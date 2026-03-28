"use client";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/DashboardSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { SessionUser } from '@/types/session';

type QuoteItem = {
  id: string;
  description: string;
  quantity: number;
  unit: 'PZA' | 'SERV';
  unit_price: number;
  percentage: number;
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
  custom_commercial_terms: string;
  show_valid_until: boolean;
};

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

function CotizadorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
    notes: '',
    custom_commercial_terms: '',
    show_valid_until: true
  });

  const [useCustomTerms, setUseCustomTerms] = useState(false);

  const [items, setItems] = useState<QuoteItem[]>([
    {
      id: '1',
      description: '',
      quantity: 1,
      unit: 'PZA',
      unit_price: 0,
      percentage: 0,
      total: 0
    }
  ]);

  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [user] = useState<SessionUser>({
    id: '1',
    email: 'admin@edm.com',
    name: 'Administrador',
    role: 'admin'
  });

  useEffect(() => {
    const newSubtotal = items.reduce((sum, item) => sum + item.total, 0);
    setSubtotal(newSubtotal);
    setTax(0);
    setTotal(newSubtotal);
  }, [items]);

  useEffect(() => {
    const clientId = searchParams.get('clientId');
    if (clientId) {
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
    setCurrentStep(1);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (id: string, field: keyof QuoteItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unit_price' || field === 'percentage') {
          const priceWithPercentage = updatedItem.unit_price * (1 + updatedItem.percentage / 100);
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
      description: '',
      quantity: 1,
      unit: 'PZA',
      unit_price: 0,
      percentage: 0,
      total: 0
    };
    setItems([...items, newItem]);
    setTimeout(() => {
      const newItemElement = document.querySelector(`input[name="description-${newItem.id}"]`) as HTMLInputElement;
      if (newItemElement) {
        newItemElement.focus();
      }
    }, 100);
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

      if (data.success) {
        setSubmitStatus('success');
        setTimeout(() => {
          router.push('/dashboard/cotizaciones');
        }, 2000);
      } else {
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

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedClient !== null;
      case 2:
        return formData.service_type !== '';
      case 3:
        return items.some(item => item.description && item.total > 0);
      default:
        return true;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const steps = [
    { number: 1, title: 'Cliente', description: 'Seleccionar o crear' },
    { number: 2, title: 'Servicio', description: 'Detalles del proyecto' },
    { number: 3, title: 'Items', description: 'Productos y precios' },
    { number: 4, title: 'Resumen', description: 'Confirmar y enviar' },
  ];

  return (
    <div className="min-h-screen bg-surface-secondary">
      <Sidebar />
      <DashboardHeader user={user} onLogout={handleLogout} sidebarCollapsed={sidebarCollapsed} />

      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <a href="/dashboard" className="p-2 rounded-xl hover:bg-white/50 transition-colors">
                <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </a>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Nueva Cotización</h1>
                <p className="text-muted">Crea una cotización profesional para tu cliente</p>
              </div>
            </div>
          </div>

          {/* Success/Error Alerts */}
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-2xl flex items-center gap-3 animate-slide-up">
              <div className="w-10 h-10 rounded-xl bg-success flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-success-dark">¡Cotización creada exitosamente!</p>
                <p className="text-sm text-success/80">Redirigiendo a cotizaciones...</p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-2xl flex items-center gap-3 animate-slide-up">
              <div className="w-10 h-10 rounded-xl bg-danger flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-danger-dark">Error al crear la cotización</p>
                <p className="text-sm text-danger/80">Intenta nuevamente o contacta a soporte</p>
              </div>
            </div>
          )}

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex items-center">
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-sm
                      transition-all duration-300
                      ${currentStep > step.number 
                        ? 'bg-success text-white' 
                        : currentStep === step.number 
                          ? 'bg-brand text-white shadow-soft' 
                          : 'bg-white text-muted border border-gray-200'
                      }
                    `}>
                      {currentStep > step.number ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className="hidden sm:block ml-3">
                      <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-gray-900' : 'text-muted'}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-light">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`
                      hidden sm:block w-12 lg:w-24 h-0.5 mx-4 transition-colors duration-300
                      ${currentStep > step.number ? 'bg-success' : 'bg-gray-200'}
                    `} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Cliente */}
            <div className={`bg-white rounded-2xl shadow-card overflow-hidden transition-all duration-300 mb-6 ${currentStep === 1 ? 'block' : 'hidden sm:block'}`}>
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-brand to-brand-light">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Información del Cliente</h2>
                    <p className="text-sm text-white/70">Selecciona un cliente existente o crea uno nuevo</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {!selectedClient ? (
                  <div className="space-y-6">
                    {/* Search */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
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
                          className="input pl-11 pr-4 py-3"
                          placeholder="Buscar por nombre, email o empresa..."
                        />
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        {isSearching && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>

                      {/* Results */}
                      {searchResults.length > 0 && (
                        <div className="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-elevated border border-gray-100 max-h-72 overflow-y-auto">
                          {searchResults.map((client) => (
                            <button
                              key={client.id}
                              type="button"
                              onClick={() => selectClient(client)}
                              className="w-full text-left px-4 py-3 hover:bg-surface-secondary transition-colors border-b border-gray-50 last:border-0"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-semibold">
                                  {client.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 truncate">{client.name}</p>
                                  <p className="text-sm text-muted truncate">{client.email}</p>
                                </div>
                                {client.company && (
                                  <span className="hidden sm:block text-xs text-muted-light bg-gray-100 px-2 py-1 rounded-lg">
                                    {client.company}
                                  </span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1 border-t border-gray-200" />
                      <span className="text-sm text-muted">ó</span>
                      <div className="flex-1 border-t border-gray-200" />
                    </div>

                    {/* New Client Button */}
                    <button
                      type="button"
                      onClick={() => setShowNewClientForm(!showNewClientForm)}
                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-accent hover:bg-accent/5 transition-all duration-200 flex items-center justify-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Crear nuevo cliente</p>
                        <p className="text-sm text-muted">Ingresa los datos del nuevo cliente</p>
                      </div>
                    </button>

                    {/* New Client Form */}
                    {showNewClientForm && (
                      <div className="p-5 bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl border border-accent/20 space-y-4 animate-slide-up">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre completo *</label>
                            <input
                              type="text"
                              name="client_name"
                              value={formData.client_name}
                              onChange={handleFormChange}
                              className="input"
                              placeholder="Nombre del cliente"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                            <input
                              type="email"
                              name="client_email"
                              value={formData.client_email}
                              onChange={handleFormChange}
                              className="input"
                              placeholder="cliente@empresa.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono</label>
                            <input
                              type="tel"
                              name="client_phone"
                              value={formData.client_phone}
                              onChange={handleFormChange}
                              className="input"
                              placeholder="+52 55 1234 5678"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Empresa</label>
                            <input
                              type="text"
                              name="client_company"
                              value={formData.client_company}
                              onChange={handleFormChange}
                              className="input"
                              placeholder="Nombre de la empresa"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
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
                            className="btn-accent disabled:opacity-50"
                          >
                            Continuar con este cliente
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    {/* Selected Client Card */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gradient-to-r from-success/10 to-success/5 rounded-xl border border-success/20">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white font-bold text-xl shadow-soft">
                          {selectedClient.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">{selectedClient.name}</p>
                          <p className="text-muted">{selectedClient.email}</p>
                          {selectedClient.company && (
                            <p className="text-sm text-muted-light flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              {selectedClient.company}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={clearClient}
                        className="text-sm font-medium text-danger hover:bg-danger/10 px-4 py-2 rounded-xl transition-colors"
                      >
                        Cambiar cliente
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end mt-6">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        disabled={!canProceed()}
                        className="btn-accent disabled:opacity-50"
                      >
                        Continuar
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Servicio */}
            <div className={`bg-white rounded-2xl shadow-card overflow-hidden transition-all duration-300 mb-6 ${currentStep === 2 ? 'block' : 'hidden sm:block'}`}>
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-brand to-brand-light">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Detalles del Servicio</h2>
                    <p className="text-sm text-white/70">Describe el proyecto o servicio a cotizar</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Service Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Servicio *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {serviceTypes.map((service) => (
                      <button
                        key={service.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, service_type: service.value })}
                        className={`
                          p-4 rounded-xl border-2 text-left transition-all duration-200
                          ${formData.service_type === service.value
                            ? 'border-accent bg-accent/5 shadow-soft'
                            : 'border-gray-200 hover:border-accent/50 hover:bg-surface-secondary'
                          }
                        `}
                      >
                        <span className="text-2xl mb-2 block">{service.icon}</span>
                        <p className={`text-sm font-medium ${formData.service_type === service.value ? 'text-accent' : 'text-gray-700'}`}>
                          {service.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date and Description */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Válida hasta</label>
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
                        checked={formData.show_valid_until}
                        onChange={(e) => setFormData({ ...formData, show_valid_until: e.target.checked })}
                        className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                      />
                      <span className="text-sm text-gray-600">Mostrar en el PDF</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción general</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows={3}
                      className="input resize-none"
                      placeholder="Describe el proyecto o servicio..."
                    />
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="btn-secondary"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    disabled={!canProceed()}
                    className="btn-accent disabled:opacity-50"
                  >
                    Continuar
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3: Items */}
            <div className={`bg-white rounded-2xl shadow-card overflow-hidden transition-all duration-300 mb-6 ${currentStep === 3 ? 'block' : 'hidden sm:block'}`}>
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-brand to-brand-light">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">Items de la Cotización</h2>
                      <p className="text-sm text-white/70">Agrega los productos o servicios a cotizar</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg">
                    <span className="text-sm text-white/80">{items.length} items</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Items List */}
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="group relative bg-surface-secondary rounded-xl p-4 sm:p-5 border border-gray-100 hover:border-accent/30 transition-all duration-200"
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
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">Descripción *</label>
                          <input
                            type="text"
                            name={`description-${item.id}`}
                            value={item.description}
                            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                            className="input bg-white"
                            placeholder="Ej: Cámara IP 4K, Cable UTP Cat6, Instalación..."
                          />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Cantidad</label>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                              min="1"
                              className="input bg-white text-center"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Unidad</label>
                            <select
                              value={item.unit}
                              onChange={(e) => handleItemChange(item.id, 'unit', e.target.value as 'PZA' | 'SERV')}
                              className="input bg-white"
                            >
                              <option value="PZA">Pieza</option>
                              <option value="SERV">Servicio</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">% Ajuste</label>
                            <div className="relative">
                              <input
                                type="number"
                                value={item.percentage}
                                onChange={(e) => handleItemChange(item.id, 'percentage', parseFloat(e.target.value) || 0)}
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
                                onChange={(e) => handleItemChange(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
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
                              {formatCurrency(item.unit_price * (1 + item.percentage / 100))}
                            </span>
                            {item.percentage !== 0 && (
                              <span className="ml-2 text-xs text-accent">
                                ({item.percentage > 0 ? '+' : ''}{item.percentage}% del base)
                              </span>
                            )}
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

                {/* Add Item Button */}
                <button
                  type="button"
                  onClick={addItem}
                  className="w-full mt-4 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-accent hover:bg-accent/5 transition-all duration-200 flex items-center justify-center gap-2 text-muted hover:text-accent"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Agregar otro item
                </button>

                {/* Grand Total */}
                <div className="mt-6 p-4 bg-gradient-to-r from-brand/5 to-accent/5 rounded-xl border border-brand/10">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Total de la Cotización</span>
                    <span className="text-2xl font-bold text-brand">{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Notas Internas (opcional)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    rows={2}
                    className="input resize-none"
                    placeholder="Notas adicionales, comentarios internos, descuentos..."
                  />
                </div>

                {/* Commercial Terms */}
                <div className="mt-4 p-4 bg-surface-secondary rounded-xl">
                  <div className="flex items-center justify-between mb-3">
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
                      <span className="text-sm font-medium text-gray-700">Usar condiciones comerciales personalizadas</span>
                    </label>
                  </div>
                  {useCustomTerms ? (
                    <textarea
                      name="custom_commercial_terms"
                      value={formData.custom_commercial_terms}
                      onChange={handleFormChange}
                      rows={4}
                      className="input resize-none font-mono text-sm"
                      placeholder="• Condición 1&#10;• Condición 2&#10;• Condición 3"
                    />
                  ) : (
                    <div className="text-sm text-muted space-y-1">
                      <p className="font-medium text-gray-600">Condiciones por defecto:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-muted-light">
                        <li>Validez de 30 días</li>
                        <li>Pesos mexicanos (MXN), sin IVA</li>
                        <li>50% anticipo, 50% al finalizar</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="btn-secondary"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    disabled={!canProceed()}
                    className="btn-accent disabled:opacity-50"
                  >
                    Revisar Cotización
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Step 4: Resumen */}
            <div className={`bg-white rounded-2xl shadow-card overflow-hidden transition-all duration-300 mb-6 ${currentStep === 4 ? 'block' : 'hidden sm:block'}`}>
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-brand to-brand-light">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Resumen de la Cotización</h2>
                    <p className="text-sm text-white/70">Revisa los datos antes de crear la cotización</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Client Card */}
                  <div className="p-4 bg-surface-secondary rounded-xl">
                    <p className="text-xs font-medium text-muted uppercase tracking-wide mb-2">Cliente</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white font-bold">
                        {selectedClient?.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{selectedClient?.name}</p>
                        <p className="text-sm text-muted">{selectedClient?.company || selectedClient?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Service Card */}
                  <div className="p-4 bg-surface-secondary rounded-xl">
                    <p className="text-xs font-medium text-muted uppercase tracking-wide mb-2">Servicio</p>
                    <p className="font-semibold text-gray-900">
                      {serviceTypes.find(s => s.value === formData.service_type)?.label || '-'}
                    </p>
                    <p className="text-sm text-muted mt-1">
                      {formData.show_valid_until ? `Válida hasta: ${new Date(formData.valid_until).toLocaleDateString('es-MX')}` : 'Sin fecha de validez'}
                    </p>
                  </div>

                  {/* Total Card */}
                  <div className="p-4 bg-gradient-to-br from-brand/10 to-accent/10 rounded-xl border border-brand/10">
                    <p className="text-xs font-medium text-muted uppercase tracking-wide mb-2">Total</p>
                    <p className="text-2xl font-bold text-brand">{formatCurrency(total)}</p>
                    <p className="text-sm text-muted">{items.filter(i => i.description).length} items</p>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Items Incluidos</h3>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-surface-secondary">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">#</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">Descripción</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-muted uppercase tracking-wide">Cant.</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-muted uppercase tracking-wide">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {items.filter(i => i.description).map((item, index) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3 text-sm text-muted">{index + 1}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.description}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 text-center">{item.quantity} {item.unit}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">{formatCurrency(item.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-surface-secondary">
                        <tr>
                          <td colSpan={3} className="px-4 py-3 text-right font-semibold text-gray-900">Total:</td>
                          <td className="px-4 py-3 text-lg font-bold text-brand text-right">{formatCurrency(total)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="btn-secondary"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Editar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !canProceed()}
                    className="btn-accent disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creando...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Crear Cotización
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function CotizadorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted">Cargando cotizador...</p>
        </div>
      </div>
    }>
      <CotizadorContent />
    </Suspense>
  );
}
