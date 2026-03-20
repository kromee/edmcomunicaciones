/** Valores de `quotes.status` en BD (inglés) */
export type QuoteStatusDb =
  | 'pending'
  | 'sent'
  | 'approved'
  | 'rejected'
  | 'paid';

/** Valores antiguos del formulario en español → normalizar al guardar/leer */
const LEGACY_STATUS_MAP: Record<string, QuoteStatusDb> = {
  borrador: 'pending',
  enviada: 'sent',
  autorizada: 'approved',
  rechazada: 'rejected',
};

export function normalizeQuoteStatus(status: string): QuoteStatusDb {
  const mapped = LEGACY_STATUS_MAP[status];
  if (mapped) return mapped;
  if (
    status === 'pending' ||
    status === 'sent' ||
    status === 'approved' ||
    status === 'rejected' ||
    status === 'paid'
  ) {
    return status;
  }
  return 'pending';
}

const BADGE: Record<
  QuoteStatusDb,
  { bg: string; text: string; label: string }
> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' },
  sent: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Enviada' },
  approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Aprobada' },
  rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rechazada' },
  paid: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Pagado' },
};

export function quoteStatusBadgeClasses(status: string) {
  const key = normalizeQuoteStatus(status);
  return BADGE[key];
}
