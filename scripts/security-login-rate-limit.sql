-- Ejecutar en el SQL Editor de Supabase antes de desplegar el código del login.
-- El contador es compartido por todas las instancias de Vercel.
BEGIN;

CREATE TABLE IF NOT EXISTS public.auth_login_attempts (
  key_hash text PRIMARY KEY,
  attempt_count integer NOT NULL DEFAULT 0,
  window_ends_at timestamptz NOT NULL
);

ALTER TABLE public.auth_login_attempts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.auth_login_attempts FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.check_login_attempt(
  p_key_hash text,
  p_limit integer,
  p_window_seconds integer
) RETURNS TABLE (allowed boolean, retry_after_seconds integer)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  current_count integer;
  current_end timestamptz;
BEGIN
  IF p_key_hash !~ '^[0-9a-f]{64}$' OR p_limit < 1 OR p_window_seconds < 1 THEN
    RAISE EXCEPTION 'Parámetros inválidos';
  END IF;

  INSERT INTO public.auth_login_attempts (key_hash, attempt_count, window_ends_at)
  VALUES (p_key_hash, 1, now() + make_interval(secs => p_window_seconds))
  ON CONFLICT (key_hash) DO UPDATE
  SET attempt_count = CASE
        WHEN public.auth_login_attempts.window_ends_at <= now() THEN 1
        ELSE public.auth_login_attempts.attempt_count + 1
      END,
      window_ends_at = CASE
        WHEN public.auth_login_attempts.window_ends_at <= now()
          THEN now() + make_interval(secs => p_window_seconds)
        ELSE public.auth_login_attempts.window_ends_at
      END
  RETURNING attempt_count, window_ends_at INTO current_count, current_end;

  RETURN QUERY SELECT current_count <= p_limit,
    CASE WHEN current_count <= p_limit THEN 0
      ELSE greatest(1, ceil(extract(epoch FROM current_end - now()))::integer)
    END;
END;
$$;

REVOKE ALL ON FUNCTION public.check_login_attempt(text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_login_attempt(text, integer, integer) TO service_role;

COMMIT;
