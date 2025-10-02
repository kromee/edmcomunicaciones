import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';
import CotizacionesClient from './cotizaciones-client';

export default async function CotizacionesPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const supabase = await createClient();

  // Obtener cotizaciones
  const { data: quotes, error } = await supabase
    .from('quotes')
    .select(`
      *,
      quote_items (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching quotes:', error);
  }

  return <CotizacionesClient quotes={quotes || []} user={session} />;
}
