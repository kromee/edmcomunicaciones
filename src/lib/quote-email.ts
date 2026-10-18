import emailjs from '@emailjs/browser';
import { config } from '@/lib/config';

export type SendQuoteEmailInput = {
  to_email: string;
  client_name: string;
  quote_number: string;
  total_amount: number;
  pdfBase64: string;
};

export function isQuoteEmailConfigured(): boolean {
  const { serviceId, publicKey } = config.emailjs;
  return Boolean(serviceId && publicKey);
}

export async function sendQuoteEmail(
  input: SendQuoteEmailInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isQuoteEmailConfigured()) {
    return { ok: false, error: 'EmailJS no está configurado' };
  }

  const { serviceId, publicKey } = config.emailjs;
  const templateId =
    process.env.NEXT_PUBLIC_EMAILJS_QUOTE_TEMPLATE_ID || 'template_cotizacion';

  try {
    await emailjs.send(
      serviceId,
      templateId,
      {
        to_email: input.to_email,
        client_name: input.client_name,
        quote_number: input.quote_number,
        total_amount: `$${input.total_amount.toLocaleString('es-MX', {
          minimumFractionDigits: 2,
        })}`,
        pdf_attachment: input.pdfBase64,
      },
      publicKey
    );
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al enviar correo';
    return { ok: false, error: message };
  }
}
