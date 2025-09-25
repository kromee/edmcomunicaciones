import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function NosotrosPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold">Nosotros</h1>
        <p className="mt-2 text-gray-600">Equipo certificado y enfoque en calidad.</p>
      </main>
      <Footer />
    </>
  );
}


