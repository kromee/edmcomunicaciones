"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import type { Route } from 'next';
import { useState, useEffect } from 'react';
import {
  contactNeedsAttention,
  countContactsNeedingAttention,
} from '@/lib/contact-follow-up';
import { SessionUser } from '@/types/session';
import { Modal } from '@/components/Modal';
import { useModal } from '@/hooks/useModal';
import { Sidebar } from '@/components/DashboardSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { ContactosList } from './contactos-list';

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  notes: string | null;
  client_id: string | null;
  follow_up_date: string | null;
  next_action: string | null;
  created_at: string;
};

type StatusFilter = 'all' | 'new' | 'contacted' | 'closed';

const statusConfig: Record<StatusFilter, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  all: { 
    label: 'Todos', 
    bg: 'bg-gray-100', 
    text: 'text-gray-700', 
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> 
  },
  new: { 
    label: 'Nuevos', 
    bg: 'bg-accent/10', 
    text: 'text-accent-dark', 
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg> 
  },
  contacted: { 
    label: 'Contactados', 
    bg: 'bg-warning/10', 
    text: 'text-warning-dark', 
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> 
  },
  closed: { 
    label: 'Cerrados', 
    bg: 'bg-gray-100', 
    text: 'text-gray-600', 
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> 
  },
};

