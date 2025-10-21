-- =====================================================
-- Agregar campo custom_commercial_terms a la tabla quotes
-- =====================================================

-- Agregar columna para condiciones comerciales personalizadas
ALTER TABLE quotes 
ADD COLUMN IF NOT EXISTS custom_commercial_terms TEXT;

-- Comentario para documentación
COMMENT ON COLUMN quotes.custom_commercial_terms IS 'Condiciones comerciales personalizadas para la cotización. Si es NULL, se usan las condiciones por defecto.';

