import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Cliente de Supabase solo para servidor (Route Handlers, Server Components).
 * Usa la service_role key: bypassa RLS, que debe estar ACTIVADO en las tablas
 * para que la clave anon pública no pueda leer/escribir datos por la API REST.
 *
 * La autenticación de la app sigue siendo la cookie `session` (no Supabase Auth).
 */
export function createClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY. ' +
        'El servidor necesita la service role key para acceder a la base de datos con RLS habilitado.'
    );
  }

  return createSupabaseClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
