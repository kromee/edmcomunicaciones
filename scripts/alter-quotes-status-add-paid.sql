-- Ejecutar una vez en Supabase SQL Editor (proyectos ya desplegados).
-- Amplía el CHECK de status para permitir 'paid' (Pagado).
ALTER TABLE quotes DROP CONSTRAINT IF EXISTS quotes_status_check;
ALTER TABLE quotes ADD CONSTRAINT quotes_status_check
  CHECK (status IN ('pending', 'approved', 'rejected', 'sent', 'paid'));

COMMENT ON COLUMN quotes.status IS 'Estado: pending, sent, approved, rejected, paid';
