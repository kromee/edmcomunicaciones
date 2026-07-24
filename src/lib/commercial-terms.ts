/** Condiciones comerciales por defecto (editables en cotizador/edición). */
export const DEFAULT_COMMERCIAL_TERMS = [
  'Validez de 30 días',
  'Pesos mexicanos (MXN), sin IVA',
  '50% anticipo, 50% al finalizar',
] as const;

/** Convierte líneas del formulario a texto para BD/PDF (con viñeta). */
export function commercialTermsToString(terms: string[]): string {
  return terms
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => (t.startsWith('•') ? t : `• ${t}`))
    .join('\n');
}

/** Parsea texto guardado a lista editable (sin viñetas). Si vacío, usa defaults. */
export function commercialTermsFromString(
  value: string | null | undefined,
  options?: { fallbackToDefaults?: boolean }
): string[] {
  const fallbackToDefaults = options?.fallbackToDefaults !== false;
  if (!value?.trim()) {
    return fallbackToDefaults ? [...DEFAULT_COMMERCIAL_TERMS] : [''];
  }

  const parsed = value
    .split('\n')
    .map((line) => line.replace(/^[•\-\*]\s*/, '').trim())
    .filter(Boolean);

  if (parsed.length === 0) {
    return fallbackToDefaults ? [...DEFAULT_COMMERCIAL_TERMS] : [''];
  }

  return parsed;
}
