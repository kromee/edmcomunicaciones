export function Footer() {
  return (
    <footer className="border-t py-8 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-sm text-gray-600 grid gap-4 sm:flex sm:flex-row sm:items-center sm:justify-between">
        <p className="text-center sm:text-left">© {new Date().getFullYear()} EDM Comunicaciones. Todos los derechos reservados.</p>
        <nav className="flex justify-center sm:justify-end gap-4">
          <a className="hover:text-gray-900" href="/privacidad">Privacidad</a>
          <a className="hover:text-gray-900" href="/terminos">Términos</a>
          <a className="hover:text-gray-900" href="/cookies">Cookies</a>
        </nav>
      </div>
    </footer>
  );
}


