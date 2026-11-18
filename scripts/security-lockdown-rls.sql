-- Aplicar en Supabase SQL Editor del proyecto de producción.
-- La aplicación autentica en Next.js con cookie; sus operaciones de BD usan
-- SUPABASE_SERVICE_ROLE_KEY solo en el servidor. No usa Supabase Auth.
-- Este cambio cierra el acceso directo con la clave pública anon.
BEGIN;
DO $$
DECLARE
  table_name text;
  policy_record record;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'users', 'clients', 'quotes', 'quote_items', 'contacts',
    'catalog_items', 'quote_send_logs', 'quote_daily_counters',
    'quote_pdf_sends', 'quote_follow_ups'
  ] LOOP
    IF to_regclass(format('public.%I', table_name)) IS NULL THEN
      CONTINUE;
    END IF;
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
    FOR policy_record IN
      SELECT policyname FROM pg_policies
      WHERE schemaname = 'public' AND tablename = table_name
    LOOP
      EXECUTE format('DROP POLICY %I ON public.%I', policy_record.policyname, table_name);
    END LOOP;
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon, authenticated', table_name);
  END LOOP;
END $$;
COMMIT;
