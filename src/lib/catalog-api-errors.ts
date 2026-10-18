type SupabaseLikeError = {
  message?: string;
  code?: string;
  details?: string;
};

export function catalogApiErrorMessage(
  error: SupabaseLikeError,
  fallback: string
): string {
  const msg = (error.message || '').toLowerCase();

  if (
    msg.includes('catalog_items') &&
    (msg.includes('does not exist') ||
      msg.includes('schema cache') ||
      msg.includes('could not find the table'))
  ) {
    return 'Falta la tabla en Supabase. Ejecuta scripts/p1-catalog-items.sql en el SQL Editor.';
  }

  if (error.code === '23503') {
    return 'Sesión no vinculada al usuario en BD. Cierra sesión y vuelve a entrar.';
  }

  if (error.message) {
    return error.message;
  }

  return fallback;
}
