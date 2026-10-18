import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';
import type { Route } from 'next';
import DashboardClient from './dashboard-client';

export default async function DashboardPage() {
  try {
    const session = await getSession();

    if (!session) {
      redirect('/login');
    }

    const supabase = await createClient();
    const now = new Date();

    // Obtener estadísticas básicas
    const [quotesResult, clientsResult, newContactsResult] = await Promise.all([
      supabase.from('quotes').select('client_name, total_amount, created_at', { count: 'exact' }),
      supabase.from('clients').select('id', { count: 'exact' }),
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

    const clientTotals = new Map<string, { name: string; count: number; amount: number }>();
    quotesResult.data?.forEach(quote => {
      const name = String(quote.client_name || 'Sin cliente').trim();
      const key = name.toLocaleUpperCase('es-MX');
      const current = clientTotals.get(key) || { name, count: 0, amount: 0 };
      current.count += 1;
      current.amount += Number(quote.total_amount) || 0;
      clientTotals.set(key, current);
    });

    const topClients = Array.from(clientTotals.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Actividad reciente basada en nuevas cotizaciones, sin depender de estados manuales.
    const notificationsResult = await supabase
      .from('quotes')
      .select('id, quote_number, client_name, created_at')
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
        message: `Creada para ${quote.client_name}`,
        time: timeStr,
        type: 'info' as const,
        read: diffHours >= 24
      };
    }) || [];

    const unreadCount = notifications.filter(n => !n.read).length;

    const todayStr = now.toISOString().slice(0, 10);
    const inSevenDays = new Date(now);
    inSevenDays.setDate(inSevenDays.getDate() + 7);
    const inSevenStr = inSevenDays.toISOString().slice(0, 10);

    const [newLeadsResult, followUpContactsResult, expiringQuotesResult] =
      await Promise.all([
        supabase
          .from('contacts')
          .select('id, name, created_at, service')
          .eq('status', 'new')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('contacts')
          .select('id, name, follow_up_date, next_action, status')
          .neq('status', 'closed')
          .not('follow_up_date', 'is', null)
          .lte('follow_up_date', todayStr)
          .order('follow_up_date', { ascending: true })
          .limit(5),
        supabase
          .from('quotes')
          .select('id, quote_number, client_name, valid_until')
          .not('valid_until', 'is', null)
          .lte('valid_until', inSevenStr)
          .order('valid_until', { ascending: true })
          .limit(5),
      ]);

    type FollowUpTask = {
      id: string;
      kind: 'lead_new' | 'lead_follow_up' | 'quote_expiring';
      title: string;
      message: string;
      href: Route;
      dueLabel: string;
    };

    if (followUpContactsResult.error) {
      console.error('Error fetching follow-up contacts:', followUpContactsResult.error);
    }

    const followUpTasks: FollowUpTask[] = [];

    newLeadsResult.data?.forEach((contact) => {
      followUpTasks.push({
        id: `lead-new-${contact.id}`,
        kind: 'lead_new',
        title: contact.name,
        message: contact.service
          ? `Lead nuevo · ${contact.service}`
          : 'Lead nuevo sin atender',
        href: '/dashboard/contactos?atencion=1' as Route,
        dueLabel: 'Hoy',
      });
    });

    followUpContactsResult.data?.forEach((contact) => {
      const due = contact.follow_up_date
        ? new Date(`${contact.follow_up_date}T12:00:00`)
        : now;
      followUpTasks.push({
        id: `lead-follow-${contact.id}`,
        kind: 'lead_follow_up',
        title: contact.name,
        message: contact.next_action || 'Seguimiento programado',
        href: '/dashboard/contactos?atencion=1' as Route,
        dueLabel: due.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }),
      });
    });

    expiringQuotesResult.data?.forEach((quote) => {
      const due = quote.valid_until
        ? new Date(`${quote.valid_until}T12:00:00`)
        : now;
      const isPast = due.getTime() < new Date(todayStr + 'T12:00:00').getTime();
      followUpTasks.push({
        id: `quote-exp-${quote.id}`,
        kind: 'quote_expiring',
        title: quote.quote_number,
        message: `Vigencia · ${quote.client_name}`,
        href: `/dashboard/cotizaciones/detalles/${quote.id}` as Route,
        dueLabel: isPast ? 'Vencida' : due.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }),
      });
    });

    const stats = {
      totalQuotes: quotesResult.count || 0,
      totalClients: clientsResult.count || 0,
      totalQuoted: quotesResult.data?.reduce((sum, quote) => sum + (quote.total_amount || 0), 0) || 0,
      newContacts: newContactsResult.count || 0,
      recentQuotes: recentQuotesResult.data || [],
      chartData,
      topClients,
      notifications,
      unreadCount,
      followUpTasks: followUpTasks.slice(0, 8),
      followUpCount: followUpTasks.length,
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
