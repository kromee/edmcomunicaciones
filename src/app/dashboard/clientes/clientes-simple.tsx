"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SessionUser } from '@/types/session';
import { ClientFormModal } from '@/components/ClientFormModal';
import { Modal } from '@/components/Modal';
import { useModal } from '@/hooks/useModal';
import { Sidebar } from '@/components/DashboardSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';

const ITEMS_PER_PAGE = 20;

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

type StatusFilter = 'all' | 'active' | 'inactive' | 'prospect';

const statusConfig: Record<StatusFilter, { label: string }> = {
  all: { label: 'Todos' },
  active: { label: 'Activos' },
  inactive: { label: 'Inactivos' },
  prospect: { label: 'Prospectos' },
};

function ClientRowMenu({
  client,
  open,
  openUpward,
  onToggle,
  onEdit,
  onDelete,
}: {
  client: Client;
  open: boolean;
  openUpward: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; upward: boolean } | null>(null);

  useEffect(() => {
    if (!open || !buttonRef.current) {
      setCoords(null);
      return;
    }

    const place = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      const upward = openUpward || rect.bottom + 280 > window.innerHeight;
      setCoords({
        top: upward ? rect.top - 4 : rect.bottom + 4,
        left: rect.right,
        upward,
      });
    };

    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [open, openUpward]);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <button
        ref={buttonRef}
        type="button"
        onClick={onToggle}
        className="p-1.5 rounded-md hover:bg-surface-secondary transition-colors text-muted hover:text-gray-900"
        aria-label="Acciones"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>

      {open && coords && (
        <div
          className="fixed z-50 w-48 bg-white rounded-md shadow-elevated border border-gray-100 py-1.5"
          style={{
            top: coords.top,
            left: coords.left,
            transform: coords.upward ? 'translate(-100%, -100%)' : 'translateX(-100%)',
          }}
        >
          <a href={`/dashboard/clientes/detalle/${client.id}`} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-surface-secondary">
            Ver detalles
          </a>
          <a href={`/cotizador?clientId=${client.id}`} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-surface-secondary">
            Cotizar
          </a>
          <button type="button" onClick={onEdit} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-surface-secondary">
            Editar
          </button>
          <a href={`mailto:${client.email}`} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-surface-secondary">
            Enviar email
          </a>
          {client.phone ? (
            <a
              href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-surface-secondary"
            >
              WhatsApp
            </a>
          ) : null}
          <div className="my-1 border-t border-gray-100" />
          <button type="button" onClick={onDelete} className="flex w-full items-center px-4 py-2 text-sm text-danger hover:bg-danger/5">
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}

export default function ClientesSimple({ clients, user }: { clients: Client[]; user: SessionUser }) {
  const router = useRouter();
  const { modal, hideModal, showConfirm, showSuccess, showError } = useModal();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [actionsOpen, setActionsOpen] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'México',
    tax_id: '',
    notes: '',
    status: 'active' as 'active' | 'inactive' | 'prospect'
  });

  const normalizeText = (value: unknown): string =>
    String(value ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const filteredClients = (() => {
    let filtered = clients;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }

    const tokens = normalizeText(searchTerm).split(/\s+/).filter(Boolean);
    if (tokens.length > 0) {
      filtered = filtered.filter(client => {
        const haystack = normalizeText(
          [
            client.name,
            client.email,
            client.phone,
            client.company,
            client.city,
            client.state,
            client.tax_id,
            client.notes,
          ].join(' ')
        );
        return tokens.every(token => haystack.includes(token));
      });
    }

    return filtered;
  })();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedClients = filteredClients.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'México',
      tax_id: '',
      notes: '',
      status: 'active'
    });
    setEditingClient(null);
    setShowCreateModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingClient ? '/api/clients/update' : '/api/clients/create';
      const method = editingClient ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingClient ? { id: editingClient.id, ...formData } : formData),
      });

      const data = await response.json();

      if (data.success) {
        showSuccess(
          editingClient ? 'Cliente Actualizado' : 'Cliente Creado',
          editingClient ? 'El cliente se ha actualizado exitosamente' : 'El cliente se ha creado exitosamente'
        );
        resetForm();
        router.refresh();
      } else {
        showError('Error', data.error || 'Error al procesar la solicitud');
      }
    } catch (error) {
      console.error('Error saving client:', error);
      showError('Error', 'Error al guardar el cliente');
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone || '',
      company: client.company || '',
      address: client.address || '',
      city: client.city || '',
      state: client.state || '',
      postal_code: client.postal_code || '',
      country: client.country,
      tax_id: client.tax_id || '',
      notes: client.notes || '',
      status: client.status
    });
    setShowCreateModal(true);
    setActionsOpen(null);
  };

  const handleDelete = (client: Client) => {
    setActionsOpen(null);
    showConfirm(
      'Eliminar Cliente',
      `¿Estás seguro de que quieres eliminar el cliente "${client.name}"? Esta acción no se puede deshacer.`,
      async () => {
        try {
          const response = await fetch('/api/clients/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: client.id }),
          });

          const data = await response.json();

          if (data.success) {
            showSuccess('Cliente Eliminado', 'El cliente se ha eliminado exitosamente');
            router.refresh();
          } else {
            showError('Error', data.error || 'Error al eliminar el cliente');
          }
        } catch (error) {
          console.error('Error deleting client:', error);
          showError('Error', 'Error al eliminar el cliente');
        }
      },
      'Eliminar',
      'Cancelar'
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-surface-secondary">
      <Sidebar defaultCollapsed onCollapsedChange={setSidebarCollapsed} />
      <DashboardHeader
        user={user}
        onLogout={handleLogout}
        sidebarCollapsed={sidebarCollapsed}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar por nombre, email, empresa..."
      />

      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <a href="/dashboard" className="p-2 rounded-md hover:bg-white/50 transition-colors">
                <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </a>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Clientes</h1>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="sr-only" htmlFor="client-status-filter">Estado</label>
              <select
                id="client-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="h-8 flex-1 sm:flex-none bg-white border border-gray-200 rounded-md px-2.5 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                {(Object.keys(statusConfig) as StatusFilter[]).map((status) => (
                  <option key={status} value={status}>
                    {statusConfig[status].label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  resetForm();
                  setShowCreateModal(true);
                }}
                className="btn-primary h-8 px-3 py-0 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nuevo Cliente
              </button>
            </div>
          </div>

          {filteredClients.length === 0 ? (
            <div className="bg-white rounded-xl p-12 shadow-card text-center">
              <div className="w-16 h-16 rounded-md bg-surface-secondary flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-muted-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin resultados</h3>
              <p className="text-muted mb-6">No hay clientes que coincidan con tu búsqueda</p>
              <button
                onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                className="btn-secondary"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <table className="w-full table-fixed text-sm">
                  <thead className="border-b border-gray-100 bg-surface-secondary/60 text-[11px] uppercase tracking-wider text-muted">
                    <tr>
                      <th className="text-left font-semibold px-4 py-2 w-[22%]">Cliente</th>
                      <th className="text-left font-semibold px-3 py-2">Correo</th>
                      <th className="text-left font-semibold px-3 py-2 w-[14%]">Teléfono</th>
                      <th className="text-left font-semibold px-3 py-2 w-[14%]">Ciudad</th>
                      <th className="text-left font-semibold px-3 py-2 w-[11%]">Registro</th>
                      <th className="px-2 py-2 w-[4%]"><span className="sr-only">Acciones</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedClients.map((client, index) => (
                      <tr
                        key={client.id}
                        onClick={() => router.push(`/dashboard/clientes/detalle/${client.id}`)}
                        className="cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors hover:bg-accent/[0.04]"
                      >
                        <td className="px-4 py-3 align-top overflow-hidden">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-sm font-bold text-brand">
                              {client.name.charAt(0).toUpperCase()}
                            </span>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate uppercase tracking-wide">{client.name}</p>
                              {client.company ? (
                                <p className="mt-0.5 text-xs text-muted truncate">{client.company}</p>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 align-top overflow-hidden">
                          <p className="text-gray-700 truncate">{client.email}</p>
                        </td>
                        <td className="px-3 py-3 align-top whitespace-nowrap text-gray-700">{client.phone || '—'}</td>
                        <td className="px-3 py-3 align-top overflow-hidden">
                          <p className="text-gray-700 truncate">{client.city || '—'}</p>
                        </td>
                        <td className="px-3 py-3 align-top whitespace-nowrap text-sm text-muted">{formatDate(client.created_at)}</td>
                        <td className="px-2 py-3 align-top">
                          <ClientRowMenu
                            client={client}
                            open={actionsOpen === client.id}
                            openUpward={index >= paginatedClients.length - 3}
                            onToggle={() => setActionsOpen(actionsOpen === client.id ? null : client.id)}
                            onEdit={() => handleEdit(client)}
                            onDelete={() => handleDelete(client)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm divide-y divide-gray-100">
                {paginatedClients.map((client, index) => (
                  <div
                    key={client.id}
                    onClick={() => router.push(`/dashboard/clientes/detalle/${client.id}`)}
                    className="flex cursor-pointer items-start gap-3 px-3 py-3 transition-colors active:bg-accent/[0.04]"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-sm font-bold text-brand">
                      {client.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate uppercase tracking-wide">{client.name}</p>
                      {client.company ? <p className="text-xs text-muted truncate">{client.company}</p> : null}
                      <p className="mt-1 text-xs text-gray-700 truncate">{client.email}</p>
                      <p className="text-[11px] text-muted">
                        {[client.phone, client.city, formatDate(client.created_at)].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <ClientRowMenu
                      client={client}
                      open={actionsOpen === client.id}
                      openUpward={index >= paginatedClients.length - 2}
                      onToggle={() => setActionsOpen(actionsOpen === client.id ? null : client.id)}
                      onEdit={() => handleEdit(client)}
                      onDelete={() => handleDelete(client)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
              <p className="text-sm text-muted">
                Mostrando {startIndex + 1} - {Math.min(endIndex, filteredClients.length)} de {filteredClients.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md hover:bg-surface-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => goToPage(pageNumber)}
                        className={`w-10 h-10 rounded-md text-sm font-medium transition-all ${
                          currentPage === pageNumber
                            ? 'bg-brand text-white'
                            : 'bg-surface-secondary text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                    return <span key={pageNumber} className="px-1 text-gray-400">...</span>;
                  }
                  return null;
                })}
                
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md hover:bg-surface-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
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

      <ClientFormModal
        open={showCreateModal}
        title={editingClient ? 'Editar cliente' : 'Nuevo cliente'}
        subtitle={editingClient ? editingClient.name.toUpperCase() : 'Completa los datos de contacto y facturación'}
        submitLabel={editingClient ? 'Guardar cambios' : 'Crear cliente'}
        values={formData}
        onChange={setFormData}
        onClose={resetForm}
        onSubmit={handleSubmit}
      />

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
