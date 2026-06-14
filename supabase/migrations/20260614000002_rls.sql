-- ============================================================
-- ROW LEVEL SECURITY
-- Aislamiento multi-tenant: cada empresa solo ve sus propios datos
-- ============================================================

ALTER TABLE companies          ENABLE ROW LEVEL SECURITY;
ALTER TABLE users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbots           ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents          ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks    ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages           ENABLE ROW LEVEL SECURITY;

-- Helper: company_id del usuario autenticado
CREATE OR REPLACE FUNCTION my_company_id()
RETURNS uuid
LANGUAGE sql STABLE
AS $$
  SELECT company_id FROM users WHERE id = auth.uid()
$$;

-- ============================================================
-- COMPANIES
-- Un usuario solo ve su propia empresa
-- ============================================================
CREATE POLICY "companies: select own"
  ON companies FOR SELECT
  USING (id = my_company_id());

CREATE POLICY "companies: update own"
  ON companies FOR UPDATE
  USING (id = my_company_id());

-- ============================================================
-- USERS
-- Un usuario ve a todos los miembros de su empresa
-- ============================================================
CREATE POLICY "users: select same company"
  ON users FOR SELECT
  USING (company_id = my_company_id());

CREATE POLICY "users: insert own record"
  ON users FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "users: update own record"
  ON users FOR UPDATE
  USING (id = auth.uid());

-- ============================================================
-- CHATBOTS
-- ============================================================
CREATE POLICY "chatbots: select own company"
  ON chatbots FOR SELECT
  USING (company_id = my_company_id());

CREATE POLICY "chatbots: insert own company"
  ON chatbots FOR INSERT
  WITH CHECK (company_id = my_company_id());

CREATE POLICY "chatbots: update own company"
  ON chatbots FOR UPDATE
  USING (company_id = my_company_id());

CREATE POLICY "chatbots: delete own company"
  ON chatbots FOR DELETE
  USING (company_id = my_company_id());

-- ============================================================
-- DOCUMENTS
-- ============================================================
CREATE POLICY "documents: select own company"
  ON documents FOR SELECT
  USING (
    chatbot_id IN (SELECT id FROM chatbots WHERE company_id = my_company_id())
  );

CREATE POLICY "documents: insert own company"
  ON documents FOR INSERT
  WITH CHECK (
    chatbot_id IN (SELECT id FROM chatbots WHERE company_id = my_company_id())
  );

CREATE POLICY "documents: delete own company"
  ON documents FOR DELETE
  USING (
    chatbot_id IN (SELECT id FROM chatbots WHERE company_id = my_company_id())
  );

-- ============================================================
-- DOCUMENT CHUNKS
-- ============================================================
CREATE POLICY "document_chunks: select own company"
  ON document_chunks FOR SELECT
  USING (
    document_id IN (
      SELECT d.id FROM documents d
      JOIN chatbots c ON c.id = d.chatbot_id
      WHERE c.company_id = my_company_id()
    )
  );

CREATE POLICY "document_chunks: insert own company"
  ON document_chunks FOR INSERT
  WITH CHECK (
    document_id IN (
      SELECT d.id FROM documents d
      JOIN chatbots c ON c.id = d.chatbot_id
      WHERE c.company_id = my_company_id()
    )
  );

-- ============================================================
-- CONVERSATIONS
-- ============================================================
CREATE POLICY "conversations: select own company"
  ON conversations FOR SELECT
  USING (
    chatbot_id IN (SELECT id FROM chatbots WHERE company_id = my_company_id())
  );

CREATE POLICY "conversations: insert own company"
  ON conversations FOR INSERT
  WITH CHECK (
    chatbot_id IN (SELECT id FROM chatbots WHERE company_id = my_company_id())
  );

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE POLICY "messages: select own company"
  ON messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT cv.id FROM conversations cv
      JOIN chatbots c ON c.id = cv.chatbot_id
      WHERE c.company_id = my_company_id()
    )
  );

CREATE POLICY "messages: insert own company"
  ON messages FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT cv.id FROM conversations cv
      JOIN chatbots c ON c.id = cv.chatbot_id
      WHERE c.company_id = my_company_id()
    )
  );
