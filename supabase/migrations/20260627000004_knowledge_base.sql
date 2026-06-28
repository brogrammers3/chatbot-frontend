-- ============================================================
-- BASE DE CONOCIMIENTO — enriquecimiento del modelo de fuentes
-- Historia: Construir la base de conocimiento del asistente virtual.
-- Implementa T3/T4 de docs/base-conocimiento.md.
--
-- Decisiones del PO:
--   1) Biblioteca POR ASISTENTE  -> se conserva chatbot_id (sin cambios de raíz).
--   2) Sin Supabase Storage en v1 -> los archivos no retienen binario; faq/text
--      guardan su contenido en raw_content.
--   3) Tipos v1: file / faq / text.
--
-- Migración ADITIVA y retrocompatible: la ingesta actual (rag.py inserta
-- {chatbot_id, filename, status}) sigue válida (source_type toma 'file').
-- ============================================================

-- ------------------------------------------------------------
-- documents: de "archivo subido" a "fuente de conocimiento"
-- ------------------------------------------------------------
ALTER TABLE documents ALTER COLUMN filename DROP NOT NULL;  -- faq/text no tienen archivo

ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS title       text,
  ADD COLUMN IF NOT EXISTS source_type text NOT NULL DEFAULT 'file'
    CHECK (source_type IN ('file', 'faq', 'text')),
  ADD COLUMN IF NOT EXISTS mime_type   text,
  ADD COLUMN IF NOT EXISTS raw_content text,   -- contenido de faq/text (re-procesable sin Storage)
  ADD COLUMN IF NOT EXISTS language    text,   -- 'es', 'en', …
  ADD COLUMN IF NOT EXISTS metadata    jsonb NOT NULL DEFAULT '{}'::jsonb,  -- category, tags, version…
  ADD COLUMN IF NOT EXISTS created_by  uuid REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_at  timestamptz NOT NULL DEFAULT now();

-- Coherencia de la fuente según su tipo:
--   file  -> debe traer filename ; faq/text -> debe traer raw_content.
ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_source_shape;
ALTER TABLE documents ADD CONSTRAINT documents_source_shape CHECK (
  (source_type = 'file'           AND filename    IS NOT NULL) OR
  (source_type IN ('faq', 'text') AND raw_content IS NOT NULL)
);

-- ------------------------------------------------------------
-- document_chunks: metadatos para citas y filtrado
-- ------------------------------------------------------------
ALTER TABLE document_chunks
  ADD COLUMN IF NOT EXISTS chunk_index int,
  ADD COLUMN IF NOT EXISTS metadata    jsonb NOT NULL DEFAULT '{}'::jsonb;  -- page, section, qa_pair…

-- ------------------------------------------------------------
-- Índice para clasificar/filtrar fuentes por tipo dentro de un asistente
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_documents_chatbot_source_type
  ON documents (chatbot_id, source_type);

-- ------------------------------------------------------------
-- "Información actualizada": refrescar updated_at en cada UPDATE de la fuente
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS documents_set_updated_at ON documents;
CREATE TRIGGER documents_set_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
