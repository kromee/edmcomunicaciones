import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function ProyectosPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold">Proyectos</h1>
        <p className="mt-2 text-gray-600">Casos de éxito y resultados medibles.</p>
      </main>
      <Footer />
    </>
  );
}


