const SERVICE_KEYWORDS: { value: string; patterns: RegExp[] }[] = [
  { value: 'cctv', patterns: [/cctv/i, /videovigil/i, /c[aá]mara/i] },
  { value: 'cableado', patterns: [/cableado/i, /estructurado/i, /red/i] },
  { value: 'mantenimiento', patterns: [/mantenimiento/i, /soporte/i] },
  { value: 'instalacion', patterns: [/instalaci/i, /venta/i] },
  { value: 'software', patterns: [/software/i, /desarrollo/i, /app/i, /web/i] },
  { value: 'consultoria', patterns: [/consultor/i, /asesor/i] },
  { value: 'mixto', patterns: [/integral/i, /proyecto/i] },
];

export function inferServiceTypeFromContact(service: string | null | undefined): string {
  if (!service?.trim()) return 'otro';
  const text = service.trim();
  for (const entry of SERVICE_KEYWORDS) {
    if (entry.patterns.some((p) => p.test(text))) return entry.value;
  }
  return 'otro';
}

export function contactLeadDescription(message: string, service: string | null | undefined): string {
  const base =
    'A continuación presento la propuesta económica solicitada por concepto de ';
  const servicePart = service?.trim() ? service.trim() : 'servicios solicitados';
  const messagePart = message?.trim()
    ? `\n\nReferencia del contacto: ${message.trim().slice(0, 400)}`
    : '';
  return `${base}${servicePart}.${messagePart}`;
}
