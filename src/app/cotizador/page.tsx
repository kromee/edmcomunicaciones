"use client";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/DashboardSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { SessionUser } from '@/types/session';
import {
  QUOTE_ITEM_UNIT_OPTIONS,
  normalizeQuoteItemUnit,
  type QuoteItemUnit,
  getQuoteItemUnitLabel,
} from '@/lib/quote-item-units';
import {
  getTodayDateString,
  getDefaultValidUntil,
  dateInputToISO,
  isoToDateInput,
} from '@/lib/quote-dates';
import { normalizeQuoteStatus } from '@/lib/quote-status';
import {
  DEFAULT_COMMERCIAL_TERMS,
  commercialTermsFromString,
  commercialTermsToString,
} from '@/lib/commercial-terms';
import { CommercialTermsEditor } from '@/components/CommercialTermsEditor';
import { PdfPreviewModal } from '@/components/PdfPreviewModal';
import { reorderList } from '@/lib/quote-item-order';
import type { QuotePDFData } from '@/lib/pdf-generator';
import {
  contactLeadDescription,
  inferServiceTypeFromContact,
} from '@/lib/contact-to-quote';
import { CatalogPickerModal, type CatalogItemRecord } from '@/components/CatalogPickerModal';
import { NumericInput } from '@/components/NumericInput';
import { computeQuoteLineTotal } from '@/lib/catalog-item-totals';

type QuoteItem = {
  id: string;
  description: string;
  quantity: number;
  unit: QuoteItemUnit;
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
  quote_date: string;
  notes: string;
  custom_commercial_terms: string;
  show_valid_until: boolean;
};

type QuoteTemplate = {
  id: string;
  quote_number: string;
  client_id?: string | null;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  client_company: string | null;
  status?: string;
  created_at?: string;
  service_type: string;
  description: string | null;
  valid_until: string | null;
  notes: string | null;
  custom_commercial_terms: string | null;
  show_valid_until: boolean | null;
  quote_items: Array<{
    id: string;
    description: string | null;
    quantity: number;
    unit: string;
    unit_price: number;
    percentage: number;
    total: number;
  }>;
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

const quoteStatusOptions = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'sent', label: 'Enviada' },
  { value: 'approved', label: 'Aprobada' },
  { value: 'rejected', label: 'Rechazada' },
  { value: 'paid', label: 'Pagada' },
];

function mapApiItemsToFormItems(
  quoteItems: QuoteTemplate['quote_items'],
  preserveIds: boolean
): QuoteItem[] {
  return (quoteItems || []).map((item, index) => {
    const quantity = Number(item.quantity) || 1;
    const unitPrice = Number(item.unit_price) || 0;
    const percentage = Number(item.percentage) || 0;
    const priceWithPercentage = unitPrice * (1 + percentage / 100);
    return {
      id: preserveIds ? item.id : `${Date.now()}-${index}`,
      description: item.description || '',
      quantity,
      unit: normalizeQuoteItemUnit(item.unit),
      unit_price: unitPrice,
      percentage,
      total: Number(item.total) || quantity * priceWithPercentage,
    };
  });
}

function CotizadorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [sourceContactId, setSourceContactId] = useState<string | null>(null);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [createEmailPromptOpen, setCreateEmailPromptOpen] = useState(false);

  const [formData, setFormData] = useState<QuoteFormData>({
    client_name: '',
    client_email: '',
    client_phone: '',
    client_company: '',
    service_type: '',
    description: 'A continuación presento la propuesta económica solicitada por concepto de ',
    quote_date: getTodayDateString(),
    valid_until: getDefaultValidUntil(),
    notes: '',
    custom_commercial_terms: '',
    show_valid_until: true
  });

  const [commercialTerms, setCommercialTerms] = useState<string[]>([
    ...DEFAULT_COMMERCIAL_TERMS,
  ]);

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
  const [duplicateSource, setDuplicateSource] = useState<string | null>(null);
  const [editQuoteId, setEditQuoteId] = useState<string | null>(null);
  const [editQuoteNumber, setEditQuoteNumber] = useState<string | null>(null);
  const [quoteStatus, setQuoteStatus] = useState('pending');
  const [linkedClientId, setLinkedClientId] = useState<string | null>(null);
  const [editLoadError, setEditLoadError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);

  const isEditMode = Boolean(editQuoteId);

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

  useEffect(() => {
    const contactId = searchParams.get('contactId');
    if (!contactId) return;

    setSourceContactId(contactId);

    const loadContact = async () => {
      try {
        const response = await fetch(`/api/contacts/get?id=${contactId}`);
        const data = await response.json();
        if (!data.success || !data.contact) return;

        const contact = data.contact;
        const serviceType = inferServiceTypeFromContact(contact.service);

        setFormData((prev) => ({
          ...prev,
          client_name: prev.client_name || contact.name || '',
          client_email: prev.client_email || contact.email || '',
          client_phone: prev.client_phone || contact.phone || '',
          client_company: prev.client_company || contact.company || '',
          service_type: prev.service_type || serviceType,
          description: prev.description?.trim()
            ? prev.description
            : contactLeadDescription(contact.message, contact.service),
          notes: prev.notes || (contact.service ? `Lead: ${contact.service}` : prev.notes),
        }));
      } catch (error) {
        console.error('Error loading contact for cotizador:', error);
      }
    };

    loadContact();
  }, [searchParams]);

  useEffect(() => {
    const quoteId = searchParams.get('quoteId');
    if (!quoteId) return;

    const loadQuoteToEdit = async () => {
      setEditLoadError(null);
      try {
        const response = await fetch(`/api/quotes/get?id=${quoteId}`);
        const data = await response.json();
        if (!data.success || !data.quote) {
          setEditLoadError(data.error || 'No se pudo cargar la cotización');
          return;
        }

        const quote: QuoteTemplate = data.quote;
        setEditQuoteId(quote.id);
        setEditQuoteNumber(quote.quote_number);
        setQuoteStatus(normalizeQuoteStatus(quote.status || 'pending'));
        setLinkedClientId(quote.client_id ?? null);
        setDuplicateSource(null);

        setFormData({
          client_name: quote.client_name || '',
          client_email: quote.client_email || '',
          client_phone: quote.client_phone || '',
          client_company: quote.client_company || '',
          service_type: quote.service_type || '',
          description: quote.description || '',
          quote_date: quote.created_at
            ? isoToDateInput(quote.created_at)
            : getTodayDateString(),
          valid_until: quote.valid_until || getDefaultValidUntil(),
          notes: quote.notes || '',
          custom_commercial_terms: quote.custom_commercial_terms || '',
          show_valid_until: quote.show_valid_until ?? true,
        });

        setCommercialTerms(commercialTermsFromString(quote.custom_commercial_terms));

        const formItems = mapApiItemsToFormItems(quote.quote_items, true);
        if (formItems.length > 0) {
          setItems(formItems);
        }

        setSelectedClient({
          id: quote.client_id || `quote-${quote.id}`,
          name: quote.client_name || '',
          email: quote.client_email || '',
          phone: quote.client_phone || null,
          company: quote.client_company || null,
          address: null,
          city: null,
          state: null,
          postal_code: null,
          country: 'México',
          tax_id: null,
          notes: null,
          status: 'active',
          created_by: null,
          created_at: quote.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        setCurrentStep(1);
      } catch (error) {
        console.error('Error loading quote for edit:', error);
        setEditLoadError('Error al cargar la cotización');
      }
    };

    loadQuoteToEdit();
  }, [searchParams]);

  useEffect(() => {
    const duplicateQuoteId = searchParams.get('duplicateQuoteId');
    if (!duplicateQuoteId || searchParams.get('quoteId')) return;

    const loadQuoteToDuplicate = async () => {
      try {
        const response = await fetch(`/api/quotes/get?id=${duplicateQuoteId}`);
        const data = await response.json();
        if (!data.success || !data.quote) return;

        const quote: QuoteTemplate = data.quote;
        setDuplicateSource(quote.quote_number);

        setFormData(prev => ({
          ...prev,
          client_name: quote.client_name || '',
          client_email: quote.client_email || '',
          client_phone: quote.client_phone || '',
          client_company: quote.client_company || '',
          service_type: quote.service_type || '',
          description: quote.description || prev.description,
          quote_date: getTodayDateString(),
          valid_until: getDefaultValidUntil(),
          notes: quote.notes || '',
          custom_commercial_terms: quote.custom_commercial_terms || '',
          show_valid_until: quote.show_valid_until ?? true,
        }));

        setCommercialTerms(
          commercialTermsFromString(quote.custom_commercial_terms)
        );

        const templateItems = mapApiItemsToFormItems(quote.quote_items, false);
        if (templateItems.length > 0) {
          setItems(templateItems);
        }
        setEditQuoteId(null);
        setEditQuoteNumber(null);

        setSelectedClient({
          id: 'duplicated',
          name: quote.client_name || '',
          email: quote.client_email || '',
          phone: quote.client_phone || null,
          company: quote.client_company || null,
          address: null,
          city: null,
          state: null,
          postal_code: null,
          country: 'México',
          tax_id: null,
          notes: null,
          status: 'active',
          created_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error duplicating quote:', error);
      }
    };

    loadQuoteToDuplicate();
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
    setLinkedClientId(client.id);
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
    setLinkedClientId(null);
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
        const next =
          field === 'unit' ? normalizeQuoteItemUnit(value) : value;
        const updatedItem = { ...item, [field]: next } as QuoteItem;
        if (field === 'quantity' || field === 'unit_price' || field === 'percentage') {
          const priceWithPercentage = updatedItem.unit_price * (1 + updatedItem.percentage / 100);
          updatedItem.total = updatedItem.quantity * priceWithPercentage;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const addItemFromCatalog = (record: CatalogItemRecord) => {
    const quantity = record.default_quantity || 1;
    const unit_price = Number(record.default_unit_price) || 0;
    const percentage = Number(record.default_percentage) || 0;
    const unit = normalizeQuoteItemUnit(record.unit);
    const description = record.description?.trim() || record.title;
    const newItem: QuoteItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      description,
      quantity,
      unit,
      unit_price,
      percentage,
      total: computeQuoteLineTotal(quantity, unit_price, percentage),
    };
    setItems([...items, newItem]);
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

  const moveItem = (from: number, to: number) => {
    setItems((prev) => reorderList(prev, from, to));
  };

  const handleItemDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleItemDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    moveItem(dragIndex, index);
    setDragIndex(index);
  };

  const handleItemDragEnd = () => {
    setDragIndex(null);
  };

  const buildPreviewQuoteData = (): QuotePDFData => ({
    quote_number: editQuoteNumber || 'VISTA-PREVIA',
    client_name: formData.client_name || selectedClient?.name || 'Cliente',
    client_email: formData.client_email || selectedClient?.email || '',
    client_phone: formData.client_phone || selectedClient?.phone || '',
    client_company: formData.client_company || selectedClient?.company || '',
    service_type: formData.service_type,
    description: formData.description || '',
    valid_until: formData.valid_until,
    custom_commercial_terms: commercialTermsToString(commercialTerms) || null,
    show_valid_until: formData.show_valid_until,
    items: items.map((item) => ({
      item_name: item.description || '',
      description: item.description || '',
      quantity: item.quantity,
      unit: item.unit,
      unit_price: item.unit_price,
      percentage: item.percentage || 0,
      total: item.total,
    })),
    subtotal,
    tax,
    total_amount: total,
    created_at: dateInputToISO(formData.quote_date || getTodayDateString()),
  });

  const persistQuote = async (sendEmailOnCreate: boolean) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setCreateEmailPromptOpen(false);

    try {
      const clientIdForSave =
        linkedClientId ||
        (selectedClient?.id && !String(selectedClient.id).startsWith('quote-') &&
        selectedClient.id !== 'duplicated'
          ? selectedClient.id
          : null);

      const payload = {
        ...formData,
        custom_commercial_terms: commercialTermsToString(commercialTerms) || null,
        items,
        subtotal,
        tax,
        total_amount: total,
        client_id: clientIdForSave,
      };

      const response = isEditMode
        ? await fetch('/api/quotes/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              quoteId: editQuoteId,
              client_name: formData.client_name.trim(),
              client_email: formData.client_email.trim(),
              client_phone: formData.client_phone.trim() || null,
              client_company: formData.client_company.trim() || null,
              service_type: formData.service_type,
              description: formData.description,
              valid_until: formData.valid_until,
              quote_date: formData.quote_date,
              notes: formData.notes,
              show_valid_until: formData.show_valid_until,
              status: normalizeQuoteStatus(quoteStatus),
              client_id: clientIdForSave,
              custom_commercial_terms: payload.custom_commercial_terms,
              items: items.map((item) => ({
                id: item.id,
                item_name: item.description,
                description: item.description,
                quantity: item.quantity,
                unit: item.unit,
                unit_price: item.unit_price,
                percentage: item.percentage,
                total: item.total,
              })),
              total_amount: total,
            }),
          })
        : await fetch('/api/quotes/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...payload,
              contact_id: sourceContactId,
              send_email: sendEmailOnCreate,
            }),
          });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        setTimeout(() => {
          router.push(
            isEditMode && editQuoteId
              ? `/dashboard/cotizaciones/detalles/${editQuoteId}`
              : data.quote?.id
                ? `/dashboard/cotizaciones/detalles/${data.quote.id}`
                : '/dashboard/cotizaciones'
          );
        }, 1500);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error saving quote:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditMode) {
      setCreateEmailPromptOpen(true);
      return;
    }
    void persistQuote(false);
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
    { number: 4, title: 'Resumen', description: 'Confirmar y guardar' },
  ];

  return (
    <div className="min-h-screen bg-surface-secondary">
      <Sidebar defaultCollapsed onCollapsedChange={setSidebarCollapsed} />
      <DashboardHeader user={user} onLogout={handleLogout} sidebarCollapsed={sidebarCollapsed} />

      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <a href="/dashboard" className="p-2 rounded-md hover:bg-white/50 transition-colors">
                <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </a>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {isEditMode ? `Editar ${editQuoteNumber || 'cotización'}` : 'Nueva Cotización'}
                </h1>
                <p className="text-muted">
                  {isEditMode
                    ? 'Mismo flujo del cotizador: ajusta datos y guarda los cambios'
                    : 'Crea una cotización profesional para tu cliente'}
                </p>
              </div>
            </div>
          </div>

          {/* Success/Error Alerts */}
          {editLoadError && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-2xl animate-slide-up">
              <p className="font-semibold text-danger-dark">{editLoadError}</p>
            </div>
          )}

          {duplicateSource && (
            <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-between gap-3 animate-slide-up">
              <div>
                <p className="font-semibold text-accent-dark">Cotización duplicada</p>
                <p className="text-sm text-accent/80">
                  Basada en {duplicateSource}. La fecha de cotización se inicializa en hoy; puedes ajustar fechas, cliente e ítems antes de guardar.
                </p>
              </div>
            </div>
          )}

          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-2xl flex items-center gap-3 animate-slide-up">
              <div className="w-10 h-10 rounded-md bg-success flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-success-dark">
                  {isEditMode ? '¡Cambios guardados!' : '¡Cotización creada exitosamente!'}
                </p>
                <p className="text-sm text-success/80">Redirigiendo...</p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-2xl flex items-center gap-3 animate-slide-up">
              <div className="w-10 h-10 rounded-md bg-danger flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-danger-dark">
                  {isEditMode ? 'Error al guardar la cotización' : 'Error al crear la cotización'}
                </p>
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
                      w-10 h-10 rounded-md flex items-center justify-center font-semibold text-sm
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
                  <div className="w-10 h-10 rounded-md bg-white/20 flex items-center justify-center">
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
                        <div className="absolute z-20 w-full mt-2 bg-white rounded-md shadow-elevated border border-gray-100 max-h-72 overflow-y-auto">
                          {searchResults.map((client) => (
                            <button
                              key={client.id}
                              type="button"
                              onClick={() => selectClient(client)}
                              className="w-full text-left px-4 py-3 hover:bg-surface-secondary transition-colors border-b border-gray-50 last:border-0"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center text-accent font-semibold">
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
                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-accent hover:bg-accent/5 transition-all duration-200 flex items-center justify-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center">
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
                      <div className="p-5 bg-gradient-to-br from-accent/5 to-accent/10 rounded-md border border-accent/20 space-y-4 animate-slide-up">
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
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gradient-to-r from-success/10 to-success/5 rounded-md border border-success/20">
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
                        className="text-sm font-medium text-danger hover:bg-danger/10 px-4 py-2 rounded-md transition-colors"
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
                  <div className="w-10 h-10 rounded-md bg-white/20 flex items-center justify-center">
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
                          p-4 rounded-md border-2 text-left transition-all duration-200
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

                {/* Fechas y descripción */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Fecha de cotización
                    </label>
                    <input
                      type="date"
                      name="quote_date"
                      value={formData.quote_date}
                      onChange={handleFormChange}
                      className="input"
                    />
                    <p className="text-xs text-muted mt-1.5">
                      Aparece como &quot;Fecha&quot; en el PDF.
                    </p>
                  </div>
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

                {isEditMode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Estado</label>
                    <select
                      value={quoteStatus}
                      onChange={(e) => setQuoteStatus(e.target.value)}
                      className="input max-w-xs"
                    >
                      {quoteStatusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

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
                    <div className="w-10 h-10 rounded-md bg-white/20 flex items-center justify-center">
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
                <p className="text-sm text-muted mb-4">
                  Puedes dejar corridas vacías para llenarlas después y arrastrar cualquier partida a otra posición.
                </p>
                {/* Items List */}
                <div className="space-y-4">
                  {items.map((item, index) => {
                    const isEmptyCorrida = !item.description?.trim();
                    return (
                    <div 
                      key={item.id}
                      draggable
                      onDragStart={() => handleItemDragStart(index)}
                      onDragOver={(e) => handleItemDragOver(e, index)}
                      onDragEnd={handleItemDragEnd}
                      className={`group relative rounded-md p-4 sm:p-5 border-2 transition-all duration-200 ${
                        dragIndex === index
                          ? 'border-accent shadow-soft opacity-90 bg-surface-secondary'
                          : isEmptyCorrida
                            ? 'border-dashed border-amber-400 bg-amber-50/80 hover:border-amber-500'
                            : 'border-gray-100 bg-surface-secondary hover:border-accent/30'
                      }`}
                    >
                      {/* Item Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg text-muted hover:bg-white hover:text-gray-700"
                            title="Arrastrar para reordenar"
                            aria-label={`Arrastrar corrida ${index + 1}`}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M7 4a1 1 0 100 2 1 1 0 000-2zm0 5a1 1 0 100 2 1 1 0 000-2zm0 5a1 1 0 100 2 1 1 0 000-2zm6-10a1 1 0 100 2 1 1 0 000-2zm0 5a1 1 0 100 2 1 1 0 000-2zm0 5a1 1 0 100 2 1 1 0 000-2z" />
                            </svg>
                          </button>
                          <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-semibold text-sm ${
                            isEmptyCorrida
                              ? 'bg-amber-200 text-amber-900'
                              : 'bg-accent/10 text-accent'
                          }`}>
                            {index + 1}
                          </span>
                          {isEmptyCorrida ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-200 text-amber-900">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                              </svg>
                              Falta descripción
                            </span>
                          ) : (
                            <span className="text-sm font-medium text-muted">Item</span>
                          )}
                          <div className="hidden sm:flex items-center gap-1 ml-1">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => moveItem(index, index - 1)}
                              className="p-1 rounded text-muted hover:bg-white disabled:opacity-30"
                              title="Subir"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              disabled={index === items.length - 1}
                              onClick={() => moveItem(index, index + 1)}
                              className="p-1 rounded text-muted hover:bg-white disabled:opacity-30"
                              title="Bajar"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
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
                          <label className={`block text-xs font-medium mb-1.5 ${
                            isEmptyCorrida ? 'text-amber-800' : 'text-gray-500'
                          }`}>
                            Descripción{' '}
                            <span className={`font-normal ${isEmptyCorrida ? 'text-amber-700' : 'text-muted-light'}`}>
                              {isEmptyCorrida ? '(pendiente de llenar)' : '(opcional si es corrida vacía)'}
                            </span>
                          </label>
                          <input
                            type="text"
                            name={`description-${item.id}`}
                            value={item.description}
                            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                            className={`input bg-white ${
                              isEmptyCorrida
                                ? 'border-amber-300 focus:border-amber-500 focus:ring-amber-200 placeholder:text-amber-700/60'
                                : ''
                            }`}
                            placeholder={isEmptyCorrida ? 'Esta corrida está vacía — escribe la descripción aquí…' : 'Ej: Cámara IP 4K, Cable UTP Cat6, Instalación...'}
                          />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Cantidad</label>
                            <NumericInput
                              value={item.quantity}
                              min={1}
                              onChange={(n) => handleItemChange(item.id, 'quantity', Math.round(n))}
                              className="input bg-white"
                              center
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Unidad</label>
                            <select
                              value={item.unit}
                              onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
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
                              <NumericInput
                                value={item.percentage}
                                step="0.01"
                                onChange={(n) => handleItemChange(item.id, 'percentage', n)}
                                className="input bg-white pr-8"
                                center
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-light text-sm">%</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Precio Unit.</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-light text-sm">$</span>
                              <NumericInput
                                value={item.unit_price}
                                step="0.01"
                                min={0}
                                onChange={(n) => handleItemChange(item.id, 'unit_price', n)}
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
                    );
                  })}
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCatalogOpen(true)}
                    className="p-4 border-2 border-dashed border-brand/30 rounded-md hover:border-brand hover:bg-brand/5 transition-all flex items-center justify-center gap-2 text-brand font-medium"
                  >
                    Del catálogo
                  </button>
                  <button
                    type="button"
                    onClick={addItem}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-accent hover:bg-accent/5 transition-all flex items-center justify-center gap-2 text-muted hover:text-accent"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Corrida vacía
                  </button>
                </div>

                <CatalogPickerModal
                  open={catalogOpen}
                  onClose={() => setCatalogOpen(false)}
                  onSelect={addItemFromCatalog}
                />

                {/* Grand Total */}
                <div className="mt-6 p-4 bg-gradient-to-r from-brand/5 to-accent/5 rounded-md border border-brand/10">
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
                <div className="mt-4 p-4 bg-surface-secondary rounded-md">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Condiciones comerciales
                  </label>
                  <CommercialTermsEditor
                    terms={commercialTerms}
                    onChange={setCommercialTerms}
                  />
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
                  <div className="w-10 h-10 rounded-md bg-white/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Resumen de la Cotización</h2>
                    <p className="text-sm text-white/70">
                      {isEditMode
                        ? 'Revisa los datos antes de guardar'
                        : 'Revisa los datos antes de crear la cotización'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Client Card */}
                  <div className="p-4 bg-surface-secondary rounded-md">
                    <p className="text-xs font-medium text-muted uppercase tracking-wide mb-2">Cliente</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white font-bold">
                        {selectedClient?.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{selectedClient?.name}</p>
                        <p className="text-sm text-muted">{selectedClient?.company || selectedClient?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Service Card */}
                  <div className="p-4 bg-surface-secondary rounded-md">
                    <p className="text-xs font-medium text-muted uppercase tracking-wide mb-2">Servicio</p>
                    <p className="font-semibold text-gray-900">
                      {serviceTypes.find(s => s.value === formData.service_type)?.label || '-'}
                    </p>
                    <p className="text-sm text-muted mt-1">
                      Fecha: {new Date(formData.quote_date + 'T12:00:00').toLocaleDateString('es-MX')}
                    </p>
                    <p className="text-sm text-muted">
                      {formData.show_valid_until ? `Válida hasta: ${new Date(formData.valid_until + 'T12:00:00').toLocaleDateString('es-MX')}` : 'Sin fecha de validez'}
                    </p>
                  </div>

                  {/* Total Card */}
                  <div className="p-4 bg-gradient-to-br from-brand/10 to-accent/10 rounded-md border border-brand/10">
                    <p className="text-xs font-medium text-muted uppercase tracking-wide mb-2">Total</p>
                    <p className="text-2xl font-bold text-brand">{formatCurrency(total)}</p>
                    <p className="text-sm text-muted">{items.length} corridas</p>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Items Incluidos</h3>
                  <div className="border border-gray-200 rounded-md overflow-hidden">
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
                        {items.map((item, index) => {
                          const isEmptyCorrida = !item.description?.trim();
                          return (
                          <tr
                            key={item.id}
                            className={isEmptyCorrida ? 'bg-amber-50/80' : undefined}
                          >
                            <td className="px-4 py-3 text-sm text-muted">{index + 1}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {isEmptyCorrida ? (
                                <span className="inline-flex items-center gap-1.5 text-amber-800 italic font-semibold">
                                  <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
                                  Falta descripción
                                </span>
                              ) : (
                                item.description
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 text-center">{item.quantity} {getQuoteItemUnitLabel(item.unit)}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">{formatCurrency(item.total)}</td>
                          </tr>
                          );
                        })}
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
                <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-6 border-t border-gray-100">
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
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => setPdfPreviewOpen(true)}
                      className="btn-secondary"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Vista previa PDF
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !canProceed()}
                      className="btn-accent disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {isEditMode ? 'Guardando...' : 'Creando...'}
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {isEditMode ? 'Guardar cambios' : 'Crear Cotización'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      {createEmailPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setCreateEmailPromptOpen(false)}
            aria-hidden
          />
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Enviar cotización por correo?</h3>
            <p className="text-sm text-gray-600 mb-1">
              La cotización se guardará en el sistema. Elige si deseas enviar el PDF al cliente ahora.
            </p>
            {formData.client_email.trim() ? (
              <p className="text-sm text-brand font-medium mb-6 break-all">{formData.client_email.trim()}</p>
            ) : (
              <p className="text-sm text-amber-700 mb-6">No hay correo del cliente; solo podrás guardar sin enviar.</p>
            )}
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setCreateEmailPromptOpen(false)}
              >
                Volver
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => void persistQuote(false)}
              >
                Solo guardar
              </button>
              <button
                type="button"
                className="btn-accent disabled:opacity-50"
                disabled={!formData.client_email.trim()}
                onClick={() => void persistQuote(true)}
              >
                Guardar y enviar correo
              </button>
            </div>
          </div>
        </div>
      )}

      <PdfPreviewModal
        isOpen={pdfPreviewOpen}
        onClose={() => setPdfPreviewOpen(false)}
        getQuoteData={buildPreviewQuoteData}
        fileName="vista-previa-cotizacion.pdf"
        title="Vista previa del PDF"
      />
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
