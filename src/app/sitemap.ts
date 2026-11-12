import type { MetadataRoute } from 'next';
import { getPublicSiteUrl } from '@/lib/site-url';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getPublicSiteUrl();
  return [
    '',
    '/servicios',
    '/servicios/cctv',
    '/servicios/redes-y-cableado',
    '/servicios/desarrollo-software-a-medida',
    '/proyectos',
    '/blog',
    '/nosotros',
    '/galeria',
    '/contacto'
  ].map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date() }));
}


