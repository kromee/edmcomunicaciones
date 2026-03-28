"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { SessionUser } from '@/types/session';
import { Modal } from '@/components/Modal';
import { useModal } from '@/hooks/useModal';
import { Sidebar } from '@/components/DashboardSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';

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
  const { modal, hideModal, showConfirm, showSuccess, showError } = useModal();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(contacts);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState('');
  const [actionsOpen, setActionsOpen] = useState<string | null>(null);

  useEffect(() => {
    let filtered = contacts;
    
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
  }, [searchTerm, statusFilter, contacts]);

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
      }
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const updateNotes = async (contactId: string, notes: string) => {
    try {
      const response = await fetch('/api/contacts/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: contactId, notes }),
      });

      if (response.ok) {
        showSuccess('Notas Actualizadas', 'Las notas se han guardado exitosamente');
        setEditingNotes(false);
        setNotesText('');
        setSelectedContact(null);
        router.refresh();
      } else {
        showError('Error', 'No se pudieron guardar las notas');
      }
    } catch (error) {
      console.error('Error updating notes:', error);
      showError('Error', 'Error al guardar las notas');
    }
  };

  const startEditingNotes = (contact: Contact) => {
    setSelectedContact(contact);
    setNotesText(contact.notes || '');
    setEditingNotes(true);
    setActionsOpen(null);
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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Contactos</h1>
              </div>
              <p className="text-muted ml-11 sm:ml-0">{filteredContacts.length} contacto{filteredContacts.length !== 1 ? 's' : ''} encontrado{filteredContacts.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
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
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
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
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{getStatusCount('closed')}</p>
                  <p className="text-xs text-muted">Cerrados</p>
                </div>
              </div>
            </div>
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
            <div className="bg-white rounded-2xl p-12 shadow-card text-center">
              <div className="w-16 h-16 rounded-2xl bg-surface-secondary flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-muted-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all' ? 'Sin resultados' : 'No hay contactos'}
              </h3>
              <p className="text-muted mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No hay contactos que coincidan con los filtros aplicados.'
                  : 'Los mensajes del formulario de contacto aparecerán aquí.'}
              </p>
              <button
                onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                className="btn-secondary"
              >
                {searchTerm || statusFilter !== 'all' ? 'Limpiar filtros' : 'Cerrar'}
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredContacts.map((contact) => {
                const statusStyle = statusConfig[contact.status as StatusFilter] || statusConfig.new;
                return (
                  <div 
                    key={contact.id} 
                    className="bg-white rounded-2xl shadow-card hover:shadow-elevated transition-all duration-200 group"
                  >
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        {/* Left: Avatar & Info */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-gradient-to-br from-brand to-accent items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            {contact.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                                {statusStyle.icon}
                                {statusStyle.label}
                              </span>
                              {contact.service && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                  </svg>
                                  {contact.service}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted">{contact.email}</p>
                            {contact.phone && (
                              <p className="text-sm text-muted-light">{contact.phone}</p>
                            )}
                            {contact.company && (
                              <p className="text-sm text-muted-light flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                {contact.company}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Message Preview */}
                        <div className="hidden lg:block max-w-md">
                          <p className="text-sm text-gray-700 line-clamp-2">{contact.message}</p>
                          {contact.notes && (
                            <div className="mt-2 flex items-start gap-2 p-2 bg-warning/5 rounded-lg border border-warning/20">
                              <svg className="w-4 h-4 text-warning-dark mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <p className="text-xs text-warning-dark line-clamp-1">{contact.notes}</p>
                            </div>
                          )}
                        </div>

                        {/* Right: Date & Actions */}
                        <div className="flex flex-col items-end gap-3">
                          <p className="text-xs text-muted-light">
                            {formatDate(contact.created_at)}
                          </p>
                          
                          <div className="flex items-center gap-2">
                            <a
                              href={`mailto:${contact.email}`}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent-dark transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="hidden sm:inline">Email</span>
                            </a>

                            {contact.phone && (
                              <a
                                href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-2 bg-[#25D366] text-white text-sm font-medium rounded-xl hover:bg-[#20BD5A] transition-colors"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                                </svg>
                                <span className="hidden sm:inline">WhatsApp</span>
                              </a>
                            )}

                            {/* Actions Dropdown */}
                            <div className="relative">
                              <button
                                onClick={() => setActionsOpen(actionsOpen === contact.id ? null : contact.id)}
                                className="p-2 rounded-xl hover:bg-surface-secondary transition-colors text-muted hover:text-gray-900"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 12a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                              </button>
                              
                              {actionsOpen === contact.id && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-elevated border border-gray-100 py-2 z-20 animate-slide-up">
                                  <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-xs font-medium text-muted-light uppercase tracking-wide">Cambiar estado</p>
                                  </div>
                                  {(['new', 'contacted', 'closed'] as const).map((status) => (
                                    <button
                                      key={status}
                                      onClick={() => {
                                        updateStatus(contact.id, status);
                                        setActionsOpen(null);
                                      }}
                                      className={`flex items-center gap-3 px-4 py-2.5 w-full text-sm transition-colors ${
                                        contact.status === status 
                                          ? 'bg-surface-secondary text-gray-900 font-medium' 
                                          : 'text-gray-700 hover:bg-surface-secondary'
                                      }`}
                                    >
                                      {statusConfig[status].icon}
                                      <span className={statusConfig[status].text}>
                                        {statusConfig[status].label}
                                      </span>
                                      {contact.status === status && (
                                        <svg className="w-4 h-4 ml-auto text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                      )}
                                    </button>
                                  ))}
                                  <div className="border-t border-gray-100 my-2" />
                                  <button
                                    onClick={() => startEditingNotes(contact)}
                                    className="flex items-center gap-3 px-4 py-2.5 w-full text-sm text-gray-700 hover:bg-surface-secondary transition-colors"
                                  >
                                    <svg className="w-4 h-4 text-warning-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    {contact.notes ? 'Editar notas' : 'Agregar notas'}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Message Preview */}
                      <div className="mt-4 lg:hidden">
                        <p className="text-sm text-gray-700 line-clamp-2">{contact.message}</p>
                        {contact.notes && (
                          <div className="mt-2 flex items-start gap-2 p-2 bg-warning/5 rounded-lg border border-warning/20">
                            <svg className="w-4 h-4 text-warning-dark mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <p className="text-xs text-warning-dark line-clamp-2">{contact.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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

      {/* Notes Modal */}
      {editingNotes && selectedContact && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-elevated animate-slide-up">
            <div className="px-6 py-4 bg-gradient-to-r from-brand to-brand-light">
              <h3 className="text-lg font-semibold text-white">
                Notas para {selectedContact.name}
              </h3>
              <p className="text-sm text-white/70">
                {selectedContact.notes ? 'Edita las notas internas' : 'Agrega notas internas sobre este contacto'}
              </p>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Notas internas</label>
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Agrega notas sobre este contacto..."
                className="input resize-none h-32"
              />
              <p className="mt-2 text-xs text-muted">Las notas son solo visibles para ti y tu equipo.</p>

              <div className="flex gap-3 pt-6 mt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingNotes(false);
                    setNotesText('');
                    setSelectedContact(null);
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => updateNotes(selectedContact.id, notesText)}
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
