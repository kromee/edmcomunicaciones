/** Fecha local YYYY-MM-DD (sin desfase por zona horaria). */
export function getTodayDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Convierte ISO de BD a valor para `<input type="date">`. */
export function isoToDateInput(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Convierte YYYY-MM-DD a ISO para guardar en `created_at` (mediodía UTC). */
export function dateInputToISO(dateStr: string): string {
  return `${dateStr}T12:00:00.000Z`;
}

/** Válida hasta: hoy + 30 días. */
export function getDefaultValidUntil(): string {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + 30);
  return isoToDateInput(futureDate.toISOString());
}
