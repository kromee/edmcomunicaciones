-- Folio atómico por día: COT-YYMMDD-0001 (sin carrera MAX+1)
-- Ejecutar en Supabase SQL Editor (proyecto existente).
-- Reemplaza la lógica de scripts/quote-number-yymmdd.sql

CREATE TABLE IF NOT EXISTS quote_daily_counters (
  day_key TEXT PRIMARY KEY,
  last_seq INTEGER NOT NULL DEFAULT 0 CHECK (last_seq >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE quote_daily_counters IS 'Contador diario para folios COT-YYMMDD-NNNN (incremento atómico)';

-- Sincronizar con cotizaciones ya existidas en formato nuevo
INSERT INTO quote_daily_counters (day_key, last_seq)
SELECT
  SUBSTRING(quote_number FROM '^COT-(\d{6})-') AS day_key,
  MAX(CAST(SUBSTRING(quote_number FROM '^COT-\d{6}-(\d+)$') AS INTEGER)) AS last_seq
FROM quotes
WHERE quote_number ~ '^COT-\d{6}-\d+$'
GROUP BY 1
ON CONFLICT (day_key) DO UPDATE
SET
  last_seq = GREATEST(quote_daily_counters.last_seq, EXCLUDED.last_seq),
  updated_at = NOW();

CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  day_part TEXT;
  next_seq INTEGER;
BEGIN
  day_part := TO_CHAR(NOW() AT TIME ZONE 'America/Mexico_City', 'YYMMDD');

  INSERT INTO quote_daily_counters (day_key, last_seq)
  VALUES (day_part, 1)
  ON CONFLICT (day_key) DO UPDATE
  SET
    last_seq = quote_daily_counters.last_seq + 1,
    updated_at = NOW()
  RETURNING last_seq INTO next_seq;

  RETURN 'COT-' || day_part || '-' || LPAD(next_seq::TEXT, 4, '0');
END;
$$;

GRANT EXECUTE ON FUNCTION generate_quote_number() TO authenticated;
GRANT EXECUTE ON FUNCTION generate_quote_number() TO service_role;
