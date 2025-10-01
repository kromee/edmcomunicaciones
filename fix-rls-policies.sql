-- Deshabilitar temporalmente RLS para probar
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- O, crear una política que permita SELECT sin autenticación para login
DROP POLICY IF EXISTS "Allow login" ON users;
CREATE POLICY "Allow login" ON users
  FOR SELECT USING (true);

-- Verificar políticas actuales
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users';

-- Verificar que el usuario existe y ver su hash
SELECT id, email, name, role, LENGTH(password_hash) as hash_length, created_at 
FROM users 
WHERE email = 'admin@edmcomunicaciones.com';
