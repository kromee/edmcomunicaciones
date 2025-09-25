import Link from 'next/link';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">EDM Comunicaciones</Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/servicios" className="hover:text-brand">Servicios</Link>
          <Link href="/proyectos" className="hover:text-brand">Proyectos</Link>
          <Link href="/blog" className="hover:text-brand">Blog</Link>
          <Link href="/nosotros" className="hover:text-brand">Nosotros</Link>
          <Link href="/galeria" className="hover:text-brand">Galería</Link>
          <Link href="/contacto" className="hover:text-brand">Contacto</Link>
          <Link href="/login" className="rounded-md bg-brand px-3 py-1.5 text-white hover:bg-brand-dark">Ingresar</Link>
        </nav>
      </div>
    </header>
  );
}


