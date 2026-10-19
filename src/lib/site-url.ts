/**
 * URL pública del sitio (correos con enlace PDF, sitemap, Open Graph).
 * Solo servidor: define SITE_URL en Vercel (dominio principal, sin / final).
 */
export function getPublicSiteUrl(): string {
  const explicit =
    process.env.SITE_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, '');
  }
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) {
    return `https://${production.replace(/\/$/, '')}`;
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return `https://${vercel.replace(/\/$/, '')}`;
  }
  return 'http://localhost:3000';
}

export function buildQuotePublicDownloadUrl(quoteId: string, token: string): string {
  const base = getPublicSiteUrl();
  const params = new URLSearchParams({ token });
  return `${base}/api/quotes/public-download?${params.toString()}`;
}
