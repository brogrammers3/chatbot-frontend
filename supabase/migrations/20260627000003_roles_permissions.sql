-- ============================================================
-- ROLES Y PERMISOS — enforcement por rol sobre la RLS existente
-- Historia: Roles y permisos (SCRUM-75 … SCRUM-83)
-- Implementa T7 de docs/roles-permisos.md (pasos 1–4 + métricas viewer).
--
-- Hasta ahora la RLS solo aislaba por empresa (my_company_id()); todas las
-- políticas trataban igual a admin y member. Esta migración añade la dimensión
-- de ROL (owner > admin > member > viewer) sin romper el aislamiento por empresa.
-- El backend (service_role) ignora RLS: el enforcement de rol en FastAPI
-- (require_role) es trabajo aparte y depende de la auth de backend (doc seguridad R1).
-- ============================================================

-- ------------------------------------------------------------
-- 1. Ampliar los roles permitidos (de admin/member a los 4 roles)
-- ------------------------------------------------------------
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check
  CHECK (role IN ('owner', 'admin', 'member', 'viewer'));

-- ------------------------------------------------------------
-- 2. Helper de rol del usuario autenticado.
--    SECURITY DEFINER por la misma razón que my_company_id():
--    consulta `users` (con RLS) y sin definer provocaría recursión infinita.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION my_role()
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT role FROM users WHERE id = auth.uid()
$$;

-- ------------------------------------------------------------
-- 3. Anti-escalada de privilegios en `users` (cierra R3 del doc de seguridad).
--    Un usuario NUNCA puede fijar/cambiar su propio `role` ni `company_id`.
--    Se aplica a nivel de columna: se revoca el privilegio de tabla y se
--    re-otorga solo sobre columnas no sensibles. `role`/`company_id` quedan
--    fuera del alcance de `authenticated`; los cambia lógica privilegiada
--    (assign_member_role / service_role / trigger de onboarding R4).
-- ------------------------------------------------------------
REVOKE INSERT, UPDATE ON public.users FROM authenticated;
GRANT  INSERT (id, email, full_name) ON public.users TO authenticated;
GRANT  UPDATE (full_name)            ON public.users TO authenticated;

-- El UPDATE del propio perfil ahora valida también la fila resultante (WITH CHECK).
DROP POLICY IF EXISTS "users: update own record" ON users;
CREATE POLICY "users: update own profile"
  ON users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Asignación de roles: solo owner/admin, dentro de su empresa, vía función
-- privilegiada (no por UPDATE directo del cliente). Reglas:
--   · admin puede asignar member/viewer/admin, NUNCA owner.
--   · solo un owner puede otorgar o modificar el rol owner (decisión PO 1.2: varios owners).
CREATE OR REPLACE FUNCTION assign_member_role(target_user uuid, new_role text)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_role    text;
  caller_company uuid;
  target_company uuid;
  target_role    text;
BEGIN
  SELECT role, company_id INTO caller_role, caller_company FROM users WHERE id = auth.uid();
  SELECT role, company_id INTO target_role, target_company FROM users WHERE id = target_user;

  IF caller_role IS NULL OR caller_role NOT IN ('owner', 'admin') THEN
    RAISE EXCEPTION 'No autorizado para asignar roles';
  END IF;
  IF target_company IS NULL OR target_company <> caller_company THEN
    RAISE EXCEPTION 'El usuario no pertenece a tu empresa';
  END IF;
  IF new_role NOT IN ('owner', 'admin', 'member', 'viewer') THEN
    RAISE EXCEPTION 'Rol inválido: %', new_role;
  END IF;
  -- Solo un owner puede crear o degradar a otro owner
  IF (new_role = 'owner' OR target_role = 'owner') AND caller_role <> 'owner' THEN
    RAISE EXCEPTION 'Solo un owner puede gestionar el rol owner';
  END IF;

  UPDATE users SET role = new_role WHERE id = target_user;
END;
$$;

GRANT EXECUTE ON FUNCTION assign_member_role(uuid, text) TO authenticated;

-- ------------------------------------------------------------
-- 4. COMPANIES — editar datos: owner/admin; eliminar: owner.
--    Plan/facturación NO se editan desde el cliente (solo `name`); los cambios
--    de plan pasan por el backend (service_role), nunca por auto-servicio.
-- ------------------------------------------------------------
REVOKE UPDATE ON public.companies FROM authenticated;
GRANT  UPDATE (name) ON public.companies TO authenticated;

DROP POLICY IF EXISTS "companies: update own" ON companies;
CREATE POLICY "companies: update by admin"
  ON companies FOR UPDATE
  USING (id = my_company_id() AND my_role() IN ('owner', 'admin'))
  WITH CHECK (id = my_company_id() AND my_role() IN ('owner', 'admin'));

CREATE POLICY "companies: delete by owner"
  ON companies FOR DELETE
  USING (id = my_company_id() AND my_role() = 'owner');

