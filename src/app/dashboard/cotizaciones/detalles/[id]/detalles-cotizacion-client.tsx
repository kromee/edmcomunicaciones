"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/useModal';
import { Modal } from '@/components/Modal';
import { generateQuotePDF } from '@/lib/pdf-generator';
import { normalizeQuoteStatus, quoteStatusBadgeClasses } from '@/lib/quote-status';
import { Sidebar } from '@/components/DashboardSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { SessionUser } from '@/types/session';

type QuoteData = {
  id: string;
  quote_number: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  client_company: string | null;
  service_type: string;
  description: string;
  valid_until: string;
  notes: string | null;
  custom_commercial_terms: string | null;
  show_valid_until?: boolean | null;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  quote_items: Array<{
    id: string;
    item_name: string;
    description: string;
    quantity: number;
    unit: string;
    unit_price: number;
    percentage: number;
    total: number;
  }>;
  created_by?: string | null;
};

const serviceIcons: Record<string, string> = {
  cctv: '📹',
  cableado: '🔌',
  mantenimiento: '🔧',
  instalacion: '⚡',
  software: '💻',
  consultoria: '📋',
  mixto: '🏗️',
  otro: '📦',
};

const statusConfig: Record<string, { bg: string; text: string; label: string; color: string }> = {
  pending: { bg: 'bg-warning/10', text: 'text-warning-dark', label: 'Pendiente', color: 'warning' },
  sent: { bg: 'bg-accent/10', text: 'text-accent-dark', label: 'Enviada', color: 'accent' },
  approved: { bg: 'bg-success/10', text: 'text-success-dark', label: 'Aprobada', color: 'success' },
  rejected: { bg: 'bg-danger/10', text: 'text-danger-dark', label: 'Rechazada', color: 'danger' },
  paid: { bg: 'bg-brand/10', text: 'text-brand', label: 'Pagada', color: 'brand' },
};

const allStatuses: Array<{ key: string; label: string; bg: string; text: string; color: string }> = [
  { key: 'pending', label: 'Pendiente', bg: 'bg-warning/10', text: 'text-warning-dark', color: 'warning' },
  { key: 'sent', label: 'Enviada', bg: 'bg-accent/10', text: 'text-accent-dark', color: 'accent' },
  { key: 'approved', label: 'Aprobada', bg: 'bg-success/10', text: 'text-success-dark', color: 'success' },
  { key: 'rejected', label: 'Rechazada', bg: 'bg-danger/10', text: 'text-danger-dark', color: 'danger' },
  { key: 'paid', label: 'Pagada', bg: 'bg-brand/10', text: 'text-brand', color: 'brand' },
];

