-- Grants para service_role (backend) y authenticated (frontend via RLS)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.companies          TO service_role, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users              TO service_role, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chatbots           TO service_role, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents          TO service_role, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.document_chunks    TO service_role, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversations      TO service_role, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages           TO service_role, authenticated;

GRANT EXECUTE ON FUNCTION match_document_chunks TO service_role, authenticated;
