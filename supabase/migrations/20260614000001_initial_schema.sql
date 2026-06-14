-- Enable pgvector for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================
-- COMPANIES — tenant raíz
-- ============================================================
CREATE TABLE companies (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  plan       text        NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- USERS — extiende auth.users de Supabase
-- ============================================================
CREATE TABLE users (
  id         uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      text        NOT NULL,
  full_name  text,
  company_id uuid        REFERENCES companies(id) ON DELETE SET NULL,
  role       text        NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- CHATBOTS — bots que crea cada empresa
-- ============================================================
CREATE TABLE chatbots (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  uuid        NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name        text        NOT NULL,
  description text,
  model       text        NOT NULL DEFAULT 'gpt' CHECK (model IN ('gpt', 'claude')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- DOCUMENTS — archivos que alimentan el RAG
-- ============================================================
CREATE TABLE documents (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id uuid        NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  filename   text        NOT NULL,
  status     text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'error')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- DOCUMENT CHUNKS — fragmentos con embeddings para el RAG
-- ============================================================
CREATE TABLE document_chunks (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid        NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  content     text        NOT NULL,
  embedding   vector(1536),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Índice para búsqueda por similitud (coseno)
CREATE INDEX ON document_chunks USING ivfflat (embedding vector_cosine_ops);

-- ============================================================
-- CONVERSATIONS — sesiones de chat
-- ============================================================
CREATE TABLE conversations (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id uuid        NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  session_id text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- MESSAGES — mensajes individuales
-- ============================================================
CREATE TABLE messages (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid        NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role            text        NOT NULL CHECK (role IN ('user', 'assistant')),
  content         text        NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);
