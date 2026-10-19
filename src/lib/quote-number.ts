import type { SupabaseClient } from '@supabase/supabase-js';

/** Formato: COT-261019-0001 → año 26, mes 10, día 19, consecutivo del día. */
export async function allocateQuoteNumber(
  supabase: SupabaseClient
): Promise<{ quote_number: string } | { error: string }> {
  const { data, error } = await supabase.rpc('generate_quote_number');

  if (error) {
    const msg = error.message || 'Error al generar folio';
    if (msg.toLowerCase().includes('generate_quote_number')) {
      return {
        error:
          'Falta la función generate_quote_number en Supabase. Ejecuta scripts/quote-number-yymmdd.sql',
      };
    }
    return { error: msg };
  }

  if (typeof data === 'string' && data.trim()) {
    return { quote_number: data.trim() };
  }

  return { error: 'No se pudo generar el número de cotización' };
}
