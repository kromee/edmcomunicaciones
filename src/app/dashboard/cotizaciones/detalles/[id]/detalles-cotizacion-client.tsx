"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/useModal';
import { Modal } from '@/components/Modal';
import { generateQuotePDF } from '@/lib/pdf-generator';

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
    total: number;
  }>;
};

export default function DetallesCotizacionClient({ quote }: { quote: QuoteData }) {
  const router = useRouter();
  const { modal, hideModal, showConfirm, showSuccess, showError } = useModal();

  const downloadPDF = async () => {
    try {
      // Convertir quote_items a items para el generador de PDF
      const quoteForPDF = {
        ...quote,
        client_phone: quote.client_phone || '',
        client_company: quote.client_company || '',
        description: quote.description || '',
        valid_until: quote.valid_until,
        items: quote.quote_items.map(item => ({
          item_name: item.item_name,
          description: item.description || '',
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unit_price,
          total: item.total
        }))
      };
      
      const pdf = await generateQuotePDF(quoteForPDF);
      pdf.save(`${quote.quote_number}.pdf`);
      showSuccess('PDF Generado', 'El PDF se ha descargado exitosamente');
    } catch (error) {
      console.error('Error generando PDF:', error);
      showError('Error', 'Error al generar el PDF');
    }
  };

  const deleteQuote = async () => {
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
    <>
      <div className="space-y-6">
        {/* Información General */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Información General</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de Cotización</label>
              <p className="text-lg font-semibold text-gray-900">{quote.quote_number}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <div className="mt-1">
                {getStatusBadge(quote.status)}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <p className="text-gray-900">{quote.client_name}</p>
              <p className="text-sm text-gray-600">{quote.client_email}</p>
              {quote.client_phone && (
                <p className="text-sm text-gray-600">{quote.client_phone}</p>
              )}
              {quote.client_company && (
                <p className="text-sm text-gray-600">{quote.client_company}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Servicio</label>
              <p className="text-gray-900">{quote.service_type}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Creación</label>
              <p className="text-gray-900">
                {new Date(quote.created_at).toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Válida hasta</label>
              <p className="text-gray-900">
                {new Date(quote.valid_until).toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          
          {quote.description && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <p className="text-gray-900">{quote.description}</p>
            </div>
          )}
          
          {quote.notes && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
              <p className="text-gray-900">{quote.notes}</p>
            </div>
          )}
        </div>

        {/* Items de la Cotización */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Items de la Cotización</h2>
          
          <div className="space-y-4">
            {quote.quote_items.map((item, index) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                      #{index + 1}
                    </span>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                      {item.description}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      ${item.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Cantidad</label>
                    <p className="text-gray-900 font-medium">{item.quantity}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Unidad</label>
                    <p className="text-gray-900 font-medium">{item.unit}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Precio Unitario</label>
                    <p className="text-gray-900 font-medium">
                      ${item.unit_price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Subtotal</label>
                    <p className="text-gray-900 font-medium">
                      ${item.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Total */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-end">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  ${quote.total_amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
            <button
              onClick={downloadPDF}
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span className="hidden sm:inline">Generar PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
            <button
              onClick={() => router.push(`/dashboard/cotizaciones/editar/${quote.id}`)}
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-green-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-green-700 transition shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              <span className="hidden sm:inline">Editar Cotización</span>
              <span className="sm:hidden">Editar</span>
            </button>
            <button
              onClick={deleteQuote}
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-red-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-red-700 transition shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              <span className="hidden sm:inline">Eliminar Cotización</span>
              <span className="sm:hidden">Eliminar</span>
            </button>
          </div>
        </div>
      </div>
      
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
    </>
  );
}
