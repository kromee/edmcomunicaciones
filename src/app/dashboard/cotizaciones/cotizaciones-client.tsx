"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SessionUser } from '@/lib/session';
import { Reveal } from '@/components/Reveal';
import { generateQuotePDF } from '@/lib/pdf-generator';
import { Modal } from '@/components/Modal';
import { useModal } from '@/hooks/useModal';

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
  subtotal: number;
  tax: number;
  total_amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'sent';
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

export default function CotizacionesClient({ quotes, user }: { quotes: Quote[]; user: SessionUser }) {
  const router = useRouter();
  const { modal, hideModal, showConfirm, showSuccess, showError } = useModal();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>(quotes);
  const [currentPage, setCurrentPage] = useState(1);

  // Función para filtrar cotizaciones
  const filterQuotes = (quotes: Quote[], searchTerm: string) => {
    if (!searchTerm.trim()) return quotes;
    
    const term = searchTerm.toLowerCase();
    return quotes.filter(quote => 
      quote.quote_number.toLowerCase().includes(term) ||
      quote.client_name.toLowerCase().includes(term) ||
      (quote.client_company && quote.client_company.toLowerCase().includes(term)) ||
      quote.service_type.toLowerCase().includes(term) ||
      (quote.description && quote.description.toLowerCase().includes(term)) ||
      quote.client_email.toLowerCase().includes(term) ||
      (quote.client_phone && quote.client_phone.includes(term))
    );
  };

  // Efecto para filtrar cotizaciones cuando cambia el término de búsqueda
  useEffect(() => {
    const filtered = filterQuotes(quotes, searchTerm);
    setFilteredQuotes(filtered);
    setCurrentPage(1); // Resetear a página 1 al filtrar
  }, [searchTerm, quotes]);

  // Calcular paginación
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
      // Validar que la cotización tenga la estructura necesaria
      if (!quote.quote_items || !Array.isArray(quote.quote_items)) {
        console.error('La cotización no tiene items válidos:', quote);
        showError('Error', 'La cotización no tiene items válidos');
        return;
      }
      
      // Convertir quote_items a items para el generador de PDF
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
    } catch (error) {
      console.error('Error generando PDF:', error);
      showError('Error', 'Error al generar el PDF');
    }
  };

  const deleteQuote = async (quoteId: string, quoteNumber: string) => {
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
            // Recargar la página para actualizar la lista
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' },
      sent: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Enviada' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Aprobada' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rechazada' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="EDM" className="h-8 w-auto" />
              <span className="hidden sm:inline text-sm text-gray-500">Comunicaciones</span>
              <div>
               
          
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-100 transition"
              >
                ← Volver
              </a>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header con botón de nueva cotización */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Cotizaciones</h2>
            <p className="text-sm sm:text-base text-gray-600">Total: {quotes.length} cotización{quotes.length !== 1 ? 'es' : ''}</p>
          </div>
          <a
            href="/cotizador"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-sky-600 hover:to-blue-700 transition shadow-md hover:shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Nueva Cotización
          </a>
        </div>

        {/* Barra de búsqueda */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Buscar cotizaciones
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por número, cliente, empresa..."
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          
          </div>
        </div>

        {/* Lista de cotizaciones */}
        {filteredQuotes.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            {searchTerm ? (
              <>
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron resultados</h3>
                <p className="text-gray-600 mb-6">
                  No hay cotizaciones que coincidan con "{searchTerm}". Intenta con otros términos de búsqueda.
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  Limpiar Búsqueda
                </button>
              </>
            ) : (
              <>
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay cotizaciones</h3>
                <p className="text-gray-600 mb-6">Crea tu primera cotización para comenzar</p>
                <a
                  href="/cotizador"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-lg hover:from-sky-600 hover:to-blue-700 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Crear Primera Cotización
                </a>
              </>
            )}
          </div>
        ) : (
          <>
          <div className="space-y-4">
            {paginatedQuotes.map((quote, index) => (
              <Reveal key={quote.id} delay={index * 0.05}>
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-3">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">{quote.quote_number}</h3>
                        <p className="text-sm sm:text-base text-gray-700 font-medium">{quote.client_name}</p>
                        {quote.client_company && (
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">{quote.client_company}</p>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                        {getStatusBadge(quote.status)}
                        <span className="text-gray-600">
                          {new Date(quote.created_at).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">{quote.quote_items?.length || 0} items</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-center">
                        <p className="text-xs text-gray-600">Total</p>
                        <p className="text-lg sm:text-2xl font-bold text-blue-600">
                          ${quote.total_amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <button
                        onClick={() => window.location.href = `/dashboard/cotizaciones/detalles/${quote.id}`}
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm hover:shadow-md w-full sm:w-auto"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-sm text-gray-600">
                Mostrando {startIndex + 1} - {Math.min(endIndex, filteredQuotes.length)} de {filteredQuotes.length} cotizaciones
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>

                {/* Páginas */}
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Mostrar solo algunas páginas alrededor de la actual
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => goToPage(pageNumber)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                            currentPage === pageNumber
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return <span key={pageNumber} className="px-2 text-gray-400">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          )}
          </>
        )}
      </main>
      
      {/* Modal */}
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
