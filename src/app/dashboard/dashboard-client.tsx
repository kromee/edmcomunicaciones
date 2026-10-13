"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SessionUser } from '@/types/session';
import { Sidebar } from '@/components/DashboardSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';

type Quote = {
  id: string;
  quote_number: string;
  client_name: string;
  client_company: string | null;
  total_amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'sent' | 'paid';
  created_at: string;
};

type ChartData = {
  month: string;
  count: number;
  amount: number;
};

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
};

type DashboardStats = {
  totalQuotes: number;
  totalClients: number;
  totalQuoted: number;
  pendingQuotes: number;
  newContacts: number;
  recentQuotes: Quote[];
  chartData: ChartData[];
  notifications: Notification[];
  unreadCount: number;
};

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const colorClasses = {
  blue: {
    bg: 'bg-accent/10',
    icon: 'text-accent',
    gradient: 'from-accent/20 to-accent/5',
  },
  green: {
    bg: 'bg-success/10',
    icon: 'text-success',
    gradient: 'from-success/20 to-success/5',
  },
  purple: {
    bg: 'bg-purple-100',
    icon: 'text-purple-600',
    gradient: 'from-purple-100 to-purple-50',
  },
  orange: {
    bg: 'bg-warning/10',
    icon: 'text-warning',
    gradient: 'from-warning/20 to-warning/5',
  },
};

function StatCard({ title, value, subtitle, icon, trend, color }: StatCardProps) {
  const colors = colorClasses[color];
  
  return (
    <div className="group relative bg-white rounded-2xl p-5 sm:p-6 shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors.gradient} rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity`} />
      
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${colors.bg} flex items-center justify-center ${colors.icon} group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              trend.value >= 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
            }`}>
              <svg className={`w-3 h-3 ${trend.value < 0 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>

        <div className="mt-4">
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {value}
          </p>
          <p className="text-sm font-medium text-gray-500 mt-1">{title}</p>
        </div>

        {subtitle && (
          <p className="text-xs text-muted-light mt-2">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

const statusStyles = {
  pending: { bg: 'bg-warning/10', text: 'text-warning-dark', label: 'Pendiente' },
  approved: { bg: 'bg-success/10', text: 'text-success-dark', label: 'Aprobada' },
  rejected: { bg: 'bg-danger/10', text: 'text-danger-dark', label: 'Rechazada' },
  sent: { bg: 'bg-accent/10', text: 'text-accent-dark', label: 'Enviada' },
  paid: { bg: 'bg-green-100', text: 'text-green-700', label: 'Pagada' },
};

function StatusBadge({ status }: { status: Quote['status'] }) {
  const styles = statusStyles[status] || statusStyles.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles.bg} ${styles.text}`}>
      {styles.label}
    </span>
  );
}

export default function DashboardClient({ user, stats }: { user: SessionUser; stats: DashboardStats }) {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const handleLogout = async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    });

    if (response.ok) {
      router.push('/login');
      router.refresh();
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatRelativeTime = (date: string) => {
    const now = new Date();
    const quoteDate = new Date(date);
    const diffMs = now.getTime() - quoteDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Hace un momento';
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return formatDate(date);
  };

  const formatCompactCurrency = (value: number) => {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
      return `$${Math.round(value / 1_000)}k`;
    }
    return formatCurrency(value);
  };

  const maxChartValue = Math.max(...stats.chartData.map(d => d.amount), 1);
  const periodAmount = stats.chartData.reduce((sum, item) => sum + item.amount, 0);
  const periodCount = stats.chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="min-h-screen bg-surface-secondary">
      <Sidebar badges={{ cotizaciones: stats.pendingQuotes, contactos: stats.newContacts }} defaultCollapsed onCollapsedChange={setSidebarCollapsed} />
      <DashboardHeader 
        user={user} 
        onLogout={handleLogout} 
        sidebarCollapsed={sidebarCollapsed}
        notifications={stats.notifications}
        unreadCount={stats.unreadCount}
      />

      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bienvenido de vuelta, {user.name.split(' ')[0]}</h1>
            <p className="mt-1 text-muted">Este es el resumen de tu actividad reciente</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <StatCard
              title="Cotizaciones"
              value={stats.totalQuotes}
              subtitle="Total de cotizaciones creadas"
              color="blue"
              trend={{ value: 12, label: 'vs mes anterior' }}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
            <StatCard
              title="Clientes"
              value={stats.totalClients}
              subtitle="Clientes registrados en el sistema"
              color="green"
              trend={{ value: 8, label: 'vs mes anterior' }}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
            <StatCard
              title="Total Cotizado"
              value={formatCurrency(stats.totalQuoted)}
              subtitle="Monto total de todas las cotizaciones"
              color="purple"
              trend={{ value: 23, label: 'vs mes anterior' }}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Quotes */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Cotizaciones Recientes</h2>
                <a href="/dashboard/cotizaciones" className="text-sm font-medium text-accent hover:text-accent-dark transition-colors">
                  Ver todas
                </a>
              </div>
              <div className="divide-y divide-gray-50">
                {stats.recentQuotes.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <svg className="w-12 h-12 mx-auto mb-3 text-muted-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm text-muted">No hay cotizaciones recientes</p>
                  </div>
                ) : (
                  stats.recentQuotes.map((quote) => (
                    <a
                      key={quote.id}
                      href={`/dashboard/cotizaciones/detalles/${quote.id}`}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-surface-secondary transition-colors"
                    >
                      <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{quote.quote_number}</p>
                        <p className="text-sm text-muted truncate">{quote.client_name}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-gray-900">{formatCurrency(quote.total_amount)}</p>
                        <p className="text-xs text-muted-light">{formatRelativeTime(quote.created_at)}</p>
                      </div>
                      <StatusBadge status={quote.status} />
                    </a>
                  ))
                )}
              </div>
            </div>

            {/* Monthly Summary Chart */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Resumen del mes</h2>
                <p className="text-sm text-muted">Monto cotizado en los últimos 6 meses</p>
              </div>
              <div className="p-5">
                {periodCount === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <svg className="w-12 h-12 mb-3 text-muted-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-sm text-muted">No hay cotizaciones en este periodo</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-end gap-2">
                      {stats.chartData.map((item) => {
                        const height = item.amount > 0
                          ? Math.max((item.amount / maxChartValue) * 100, 8)
                          : 0;

                        return (
                          <div key={item.month} className="flex min-w-0 flex-1 flex-col items-center">
                            <p className="mb-1 h-4 truncate text-center text-[11px] font-semibold text-brand">
                              {item.amount > 0 ? formatCompactCurrency(item.amount) : ''}
                            </p>
                            <div className="flex h-32 w-full items-end">
                              <div
                                className="w-full rounded-t-md bg-brand"
                                style={{ height: `${height}%` }}
                                title={`${item.count} cotización${item.count === 1 ? '' : 'es'} · ${formatCurrency(item.amount)}`}
                              />
                            </div>
                            <p className="mt-2 text-center text-xs capitalize text-muted">{item.month}</p>
                            <p className="text-center text-[11px] text-muted-light">
                              {item.count} {item.count === 1 ? 'cotización' : 'cotizaciones'}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    <p className="mt-4 border-t border-gray-100 pt-4 text-center text-sm text-muted">
                      <span className="font-semibold text-gray-900">{formatCurrency(periodAmount)}</span>
                      {' '}en {periodCount} {periodCount === 1 ? 'cotización' : 'cotizaciones'}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
