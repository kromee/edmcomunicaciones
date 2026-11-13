import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto y cotizaciones | EDM Comunicaciones',
  description: 'Contacta a EDM Comunicaciones para solicitar información o una cotización de CCTV, redes, cableado o software a medida.',
  alternates: { canonical: '/contacto' },
  openGraph: { title: 'Contacto y cotizaciones | EDM Comunicaciones', description: 'Solicita información sobre los servicios de EDM Comunicaciones.', type: 'website' },
};

export default function ContactoLayout({ children }: { children: React.ReactNode }) { return children; }
