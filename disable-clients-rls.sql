-- =====================================================
-- Deshabilitar RLS temporalmente para la tabla clients
-- =====================================================

-- Deshabilitar RLS en la tabla clients
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;

-- Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Authenticated users can view clients" ON clients;
DROP POLICY IF EXISTS "Authenticated users can create clients" ON clients;
DROP POLICY IF EXISTS "Authenticated users can update clients" ON clients;
DROP POLICY IF EXISTS "Authenticated users can delete clients" ON clients;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON clients;
