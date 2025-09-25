import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function ServiciosPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold">Servicios</h1>
        <p className="mt-2 text-gray-600">Cableado estructurado, CCTV, biométricos y más.</p>
      </main>
      <Footer />
    </>
  );
}


