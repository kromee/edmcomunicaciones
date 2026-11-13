import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Galería de proyectos de CCTV, redes y software | EDM Comunicaciones',
  description: 'Explora ejemplos de instalaciones CCTV, cableado estructurado, redes y sistemas de software realizados por EDM Comunicaciones.',
  alternates: { canonical: '/galeria' },
  openGraph: { title: 'Galería de proyectos | EDM Comunicaciones', description: 'Ejemplos de infraestructura tecnológica y software a medida.', type: 'website' },
};

export default function GaleriaLayout({ children }: { children: React.ReactNode }) { return children; }
