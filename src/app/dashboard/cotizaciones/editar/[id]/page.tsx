import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import EditarCotizacionClient from './editar-cotizacion-client';
import { QuoteData } from '@/types/quote.types';

export default async function EditarCotizacionPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const supabase = await createClient();
  
  const { data: quote, error } = await supabase
    .from('quotes')
    .select(`
      *,
      quote_items (*)
    `)
    .eq('id', params.id)
    .single();

  if (error || !quote) {
    redirect('/dashboard/cotizaciones');
  }

  return <EditarCotizacionClient quote={quote as QuoteData} user={session} />;
}
