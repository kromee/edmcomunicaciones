"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/DashboardSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useModal } from '@/hooks/useModal';
import { Modal } from '@/components/Modal';

type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'viewer';
  created_at: string;
};

export default function ProfileClient({ user }: { user: User }) {
  const router = useRouter();
  const { modal, hideModal, showSuccess, showError } = useModal();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const validatePasswords = () => {
    const newErrors: Record<string, string> = {};

    if (!passwords.current) {
      newErrors.current = 'La contraseña actual es requerida';
    }

    if (!passwords.new) {
      newErrors.new = 'La nueva contraseña es requerida';
    } else if (passwords.new.length < 6) {
      newErrors.new = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!passwords.confirm) {
      newErrors.confirm = 'Confirma la nueva contraseña';
    } else if (passwords.new !== passwords.confirm) {
      newErrors.confirm = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswords()) return;

    setIsChangingPassword(true);
    try {
      const response = await fetch('/api/profile/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new
        }),
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('Contraseña actualizada', 'Tu contraseña ha sido cambiada exitosamente');
        setShowPasswordForm(false);
        setPasswords({ current: '', new: '', confirm: '' });
        setErrors({});
      } else {
        showError('Error', data.error || 'No se pudo cambiar la contraseña');
      }
    } catch {
      showError('Error', 'No se pudo cambiar la contraseña');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-secondary">
      <Sidebar />
      <DashboardHeader user={user} onLogout={handleLogout} sidebarCollapsed={sidebarCollapsed} />

      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-3xl mx-auto">
          {/* Page Header */}
          <div className="flex items-start gap-4 mb-8">
            <a 
              href="/dashboard" 
              className="p-2.5 rounded-xl hover:bg-white/50 transition-colors mt-1"
            >
              <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </a>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mi Perfil</h1>
              <p className="text-muted">Gestiona tu información y seguridad</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Profile Info Card */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-brand to-brand-light">
                <h2 className="font-semibold text-white">Información del Perfil</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white font-bold text-3xl shadow-soft">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                    <p className="text-muted">{user.email}</p>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-2 ${
                      user.role === 'admin' 
                        ? 'bg-accent/10 text-accent-dark' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.role === 'admin' ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                      {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-surface-secondary rounded-xl">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                      <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-light uppercase tracking-wide">Correo electrónico</p>
                      <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-surface-secondary rounded-xl">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                      <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-light uppercase tracking-wide">Fecha de registro</p>
                      <p className="font-medium text-gray-900">{formatDate(user.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Card */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Seguridad
                </h2>
              </div>
              <div className="p-6">
                {!showPasswordForm ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Contraseña</h3>
                      <p className="text-sm text-muted">Cambia tu contraseña regularmente</p>
                    </div>
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className="btn-accent"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      Cambiar contraseña
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Contraseña actual
                      </label>
                      <input
                        type="password"
                        value={passwords.current}
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                        className={`input ${errors.current ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}`}
                        placeholder="••••••••"
                      />
                      {errors.current && (
                        <p className="mt-1 text-xs text-danger">{errors.current}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nueva contraseña
                      </label>
                      <input
                        type="password"
                        value={passwords.new}
                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                        className={`input ${errors.new ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}`}
                        placeholder="Mínimo 6 caracteres"
                      />
                      {errors.new && (
                        <p className="mt-1 text-xs text-danger">{errors.new}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Confirmar nueva contraseña
                      </label>
                      <input
                        type="password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                        className={`input ${errors.confirm ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}`}
                        placeholder="••••••••"
                      />
                      {errors.confirm && (
                        <p className="mt-1 text-xs text-danger">{errors.confirm}</p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswords({ current: '', new: '', confirm: '' });
                          setErrors({});
                        }}
                        className="btn-secondary"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="btn-accent flex-1"
                      >
                        {isChangingPassword ? 'Guardando...' : 'Guardar contraseña'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-danger/20">
              <div className="px-6 py-4 border-b border-gray-100 bg-danger/5">
                <h2 className="font-semibold text-danger flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Zona de Peligro
                </h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Cerrar sesión</h3>
                    <p className="text-sm text-muted">Salir de tu cuenta en este dispositivo</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 px-4 py-2 text-danger border border-danger/30 text-sm font-medium rounded-xl hover:bg-danger/5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
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
