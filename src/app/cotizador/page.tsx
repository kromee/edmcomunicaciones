"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Reveal } from '@/components/Reveal';

type QuoteItem = {
  id: string;
  description: string;
  quantity: number;
  unit: 'PZA' | 'SERV';
  unit_price: number;
  total: number;
};

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string;
  tax_id: string | null;
  notes: string | null;
  status: 'active' | 'inactive' | 'prospect';
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

type QuoteFormData = {
  client_name: string;
  client_email: string;
  client_phone: string;
  client_company: string;
  service_type: string;
  description: string;
  valid_until: string;
  notes: string;
};

export default function CotizadorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Calcular fecha de 30 días desde hoy
  const getDefaultValidUntil = () => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 30);
    return futureDate.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState<QuoteFormData>({
    client_name: '',
    client_email: '',
    client_phone: '',
    client_company: '',
    service_type: '',
    description: 'A continuación presento la propuesta económica solicitada por concepto de ',
    valid_until: getDefaultValidUntil(),
    notes: ''
  });

  const [items, setItems] = useState<QuoteItem[]>([
    {
      id: '1',
      description: '',
      quantity: 1,
      unit: 'PZA',
      unit_price: 0,
      total: 0
    }
  ]);

  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Calcular totales automáticamente
  useEffect(() => {
    const newSubtotal = items.reduce((sum, item) => sum + item.total, 0);
    const newTax = 0; // Sin IVA
    const newTotal = newSubtotal; // Total = Subtotal (sin IVA)

    setSubtotal(newSubtotal);
    setTax(newTax);
    setTotal(newTotal);
  }, [items]);

  // Cargar cliente desde URL si viene de "Cotizar"
  useEffect(() => {
    const clientId = searchParams.get('clientId');
    if (clientId) {
      // Cargar datos del cliente
      const loadClient = async () => {
        try {
          const response = await fetch(`/api/clients/get?id=${clientId}`);
          const data = await response.json();
          if (data.success && data.client) {
            selectClient(data.client);
          }
        } catch (error) {
          console.error('Error loading client:', error);
        }
      };
      loadClient();
    }
  }, [searchParams]);

  // Buscar clientes
  const searchClients = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/clients/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data.success) {
        setSearchResults(data.clients);
      }
    } catch (error) {
      console.error('Error searching clients:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectClient = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      ...formData,
      client_name: client.name,
      client_email: client.email,
      client_phone: client.phone || '',
      client_company: client.company || ''
    });
    setSearchQuery('');
    setSearchResults([]);
    setShowNewClientForm(false);
  };

  const clearClient = () => {
    setSelectedClient(null);
    setFormData({
      ...formData,
      client_name: '',
      client_email: '',
      client_phone: '',
      client_company: ''
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (id: string, field: keyof QuoteItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        // Recalcular total del item
        if (field === 'quantity' || field === 'unit_price') {
          updatedItem.total = updatedItem.quantity * updatedItem.unit_price;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const addItem = () => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unit: 'PZA',
      unit_price: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/quotes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items,
          subtotal,
          tax,
          total_amount: total
        }),
      });

      const data = await response.json();

      console.log('Response:', response.status, data);

      if (data.success) {
        setSubmitStatus('success');
        // Redirigir a la página de cotizaciones después de 2 segundos
        setTimeout(() => {
          router.push('/dashboard/cotizaciones');
        }, 2000);
      } else {
        console.error('Error creating quote:', data.error);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error creating quote:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-200">
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
                className="inline-flex items-center gap-2 px-5 py-3 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-green-800 font-medium">¡Cotización creada exitosamente! Redirigiendo...</p>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-red-800 font-medium">Error al crear la cotización. Intenta nuevamente.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Selector de Cliente */}
          <Reveal>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-3">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Crear cotización</h2>
              
              {!selectedClient ? (
                <div className="space-y-4">
                  {/* Buscador de clientes */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Buscar cliente existente
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          searchClients(e.target.value);
                        }}
                        className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Buscar por nombre, email o empresa..."
                      />
                      <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                    
                    {/* Resultados de búsqueda */}
                    {searchResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {searchResults.map((client) => (
                          <button
                            key={client.id}
                            type="button"
                            onClick={() => selectClient(client)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                          >
                            <p className="font-medium text-gray-900">{client.name}</p>
                            <p className="text-sm text-gray-600">{client.email}</p>
                            {client.company && (
                              <p className="text-xs text-gray-500">{client.company}</p>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {isSearching && (
                      <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center">
                        <p className="text-sm text-gray-600">Buscando...</p>
                      </div>
                    )}
                  </div>

                  {/* Botón para nuevo cliente */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <button
                      type="button"
                      onClick={() => setShowNewClientForm(!showNewClientForm)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      {showNewClientForm ? 'Cancelar' : 'Nuevo Cliente'}
                    </button>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>

                  {/* Formulario para nuevo cliente */}
                  {showNewClientForm && (
                    <div className="grid gap-4 sm:grid-cols-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre completo *
                        </label>
                        <input
                          type="text"
                          name="client_name"
                          value={formData.client_name}
                          onChange={handleFormChange}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="Nombre del cliente"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="client_email"
                          value={formData.client_email}
                          onChange={handleFormChange}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="cliente@empresa.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          name="client_phone"
                          value={formData.client_phone}
                          onChange={handleFormChange}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="+52 55 1234 5678"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Empresa
                        </label>
                        <input
                          type="text"
                          name="client_company"
                          value={formData.client_company}
                          onChange={handleFormChange}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="Nombre de la empresa"
                        />
                      </div>
                      <div className="sm:col-span-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            if (formData.client_name && formData.client_email) {
                              setSelectedClient({
                                id: 'new',
                                name: formData.client_name,
                                email: formData.client_email,
                                phone: formData.client_phone || null,
                                company: formData.client_company || null,
                                address: null,
                                city: null,
                                state: null,
                                postal_code: null,
                                country: 'México',
                                tax_id: null,
                                notes: null,
                                status: 'active' as 'active',
                                created_by: null,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString()
                              });
                              setShowNewClientForm(false);
                            }
                          }}
                          disabled={!formData.client_name || !formData.client_email}
                          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Usar este cliente
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {selectedClient.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{selectedClient.name}</p>
                      <p className="text-sm text-gray-600">{selectedClient.email}</p>
                      {selectedClient.company && (
                        <p className="text-xs text-gray-500">{selectedClient.company}</p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearClient}
                    className="inline-flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Cambiar
                  </button>
                </div>
              )}

              {/* Campos adicionales de cotización */}
              {selectedClient && (
                <div className="grid gap-4 sm:grid-cols-2 mt-6">
                  <div>
                    <label htmlFor="service_type" className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de servicio *
                    </label>
                    <select
                      id="service_type"
                      name="service_type"
                      value={formData.service_type}
                      onChange={handleFormChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar servicio</option>
                      <option value="cctv">CCTV y Videovigilancia</option>
                      <option value="cableado">Cableado Estructurado</option>
                      <option value="mantenimiento">Mantenimiento de Equipos</option>
                      <option value="instalacion">Venta e Instalación</option>
                      <option value="software">Desarrollo de Software</option>
                      <option value="consultoria">Consultoría Técnica</option>
                      <option value="mixto">Proyecto Integral</option>
                      <option value="otro">Otro (especificar en descripción)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="valid_until" className="block text-sm font-medium text-gray-700 mb-2">
                      Válida hasta
                    </label>
                    <input
                      type="date"
                      id="valid_until"
                      name="valid_until"
                      value={formData.valid_until}
                      onChange={handleFormChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción general
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows={2}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Descripción del proyecto o servicio a cotizar..."
                    />
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          {/* Items de Cotización */}
          {selectedClient && (
          <Reveal delay={0.1}>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Items de la Cotización</h2>
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Agregar Item
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 relative">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                        aria-label="Eliminar item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    )}
                    <p className="text-sm font-semibold text-gray-700 mb-3">Item #{index + 1}</p>
                    <div className="grid gap-4 sm:grid-cols-12">
                      <div className="sm:col-span-6">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Descripción *
                        </label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          required
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ej: Cámara IP 4K, Cable UTP Cat6, etc."
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Cant. *
                        </label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          required
                          min="1"
                          className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Unidad *
                        </label>
                        <select
                          value={item.unit}
                          onChange={(e) => handleItemChange(item.id, 'unit', e.target.value as 'PZA' | 'SERV')}
                          required
                          className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="PZA">PZA</option>
                          <option value="SERV">SERV</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Precio Unit. *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-500 text-sm">$</span>
                          <input
                            type="number"
                            value={item.unit_price}
                            onChange={(e) => handleItemChange(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                            required
                            min="0"
                            step="0.01"
                            className="w-full rounded-lg border border-gray-300 pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <div className="bg-gray-50 px-4 py-2 rounded-lg">
                        <span className="text-xs text-gray-600">Total: </span>
                        <span className="text-base font-bold text-gray-900">
                          ${item.total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          )}

          {/* Resumen de Totales */}
          {selectedClient && (
          <Reveal delay={0.2}>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Resumen</h2>
              <div className="space-y-3 max-w-md ml-auto">
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
          )}

          {/* Notas */}
          {selectedClient && (
          <Reveal delay={0.3}>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Notas Internas</h2>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleFormChange}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Notas adicionales, comentarios internos, descuentos especiales, etc."
              />
            </div>
          </Reveal>
          )}

          {/* Botones de Acción */}
          {selectedClient && (
          <Reveal delay={0.4}>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-lg hover:from-sky-600 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creando cotización...
                    </div>
                  ) : (
                    'Crear Cotización y Generar PDF'
                  )}
                </button>
              </div>
            </div>
          </Reveal>
          )}
        </form>
      </main>
    </div>
  );
}