export default function DetallesCotizacionClient({
  quote,
  creator,
  user,
}: {
  quote: QuoteData;
  creator: { name: string; email: string } | null;
  user: SessionUser;
}) {
  const router = useRouter();
  const { modal, hideModal, showConfirm, showSuccess, showError } = useModal();
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const statusNormalized = normalizeQuoteStatus(quote.status);
  const statusInfo = statusConfig[statusNormalized] || statusConfig.pending;
  const currentStatusOption = allStatuses.find(s => s.key === statusNormalized) || allStatuses[0];
  const statusMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target as Node)) {
        setStatusMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const downloadPDF = async () => {
    try {
      const quoteForPDF = {
        quote_number: quote.quote_number,
        client_name: quote.client_name,
        client_email: quote.client_email,
        client_phone: quote.client_phone || '',
        client_company: quote.client_company || '',
        service_type: quote.service_type,
        description: quote.description || '',
        valid_until: quote.valid_until,
        custom_commercial_terms: quote.custom_commercial_terms,
        show_valid_until: quote.show_valid_until !== undefined ? quote.show_valid_until : true,
        items: quote.quote_items.map(item => ({
          item_name: item.item_name,
          description: item.description || '',
          quantity: item.quantity,
          unit: item.unit as 'PZA' | 'SERV',
          unit_price: item.unit_price,
          percentage: item.percentage || 0,
          total: item.total
        })),
        subtotal: quote.total_amount,
        tax: 0,
        total_amount: quote.total_amount,
        created_at: quote.created_at
      };
      
      const pdf = await generateQuotePDF(quoteForPDF);
      pdf.save(`${quote.quote_number}.pdf`);
      showSuccess('PDF Generado', 'El PDF se ha descargado exitosamente');
    } catch (error) {
      console.error('Error generando PDF:', error);
      showError('Error', 'Error al generar el PDF');
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (statusNormalized === newStatus) return;
    setUpdatingStatus(true);
    setStatusMenuOpen(false);
    try {
      const response = await fetch('/api/quotes/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId: quote.id, status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        const statusLabel = allStatuses.find(s => s.key === newStatus)?.label || newStatus;
        showSuccess('Estado actualizado', `La cotización quedó marcada como ${statusLabel}`);
        router.refresh();
      } else {
        showError('Error', data.error || 'No se pudo actualizar el estado');
      }
    } catch {
      showError('Error', 'No se pudo actualizar el estado');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const deleteQuote = () => {
    showConfirm(
      'Eliminar Cotización',
      `¿Estás seguro de que quieres eliminar la cotización ${quote.quote_number}? Esta acción no se puede deshacer.`,
      async () => {
        try {
          const response = await fetch(`/api/quotes/delete?id=${quote.id}`, {
            method: 'DELETE',
          });
          const data = await response.json();
          if (data.success) {
            showSuccess('Cotización Eliminada', 'La cotización se ha eliminado exitosamente');
            setTimeout(() => {
              router.push('/dashboard/cotizaciones');
            }, 1500);
          } else {
            showError('Error', `Error: ${data.error}`);
          }
        } catch (error) {
          console.error('Error eliminando cotización:', error);
          showError('Error', 'Error al eliminar la cotización');
        }
      },
      'Eliminar',
      'Cancelar'
    );
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-surface-secondary">
      <Sidebar />
      <DashboardHeader user={user} onLogout={handleLogout} sidebarCollapsed={sidebarCollapsed} />

      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="flex items-start gap-4 mb-8">
            <a 
              href="/dashboard/cotizaciones" 
              className="p-2.5 rounded-xl hover:bg-white/50 transition-colors mt-1"
            >
              <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </a>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Cotización</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.text}`}>
                  {statusInfo.label}
                </span>
              </div>
              <p className="text-muted">
                {quote.quote_number} • {quote.client_name}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Overview Card */}
            <div className="bg-white rounded-2xl shadow-card">
              <div className="p-6 bg-gradient-to-r from-brand to-brand-light">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
                      {serviceIcons[quote.service_type] || '📦'}
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Total de la Cotización</p>
                      <p className="text-3xl font-bold text-white">{formatCurrency(quote.total_amount)}</p>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right text-white/70 text-sm">
                    <p>Válida hasta</p>
                    <p className="font-semibold text-white">{formatDate(quote.valid_until)}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap gap-2">
                {/* Status Dropdown */}
                <div ref={statusMenuRef} className="relative">
                  <button
                    onClick={() => setStatusMenuOpen(!statusMenuOpen)}
                    disabled={updatingStatus}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-colors disabled:opacity-50 ${currentStatusOption.bg} ${currentStatusOption.text} hover:opacity-80`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    {updatingStatus ? 'Guardando...' : `Estado: ${currentStatusOption.label}`}
                    <svg className={`w-4 h-4 transition-transform ${statusMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {statusMenuOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-elevated border border-gray-100 py-2 z-20 animate-slide-up">
                      <p className="px-4 py-2 text-xs font-semibold text-muted uppercase tracking-wide border-b border-gray-100">
                        Cambiar estado
                      </p>
                      {allStatuses.map((status) => (
                        <button
                          key={status.key}
                          onClick={() => updateStatus(status.key)}
                          className={`flex items-center gap-3 px-4 py-2.5 w-full text-sm transition-colors ${
                            statusNormalized === status.key
                              ? `${status.bg} font-medium`
                              : 'text-gray-700 hover:bg-surface-secondary'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${status.bg.includes('brand') ? 'bg-brand' : status.bg.replace('/10', '')}`} />
                          {status.label}
                          {statusNormalized === status.key && (
                            <svg className="w-4 h-4 ml-auto text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={downloadPDF}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent-dark transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Descargar PDF
                </button>
                <button
                  onClick={() => router.push(`/dashboard/cotizaciones/editar/${quote.id}`)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-surface-secondary text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
                <button
                  onClick={deleteQuote}
                  className="inline-flex items-center gap-2 px-4 py-2 text-danger text-sm font-medium rounded-xl hover:bg-danger/5 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar
                </button>
              </div>

              {/* Client Info */}
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {quote.client_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{quote.client_name}</h3>
                    <p className="text-muted">{quote.client_email}</p>
                    {quote.client_company && (
                      <p className="text-sm text-muted-light flex items-center gap-1 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {quote.client_company}
                      </p>
                    )}
                    {quote.client_phone && (
                      <p className="text-sm text-muted-light flex items-center gap-1 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {quote.client_phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Description */}
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Descripción
                </h3>
                <p className="text-muted">
                  {quote.description || 'Sin descripción'}
                </p>
                {quote.notes && (
                  <div className="mt-4 p-3 bg-warning/5 rounded-xl border border-warning/10">
                    <p className="text-xs font-medium text-warning-dark mb-1">Notas</p>
                    <p className="text-sm text-muted">{quote.notes}</p>
                  </div>
                )}
              </div>

              {/* Meta Info */}
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Información
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted text-sm">Fecha de creación</span>
                    <span className="font-medium text-gray-900 text-sm">{formatDate(quote.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted text-sm">Válida hasta</span>
                    <span className="font-medium text-gray-900 text-sm">{formatDate(quote.valid_until)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted text-sm">Tipo de servicio</span>
                    <span className="font-medium text-gray-900 text-sm capitalize">{quote.service_type}</span>
                  </div>
                  {creator && (
                    <div className="flex justify-between">
                      <span className="text-muted text-sm">Creada por</span>
                      <span className="font-medium text-gray-900 text-sm">{creator.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Items de la Cotización ({quote.quote_items.length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface-secondary">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">#</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Descripción</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-muted uppercase tracking-wide">Cant.</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-muted uppercase tracking-wide">Precio Unit.</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-muted uppercase tracking-wide">%</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-muted uppercase tracking-wide">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {quote.quote_items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-surface-secondary/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-muted">{index + 1}</td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{item.description}</p>
                          <p className="text-xs text-muted-light">{item.unit}</p>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-6 py-4 text-right text-sm text-gray-900">{formatCurrency(item.unit_price)}</td>
                        <td className="px-6 py-4 text-right text-sm text-accent">{item.percentage || 0}%</td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-semibold text-brand">{formatCurrency(item.total)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-surface-secondary">
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-right font-semibold text-gray-900">Total:</td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xl font-bold text-brand">{formatCurrency(quote.total_amount)}</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Commercial Terms */}
            {quote.custom_commercial_terms && (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Condiciones Comerciales
                </h3>
                <div className="p-4 bg-surface-secondary rounded-xl">
                  <p className="text-sm text-muted whitespace-pre-wrap">{quote.custom_commercial_terms}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Modal
        isOpen={modal.isOpen}
        onClose={hideModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
      />
    </div>
  );
}
