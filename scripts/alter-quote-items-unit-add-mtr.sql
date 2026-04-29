-- Supabase / PostgreSQL: permitir unidad MTR (Metros) en quote_items.
-- Ejecutar en SQL Editor después de desplegar el código que envía unit = 'MTR'.

DO $$
DECLARE r record;
BEGIN
  FOR r IN (
    SELECT c.conname
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE n.nspname = 'public'
      AND t.relname = 'quote_items'
      AND c.contype = 'c'
      AND pg_get_constraintdef(c.oid) LIKE '%unit%'
  ) LOOP
    EXECUTE format('ALTER TABLE quote_items DROP CONSTRAINT %I', r.conname);
  END LOOP;
END $$;

ALTER TABLE quote_items
  ADD CONSTRAINT quote_items_unit_check
  CHECK (unit IN ('PZA', 'SERV', 'MTR'));

COMMENT ON COLUMN quote_items.unit IS 'Unidad: PZA (Pieza), SERV (Servicio), MTR (Metros)';
