-- Script para agregar la columna percentage a la tabla quote_items
-- Ejecutar en el SQL Editor de Supabase

-- Agregar columna percentage a la tabla quote_items
ALTER TABLE quote_items 
ADD COLUMN percentage DECIMAL(5,2) DEFAULT 0;

-- Actualizar registros existentes para que tengan percentage = 0
UPDATE quote_items 
SET percentage = 0 
WHERE percentage IS NULL;

-- Hacer la columna NOT NULL después de actualizar los registros existentes
ALTER TABLE quote_items 
ALTER COLUMN percentage SET NOT NULL;

-- Verificar que la columna se agregó correctamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'quote_items' 
ORDER BY ordinal_position;
