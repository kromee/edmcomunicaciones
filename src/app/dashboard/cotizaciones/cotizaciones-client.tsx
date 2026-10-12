"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SessionUser } from '@/types/session';
import { Sidebar } from '@/components/DashboardSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Modal } from '@/components/Modal';
import { useModal } from '@/hooks/useModal';
import { generateQuotePDF } from '@/lib/pdf-generator';
import type { QuoteItemUnit } from '@/lib/quote-item-units';
import { normalizeQuoteItemUnit } from '@/lib/quote-item-units';

const ITEMS_PER_PAGE = 20;

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
    unit: QuoteItemUnit;
    unit_price: number;
    percentage: number;
    total: number;
  }>;
};

type StatusFilter = 'all' | 'pending' | 'sent' | 'approved' | 'rejected' | 'paid';

const statusConfig: Record<StatusFilter, { label: string }> = {
  all: { label: 'Todas' },
  pending: { label: 'Pendientes' },
  sent: { label: 'Enviadas' },
  approved: { label: 'Aprobadas' },
  rejected: { label: 'Rechazadas' },
  paid: { label: 'Pagadas' },
};

/** Intro fija del cotizador. En el listado solo se muestra lo que sigue. */
const PROJECT_INTRO =
  /^a continuaci[oó]n presento la propuesta econ[oó]mica solicitada por concepto(?:\s+de)?\s*[:\-–—]?\s*/i;

function projectListText(description: string | null | undefined): string {
  return (description ?? '').trim().replace(PROJECT_INTRO, '').trim();
}

function totalSearchText(amount: number): string {
  const value = Number(amount);
  if (!Number.isFinite(value)) return '';
  const fixed = value.toFixed(2);
  const grouped = new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  const currency = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(value);
  return [String(value), fixed, grouped, currency].join(' ');
}

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

