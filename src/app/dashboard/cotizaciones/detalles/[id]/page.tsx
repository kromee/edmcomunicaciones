import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import DetallesCotizacionClient from './detalles-cotizacion-client';

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
    .single();

  if (error || !quote) {
    redirect('/dashboard/cotizaciones');
  }

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

  return (
    <DetallesCotizacionClient 
      quote={quote as QuoteData} 
      creator={creator}
      user={session}
    />
  );
}
