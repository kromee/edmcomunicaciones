import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';
import DashboardClient from './dashboard-client';

export default async function DashboardPage() {
  try {
    const session = await getSession();

    if (!session) {
      redirect('/login');
    }

    const supabase = await createClient();

    // Obtener estadísticas
    const [quotesResult, clientsResult] = await Promise.all([
      supabase.from('quotes').select('total_amount', { count: 'exact' }),
      supabase.from('clients').select('id', { count: 'exact' })
    ]);

    const stats = {
      totalQuotes: quotesResult.count || 0,
      totalClients: clientsResult.count || 0,
      totalQuoted: quotesResult.data?.reduce((sum, quote) => sum + (quote.total_amount || 0), 0) || 0
    };

    return <DashboardClient user={session} stats={stats} />;
  } catch (error) {
    console.error('Error in dashboard:', error);
    redirect('/login');
  }
}
