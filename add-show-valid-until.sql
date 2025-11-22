-- =====================================================
-- Agregar campo show_valid_until a la tabla quotes
-- =====================================================

-- Agregar columna para controlar si se muestra la fecha de vencimiento en el PDF
ALTER TABLE quotes 
ADD COLUMN IF NOT EXISTS show_valid_until BOOLEAN DEFAULT true;

-- Comentario para documentación
COMMENT ON COLUMN quotes.show_valid_until IS 'Indica si se debe mostrar la fecha de vencimiento en el PDF de la cotización. Por defecto es true.';

