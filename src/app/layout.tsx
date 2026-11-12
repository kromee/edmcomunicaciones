import type { Metadata } from 'next';
import './globals.css';
import { getPublicSiteUrl } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'EDM Comunicaciones | CCTV, redes y software a medida',
  description: 'Instalación de CCTV, redes y cableado en CDMX, Estado de México, Puebla y Veracruz. Desarrollo de software a medida para comercios y empresas.',
  metadataBase: new URL(getPublicSiteUrl()),
  openGraph: {
    title: 'EDM Comunicaciones',
    description: 'CCTV, redes y cableado, y desarrollo de software a medida.',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}