export default function ContactosClient({ contacts, user }: { contacts: Contact[]; user: SessionUser }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { modal, hideModal, showSuccess, showError } = useModal();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(contacts);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [actionsOpen, setActionsOpen] = useState<string | null>(null);
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [attentionFilter, setAttentionFilter] = useState(false);
  const [messageModalContact, setMessageModalContact] = useState<Contact | null>(null);

  useEffect(() => {
    if (searchParams.get('atencion') === '1') {
      setAttentionFilter(true);
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = contacts;

    if (attentionFilter) {
      filtered = filtered.filter(contactNeedsAttention);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(contact => contact.status === statusFilter);
    }
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(contact => 
        contact.name.toLowerCase().includes(term) ||
        contact.email.toLowerCase().includes(term) ||
        (contact.phone && contact.phone.includes(term)) ||
        (contact.company && contact.company.toLowerCase().includes(term)) ||
        (contact.service && contact.service.toLowerCase().includes(term)) ||
        contact.message.toLowerCase().includes(term) ||
        (contact.notes && contact.notes.toLowerCase().includes(term))
      );
    }
    
    setFilteredContacts(filtered);
  }, [searchTerm, statusFilter, attentionFilter, contacts]);

  const getStatusCount = (status: StatusFilter) => {
    if (status === 'all') return contacts.length;
    return contacts.filter(c => c.status === status).length;
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const updateStatus = async (contactId: string, newStatus: 'new' | 'contacted' | 'closed') => {
    try {
      const response = await fetch('/api/contacts/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: contactId, status: newStatus }),
      });

      if (response.ok) {
        router.refresh();
        showSuccess('Estado actualizado', 'El contacto se actualizó correctamente');
      } else {
        showError('Error', 'No se pudo actualizar el estado');
      }
    } catch (error) {
      console.error('Error updating contact:', error);
      showError('Error', 'No se pudo actualizar el estado');
    }
  };

  const saveContactFollowUp = async (contactId: string) => {
    try {
      const response = await fetch('/api/contacts/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: contactId,
          notes: notesText,
          follow_up_date: followUpDate || null,
          next_action: nextAction || null,
        }),
      });

      if (response.ok) {
        showSuccess('Seguimiento guardado', 'Notas y próxima acción actualizadas');
        setEditingNotes(false);
        setNotesText('');
        setFollowUpDate('');
        setNextAction('');
        setSelectedContact(null);
        router.refresh();
      } else {
        showError('Error', 'No se pudo guardar el seguimiento');
      }
    } catch (error) {
      console.error('Error updating contact follow-up:', error);
      showError('Error', 'Error al guardar el seguimiento');
    }
  };

  const startEditingNotes = (contact: Contact) => {
    setSelectedContact(contact);
    setNotesText(contact.notes || '');
    setFollowUpDate(contact.follow_up_date || '');
    setNextAction(contact.next_action || '');
    setEditingNotes(true);
    setActionsOpen(null);
  };

  const attentionCount = countContactsNeedingAttention(contacts);

  const buildCotizadorUrl = (contact: Contact, clientId?: string | null): Route => {
    const params = new URLSearchParams({ contactId: contact.id });
    const resolvedClientId = clientId ?? contact.client_id;
    if (resolvedClientId) params.set('clientId', resolvedClientId);
    return `/cotizador?${params.toString()}` as Route;
  };

  const handleCotizar = async (contact: Contact) => {
    setActionsOpen(null);
    if (contact.client_id) {
      router.push(buildCotizadorUrl(contact));
      return;
    }

    setConvertingId(contact.id);
    try {
      const response = await fetch('/api/contacts/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId: contact.id }),
      });
      const data = await response.json();
      if (data.success && data.client?.id) {
        router.push(buildCotizadorUrl(contact, data.client.id));
        return;
      }
      showError('No se pudo preparar la cotización', data.error || 'Intenta registrar el cliente primero');
    } catch (error) {
      console.error('Error preparing quote from contact:', error);
      showError('Error', 'No se pudo abrir el cotizador');
    } finally {
      setConvertingId(null);
    }
  };

  const handleRegisterClient = async (contact: Contact) => {
    setActionsOpen(null);
    if (contact.client_id) {
      router.push(`/dashboard/clientes/detalle/${contact.client_id}`);
      return;
    }

    setConvertingId(contact.id);
    try {
      const response = await fetch('/api/contacts/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId: contact.id }),
      });
      const data = await response.json();
      if (data.success && data.client?.id) {
        showSuccess(
          data.created ? 'Cliente creado' : 'Cliente vinculado',
          data.created
            ? `${contact.name} quedó registrado como prospecto.`
            : `Ya existía un cliente con ese correo; el contacto quedó vinculado.`
        );
        router.refresh();
        router.push(`/dashboard/clientes/detalle/${data.client.id}`);
      } else {
        showError('Error', data.error || 'No se pudo registrar el cliente');
      }
    } catch (error) {
      console.error('Error converting contact:', error);
      showError('Error', 'No se pudo registrar el cliente');
    } finally {
      setConvertingId(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-surface-secondary">
      <Sidebar defaultCollapsed onCollapsedChange={setSidebarCollapsed} />
      <DashboardHeader user={user} onLogout={handleLogout} sidebarCollapsed={sidebarCollapsed} />

      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <a href="/dashboard" className="p-2 rounded-md hover:bg-white/50 transition-colors">
                  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </a>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Contactos</h1>
              </div>
              <p className="text-muted ml-11 sm:ml-0">{filteredContacts.length} contacto{filteredContacts.length !== 1 ? 's' : ''} encontrado{filteredContacts.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
                  <p className="text-xs text-muted">Total</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{getStatusCount('new')}</p>
                  <p className="text-xs text-muted">Nuevos</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-warning/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-warning-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{attentionCount}</p>
                  <p className="text-xs text-muted">Por atender</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Filters */}
          <div className="mb-6 overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max">
              <button
                type="button"
                onClick={() => setAttentionFilter((v) => !v)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium
                  transition-all duration-200
                  ${attentionFilter
                    ? 'bg-warning text-white shadow-soft'
                    : 'bg-white text-muted hover:bg-surface-secondary border border-gray-100'
                  }
                `}
              >
                Por atender
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${attentionFilter ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {attentionCount}
                </span>
              </button>
              {(Object.keys(statusConfig) as StatusFilter[]).map((status) => {
                const config = statusConfig[status];
                const isActive = statusFilter === status;
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium
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
                placeholder="Buscar por nombre, email, empresa, servicio..."
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

          {/* Contacts List */}
          {filteredContacts.length === 0 ? (
            <div className="rounded-xl border border-gray-100 bg-white p-12 shadow-sm text-center">
              <div className="w-16 h-16 rounded-2xl bg-surface-secondary flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-muted-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all' || attentionFilter ? 'Sin resultados' : 'No hay contactos'}
              </h3>
              <p className="text-muted mb-6">
                {searchTerm || statusFilter !== 'all' || attentionFilter
                  ? 'No hay contactos que coincidan con los filtros aplicados.'
                  : 'Los mensajes del formulario de contacto aparecerán aquí.'}
              </p>
              <button
                onClick={() => { setSearchTerm(''); setStatusFilter('all'); setAttentionFilter(false); }}
                className="btn-secondary"
              >
                {searchTerm || statusFilter !== 'all' || attentionFilter ? 'Limpiar filtros' : 'Cerrar'}
              </button>
            </div>
          ) : (
            <ContactosList
              contacts={filteredContacts}
              actionsOpen={actionsOpen}
              setActionsOpen={setActionsOpen}
              convertingId={convertingId}
              onViewMessage={setMessageModalContact}
              onCotizar={handleCotizar}
              onRegisterClient={handleRegisterClient}
              onFollowUp={startEditingNotes}
              onStatusChange={updateStatus}
              formatDate={formatDate}
            />
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

      {messageModalContact && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-elevated animate-slide-up max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{messageModalContact.name}</h3>
                <p className="text-sm text-muted">{messageModalContact.email}</p>
                {messageModalContact.service && (
                  <p className="text-xs text-purple-700 mt-1">{messageModalContact.service}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setMessageModalContact(null)}
                className="p-2 rounded-md hover:bg-surface-secondary text-muted"
                aria-label="Cerrar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Mensaje del formulario</p>
              <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{messageModalContact.message}</p>
              {messageModalContact.next_action && (
                <div className="mt-4 p-3 rounded-lg bg-surface-secondary">
                  <p className="text-xs font-semibold text-muted mb-1">Próxima acción</p>
                  <p className="text-sm text-gray-800">{messageModalContact.next_action}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setMessageModalContact(null);
                  handleCotizar(messageModalContact);
                }}
                className="btn-primary text-sm px-4 py-2"
              >
                Cotizar
              </button>
              <button
                type="button"
                onClick={() => {
                  setMessageModalContact(null);
                  startEditingNotes(messageModalContact);
                }}
                className="btn-secondary text-sm px-4 py-2"
              >
                Seguimiento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {editingNotes && selectedContact && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-elevated animate-slide-up">
            <div className="px-6 py-4 bg-gradient-to-r from-brand to-brand-light">
              <h3 className="text-lg font-semibold text-white">
                Seguimiento — {selectedContact.name}
              </h3>
              <p className="text-sm text-white/70">
                Próxima acción, fecha y notas internas del lead
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Próxima acción</label>
                <input
                  type="text"
                  value={nextAction}
                  onChange={(e) => setNextAction(e.target.value)}
                  placeholder="Ej. Llamar, enviar cotización, visita..."
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de seguimiento</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Notas internas</label>
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Contexto del lead, acuerdos, etc."
                  className="input resize-none h-28"
                />
              </div>

              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingNotes(false);
                    setNotesText('');
                    setFollowUpDate('');
                    setNextAction('');
                    setSelectedContact(null);
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => saveContactFollowUp(selectedContact.id)}
                  className="flex-1 btn-accent"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
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
