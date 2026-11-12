'use client';

import { useEffect } from 'react';

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

export function AnalyticsEvents() {
  useEffect(() => {
    const trackContactClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>('a[href]');
      if (!link || !window.gtag) return;

      const href = link.href;
      if (href.startsWith('https://wa.me/')) {
        window.gtag('event', 'whatsapp_click', { link_url: href });
      } else if (link.protocol === 'tel:') {
        window.gtag('event', 'phone_click', { link_url: href });
      } else if (link.protocol === 'mailto:') {
        window.gtag('event', 'email_click', { link_url: href });
      }
    };

    document.addEventListener('click', trackContactClick);
    return () => document.removeEventListener('click', trackContactClick);
  }, []);

  return null;
}
