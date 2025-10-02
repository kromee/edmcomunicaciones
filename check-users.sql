-- Script para verificar la tabla users y sus datos
-- Ejecutar en el SQL Editor de Supabase

-- 1. Verificar que la tabla users existe
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- 2. Verificar los datos en la tabla users
SELECT id, email, name, role, created_at
FROM users
ORDER BY created_at DESC;

-- 3. Verificar si hay usuarios con el email específico
SELECT id, email, name, role, 
       CASE 
         WHEN password_hash IS NOT NULL THEN 'Password hash exists'
         ELSE 'No password hash'
       END as password_status
FROM users 
WHERE email = 'admin@edmcomunicaciones.com'; -- Cambiar por el email que estás usando

-- 4. Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'users';
