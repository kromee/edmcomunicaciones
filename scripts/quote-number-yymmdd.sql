-- Folio consecutivo por día: COT-YYMMDD-0001 (zona America/Mexico_City)
-- Ejecutar en Supabase SQL Editor (proyecto existente).

CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TEXT AS $$
DECLARE
  day_part TEXT;
  sequence_num INTEGER;
  quote_num TEXT;
BEGIN
  day_part := TO_CHAR(NOW() AT TIME ZONE 'America/Mexico_City', 'YYMMDD');

  SELECT COALESCE(MAX(
    CAST(SUBSTRING(quote_number FROM 'COT-' || day_part || '-(\d+)') AS INTEGER)
  ), 0) + 1 INTO sequence_num
  FROM quotes
  WHERE quote_number LIKE 'COT-' || day_part || '-%';

  quote_num := 'COT-' || day_part || '-' || LPAD(sequence_num::TEXT, 4, '0');

  RETURN quote_num;
END;
$$ LANGUAGE plpgsql;
