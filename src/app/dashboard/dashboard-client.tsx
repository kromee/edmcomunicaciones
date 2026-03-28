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
  total: number;
  approved: number;
  paid: number;
  pending: number;
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

interface QuickActionProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  gradient: string;
  hoverBorder: string;
}

function QuickAction({ title, description, href, icon, gradient, hoverBorder }: QuickActionProps) {
  return (
    <a
      href={href}
      className={`
        group relative flex items-center gap-4 p-4 sm:p-5
        bg-white rounded-2xl shadow-card
        border-2 border-transparent
        hover:border-transparent hover:shadow-elevated
        transition-all duration-300
        overflow-hidden
      `}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className={`absolute inset-0 border-2 border-transparent group-hover:${hoverBorder} rounded-2xl`} />
      
      <div className="relative z-10 flex items-center gap-4">
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-soft group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 group-hover:text-brand transition-colors">{title}</p>
          <p className="text-sm text-muted">{description}</p>
        </div>
        <svg className="w-5 h-5 text-muted-light group-hover:text-brand group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  const maxChartValue = Math.max(...stats.chartData.map(d => d.total), 1);

  return (
    <div className="min-h-screen bg-surface-secondary">
      <Sidebar badges={{ cotizaciones: stats.pendingQuotes, contactos: stats.newContacts }} />
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

          {/* Quick Actions */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuickAction
                title="Nueva Cotización"
                description="Crear cotización para un nuevo cliente"
                href="/cotizador"
                gradient="from-sky-500 to-blue-600"
                hoverBorder="border-sky-500"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                }
              />
              <QuickAction
                title="Ver Cotizaciones"
                description="Gestionar todas las cotizaciones"
                href="/dashboard/cotizaciones"
                gradient="from-purple-500 to-pink-500"
                hoverBorder="border-purple-500"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                }
              />
              <QuickAction
                title="Gestionar Clientes"
                description="Administrar base de datos de clientes"
                href="/dashboard/clientes"
                gradient="from-emerald-500 to-teal-500"
                hoverBorder="border-emerald-500"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                }
              />
              <QuickAction
                title="Revisar Contactos"
                description="Ver mensajes y leads recibidos"
                href="/dashboard/contactos"
                gradient="from-orange-500 to-amber-500"
                hoverBorder="border-orange-500"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
            </div>
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
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
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
                <h2 className="font-semibold text-gray-900">Resumen del Mes</h2>
                <p className="text-sm text-muted">Cotizaciones de los últimos 6 meses</p>
              </div>
              <div className="p-5">
                {stats.chartData.every(d => d.total === 0) ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <svg className="w-12 h-12 mb-3 text-muted-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-sm text-muted">No hay datos para mostrar</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-end justify-between h-40 gap-2 mb-4">
                      {stats.chartData.map((item, index) => {
                        const totalHeight = item.approved + item.paid + item.pending;
                        const approvedHeight = maxChartValue > 0 ? (item.approved / maxChartValue) * 100 : 0;
                        const paidHeight = maxChartValue > 0 ? (item.paid / maxChartValue) * 100 : 0;
                        const pendingHeight = maxChartValue > 0 ? (item.pending / maxChartValue) * 100 : 0;
                        
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full flex flex-col-reverse gap-0.5 items-center">
                              {totalHeight === 0 ? (
                                <div className="w-full h-1 bg-gray-100 rounded" />
                              ) : (
                                <>
                                  <div 
                                    className="w-full bg-success rounded-t-sm transition-all duration-500 hover:opacity-80"
                                    style={{ height: `${Math.max(approvedHeight, 0.5)}%` }}
                                    title={`Aprobadas: ${item.approved}`}
                                  />
                                  <div 
                                    className="w-full bg-[#0f1e48] rounded-t-sm transition-all duration-500 hover:opacity-80"
                                    style={{ height: `${Math.max(paidHeight, 0.5)}%` }}
                                    title={`Pagadas: ${item.paid}`}
                                  />
                                  <div 
                                    className="w-full bg-warning rounded-t-sm transition-all duration-500 hover:opacity-80"
                                    style={{ height: `${Math.max(pendingHeight, 0.5)}%` }}
                                    title={`Pendientes: ${item.pending}`}
                                  />
                                </>
                              )}
                            </div>
                            <span className="text-xs text-muted-light capitalize">{item.month}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-warning" />
                        <span className="text-sm text-muted">Pendientes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#0f1e48]" />
                        <span className="text-sm text-muted">Pagadas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-success" />
                        <span className="text-sm text-muted">Aprobadas</span>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 bg-warning/10 rounded-xl">
                        <p className="text-lg font-bold text-warning">
                          {stats.chartData.reduce((sum, d) => sum + d.pending, 0)}
                        </p>
                        <p className="text-xs text-muted">Pendientes</p>
                      </div>
                      <div className="p-3 bg-[#0f1e48]/10 rounded-xl">
                        <p className="text-lg font-bold text-brand">
                          {stats.chartData.reduce((sum, d) => sum + d.paid, 0)}
                        </p>
                        <p className="text-xs text-muted">Pagadas</p>
                      </div>
                      <div className="p-3 bg-success/10 rounded-xl">
                        <p className="text-lg font-bold text-success">
                          {stats.chartData.reduce((sum, d) => sum + d.approved, 0)}
                        </p>
                        <p className="text-xs text-muted">Aprobadas</p>
                      </div>
                    </div>
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
