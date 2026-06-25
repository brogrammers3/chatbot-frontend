CREATE OR REPLACE FUNCTION match_document_chunks(
  query_embedding vector(1536),
  chatbot_id_input uuid,
  match_count int DEFAULT 5
)
RETURNS TABLE(id uuid, content text, similarity float)
LANGUAGE sql STABLE
AS $$
  SELECT
    dc.id,
    dc.content,
    1 - (dc.embedding <=> query_embedding) AS similarity
  FROM document_chunks dc
  JOIN documents d ON d.id = dc.document_id
  WHERE d.chatbot_id = chatbot_id_input
    AND dc.embedding IS NOT NULL
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
$$;
