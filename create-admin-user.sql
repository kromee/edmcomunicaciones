-- Habilitar la extensión pgcrypto para bcrypt
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Crear usuario admin
-- Email: admin@edmcomunicaciones.com
-- Password: admin123
INSERT INTO users (email, name, role, password_hash)
VALUES (
  'admin@edmcomunicaciones.com',
  'Administrador EDM',
  'admin',
  crypt('admin123', gen_salt('bf'))
)
ON CONFLICT (email) DO NOTHING;

-- Verificar que el usuario se creó correctamente
SELECT id, email, name, role, created_at 
FROM users 
WHERE email = 'admin@edmcomunicaciones.com';
