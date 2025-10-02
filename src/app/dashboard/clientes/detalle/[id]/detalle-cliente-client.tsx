"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SessionUser } from '@/lib/session';
import { Modal } from '@/components/Modal';
import { useModal } from '@/hooks/useModal';

// Componente para mostrar fechas solo en el cliente
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

export default function DetalleClienteClient({ client, user }: { client: Client; user: SessionUser }) {
  const router = useRouter();
  const { modal, hideModal, showConfirm, showSuccess, showError } = useModal();
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
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

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/clients/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: client.id, ...formData }),
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('Cliente Actualizado', 'El cliente se ha actualizado exitosamente');
        setShowEditModal(false);
        router.refresh();
      } else {
        showError('Error', data.error || 'Error al actualizar el cliente');
      }
    } catch (error) {
      console.error('Error updating client:', error);
      showError('Error', 'Error al actualizar el cliente');
    }
  };

  const handleDelete = () => {
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
            setTimeout(() => {
              router.push('/dashboard/clientes');
              router.refresh();
            }, 1500);
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
      <span className={`px-4 py-2 text-sm font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="EDM" className="h-8 w-auto" />
              <span className="hidden sm:inline text-sm text-gray-500">Comunicaciones</span>
          
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <a
                href="/dashboard/clientes"
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-100 transition"
              >
                ← Volver
              </a>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Información Principal */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-8 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{client.name}</h2>
                {client.company && (
                  <p className="text-sky-100 text-lg">{client.company}</p>
                )}
              </div>
              <div>
                {getStatusBadge(client.status)}
              </div>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información de Contacto */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  Información de Contacto
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <a href={`mailto:${client.email}`} className="text-blue-600 hover:text-blue-700 hover:underline">
                        {client.email}
                      </a>
                    </dd>
                  </div>
                  {client.phone && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <a href={`tel:${client.phone}`} className="text-blue-600 hover:text-blue-700 hover:underline">
                          {client.phone}
                        </a>
                      </dd>
                    </div>
                  )}
                  {client.tax_id && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">RFC</dt>
                      <dd className="mt-1 text-sm text-gray-900 font-mono">{client.tax_id}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Dirección */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Dirección
                </h3>
                <dl className="space-y-3">
                  {client.address && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Calle</dt>
                      <dd className="mt-1 text-sm text-gray-900">{client.address}</dd>
                    </div>
                  )}
                  {client.city && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Ciudad</dt>
                      <dd className="mt-1 text-sm text-gray-900">{client.city}</dd>
                    </div>
                  )}
                  {client.state && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Estado</dt>
                      <dd className="mt-1 text-sm text-gray-900">{client.state}</dd>
                    </div>
                  )}
                  {client.postal_code && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Código Postal</dt>
                      <dd className="mt-1 text-sm text-gray-900">{client.postal_code}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-gray-500">País</dt>
                    <dd className="mt-1 text-sm text-gray-900">{client.country}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Notas */}
            {client.notes && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Notas
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{client.notes}</p>
                </div>
              </div>
            )}

            {/* Información del Sistema */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Información del Sistema
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Fecha de Creación</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <ClientDate dateString={client.created_at} />
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Última Actualización</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <ClientDate dateString={client.updated_at} />
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Acciones</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            <a
              href={`mailto:${client.email}`}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:from-sky-600 hover:to-blue-700 transition shadow-sm hover:shadow-md"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <span className="hidden sm:inline">Email</span>
              <span className="sm:hidden">✉️</span>
            </a>

            {client.phone && (
              <a
                href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition shadow-sm hover:shadow-md"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span className="hidden sm:inline">WhatsApp</span>
                <span className="sm:hidden">💬</span>
              </a>
            )}

            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-700 transition"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              <span className="hidden sm:inline">Editar</span>
              <span className="sm:hidden">✏️</span>
            </button>

            <button
              onClick={handleDelete}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-red-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-red-700 transition"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              <span className="hidden sm:inline">Eliminar</span>
              <span className="sm:hidden">🗑️</span>
            </button>
          </div>
        </div>
      </main>

      {/* Modal para editar cliente */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Editar Cliente
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
                  Actualizar Cliente
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
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

