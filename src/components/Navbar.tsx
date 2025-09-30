"use client";
import Link from 'next/link';
import { useState } from 'react';

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="EDM" className="h-8 w-auto" />
          <span className="text-xs sm:text-sm text-gray-500">Comunicaciones</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/servicios" className="hover:text-brand">Servicios</Link>
          <Link href="/proyectos" className="hover:text-brand">Proyectos</Link>
          <Link href="/nosotros" className="hover:text-brand">Nosotros</Link>
          <Link href="/galeria" className="hover:text-brand">Galería</Link>
          <Link href="/contacto" className="hover:text-brand">Contacto</Link>
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
            <Link href="/servicios" onClick={() => setOpen(false)} className="hover:text-brand">Servicios</Link>
            <Link href="/proyectos" onClick={() => setOpen(false)} className="hover:text-brand">Proyectos</Link>
            <Link href="/nosotros" onClick={() => setOpen(false)} className="hover:text-brand">Nosotros</Link>
            <Link href="/galeria" onClick={() => setOpen(false)} className="hover:text-brand">Galería</Link>
            <Link href="/contacto" onClick={() => setOpen(false)} className="hover:text-brand">Contacto</Link>
            <Link href="/login" onClick={() => setOpen(false)} className="rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-white shadow-md transition hover:shadow-lg hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 active:scale-95 w-fit">Ingresar</Link>
          </nav>
        </div>
      )}
    </header>
  );
}


