export function Footer() {
  return (
    <footer className="border-t py-8 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-sm text-gray-600 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} EDM Comunicaciones. Todos los derechos reservados.</p>
        <nav className="flex gap-4">
          <a className="hover:text-gray-900" href="/privacidad">Privacidad</a>
          <a className="hover:text-gray-900" href="/terminos">Términos</a>
          <a className="hover:text-gray-900" href="/cookies">Cookies</a>
        </nav>
      </div>
    </footer>
  );
}


