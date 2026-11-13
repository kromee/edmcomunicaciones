import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog de tecnología e infraestructura | EDM Comunicaciones',
  description: 'Artículos y novedades sobre CCTV, redes, cableado estructurado y desarrollo de software a medida.',
  alternates: { canonical: '/blog' },
  openGraph: { title: 'Blog de tecnología | EDM Comunicaciones', description: 'Consejos y novedades sobre tecnología para negocios y empresas.', type: 'website' },
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold">Blog</h1>
        <p className="mt-2 text-gray-600">Artículos y novedades de telecomunicaciones.</p>
      </main>
      <Footer />
    </>
  );
}


