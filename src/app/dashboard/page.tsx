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
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // Obtener estadísticas básicas
    const [quotesResult, clientsResult, pendingQuotesResult, newContactsResult] = await Promise.all([
      supabase.from('quotes').select('total_amount, status, created_at', { count: 'exact' }),
      supabase.from('clients').select('id', { count: 'exact' }),
      supabase.from('quotes').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabase.from('contacts').select('id', { count: 'exact' }).eq('status', 'new')
    ]);

    // Obtener cotizaciones recientes (últimas 5)
    const recentQuotesResult = await supabase
      .from('quotes')
      .select(`
        id,
        quote_number,
        client_name,
        client_company,
        total_amount,
        status,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    // Obtener cotizaciones por mes para el gráfico (últimos 6 meses)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const monthlyQuotesResult = await supabase
      .from('quotes')
      .select('created_at, total_amount')
      .gte('created_at', sixMonthsAgo.toISOString())
      .order('created_at', { ascending: true });

    const monthlyData: Record<string, { count: number; amount: number }> = {};
    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const key = date.toLocaleDateString('es-MX', { month: 'short' }).replace('.', '');
      monthlyData[key] = { count: 0, amount: 0 };
    }

    monthlyQuotesResult.data?.forEach(quote => {
      const date = new Date(quote.created_at);
      const key = date.toLocaleDateString('es-MX', { month: 'short' }).replace('.', '');
      if (monthlyData[key]) {
        monthlyData[key].count += 1;
        monthlyData[key].amount += Number(quote.total_amount) || 0;
      }
    });

    const chartData = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      count: data.count,
      amount: data.amount,
    }));

    // Obtener notificaciones reales
    const notificationsResult = await supabase
      .from('quotes')
      .select('id, quote_number, status, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    const notifications = notificationsResult.data?.slice(0, 5).map(quote => {
      const quoteDate = new Date(quote.created_at);
      const diffMs = now.getTime() - quoteDate.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      let timeStr = 'Hace un momento';
      if (diffHours < 1) {
        timeStr = 'Hace unos minutos';
      } else if (diffHours < 24) {
        timeStr = `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
      } else if (diffDays < 7) {
        timeStr = `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
      } else {
        timeStr = quoteDate.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
      }

      return {
        id: quote.id,
        title: `Cotización ${quote.quote_number}`,
        message: quote.status === 'approved' 
          ? `La cotización ha sido aprobada`
          : quote.status === 'pending'
          ? `Cotización pendiente de revisión`
          : `Estado: ${quote.status}`,
        time: timeStr,
        type: quote.status === 'approved' ? 'success' as const : quote.status === 'pending' ? 'warning' as const : 'info' as const,
        read: quote.status !== 'pending'
      };
    }) || [];

    const unreadCount = notifications.filter(n => !n.read).length;

    const stats = {
      totalQuotes: quotesResult.count || 0,
      totalClients: clientsResult.count || 0,
      totalQuoted: quotesResult.data?.reduce((sum, quote) => sum + (quote.total_amount || 0), 0) || 0,
      pendingQuotes: pendingQuotesResult.count || 0,
      newContacts: newContactsResult.count || 0,
      recentQuotes: recentQuotesResult.data || [],
      chartData,
      notifications,
      unreadCount
    };

    return <DashboardClient user={session} stats={stats} />;
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'digest' in error &&
      typeof (error as { digest?: string }).digest === 'string' &&
      (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }
    console.error('Error in dashboard:', error);
    redirect('/login');
  }
}
