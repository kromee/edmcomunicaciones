import { createClient } from '@/lib/supabase/server';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import DetalleClienteClient from './detalle-cliente-client';

export default async function DetalleClientePage({ params }: { params: { id: string } }) {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  const supabase = await createClient();
  
  const { data: client, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !client) {
    console.error('Error fetching client:', error);
    redirect('/dashboard/clientes');
  }

  const { data: quotes } = await supabase
    .from('quotes')
    .select('id, quote_number, total_amount, status, created_at, service_type')
    .eq('client_email', client.email)
    .order('created_at', { ascending: false });

  return (
    <DetalleClienteClient 
      client={client}
      user={session}
      quotes={quotes || []}
    />
  );
}
