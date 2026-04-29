"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/useModal';
import { Modal } from '@/components/Modal';
import { QuoteData, QuoteFormData, QuoteItem } from '@/types/quote.types';
import { normalizeQuoteStatus } from '@/lib/quote-status';
import { Sidebar } from '@/components/DashboardSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { SessionUser } from '@/types/session';
import { generateQuotePDF } from '@/lib/pdf-generator';
import { QUOTE_ITEM_UNIT_OPTIONS, normalizeQuoteItemUnit } from '@/lib/quote-item-units';

const serviceTypes = [
  { value: 'cctv', label: 'CCTV y Videovigilancia', icon: '📹' },
  { value: 'cableado', label: 'Cableado Estructurado', icon: '🔌' },
  { value: 'mantenimiento', label: 'Mantenimiento de Equipos', icon: '🔧' },
  { value: 'instalacion', label: 'Venta e Instalación', icon: '⚡' },
  { value: 'software', label: 'Desarrollo de Software', icon: '💻' },
  { value: 'consultoria', label: 'Consultoría Técnica', icon: '📋' },
  { value: 'mixto', label: 'Proyecto Integral', icon: '🏗️' },
  { value: 'otro', label: 'Otro', icon: '📦' },
];

const statusOptions = [
  { value: 'pending', label: 'Pendiente', bg: 'bg-warning/10', text: 'text-warning-dark' },
  { value: 'sent', label: 'Enviada', bg: 'bg-accent/10', text: 'text-accent-dark' },
  { value: 'approved', label: 'Aprobada', bg: 'bg-success/10', text: 'text-success-dark' },
  { value: 'rejected', label: 'Rechazada', bg: 'bg-danger/10', text: 'text-danger-dark' },
  { value: 'paid', label: 'Pagada', bg: 'bg-green-100', text: 'text-green-700' },
];

