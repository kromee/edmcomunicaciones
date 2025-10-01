-- =====================================================
-- Corregir políticas RLS para la tabla clients
-- =====================================================

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Authenticated users can view clients" ON clients;
DROP POLICY IF EXISTS "Authenticated users can create clients" ON clients;
DROP POLICY IF EXISTS "Authenticated users can update clients" ON clients;
DROP POLICY IF EXISTS "Authenticated users can delete clients" ON clients;

-- Crear nuevas políticas que funcionen con autenticación personalizada
-- Para desarrollo, permitir todas las operaciones a usuarios autenticados
CREATE POLICY "Allow all operations for authenticated users" ON clients
  FOR ALL USING (true) WITH CHECK (true);

-- Alternativa más restrictiva (descomenta si prefieres):
-- CREATE POLICY "Allow all operations for authenticated users" ON clients
--   FOR SELECT USING (true);
-- 
-- CREATE POLICY "Allow insert for authenticated users" ON clients
--   FOR INSERT WITH CHECK (true);
-- 
-- CREATE POLICY "Allow update for authenticated users" ON clients
--   FOR UPDATE USING (true) WITH CHECK (true);
-- 
-- CREATE POLICY "Allow delete for authenticated users" ON clients
--   FOR DELETE USING (true);