function QuoteRowMenu({
  quoteId,
  open,
  openUpward,
  onToggle,
  onDownload,
  onDelete,
}: {
  quoteId: string;
  open: boolean;
  openUpward: boolean;
  onToggle: () => void;
  onDownload: () => void;
  onDelete: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; upward: boolean } | null>(null);

  useEffect(() => {
    if (!open || !buttonRef.current) {
      setCoords(null);
      return;
    }

    const place = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      const upward = openUpward || rect.bottom + 220 > window.innerHeight;
      setCoords({
        top: upward ? rect.top - 4 : rect.bottom + 4,
        left: rect.right,
        upward,
      });
    };

    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [open, openUpward]);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <button
        ref={buttonRef}
        type="button"
        onClick={onToggle}
        className="p-1.5 rounded-lg hover:bg-surface-secondary transition-colors text-muted hover:text-gray-900"
        aria-label="Acciones"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>

      {open && coords && (
        <div
          className="fixed z-50 w-48 bg-white rounded-md shadow-elevated border border-gray-100 py-1.5"
          style={{
            top: coords.top,
            left: coords.left,
            transform: coords.upward ? 'translate(-100%, -100%)' : 'translateX(-100%)',
          }}
        >
          <a
            href={`/dashboard/cotizaciones/detalles/${quoteId}`}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-surface-secondary transition-colors"
          >
            Ver detalles
          </a>
          <a
            href={`/dashboard/cotizaciones/editar/${quoteId}`}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-surface-secondary transition-colors"
          >
            Editar
          </a>
          <a
            href={`/cotizador?duplicateQuoteId=${quoteId}`}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-surface-secondary transition-colors"
          >
            Duplicar
          </a>
          <button
            type="button"
            onClick={onDownload}
            className="flex items-center gap-3 px-4 py-2 w-full text-sm text-gray-700 hover:bg-surface-secondary transition-colors"
          >
            Descargar PDF
          </button>
          <div className="border-t border-gray-100 my-1" />
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-3 px-4 py-2 w-full text-sm text-danger hover:bg-danger/5 transition-colors"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}

export default function CotizacionesClient({ quotes, user }: { quotes: Quote[]; user: SessionUser }) {
  const router = useRouter();
  const { modal, hideModal, showConfirm, showSuccess, showError } = useModal();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>(quotes);
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [actionsOpen, setActionsOpen] = useState<string | null>(null);

  // Normaliza texto: minúsculas y sin acentos/diacríticos, para búsquedas tolerantes
  const normalizeText = (value: unknown): string =>
    String(value ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  // Construye un único texto buscable con todos los campos relevantes de la cotización
  const buildSearchHaystack = (quote: Quote): string => {
    const parts: unknown[] = [
      quote.quote_number,
      quote.client_name,
      quote.client_company,
      quote.client_email,
      quote.client_phone,
      quote.service_type,
      quote.description,
      totalSearchText(quote.total_amount),
    ];

    if (Array.isArray(quote.quote_items)) {
      for (const item of quote.quote_items) {
        parts.push(item.item_name, item.description);
      }
    }

    return normalizeText(parts.join(' '));
  };

  const filterQuotes = (quotes: Quote[], searchTerm: string, status: StatusFilter) => {
    let filtered = quotes;

    if (status !== 'all') {
      filtered = filtered.filter(quote => quote.status === status);
    }

    const tokens = normalizeText(searchTerm)
      .replace(/[$,]/g, '')
      .split(/\s+/)
      .filter(Boolean);
    if (tokens.length > 0) {
      filtered = filtered.filter(quote => {
        const haystack = buildSearchHaystack(quote);
        // Todas las palabras deben aparecer (búsqueda tipo "AND")
        return tokens.every(token => haystack.includes(token));
      });
    }

    return filtered;
  };

  useEffect(() => {
    const filtered = filterQuotes(quotes, searchTerm, statusFilter);
    setFilteredQuotes(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, quotes]);

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
          unit: normalizeQuoteItemUnit(item.unit),
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
      <Sidebar defaultCollapsed onCollapsedChange={setSidebarCollapsed} />
      <DashboardHeader
        user={user}
        onLogout={handleLogout}
        sidebarCollapsed={sidebarCollapsed}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar por número, cliente, empresa, proyecto o total..."
      />

      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-3">
                <a href="/dashboard" className="p-2 rounded-md hover:bg-white/50 transition-colors">
                  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </a>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Cotizaciones</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="sr-only" htmlFor="quote-status-filter">Estado</label>
              <select
                id="quote-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="flex-1 sm:flex-none bg-white border border-gray-200 rounded-md px-3 py-2.5 text-sm font-medium text-gray-900 shadow-card focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                {(Object.keys(statusConfig) as StatusFilter[]).map((status) => (
                  <option key={status} value={status}>
                    {statusConfig[status].label}
                  </option>
                ))}
              </select>
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
            <>
              <div className="hidden md:block bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
                <table className="w-full table-fixed text-sm">
                  <thead className="text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="bg-brand text-left font-semibold text-white/80 px-4 py-3 w-[16%]">Cotización</th>
                      <th className="bg-brand text-left font-semibold text-white/80 px-3 py-3 w-[16%]">Cliente</th>
                      <th className="bg-brand text-left font-semibold text-white/80 px-3 py-3">Proyecto</th>
                      <th className="bg-brand text-left font-semibold text-white/80 px-3 py-3 w-[9%]">Fecha</th>
                      <th className="bg-brand text-right font-semibold text-white/80 px-3 py-3 w-[11%]">Total</th>
                      <th className="bg-brand px-2 py-3 w-[4%]"><span className="sr-only">Acciones</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedQuotes.map((quote, index) => {
                      const project = projectListText(quote.description);
                      return (
                        <tr
                          key={quote.id}
                          onClick={() => router.push(`/dashboard/cotizaciones/detalles/${quote.id}`)}
                          className={`cursor-pointer border-b border-gray-100 transition-colors ${
                            index % 2 === 1 ? 'bg-surface-secondary/80' : 'bg-white'
                          } hover:bg-accent/5`}
                        >
                          <td className="px-4 py-3 align-top">
                            <div className="flex items-start gap-2.5 min-w-0">
                              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand/5 text-base" aria-hidden>
                                {serviceIcons[quote.service_type] || '📦'}
                              </span>
                              <span className="font-semibold text-brand leading-snug break-all">{quote.quote_number}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3 overflow-hidden align-top">
                            <p className="font-semibold text-gray-900 truncate uppercase tracking-wide">{quote.client_name}</p>
                            {quote.client_company ? (
                              <p className="mt-0.5 text-xs text-muted truncate">{quote.client_company}</p>
                            ) : null}
                          </td>
                          <td className="px-3 py-3 align-top">
                            <p className={`rounded-md px-2.5 py-1.5 text-[13px] text-gray-800 whitespace-pre-wrap break-words leading-snug ring-1 ring-gray-100 ${
                              index % 2 === 1 ? 'bg-white' : 'bg-surface-secondary'
                            }`}>
                              {project || 'Sin descripción'}
                            </p>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-muted align-top">{formatDate(quote.created_at)}</td>
                          <td className="px-3 py-3 text-right align-top">
                            <span className="inline-flex rounded-md bg-brand px-2 py-1 text-xs font-semibold text-white whitespace-nowrap">
                              {formatCurrency(quote.total_amount)}
                            </span>
                          </td>
                          <td className="px-2 py-3 align-top">
                            <QuoteRowMenu
                              quoteId={quote.id}
                              open={actionsOpen === quote.id}
                              openUpward={index >= paginatedQuotes.length - 3}
                              onToggle={() => setActionsOpen(actionsOpen === quote.id ? null : quote.id)}
                              onDownload={() => downloadPDF(quote)}
                              onDelete={() => deleteQuote(quote.id, quote.quote_number)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden bg-white rounded-2xl shadow-card border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                {paginatedQuotes.map((quote, index) => {
                  const project = projectListText(quote.description);
                  return (
                    <div
                      key={quote.id}
                      onClick={() => router.push(`/dashboard/cotizaciones/detalles/${quote.id}`)}
                      className={`px-3 py-3 flex items-start gap-2 cursor-pointer ${
                        index % 2 === 1 ? 'bg-surface-secondary/80' : 'bg-white'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand/5 text-sm" aria-hidden>
                            {serviceIcons[quote.service_type] || '📦'}
                          </span>
                          <span className="text-sm font-semibold text-brand truncate">{quote.quote_number}</span>
                          <span className="ml-auto inline-flex rounded-md bg-brand px-2 py-1 text-[11px] font-semibold text-white whitespace-nowrap">
                            {formatCurrency(quote.total_amount)}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm font-semibold text-gray-900 truncate uppercase tracking-wide">
                          {quote.client_name}
                          {quote.client_company ? <span className="font-normal normal-case tracking-normal text-muted"> · {quote.client_company}</span> : null}
                        </p>
                        <p className="mt-1 rounded-md bg-surface-secondary px-2.5 py-1.5 text-xs text-gray-800 whitespace-pre-wrap break-words leading-snug ring-1 ring-gray-100">
                          {project || 'Sin descripción'}
                        </p>
                        <p className="mt-1 text-[11px] text-muted">
                          {formatDate(quote.created_at)}
                        </p>
                      </div>
                      <QuoteRowMenu
                        quoteId={quote.id}
                        open={actionsOpen === quote.id}
                        openUpward={index >= paginatedQuotes.length - 2}
                        onToggle={() => setActionsOpen(actionsOpen === quote.id ? null : quote.id)}
                        onDownload={() => downloadPDF(quote)}
                        onDelete={() => deleteQuote(quote.id, quote.quote_number)}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl p-3 shadow-card">
              <p className="text-sm text-muted">
                Mostrando {startIndex + 1} - {Math.min(endIndex, filteredQuotes.length)} de {filteredQuotes.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md hover:bg-surface-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        className={`w-10 h-10 rounded-md text-sm font-medium transition-all ${
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
                  className="p-2 rounded-md hover:bg-surface-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
