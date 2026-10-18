import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import DetallesCotizacionClient from './detalles-cotizacion-client';
import { sortQuoteItems } from '@/lib/quote-item-order';

type QuoteData = {
  id: string;
  quote_number: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  client_company: string | null;
  service_type: string;
  description: string;
  valid_until: string;
  notes: string | null;
  custom_commercial_terms: string | null;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  quote_items: Array<{
    id: string;
    item_name: string;
    description: string;
    quantity: number;
    unit: string;
    unit_price: number;
    percentage: number;
    total: number;
  }>;
};

export default async function DetallesCotizacionPage({ params }: { params: { id: string } }) {
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

  let creator: { name: string; email: string } | null = null;
  if (quote.created_by) {
    const { data: userRow } = await supabase
      .from('users')
      .select('name, email')
      .eq('id', quote.created_by)
      .maybeSingle();
    if (userRow) {
      creator = { name: userRow.name, email: userRow.email };
    }
  }

  const { data: sendLogs } = await supabase
    .from('quote_send_logs')
    .select(
      'id, recipient_email, channel, status, error_message, sent_at, sent_by'
    )
    .eq('quote_id', params.id)
    .order('sent_at', { ascending: false });

  const senderIds = [
    ...new Set(
      (sendLogs || [])
        .map((l) => l.sent_by)
        .filter((id): id is string => Boolean(id))
    ),
  ];

  let senderNames: Record<string, string> = {};
  if (senderIds.length > 0) {
    const { data: senders } = await supabase
      .from('users')
      .select('id, name')
      .in('id', senderIds);
    if (senders) {
      senderNames = Object.fromEntries(senders.map((u) => [u.id, u.name]));
    }
  }

  return (
    <DetallesCotizacionClient 
      quote={quoteOrdered as QuoteData} 
      creator={creator}
      user={session}
      sendLogs={(sendLogs || []).map((log) => ({
        ...log,
        sent_by_name: log.sent_by ? senderNames[log.sent_by] || null : null,
      }))}
    />
  );
}
