"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SessionUser } from '@/lib/session';
import { Modal } from '@/components/Modal';
import { useModal } from '@/hooks/useModal';

const ITEMS_PER_PAGE = 10;

// Componente para mostrar fechas solo en el cliente (evita problemas de hidratación por zona horaria)
function ClientDate({ dateString }: { dateString: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span>Cargando...</span>;
  }

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.toLocaleString('es-MX', { month: 'long' });
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return <span>{day} de {month} de {year}, {hours}:{minutes}</span>;
}

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

export default function ClientesSimple({ clients, user }: { clients: Client[]; user: SessionUser }) {
  const router = useRouter();
  const { modal, hideModal, showConfirm, showSuccess, showError } = useModal();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'prospect'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
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

  // Calcular clientes filtrados directamente (sin estado para evitar hidratación)
  const filteredClients = (() => {
    let filtered = clients;
    
    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term) ||
        (client.phone && client.phone.includes(term)) ||
        (client.company && client.company.toLowerCase().includes(term)) ||
        (client.city && client.city.toLowerCase().includes(term)) ||
        (client.state && client.state.toLowerCase().includes(term)) ||
        (client.tax_id && client.tax_id.toLowerCase().includes(term)) ||
        (client.notes && client.notes.toLowerCase().includes(term))
      );
    }
    
    return filtered;
  })();

  // Resetear a página 1 cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Calcular paginación
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
  };

  const handleDelete = (client: Client) => {
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Activo' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inactivo' },
      prospect: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Prospecto' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;

    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const activeClientsCount = clients.filter(c => c.status === 'active').length;
  const prospectClientsCount = clients.filter(c => c.status === 'prospect').length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header con botón de nuevo cliente */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Clientes</h2>
            <p className="text-lg text-gray-600">Total: {clients.length} cliente{clients.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-lg hover:from-sky-600 hover:to-blue-700 transition shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Nuevo Cliente
          </button>
        </div>

        {/* Estadísticas */}
        {/* <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600">Total Clientes</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{clients.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600">Activos</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{activeClientsCount}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600">Prospectos</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{prospectClientsCount}</p>
          </div>
        </div>*/}

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar clientes
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
                  placeholder="Buscar por nombre, email, empresa, ciudad..."
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
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
                <option value="prospect">Prospectos</option>
              </select>
            </div>
          
          </div>
        </div>

        {/* Lista de clientes */}
        {filteredClients.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            {searchTerm || statusFilter !== 'all' ? (
              <>
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron resultados</h3>
                <p className="text-gray-600 mb-6">
                  No hay clientes que coincidan con los filtros aplicados. Intenta con otros términos de búsqueda.
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay clientes</h3>
                <p className="text-gray-600">Agrega tu primer cliente para comenzar</p>
              </>
            )}
          </div>
        ) : (
          <>
          <div className="space-y-4">
            {paginatedClients.map((client, index) => (
              <div key={client.id} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {/* Nombre */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Nombre</p>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900">{client.name}</h3>
                    </div>
                    
                    {/* Email */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
                      <p className="text-sm text-gray-900 truncate">{client.email}</p>
                    </div>
                    
                    {/* Empresa */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Empresa</p>
                      <p className="text-sm text-gray-900">{client.company || 'Sin empresa'}</p>
                    </div>
                    
                    {/* Estado */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Estado</p>
                      <div className="mt-1">
                        {getStatusBadge(client.status)}
                      </div>
                    </div>
                    
                    {/* RFC */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">RFC</p>
                      <p className="text-sm text-gray-900 font-mono">{client.tax_id || 'Sin RFC'}</p>
                    </div>
                  </div>
                  
                  {/* Botones de acción */}
                  <div className="flex flex-row lg:flex-col gap-2 lg:w-auto">
                    <a
                      href={`/cotizador?clientId=${client.id}`}
                      className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-sky-600 hover:to-blue-700 transition shadow-sm hover:shadow-md"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <span className="hidden sm:inline">Cotizar</span>
                    </a>
                    
                    <button
                      onClick={() => handleEdit(client)}
                      className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      <span className="hidden sm:inline">Editar</span>
                    </button>
                    
                    <a
                      href={`/dashboard/clientes/detalle/${client.id}`}
                      className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      <span className="hidden sm:inline">Detalles</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-sm text-gray-600">
                Mostrando {startIndex + 1} - {Math.min(endIndex, filteredClients.length)} de {filteredClients.length} clientes
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>

                {/* Páginas */}
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Mostrar solo algunas páginas alrededor de la actual
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => goToPage(pageNumber)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                            currentPage === pageNumber
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return <span key={pageNumber} className="px-2 text-gray-400">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          )}
          </>
        )}
      </main>
      
      {/* Modal para crear/editar cliente */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Empresa
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    País
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RFC
                  </label>
                  <input
                    type="text"
                    value={formData.tax_id}
                    onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="prospect">Prospecto</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  {editingClient ? 'Actualizar' : 'Crear'} Cliente
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
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
