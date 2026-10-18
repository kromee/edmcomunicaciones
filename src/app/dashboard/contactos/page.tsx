import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';
import { Suspense } from 'react';
import ContactosClient from './contactos-client';

export default async function ContactosPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const supabase = await createClient();

  // Obtener contactos
  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contacts:', error);
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface-secondary text-muted">
          Cargando contactos…
        </div>
      }
    >
      <ContactosClient contacts={contacts || []} user={session} />
    </Suspense>
  );
}
