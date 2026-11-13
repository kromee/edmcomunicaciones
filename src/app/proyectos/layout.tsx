import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Proyectos de tecnología e infraestructura | EDM Comunicaciones',
  description: 'Conoce proyectos de CCTV, redes, cableado y software a medida desarrollados por EDM Comunicaciones para negocios y empresas.',
  alternates: { canonical: '/proyectos' },
  openGraph: { title: 'Proyectos de tecnología e infraestructura | EDM Comunicaciones', description: 'Casos de CCTV, redes y software a medida realizados por EDM Comunicaciones.', type: 'website' },
};

export default function ProyectosLayout({ children }: { children: React.ReactNode }) { return children; }
