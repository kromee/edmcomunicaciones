import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EDM Comunicaciones | Telecomunicaciones, CCTV, Cableado, Biométricos',
  description: 'Soluciones en telecomunicaciones: cableado de red, CCTV, cámaras de vigilancia, configuración y biométricos. Instalación profesional y soporte.',
  metadataBase: new URL('https://www.ejemplo-edm.com'),
  openGraph: {
    title: 'EDM Comunicaciones',
    description: 'Telecomunicaciones, CCTV, cableado estructurado y biométricos.',
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


