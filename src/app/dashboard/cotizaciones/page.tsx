import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';
import CotizacionesClient from './cotizaciones-client';
import { sortQuoteItems } from '@/lib/quote-item-order';

export default async function CotizacionesPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const supabase = await createClient();

  const { data: quotes, error } = await supabase
    .from('quotes')
    .select(`
      *,
      quote_items (*)
    `)
    .order('created_at', { ascending: false })
    .order('sort_order', { foreignTable: 'quote_items', ascending: true });

  if (error) {
    console.error('Error fetching quotes:', error);
  }

  const quotesOrdered = (quotes || []).map((quote) => ({
    ...quote,
    quote_items: sortQuoteItems(quote.quote_items || []),
  }));

  return <CotizacionesClient quotes={quotesOrdered} user={session} />;
}
