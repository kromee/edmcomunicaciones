import type { MetadataRoute } from 'next';
import { getPublicSiteUrl } from '@/lib/site-url';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getPublicSiteUrl();
  return [
    '',
    '/servicios',
    '/proyectos',
    '/blog',
    '/nosotros',
    '/galeria',
    '/contacto'
  ].map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date() }));
}


