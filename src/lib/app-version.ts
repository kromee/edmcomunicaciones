/** Versión fijada en build (next.config → NEXT_PUBLIC_APP_VERSION). */
export const APP_VERSION =
  process.env.NEXT_PUBLIC_APP_VERSION?.trim() || '0.0.0';
