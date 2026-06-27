-- RPC function to set up company + user record atomically.
-- SECURITY DEFINER bypasses RLS so it can insert into companies
-- and upsert into users without needing explicit INSERT policies.
CREATE OR REPLACE FUNCTION setup_user_company(user_email text)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_company_id uuid;
BEGIN
  -- Return existing company if already set up
  SELECT company_id INTO v_company_id FROM users WHERE id = auth.uid();
  IF v_company_id IS NOT NULL THEN
    RETURN v_company_id;
  END IF;

  -- Create company
  INSERT INTO companies (name) VALUES (user_email) RETURNING id INTO v_company_id;

  -- Upsert user linked to new company
  INSERT INTO users (id, email, company_id)
  VALUES (auth.uid(), user_email, v_company_id)
  ON CONFLICT (id) DO UPDATE SET company_id = v_company_id;

  RETURN v_company_id;
END;
$$;
