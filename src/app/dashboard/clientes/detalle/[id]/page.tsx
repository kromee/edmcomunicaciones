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
  
  // Obtener datos del cliente
  const { data: client, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !client) {
    console.error('Error fetching client:', error);
    redirect('/dashboard/clientes');
  }

  return (
    <DetalleClienteClient 
      client={client}
      user={session} 
    />
  );
}

