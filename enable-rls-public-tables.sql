-- Ejecutar en Supabase → SQL Editor (proyecto en producción).
-- Corrige el aviso "rls_disabled_in_public": tablas expuestas a PostgREST sin RLS.
--
-- El backend de Next.js usa SUPABASE_SERVICE_ROLE_KEY, que bypassa RLS; las
-- peticiones con la clave anon quedan sin políticas que permitan acceso → no exponen filas.
-- Si en el futuro usas Supabase Auth, añade políticas con auth.uid() según necesites.
--
-- Políticas permisivas de scripts antiguos del repo (anon podría leer datos):
DROP POLICY IF EXISTS "Allow login" ON users;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON clients;

ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contacts ENABLE ROW LEVEL SECURITY;
