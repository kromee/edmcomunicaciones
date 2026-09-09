import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import EditarCotizacionClient from './editar-cotizacion-client';
import { QuoteData } from '@/types/quote.types';
import { sortQuoteItems } from '@/lib/quote-item-order';

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
    .order('sort_order', { foreignTable: 'quote_items', ascending: true })
    .single();

  if (error || !quote) {
    redirect('/dashboard/cotizaciones');
  }

  const quoteOrdered = {
    ...quote,
    quote_items: sortQuoteItems(quote.quote_items || []),
  };

  return <EditarCotizacionClient quote={quoteOrdered as QuoteData} user={session} />;
}