export default function EditarCotizacionClient({ 
  quote, 
  user 
}: { 
  quote: QuoteData; 
  user: SessionUser;
}) {
  const router = useRouter();
  const { modal, showSuccess, showError, showConfirm, hideModal } = useModal();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const [formData, setFormData] = useState<QuoteFormData>({
    service_type: quote.service_type,
    description: quote.description || '',
    valid_until: quote.valid_until,
    notes: quote.notes || '',
    custom_commercial_terms: quote.custom_commercial_terms || '',
    show_valid_until: quote.show_valid_until ?? true,
    status: normalizeQuoteStatus(quote.status)
  });

  const [useCustomTerms, setUseCustomTerms] = useState(!!quote.custom_commercial_terms);

  const [items, setItems] = useState<QuoteItem[]>(
    quote.quote_items.map(item => ({
      ...item,
      item_name: item.description || '',
      unit: normalizeQuoteItemUnit(item.unit),
    }))
  );
  
  const [subtotal, setSubtotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const newSubtotal = items.reduce((sum, item) => sum + item.total, 0);
    setSubtotal(newSubtotal);
  }, [items]);

  useEffect(() => {
    setHasChanges(true);
  }, [formData, items]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const next = field === 'unit' ? normalizeQuoteItemUnit(value) : value;
        const updatedItem = { ...item, [field]: next };
        if (field === 'quantity' || field === 'unit_price' || field === 'percentage') {
          const priceWithPercentage = updatedItem.unit_price * (1 + (updatedItem.percentage || 0) / 100);
          updatedItem.total = updatedItem.quantity * priceWithPercentage;
        }
        return updatedItem;
      }
      return item;
    }));
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
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      showConfirm(
        'Eliminar Item',
        '¿Estás seguro de que quieres eliminar este item?',
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
          status: normalizeQuoteStatus(formData.status),
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
        showSuccess('¡Cambios guardados!', 'La cotización se actualizó correctamente');
        setHasChanges(false);
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

  const handleDownloadPDF = async () => {
    try {
      const quoteForPDF = {
        quote_number: quote.quote_number,
        client_name: quote.client_name,
        client_email: quote.client_email,
        client_phone: quote.client_phone || '',
        client_company: quote.client_company || '',
        service_type: formData.service_type,
        description: formData.description || '',
        valid_until: formData.valid_until,
        custom_commercial_terms: formData.custom_commercial_terms,
        show_valid_until: formData.show_valid_until,
        items: items.map(item => ({
          item_name: item.description || '',
          description: item.description || '',
          quantity: item.quantity,
          unit: normalizeQuoteItemUnit(item.unit),
          unit_price: item.unit_price,
          percentage: item.percentage || 0,
          total: item.total
        })),
        subtotal: subtotal,
        tax: 0,
        total_amount: subtotal,
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

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const handleCancel = () => {
    if (hasChanges) {
      showConfirm(
        'Descartar cambios',
        '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.',
        () => router.push('/dashboard/cotizaciones'),
        'Salir',
        'Permanecer'
      );
    } else {
      router.push('/dashboard/cotizaciones');
    }
  };

  return (
    <div className="min-h-screen bg-surface-secondary">
      <Sidebar />
      <DashboardHeader user={user} onLogout={handleLogout} sidebarCollapsed={sidebarCollapsed} />

      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="flex items-start gap-4 mb-8">
            <button 
              onClick={handleCancel}
              className="p-2.5 rounded-xl hover:bg-white/50 transition-colors mt-1"
            >
              <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Editar Cotización</h1>
                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                  {quote.quote_number}
                </span>
              </div>
              <p className="text-muted">
                {quote.client_name} • {quote.client_company || quote.client_email}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Info Card */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-brand/5 to-accent/5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white font-bold text-lg">
                      {quote.client_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{quote.client_name}</p>
                      <p className="text-sm text-muted">{quote.client_email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-light uppercase tracking-wide">Total</p>
                    <p className="text-2xl font-bold text-brand">{formatCurrency(subtotal)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service & Status */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuración</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Servicio</label>
                  <select
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleFormChange}
                    className="input"
                  >
                    {serviceTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="input"
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Valid Until */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Válida hasta</label>
                  <input
                    type="date"
                    name="valid_until"
                    value={formData.valid_until}
                    onChange={handleFormChange}
                    className="input"
                  />
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="show_valid_until"
                      checked={formData.show_valid_until ?? true}
                      onChange={(e) => setFormData({ ...formData, show_valid_until: e.target.checked })}
                      className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                    />
                    <span className="text-sm text-gray-600">Mostrar en el PDF</span>
                  </label>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows={3}
                    className="input resize-none"
                    placeholder="Descripción del proyecto..."
                  />
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notas Internas</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    rows={2}
                    className="input resize-none"
                    placeholder="Notas adicionales..."
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Items ({items.length})</h2>
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent text-sm font-medium rounded-xl hover:bg-accent/20 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Agregar
                </button>
              </div>

              <div className="p-6 space-y-4">
                {items.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="group relative bg-surface-secondary rounded-xl p-5 border border-gray-100 hover:border-accent/30 transition-all"
                  >
                    {/* Item Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-semibold text-sm">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium text-muted">Item</span>
                      </div>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-danger hover:bg-danger/10 rounded-lg transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Item Fields */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Descripción</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          className="input bg-white"
                          placeholder="Descripción del item"
                        />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">Cantidad</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                            min="1"
                            className="input bg-white text-center"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">Unidad</label>
                          <select
                            value={item.unit}
                            onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                            className="input bg-white"
                          >
                            {QUOTE_ITEM_UNIT_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">% Ajuste</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={item.percentage || 0}
                              onChange={(e) => updateItem(item.id, 'percentage', parseFloat(e.target.value) || 0)}
                              step="0.01"
                              className="input bg-white pr-8 text-center"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-light text-sm">%</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">Precio Unit.</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-light text-sm">$</span>
                            <input
                              type="number"
                              value={item.unit_price}
                              onChange={(e) => updateItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                              step="0.01"
                              className="input bg-white pl-7"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200/50">
                        <div className="text-sm">
                          <span className="text-muted">Precio final: </span>
                          <span className="font-medium text-gray-900">
                            {formatCurrency(item.unit_price * (1 + (item.percentage || 0) / 100))}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted">Subtotal</p>
                          <p className="text-lg font-bold text-brand">{formatCurrency(item.total)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Grand Total */}
              <div className="px-6 py-4 bg-gradient-to-r from-brand/5 to-accent/5 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Total de la Cotización</span>
                  <span className="text-2xl font-bold text-brand">{formatCurrency(subtotal)}</span>
                </div>
              </div>
            </div>

            {/* Commercial Terms */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Condiciones Comerciales</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useCustomTerms}
                    onChange={(e) => {
                      setUseCustomTerms(e.target.checked);
                      if (!e.target.checked) {
                        setFormData({ ...formData, custom_commercial_terms: '' });
                      }
                    }}
                    className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                  />
                  <span className="text-sm font-medium text-gray-700">Personalizadas</span>
                </label>
              </div>

              {useCustomTerms ? (
                <textarea
                  name="custom_commercial_terms"
                  value={formData.custom_commercial_terms || ''}
                  onChange={handleFormChange}
                  rows={4}
                  className="input resize-none font-mono text-sm"
                  placeholder="• Condición 1&#10;• Condición 2&#10;• Condición 3"
                />
              ) : (
                <div className="p-4 bg-surface-secondary rounded-xl text-sm text-muted space-y-1">
                  <p className="font-medium text-gray-600 mb-2">Condiciones por defecto:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Validez de 30 días</li>
                    <li>Pesos mexicanos (MXN), sin IVA</li>
                    <li>50% anticipo, 50% al finalizar</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary w-full sm:w-auto"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancelar
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className="flex-1 sm:flex-none btn-secondary"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    PDF
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none btn-accent disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
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
