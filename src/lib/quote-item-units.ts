/**
 * Unidades de ítem de cotización (DB + UI + PDF).
 * Al agregar una unidad: extender el array, labels y ejecutar el SQL de migración en Supabase.
 */
export const QUOTE_ITEM_UNITS = ['PZA', 'SERV', 'MTR'] as const;

export type QuoteItemUnit = (typeof QUOTE_ITEM_UNITS)[number];

export const QUOTE_ITEM_UNIT_LABELS: Record<QuoteItemUnit, string> = {
  PZA: 'Pieza',
  SERV: 'Servicio',
  MTR: 'Metros',
};

export const QUOTE_ITEM_UNIT_OPTIONS: { value: QuoteItemUnit; label: string }[] =
  QUOTE_ITEM_UNITS.map((value) => ({ value, label: QUOTE_ITEM_UNIT_LABELS[value] }));

export function isQuoteItemUnit(value: unknown): value is QuoteItemUnit {
  return typeof value === 'string' && (QUOTE_ITEM_UNITS as readonly string[]).includes(value);
}

export function normalizeQuoteItemUnit(value: unknown): QuoteItemUnit {
  if (isQuoteItemUnit(value)) return value;
  return 'PZA';
}

/** Etiqueta para UI/PDF; si llega un valor legacy desconocido, se devuelve tal cual. */
export function getQuoteItemUnitLabel(unit: string | null | undefined): string {
  if (unit && isQuoteItemUnit(unit)) return QUOTE_ITEM_UNIT_LABELS[unit];
  return unit?.trim() || '';
}
