"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SessionUser } from '@/types/session';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
}

interface DashboardHeaderProps {
  user: SessionUser;
  onLogout: () => void;
  sidebarCollapsed?: boolean;
  notifications?: Notification[];
  unreadCount?: number;
}

export function DashboardHeader({ 
  user, 
  onLogout, 
  sidebarCollapsed = false,
  notifications = [],
  unreadCount = 0
}: DashboardHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return (
          <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <header className={`
      sticky top-0 z-40
      bg-white/80 backdrop-blur-xl
      border-b border-gray-100
      transition-all duration-300
      ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
    `}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-muted-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar cotizaciones, clientes..."
                className="
                  w-full pl-12 pr-4 py-2.5
                  bg-surface-secondary
                  border border-transparent
                  rounded-xl
                  text-sm text-gray-700
                  placeholder:text-muted-light
                  focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent
                  transition-all duration-200
                "
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications */}
            <div ref={notificationsRef} className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="
                  relative p-2.5 rounded-xl
                  text-muted hover:text-gray-700
                  bg-surface-secondary hover:bg-gray-100
                  transition-all duration-200
                "
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-danger rounded-full animate-pulse">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-elevated border border-gray-100 animate-slide-up overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-brand to-brand-light">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white">Notificaciones</h3>
                      <span className="text-xs text-white/70 bg-white/20 px-2 py-0.5 rounded-full">
                        {unreadCount} nueva{unreadCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <svg className="w-12 h-12 mx-auto mb-3 text-muted-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <p className="text-sm text-muted">No hay notificaciones</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`
                            px-4 py-3 border-b border-gray-50
                            hover:bg-surface-secondary transition-colors cursor-pointer
                            ${!notification.read ? 'bg-accent/5' : ''}
                          `}
                        >
                          <div className="flex gap-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="font-medium text-sm text-gray-900 truncate">
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-1.5" />
                                )}
                              </div>
                              <p className="text-xs text-muted mt-0.5 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-[10px] text-muted-light mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="px-4 py-3 bg-surface-secondary border-t border-gray-100">
                    <Link 
                      href="/dashboard/cotizaciones"
                      className="w-full text-center text-sm font-medium text-accent hover:text-accent-dark transition-colors block"
                    >
                      Ver todas las cotizaciones
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-gray-200" />

            {/* Profile */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="
                  flex items-center gap-3 p-1.5 pr-3
                  rounded-xl
                  hover:bg-surface-secondary
                  transition-all duration-200
                "
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white font-semibold text-sm shadow-soft">
                  {getInitials(user.name)}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{user.name}</p>
                  <p className="text-xs text-muted capitalize">{user.role}</p>
                </div>
                <svg className={`hidden sm:block w-4 h-4 text-muted transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-elevated border border-gray-100 animate-slide-up overflow-hidden">
                  {/* User Info */}
                  <div className="px-4 py-4 bg-gradient-to-r from-brand to-brand-light">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-lg backdrop-blur-sm">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{user.name}</p>
                        <p className="text-sm text-white/70">{user.email}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="px-2 py-1 text-xs font-medium rounded-lg bg-white/20 text-white capitalize">
                        {user.role}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-white/70">
                        <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                        En línea
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link 
                      href="/dashboard/perfil"
                      className="flex items-center gap-3 px-4 py-2.5 w-full text-sm text-gray-700 hover:bg-surface-secondary transition-colors"
                    >
                      <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Mi Perfil
                    </Link>
                    <button className="flex items-center gap-3 px-4 py-2.5 w-full text-sm text-gray-700 hover:bg-surface-secondary transition-colors">
                      <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Configuración
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="py-2 border-t border-gray-100">
                    <button
                      onClick={onLogout}
                      className="flex items-center gap-3 px-4 py-2.5 w-full text-sm text-danger hover:bg-danger/5 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
