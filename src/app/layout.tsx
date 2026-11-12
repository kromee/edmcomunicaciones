import type { Metadata } from 'next';
import './globals.css';
import { getPublicSiteUrl } from '@/lib/site-url';
import { config } from '@/lib/config';

export const metadata: Metadata = {
  title: 'EDM Comunicaciones | CCTV, redes y software a medida',
  description: 'Instalación de CCTV, redes y cableado en CDMX, Estado de México, Puebla y Veracruz. Desarrollo de software a medida para comercios y empresas.',
  metadataBase: new URL(getPublicSiteUrl()),
  alternates: {
    canonical: './',
  },
  verification: {
    google: 'IQBiT92H1rgtMIMtmhPIlkq7rB9plpPUWAZjpJTlcGo',
  },
  openGraph: {
    title: 'EDM Comunicaciones',
    description: 'CCTV, redes y cableado, y desarrollo de software a medida.',
    siteName: 'EDM Comunicaciones',
    type: 'website'
  }
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${getPublicSiteUrl()}/#organization`,
      name: config.company.name,
      url: getPublicSiteUrl(),
      email: config.contact.email,
      telephone: config.contact.phone,
      areaServed: ['Ciudad de México', 'Estado de México', 'Puebla', 'Veracruz'],
      knowsAbout: ['CCTV', 'redes y cableado estructurado', 'desarrollo de software a medida']
    },
    {
      '@type': 'WebSite',
      '@id': `${getPublicSiteUrl()}/#website`,
      name: config.company.name,
      url: getPublicSiteUrl(),
      publisher: { '@id': `${getPublicSiteUrl()}/#organization` },
      inLanguage: 'es-MX'
    }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        {children}
      </body>
    </html>
  );
}


