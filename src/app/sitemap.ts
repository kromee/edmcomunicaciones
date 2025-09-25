import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.ejemplo-edm.com';
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


