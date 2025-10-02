-- Deshabilitar temporalmente RLS para probar
ALTER TABLE quotes DISABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items DISABLE ROW LEVEL SECURITY;

-- Verificar que se pueden insertar datos
SELECT * FROM quotes LIMIT 1;
SELECT * FROM quote_items LIMIT 1;

-- Ver todas las políticas actuales
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename IN ('quotes', 'quote_items');
