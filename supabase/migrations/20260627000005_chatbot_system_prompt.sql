-- ============================================================
-- CHATBOTS · system_prompt
-- Instrucciones de sistema personalizables por chatbot. Definen
-- el tono/persona del asistente; las reglas de grounding (responder
-- solo con el contexto) se siguen aplicando en el backend.
-- ============================================================
ALTER TABLE chatbots ADD COLUMN IF NOT EXISTS system_prompt text;
