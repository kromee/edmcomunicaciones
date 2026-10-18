import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';
import ConceptosClient from './conceptos-client';

export default async function ConceptosPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const supabase = await createClient();
  const { data: items, error } = await supabase
    .from('catalog_items')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('title', { ascending: true });

  if (error) {
    console.error('Error fetching catalog:', error);
  }

  return <ConceptosClient items={items || []} user={session} />;
}
