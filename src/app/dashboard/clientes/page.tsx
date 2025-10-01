import { createClient } from '@/lib/supabase/server';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import ClientesSimple from './clientes-simple';

export default async function ClientesPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  const supabase = await createClient();
  
  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching clients:', error);
  }

  return (
    <ClientesSimple 
      clients={clients || []} 
      user={session} 
    />
  );
}
