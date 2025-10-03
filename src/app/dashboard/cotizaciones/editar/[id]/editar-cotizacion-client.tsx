"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/useModal';
import { Modal } from '@/components/Modal';
import { QuoteData, QuoteFormData, QuoteItem } from '@/types/quote.types';

export default function EditarCotizacionClient({ quote }: { quote: QuoteData }) {
  const router = useRouter();
  const { modal, showSuccess, showError, showConfirm, hideModal } = useModal();
  
  const [formData, setFormData] = useState<QuoteFormData>({
    service_type: quote.service_type,
    description: quote.description,
    valid_until: quote.valid_until,
    notes: quote.notes || '',
    status: quote.status
  });

  const [items, setItems] = useState<QuoteItem[]>(quote.quote_items);
  const [subtotal, setSubtotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calcular totales automáticamente
  useEffect(() => {
    const newSubtotal = items.reduce((sum, item) => sum + item.total, 0);
    setSubtotal(newSubtotal);
  }, [items]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addItem = () => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      item_name: '',
      description: '',
      quantity: 1,
      unit: 'PZA',
      unit_price: 0,
      percentage: 0,
      total: 0
    };
    setItems(prev => [...prev, newItem]);
    
    // Enfocar el campo de descripción del nuevo item después de que se renderice
    setTimeout(() => {
      const newItemElement = document.querySelector(`input[name="description-${newItem.id}"]`) as HTMLInputElement;
      if (newItemElement) {
        newItemElement.focus();
      }
    }, 100);
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unit_price' || field === 'percentage') {
          // Aplicar porcentaje al precio unitario
          const priceWithPercentage = updatedItem.unit_price * (1 + updatedItem.percentage / 100);
          updatedItem.total = updatedItem.quantity * priceWithPercentage;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      showConfirm(
        'Eliminar Item',
        '¿Estás seguro de que quieres eliminar este item de la cotización?',
        () => {
          setItems(prev => prev.filter(item => item.id !== id));
        },
        'Eliminar',
        'Cancelar'
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/quotes/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteId: quote.id,
          ...formData,
          items: items.map(item => ({
            id: item.id,
            item_name: item.description,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            unit_price: item.unit_price,
            total: item.total
          })),
          total_amount: subtotal
        }),
      });

      const result = await response.json();

      if (result.success) {
        showSuccess('Éxito', 'Cotización actualizada exitosamente');
        setTimeout(() => {
          router.push('/dashboard/cotizaciones');
        }, 1500);
      } else {
        showError('Error', result.error || 'Error al actualizar la cotización');
      }
    } catch (error) {
      showError('Error', 'Error al actualizar la cotización');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePDF = async () => {
    try {
      const response = await fetch('/api/quotes/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteId: quote.id
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cotizacion-${quote.quote_number}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        showError('Error', 'Error al generar el PDF');
      }
    } catch (error) {
      showError('Error', 'Error al generar el PDF');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información General */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Información General</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Servicio
              </label>
              <select
                name="service_type"
                value={formData.service_type}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="CCTV">CCTV</option>
                <option value="Cableado Estructurado">Cableado Estructurado</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Venta e Instalación">Venta e Instalación</option>
                <option value="Desarrollo de Software">Desarrollo de Software</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Válida hasta
              </label>
              <input
                type="date"
                name="valid_until"
                value={formData.valid_until}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="borrador">Borrador</option>
                <option value="enviada">Enviada</option>
                <option value="autorizada">Autorizada</option>
                <option value="rechazada">Rechazada</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleFormChange}
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Notas adicionales..."
              />
            </div>
          </div>
        </div>

        {/* Items de Cotización */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">Items de la Cotización</h2>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid gap-4 sm:grid-cols-6">
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      #
                    </label>
                    <div className="flex items-center justify-center h-10 bg-gray-50 rounded-lg text-sm font-medium text-gray-500">
                      {index + 1}
                    </div>
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unidad
                    </label>
                    <select
                      value={item.unit}
                      onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="PZA">PZA</option>
                      <option value="SERV">SERV</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <input
                      type="text"
                      name={`description-${item.id}`}
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Descripción del item"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      P. Unitario
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) => updateItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                      <span>Precio con %: </span>
                      <span className="font-semibold text-gray-900">
                        ${(item.unit_price * (1 + item.percentage / 100)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-blue-600">
                      Total: ${item.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Botón para agregar artículo */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              + Artículo
            </button>
          </div>

          {/* Totales */}
          <div className="mt-6 pt-6 border-t border-gray-200 bg-blue-50 rounded-lg p-4">
            <div className="flex justify-end">
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  ${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm font-medium text-blue-500">Subtotal</div>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={generatePDF}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span className="hidden sm:inline">Generar PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </form>

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
