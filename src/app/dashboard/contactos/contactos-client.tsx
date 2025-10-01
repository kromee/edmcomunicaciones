"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { SessionUser } from '@/lib/session';
import { Reveal } from '@/components/Reveal';
import { Modal } from '@/components/Modal';
import { useModal } from '@/hooks/useModal';

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

export default function ContactosClient({ contacts, user }: { contacts: Contact[]; user: SessionUser }) {
  const router = useRouter();
  const { modal, hideModal, showConfirm, showSuccess, showError } = useModal();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(contacts);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');

  // Función para filtrar contactos
  const filterContacts = (contacts: Contact[], searchTerm: string, statusFilter: string) => {
    console.log('filterContacts called with:', { searchTerm, statusFilter, contactsCount: contacts.length });
    let filtered = contacts;
    
    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(contact => contact.status === statusFilter);
      console.log('After status filter:', filtered.length);
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      console.log('Searching for term:', term);
      filtered = filtered.filter(contact => {
        const matches = 
          contact.name.toLowerCase().includes(term) ||
          contact.email.toLowerCase().includes(term) ||
          (contact.phone && contact.phone.includes(term)) ||
          (contact.company && contact.company.toLowerCase().includes(term)) ||
          (contact.service && contact.service.toLowerCase().includes(term)) ||
          contact.message.toLowerCase().includes(term) ||
          (contact.notes && contact.notes.toLowerCase().includes(term));
        
        if (matches) {
          console.log('Match found for contact:', contact.name);
        }
        return matches;
      });
      console.log('After search filter:', filtered.length);
    }
    
    return filtered;
  };

  // Efecto para filtrar contactos cuando cambian los filtros
  useEffect(() => {
    console.log('Filtrando contactos:', { searchTerm, statusFilter, contactsCount: contacts.length });
    const filtered = filterContacts(contacts, searchTerm, statusFilter);
    console.log('Contactos filtrados:', filtered.length);
    setFilteredContacts(filtered);
  }, [searchTerm, statusFilter, contacts]);

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
        setEditingNotes(null);
        setNotesText('');
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
    setEditingNotes(contact.id);
  };

  const cancelEditingNotes = () => {
    setEditingNotes(null);
    setNotesText('');
    setSelectedContact(null);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Nuevo' },
      contacted: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Contactado' },
      closed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Cerrado' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;

    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const newContactsCount = contacts.filter(c => c.status === 'new').length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="EDM" className="h-8 w-auto" />
              <span className="hidden sm:inline text-sm text-gray-500">Comunicaciones</span>
              <div>
              
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium"
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

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600">Total Contactos</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{contacts.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600">Nuevos</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{newContactsCount}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600">Cerrados</p>
            <p className="text-2xl font-bold text-gray-600 mt-1">
              {contacts.filter(c => c.status === 'closed').length}
            </p>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar contactos
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, email, empresa, servicio..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="lg:w-48">
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por estado
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">Todos los estados</option>
                <option value="new">Nuevos</option>
                <option value="contacted">Contactados</option>
                <option value="closed">Cerrados</option>
              </select>
            </div>
            
          </div>
        </div>

        {/* Lista de contactos */}
        {filteredContacts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            {searchTerm || statusFilter !== 'all' ? (
              <>
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron resultados</h3>
                <p className="text-gray-600 mb-6">
                  No hay contactos que coincidan con los filtros aplicados. Intenta con otros términos de búsqueda.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  Limpiar Filtros
                </button>
              </>
            ) : (
              <>
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay contactos</h3>
                <p className="text-gray-600">Los mensajes del formulario de contacto aparecerán aquí</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContacts.map((contact, index) => (
              <Reveal key={contact.id} delay={index * 0.05}>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{contact.name}</h3>
                          <p className="text-sm text-gray-600">{contact.email}</p>
                          {contact.phone && (
                            <p className="text-sm text-gray-500">{contact.phone}</p>
                          )}
                          {contact.company && (
                            <p className="text-sm text-gray-500 font-medium">{contact.company}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          {getStatusBadge(contact.status)}
                          {contact.service && (
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                              {contact.service}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{contact.message}</p>
                      
                      {/* Notas internas */}
                      {contact.notes && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                          <div className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                            <div>
                              <p className="text-sm font-medium text-yellow-800 mb-1">Notas internas:</p>
                              <p className="text-sm text-yellow-700">{contact.notes}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500">
                        {new Date(contact.created_at).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <select
                        value={contact.status}
                        onChange={(e) => updateStatus(contact.id, e.target.value as any)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="new">Nuevo</option>
                        <option value="contacted">Contactado</option>
                        <option value="closed">Cerrado</option>
                      </select>
                      
                      {/* Botón para editar notas */}
                      <button
                        onClick={() => startEditingNotes(contact)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Notas
                      </button>
                      
                      <a
                        href={`mailto:${contact.email}`}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        Email
                      </a>
                      {contact.phone && (
                        <a
                          href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                          </svg>
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </main>
      
      {/* Modal para editar notas */}
      {editingNotes && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Notas para {selectedContact.name}
            </h3>
            <textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Agrega notas internas sobre este contacto..."
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => updateNotes(selectedContact.id, notesText)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Guardar
              </button>
              <button
                onClick={cancelEditingNotes}
                className="flex-1 px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal general */}
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
