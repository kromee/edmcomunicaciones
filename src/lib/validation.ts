export type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export function validateContactForm(data: ContactFormData): { valid: boolean; errors: Partial<Record<keyof ContactFormData, string>> } {
  const errors: Partial<Record<keyof ContactFormData, string>> = {};
  if (!data.name || data.name.trim().length < 2) errors.name = 'Ingresa tu nombre';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Email inválido';
  if (!data.message || data.message.trim().length < 10) errors.message = 'Cuéntanos más (mín. 10 caracteres)';
  return { valid: Object.keys(errors).length === 0, errors };
}


