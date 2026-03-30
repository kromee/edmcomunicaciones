"use client";
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/servicios', label: 'Servicios' },
  { href: '/proyectos', label: 'Proyectos' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/galeria', label: 'Galería' },
  { href: '/contacto', label: 'Contacto' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="EDM" className="h-8 w-auto" />
          <span className="text-xs sm:text-sm text-gray-500">Comunicaciones</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map(link => (
            <Link 
              key={link.href} 
              href={link.href as any} 
              className={`relative py-1 transition-colors ${
                isActive(link.href) 
                  ? 'text-brand font-semibold' 
                  : 'text-gray-600 hover:text-brand'
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-accent rounded-full" />
              )}
            </Link>
          ))}
          <Link href="/login" className="rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-white shadow-md transition hover:shadow-lg hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 active:scale-95">Ingresar</Link>
        </nav>
        <button aria-label="Abrir menú" className="md:hidden inline-flex items-center justify-center rounded-md border px-3 py-2" onClick={() => setOpen((v) => !v)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {open ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t bg-white/95 backdrop-blur">
          <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 grid gap-4 text-sm">
            {navLinks.map(link => (
              <Link 
                key={link.href} 
                href={link.href as any} 
                onClick={() => setOpen(false)} 
                className={`py-1 ${isActive(link.href) ? 'text-brand font-semibold' : 'text-gray-600 hover:text-brand'}`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setOpen(false)} className="rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-white shadow-md transition hover:shadow-lg hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 active:scale-95 w-fit">Ingresar</Link>
          </nav>
        </div>
      )}
    </header>
  );
}


