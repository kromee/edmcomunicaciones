"use client";

import { useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
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
  created_at: string;
};

type ChartData = {
  month: string;
  count: number;
  amount: number;
};

type TopClient = {
  name: string;
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

type FollowUpTask = {
  id: string;
  kind: 'lead_new' | 'lead_follow_up' | 'quote_expiring';
  title: string;
  message: string;
  href: Route;
  dueLabel: string;
};

type DashboardStats = {
  totalQuotes: number;
  totalClients: number;
  totalQuoted: number;
  newContacts: number;
  recentQuotes: Quote[];
  chartData: ChartData[];
  topClients: TopClient[];
  notifications: Notification[];
  unreadCount: number;
  followUpTasks: FollowUpTask[];
  followUpCount: number;
};

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const colorClasses = {
  blue: {
    bg: 'bg-sky-50',
    icon: 'text-accent',
    line: 'from-accent to-sky-300',
  },
  green: {
    bg: 'bg-emerald-50',
    icon: 'text-success',
    line: 'from-emerald-500 to-emerald-300',
  },
  purple: {
    bg: 'bg-violet-50',
    icon: 'text-violet-600',
    line: 'from-violet-600 to-violet-300',
  },
  orange: {
    bg: 'bg-amber-50',
    icon: 'text-warning',
    line: 'from-amber-500 to-amber-300',
  },
};

function StatCard({ title, value, subtitle, icon, color }: StatCardProps) {
  const colors = colorClasses[color];
  
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03),0_10px_26px_rgba(15,30,72,0.045)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300/80 hover:shadow-[0_12px_30px_rgba(15,30,72,0.08)]">
      <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${colors.line}`} />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{title}</p>
          <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-slate-950 sm:text-[28px]">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1.5 text-xs text-slate-400">{subtitle}</p>
          )}
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${colors.bg} ${colors.icon} ring-1 ring-inset ring-black/[0.03] transition-transform duration-300 group-hover:scale-105`}>
          <span className="[&>svg]:h-5 [&>svg]:w-5">
            {icon}
          </span>
        </div>
      </div>
    </div>
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
      <Sidebar badges={{ contactos: stats.newContacts }} defaultCollapsed onCollapsedChange={setSidebarCollapsed} />
      <DashboardHeader 
        user={user} 
        onLogout={handleLogout} 
        sidebarCollapsed={sidebarCollapsed}
        notifications={stats.notifications}
        unreadCount={stats.unreadCount}
      />

      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-6 flex items-end justify-between border-b border-slate-200/70 pb-5">
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">Panel general</p>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-[28px]">
                Bienvenido, {user.name.split(' ')[0]}
              </h1>
              <p className="mt-1 text-sm text-slate-500">Resumen de tu actividad comercial reciente</p>
            </div>
            <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-400 ring-4 ring-emerald-50" />
              Información actualizada
            </div>
          </div>

          {stats.followUpTasks.length > 0 && (
            <div className="mb-6 overflow-hidden rounded-2xl border border-amber-200/60 bg-white shadow-[0_8px_24px_rgba(146,64,14,0.05)]">
              <div className="flex flex-col gap-1 border-b border-amber-100/80 bg-gradient-to-r from-amber-50/90 to-white px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Por atender</h2>
                  <p className="text-xs text-slate-500">
                    Leads nuevos, seguimientos vencidos y cotizaciones por vencer
                  </p>
                </div>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-100/80 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  {stats.followUpCount} pendiente{stats.followUpCount !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {stats.followUpTasks.map((task) => (
                  <Link
                    key={task.id}
                    href={task.href}
                    className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-amber-50/30"
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-black/[0.03] ${
                        task.kind === 'quote_expiring'
                          ? 'bg-violet-50 text-violet-600'
                          : task.kind === 'lead_new'
                            ? 'bg-sky-50 text-accent'
                            : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      {task.kind === 'quote_expiring' ? (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">{task.title}</p>
                      <p className="truncate text-xs text-slate-500">{task.message}</p>
                    </div>
                    <span className="shrink-0 text-[11px] font-semibold text-slate-400 transition-colors group-hover:text-amber-700">{task.dueLabel}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Cotizaciones"
              value={stats.totalQuotes}
              subtitle="Total de cotizaciones creadas"
              color="blue"
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
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Recent Quotes */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03),0_10px_26px_rgba(15,30,72,0.045)]">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Cotizaciones recientes</h2>
                  <p className="mt-0.5 text-xs text-slate-400">Últimos movimientos registrados</p>
                </div>
                <Link href="/dashboard/cotizaciones" className="text-xs font-semibold text-accent transition-colors hover:text-accent-dark">
                  Ver todas
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {stats.recentQuotes.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <svg className="w-12 h-12 mx-auto mb-3 text-muted-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm text-muted">No hay cotizaciones recientes</p>
                  </div>
                ) : (
                  stats.recentQuotes.map((quote) => (
                    <Link
                      key={quote.id}
                      href={`/dashboard/cotizaciones/detalles/${quote.id}`}
                      className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-sky-50/40"
                    >
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 ring-1 ring-inset ring-slate-200/70 transition-colors group-hover:bg-brand group-hover:text-white">
                        <svg className="h-4 w-4 text-brand transition-colors group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-mono text-xs font-semibold text-brand">{quote.quote_number}</p>
                        <p className="mt-0.5 truncate text-xs text-slate-500">{quote.client_name}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold tabular-nums text-slate-900">{formatCurrency(quote.total_amount)}</p>
                        <p className="text-[10px] text-slate-400">{formatRelativeTime(quote.created_at)}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Monthly Summary Chart */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03),0_10px_26px_rgba(15,30,72,0.045)]">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-sm font-semibold text-slate-900">Ritmo comercial</h2>
                <p className="mt-0.5 text-xs text-slate-400">Monto cotizado durante los últimos 6 meses</p>
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
                                className="w-full rounded-t-lg bg-gradient-to-t from-brand via-brand to-accent/80 shadow-[0_-4px_12px_rgba(14,165,233,0.08)] transition-all duration-300 hover:brightness-110"
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

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03),0_10px_26px_rgba(15,30,72,0.045)]">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-slate-900">Clientes principales</h2>
              <p className="mt-0.5 text-xs text-slate-400">Participación sobre el total cotizado</p>
            </div>
            {stats.topClients.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-muted">Aún no hay información para mostrar</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {stats.topClients.map((client, index) => {
                  const share = stats.totalQuoted > 0 ? (client.amount / stats.totalQuoted) * 100 : 0;
                  return (
                    <div key={client.name} className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50/70">
                      <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${
                        index === 0 ? 'bg-brand text-white' : 'bg-slate-100 text-slate-500'
                      }`}>{index + 1}</span>
                      <div className="min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate text-sm font-medium uppercase tracking-wide text-slate-900">{client.name}</p>
                          <p className="shrink-0 text-[11px] text-slate-400">
                            {client.count} {client.count === 1 ? 'cotización' : 'cotizaciones'}
                          </p>
                        </div>
                        <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-gradient-to-r from-brand to-accent" style={{ width: `${share}%` }} />
                        </div>
                      </div>
                      <div className="min-w-[7rem] text-right">
                        <p className="text-sm font-semibold text-brand">{formatCurrency(client.amount)}</p>
                        <p className="text-[11px] text-muted-light">{share.toFixed(1)}% del total</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
