import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre EDM Comunicaciones | Tecnología que sí cumple',
  description: 'Conoce la experiencia, principios y forma de trabajo de EDM Comunicaciones en CCTV, redes, cableado y software a medida.',
  alternates: { canonical: '/nosotros' },
  openGraph: { title: 'Sobre EDM Comunicaciones', description: 'Experiencia y forma de trabajo de EDM Comunicaciones.', type: 'website' },
};

export default function NosotrosLayout({ children }: { children: React.ReactNode }) { return children; }
