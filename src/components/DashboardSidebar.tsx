"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

type NavHref = '/dashboard' | '/dashboard/cotizaciones' | '/dashboard/clientes' | '/dashboard/contactos' | '/cotizador';

interface NavItem {
  label: string;
  href: NavHref;
  icon: React.ReactNode;
}

interface SidebarProps {
  badges?: {
    cotizaciones?: number;
    contactos?: number;
  };
}

const getNavItems = (badges?: SidebarProps['badges']): NavItem[] => [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Cotizaciones',
    href: '/dashboard/cotizaciones',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: 'Clientes',
    href: '/dashboard/clientes',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: 'Contactos',
    href: '/dashboard/contactos',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const secondaryNavItems: NavItem[] = [
  {
    label: 'Nueva Cotización',
    href: '/cotizador',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
  },
];

export function Sidebar({ badges }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = getNavItems(badges);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const NavLink = ({ item, badge }: { item: NavItem; badge?: number }) => {
    const active = isActive(item.href);
    return (
      <Link
        href={item.href}
        className={`
          group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
          transition-all duration-200 ease-out
          ${active 
            ? 'bg-white text-brand shadow-soft' 
            : 'text-white/70 hover:text-white hover:bg-white/10'
          }
        `}
      >
        <span className={`${active ? 'text-accent' : 'text-white/60 group-hover:text-white'} transition-colors`}>
          {item.icon}
        </span>
        <span className={`font-medium text-sm ${isCollapsed ? 'hidden' : 'block'}`}>
          {item.label}
        </span>
        {badge !== undefined && badge > 0 && (
          <span className={`
            ${isCollapsed ? 'absolute -top-1 -right-1' : 'ml-auto'}
            flex items-center justify-center min-w-[20px] h-5 px-1.5
            text-xs font-semibold rounded-full
            ${active ? 'bg-accent text-white' : 'bg-white/20 text-white'}
          `}>
            {badge > 99 ? '99+' : badge}
          </span>
        )}
        {active && !isCollapsed && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-r-full" />
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-50 w-14 h-14 bg-brand rounded-full shadow-elevated flex items-center justify-center text-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-50
        flex flex-col
        bg-gradient-to-b from-[#0f1e48] to-[#0a1628]
        transition-all duration-300 ease-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        shadow-sidebar
      `}>
        {/* Logo Area */}
        <div className={`
          flex items-center gap-3 px-5 py-6 border-b border-white/10
          ${isCollapsed ? 'justify-center px-2' : ''}
        `}>
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="EDM Comunicaciones"
              fill
              className="object-contain"
            />
          </div>
          {!isCollapsed && (
            <div className="animate-fade-in">
              <h1 className="text-white font-bold text-lg leading-tight">EDM</h1>
              <p className="text-white/50 text-xs">Comunicaciones</p>
            </div>
          )}
        </div>

        {/* Collapse Button - Desktop Only */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white rounded-full shadow-soft items-center justify-center text-gray-400 hover:text-brand transition-colors"
        >
          <svg className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
                Menú Principal
              </p>
            )}
            {navItems.map((item) => {
              let badge: number | undefined;
              if (item.href === '/dashboard/cotizaciones' && badges?.cotizaciones) {
                badge = badges.cotizaciones;
              } else if (item.href === '/dashboard/contactos' && badges?.contactos) {
                badge = badges.contactos;
              }
              return <NavLink key={item.href} item={item} badge={badge} />;
            })}
          </div>

          {/* Quick Actions */}
          <div className="pt-4 mt-4 border-t border-white/10">
            {!isCollapsed && (
              <p className="px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
                Acciones Rápidas
              </p>
            )}
            {secondaryNavItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </nav>

        {/* Footer - Desktop Only */}
        <div className={`hidden lg:block px-3 py-4 border-t border-white/10 ${isCollapsed ? 'text-center' : ''}`}>
          {!isCollapsed ? (
            <div className="flex items-center gap-3 px-3 py-2 text-white/50 text-xs">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Sistema Cotizador v1.0</span>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-success rounded-full" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
