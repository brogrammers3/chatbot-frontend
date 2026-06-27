-- Fix: my_company_id() caused infinite recursion because the users table
-- RLS policy calls my_company_id(), which queries users (also RLS-protected).
-- SECURITY DEFINER makes the function execute as its owner (postgres),
-- bypassing RLS on the users table and breaking the recursion.
CREATE OR REPLACE FUNCTION my_company_id()
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT company_id FROM users WHERE id = auth.uid()
$$;