-- ------------------------------------------------------------
-- 5. CHATBOTS — crear/editar: member+; eliminar: admin+ (decisión PO 1.1).
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "chatbots: insert own company" ON chatbots;
CREATE POLICY "chatbots: insert by member"
  ON chatbots FOR INSERT
  WITH CHECK (company_id = my_company_id() AND my_role() IN ('owner', 'admin', 'member'));

DROP POLICY IF EXISTS "chatbots: update own company" ON chatbots;
CREATE POLICY "chatbots: update by member"
  ON chatbots FOR UPDATE
  USING (company_id = my_company_id() AND my_role() IN ('owner', 'admin', 'member'))
  WITH CHECK (company_id = my_company_id() AND my_role() IN ('owner', 'admin', 'member'));

DROP POLICY IF EXISTS "chatbots: delete own company" ON chatbots;
CREATE POLICY "chatbots: delete by admin"
  ON chatbots FOR DELETE
  USING (company_id = my_company_id() AND my_role() IN ('owner', 'admin'));

-- ------------------------------------------------------------
-- 6. DOCUMENTS — subir: member+; eliminar: admin+ (decisión PO 1.1).
--    (document_chunks los inserta el backend con service_role; sin cambios.)
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "documents: insert own company" ON documents;
CREATE POLICY "documents: insert by member"
  ON documents FOR INSERT
  WITH CHECK (
    chatbot_id IN (SELECT id FROM chatbots WHERE company_id = my_company_id())
    AND my_role() IN ('owner', 'admin', 'member')
  );

DROP POLICY IF EXISTS "documents: delete own company" ON documents;
CREATE POLICY "documents: delete by admin"
  ON documents FOR DELETE
  USING (
    chatbot_id IN (SELECT id FROM chatbots WHERE company_id = my_company_id())
    AND my_role() IN ('owner', 'admin')
  );

-- ------------------------------------------------------------
-- 7. CONVERSACIONES Y MENSAJES — viewer NO ve contenido (decisión PO 1.3).
--    owner/admin/member leen el contenido; viewer solo accede a métricas
--    agregadas vía la RPC conversation_metrics() (paso 8). Moderar (eliminar)
--    sigue siendo admin+ (no había política de borrado para authenticated).
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "conversations: select own company" ON conversations;
CREATE POLICY "conversations: select content (no viewer)"
  ON conversations FOR SELECT
  USING (
    chatbot_id IN (SELECT id FROM chatbots WHERE company_id = my_company_id())
    AND my_role() IN ('owner', 'admin', 'member')
  );

DROP POLICY IF EXISTS "messages: select own company" ON messages;
CREATE POLICY "messages: select content (no viewer)"
  ON messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT cv.id FROM conversations cv
      JOIN chatbots c ON c.id = cv.chatbot_id
      WHERE c.company_id = my_company_id()
    )
    AND my_role() IN ('owner', 'admin', 'member')
  );

-- ------------------------------------------------------------
-- 8. Métricas agregadas de conversaciones para `viewer` (decisión PO 1.3).
--    Devuelve SOLO conteos (sin PII ni contenido de mensajes), acotado a la
--    empresa del solicitante. SECURITY DEFINER para saltarse RLS de forma
--    controlada; el filtro por empresa lo impone la propia función.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION conversation_metrics(chatbot_id_input uuid DEFAULT NULL)
RETURNS TABLE (
  chatbot_id         uuid,
  conversation_count bigint,
  message_count      bigint,
  user_messages      bigint,
  assistant_messages bigint
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    c.id AS chatbot_id,
    count(DISTINCT cv.id)                                   AS conversation_count,
    count(m.id)                                             AS message_count,
    count(m.id) FILTER (WHERE m.role = 'user')             AS user_messages,
    count(m.id) FILTER (WHERE m.role = 'assistant')        AS assistant_messages
  FROM chatbots c
  LEFT JOIN conversations cv ON cv.chatbot_id = c.id
  LEFT JOIN messages m       ON m.conversation_id = cv.id
  WHERE c.company_id = my_company_id()
    AND (chatbot_id_input IS NULL OR c.id = chatbot_id_input)
  GROUP BY c.id
$$;

GRANT EXECUTE ON FUNCTION conversation_metrics(uuid) TO authenticated;

-- ------------------------------------------------------------
-- 9. Backfill de seguridad (una sola vez).
--    Promueve al usuario más antiguo de cada empresa a `owner`, para que las
--    empresas existentes conserven un usuario con permisos plenos tras activar
--    el enforcement por rol. Las altas NUEVAS deben asignar `owner` vía el
--    trigger de onboarding pendiente (doc seguridad R4).
-- ------------------------------------------------------------
UPDATE users SET role = 'owner'
WHERE id IN (
  SELECT DISTINCT ON (company_id) id
  FROM users
  WHERE company_id IS NOT NULL
  ORDER BY company_id, created_at ASC
);
