import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Telecomunicaciones de alto desempeño</h1>
                <p className="mt-4 text-lg text-gray-600">Cableado estructurado, CCTV, biométricos y configuración profesional para tu empresa.</p>
                <div className="mt-8 flex gap-4">
                  <a href="/contacto" className="rounded-md bg-brand px-6 py-3 text-white hover:bg-brand-dark">Solicitar cotización</a>
                  <a href="/servicios" className="rounded-md border px-6 py-3 hover:bg-gray-50">Ver servicios</a>
                </div>
              </div>
              <div className="aspect-video rounded-xl bg-gradient-to-br from-cyan-200 to-blue-200" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}


