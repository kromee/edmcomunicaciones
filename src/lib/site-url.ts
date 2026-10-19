/** URL pública del sitio (emails, enlaces de descarga). */
export function getPublicSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, '');
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
