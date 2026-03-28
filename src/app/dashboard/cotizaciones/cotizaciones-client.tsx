"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SessionUser } from '@/types/session';
import { Sidebar } from '@/components/DashboardSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Modal } from '@/components/Modal';
import { useModal } from '@/hooks/useModal';
import { generateQuotePDF } from '@/lib/pdf-generator';

const ITEMS_PER_PAGE = 10;

type Quote = {
  id: string;
  quote_number: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  client_company: string | null;
  service_type: string;
  description: string | null;
  valid_until: string;
  custom_commercial_terms: string | null;
  show_valid_until?: boolean | null;
  subtotal: number;
  tax: number;
  total_amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'sent' | 'paid';
  created_at: string;
  quote_items: Array<{
    item_name: string;
    description: string | null;
    quantity: number;
    unit: 'PZA' | 'SERV';
    unit_price: number;
    percentage: number;
    total: number;
  }>;
};

type StatusFilter = 'all' | 'pending' | 'sent' | 'approved' | 'rejected' | 'paid';

const statusConfig: Record<StatusFilter, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  all: { label: 'Todas', bg: 'bg-gray-100', text: 'text-gray-700', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
  pending: { label: 'Pendientes', bg: 'bg-warning/10', text: 'text-warning-dark', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  sent: { label: 'Enviadas', bg: 'bg-accent/10', text: 'text-accent-dark', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
  approved: { label: 'Aprobadas', bg: 'bg-success/10', text: 'text-success-dark', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  rejected: { label: 'Rechazadas', bg: 'bg-danger/10', text: 'text-danger-dark', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  paid: { label: 'Pagadas', bg: 'bg-green-100', text: 'text-green-700', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> },
};

const serviceIcons: Record<string, React.ReactNode> = {
  cctv: '📹',
  cableado: '🔌',
  mantenimiento: '🔧',
  instalacion: '⚡',
  software: '💻',
  consultoria: '📋',
  mixto: '🏗️',
  otro: '📦',
};

export default function CotizacionesClient({ quotes, user }: { quotes: Quote[]; user: SessionUser }) {
  const router = useRouter();
  const { modal, hideModal, showConfirm, showSuccess, showError } = useModal();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>(quotes);
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [actionsOpen, setActionsOpen] = useState<string | null>(null);

  const filterQuotes = (quotes: Quote[], searchTerm: string, status: StatusFilter) => {
    let filtered = quotes;
    
    if (status !== 'all') {
      filtered = filtered.filter(quote => quote.status === status);
    }
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(quote => 
        quote.quote_number.toLowerCase().includes(term) ||
        quote.client_name.toLowerCase().includes(term) ||
        (quote.client_company && quote.client_company.toLowerCase().includes(term)) ||
        quote.service_type.toLowerCase().includes(term) ||
        (quote.description && quote.description.toLowerCase().includes(term)) ||
        quote.client_email.toLowerCase().includes(term) ||
        (quote.client_phone && quote.client_phone.includes(term))
      );
    }
    
    return filtered;
  };

  useEffect(() => {
    const filtered = filterQuotes(quotes, searchTerm, statusFilter);
    setFilteredQuotes(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, quotes]);

  const getStatusCount = (status: StatusFilter) => {
    if (status === 'all') return quotes.length;
    return quotes.filter(q => q.status === status).length;
  };

  const totalPages = Math.ceil(filteredQuotes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedQuotes = filteredQuotes.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const downloadPDF = async (quote: Quote) => {
    try {
      if (!quote.quote_items || !Array.isArray(quote.quote_items)) {
        showError('Error', 'La cotización no tiene items válidos');
        return;
      }
      
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
          unit: item.unit,
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
      setActionsOpen(null);
    } catch (error) {
      console.error('Error generando PDF:', error);
      showError('Error', 'Error al generar el PDF');
    }
  };

  const deleteQuote = async (quoteId: string, quoteNumber: string) => {
    setActionsOpen(null);
    showConfirm(
      'Eliminar Cotización',
      `¿Estás seguro de que quieres eliminar la cotización ${quoteNumber}? Esta acción no se puede deshacer.`,
      async () => {
        try {
          const response = await fetch(`/api/quotes/delete?id=${quoteId}`, {
            method: 'DELETE',
          });
          const data = await response.json();
          if (data.success) {
            showSuccess('Cotización Eliminada', 'La cotización se ha eliminado exitosamente');
            setTimeout(() => window.location.reload(), 1500);
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
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-surface-secondary">
      <Sidebar />
      <DashboardHeader user={user} onLogout={handleLogout} sidebarCollapsed={sidebarCollapsed} />

      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <a href="/dashboard" className="p-2 rounded-xl hover:bg-white/50 transition-colors">
                  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </a>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Cotizaciones</h1>
              </div>
              <p className="text-muted ml-11 sm:ml-0">{filteredQuotes.length} cotización{filteredQuotes.length !== 1 ? 'es' : ''} encontrada{filteredQuotes.length !== 1 ? 's' : ''}</p>
            </div>
            <a
              href="/cotizador"
              className="btn-accent"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nueva Cotización
            </a>
          </div>

          {/* Status Filters */}
          <div className="mb-6 overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max">
              {(Object.keys(statusConfig) as StatusFilter[]).map((status) => {
                const config = statusConfig[status];
                const isActive = statusFilter === status;
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                      transition-all duration-200
                      ${isActive 
                        ? 'bg-brand text-white shadow-soft' 
                        : 'bg-white text-muted hover:bg-surface-secondary border border-gray-100'
                      }
                    `}
                  >
                    <span className={isActive ? 'text-white/80' : config.text}>
                      {config.icon}
                    </span>
                    {config.label}
                    <span className={`
                      ml-1 px-2 py-0.5 rounded-full text-xs
                      ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}
                    `}>
                      {getStatusCount(status)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por número, cliente, empresa..."
                className="input pl-11 pr-4 py-3"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Quotes Grid */}
          {filteredQuotes.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-card text-center">
              {searchTerm || statusFilter !== 'all' ? (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-surface-secondary flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-muted-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin resultados</h3>
                  <p className="text-muted mb-6">No hay cotizaciones que coincidan con tu búsqueda</p>
                  <button
                    onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                    className="btn-secondary"
                  >
                    Limpiar filtros
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay cotizaciones</h3>
                  <p className="text-muted mb-6">Crea tu primera cotización para comenzar</p>
                  <a href="/cotizador" className="btn-accent">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Crear Cotización
                  </a>
                </>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {paginatedQuotes.map((quote) => {
                const statusStyle = statusConfig[quote.status];
                return (
                  <div 
                    key={quote.id} 
                    className="bg-white rounded-2xl shadow-card hover:shadow-elevated transition-all duration-200 group"
                  >
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Left: Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-4">
                            <div className="hidden sm:flex w-12 h-12 rounded-xl bg-gradient-to-br from-brand to-accent items-center justify-center text-2xl flex-shrink-0">
                              {serviceIcons[quote.service_type] || '📦'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-bold text-gray-900 truncate">{quote.quote_number}</h3>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                                  {statusStyle.icon}
                                  {statusStyle.label}
                                </span>
                              </div>
                              <p className="font-medium text-gray-900 truncate">{quote.client_name}</p>
                              {quote.client_company && (
                                <p className="text-sm text-muted truncate">{quote.client_company}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Center: Details */}
                        <div className="hidden md:flex items-center gap-6 lg:gap-8">
                          <div className="text-center">
                            <p className="text-xs text-muted-light uppercase tracking-wide mb-1">Fecha</p>
                            <p className="text-sm font-medium text-gray-900">{formatDate(quote.created_at)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-light uppercase tracking-wide mb-1">Válida hasta</p>
                            <p className="text-sm font-medium text-gray-900">{formatDate(quote.valid_until)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-light uppercase tracking-wide mb-1">Items</p>
                            <p className="text-sm font-medium text-gray-900">{quote.quote_items?.length || 0}</p>
                          </div>
                        </div>

                        {/* Right: Total & Actions */}
                        <div className="flex items-center justify-between lg:justify-end gap-4">
                          <div className="text-right">
                            <p className="text-xs text-muted-light uppercase tracking-wide mb-1">Total</p>
                            <p className="text-xl font-bold text-brand">{formatCurrency(quote.total_amount)}</p>
                          </div>
                          
                          {/* Actions Dropdown */}
                          <div className="relative">
                            <button
                              onClick={() => setActionsOpen(actionsOpen === quote.id ? null : quote.id)}
                              className="p-2 rounded-xl hover:bg-surface-secondary transition-colors text-muted hover:text-gray-900"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 12a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </button>
                            
                            {actionsOpen === quote.id && (
                              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-elevated border border-gray-100 py-2 z-20 animate-slide-up">
                                <a
                                  href={`/dashboard/cotizaciones/detalles/${quote.id}`}
                                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-surface-secondary transition-colors"
                                >
                                  <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  Ver Detalles
                                </a>
                                <a
                                  href={`/dashboard/cotizaciones/editar/${quote.id}`}
                                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-surface-secondary transition-colors"
                                >
                                  <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Editar
                                </a>
                                <button
                                  onClick={() => downloadPDF(quote)}
                                  className="flex items-center gap-3 px-4 py-2.5 w-full text-sm text-gray-700 hover:bg-surface-secondary transition-colors"
                                >
                                  <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  Descargar PDF
                                </button>
                                <div className="border-t border-gray-100 my-2" />
                                <button
                                  onClick={() => deleteQuote(quote.id, quote.quote_number)}
                                  className="flex items-center gap-3 px-4 py-2.5 w-full text-sm text-danger hover:bg-danger/5 transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Eliminar
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl p-4 shadow-card">
              <p className="text-sm text-muted">
                Mostrando {startIndex + 1} - {Math.min(endIndex, filteredQuotes.length)} de {filteredQuotes.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl hover:bg-surface-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => goToPage(pageNumber)}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                          currentPage === pageNumber
                            ? 'bg-brand text-white'
                            : 'bg-surface-secondary text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                    return <span key={pageNumber} className="px-1 text-gray-400">...</span>;
                  }
                  return null;
                })}
                
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl hover:bg-surface-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Click outside to close actions */}
      {actionsOpen && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setActionsOpen(null)}
        />
      )}

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
