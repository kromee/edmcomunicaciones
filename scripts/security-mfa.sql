-- Ejecutar en Supabase SQL Editor antes de desplegar la rama de MFA.
-- La tabla users ya debe estar cerrada para anon/authenticated por security-lockdown-rls.sql.
BEGIN;

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS mfa_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS mfa_secret_encrypted text,
  ADD COLUMN IF NOT EXISTS mfa_pending_secret_encrypted text,
  ADD COLUMN IF NOT EXISTS mfa_pending_until timestamptz,
  ADD COLUMN IF NOT EXISTS mfa_last_step bigint NOT NULL DEFAULT -1,
  ADD COLUMN IF NOT EXISTS mfa_recovery_hashes text[] NOT NULL DEFAULT '{}'::text[];

CREATE OR REPLACE FUNCTION public.consume_mfa_recovery_code(
  p_user_id text,
  p_code_hash text
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  affected integer;
BEGIN
  IF p_user_id IS NULL OR length(p_user_id) > 100 OR
     p_code_hash !~ '^[0-9a-f]{64}$' THEN
    RETURN false;
  END IF;

  UPDATE public.users
     SET mfa_recovery_hashes = array_remove(mfa_recovery_hashes, p_code_hash)
   WHERE id::text = p_user_id
     AND mfa_enabled = true
     AND p_code_hash = ANY(mfa_recovery_hashes);

  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected = 1;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_mfa_recovery_code(text, text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_mfa_recovery_code(text, text)
  TO service_role;

COMMIT;
