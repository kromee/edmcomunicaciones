import { config } from '@/lib/config';

export type SendQuoteEmailInput = {
  to_email: string;
  client_name: string;
  quote_number: string;
  total_amount: number;
  /** Enlace público temporal para descargar PDF (plan EmailJS sin adjuntos). */
  download_url: string;
};

const EMAILJS_SEND_URL = 'https://api.emailjs.com/api/v1.0/email/send';

function getEmailJsPrivateKey(): string {
  return process.env.EMAILJS_PRIVATE_KEY?.trim() || '';
}

/** Solo servidor — no uses NEXT_PUBLIC_ (el envío de cotización es vía API). */
export function getQuoteEmailTemplateId(): string {
  const quoteTemplate = process.env.EMAILJS_QUOTE_TEMPLATE_ID?.trim();
  if (quoteTemplate) return quoteTemplate;

  const legacyPublic = process.env.NEXT_PUBLIC_EMAILJS_QUOTE_TEMPLATE_ID?.trim();
  if (legacyPublic) return legacyPublic;

  const serverGeneral = process.env.EMAILJS_TEMPLATE_ID?.trim();
  if (serverGeneral) return serverGeneral;

  return config.emailjs.templateId?.trim() || '';
}

export function isQuoteEmailConfigured(): boolean {
  const { serviceId, publicKey } = config.emailjs;
  return Boolean(
    serviceId && publicKey && getEmailJsPrivateKey() && getQuoteEmailTemplateId()
  );
}

export async function sendQuoteEmail(
  input: SendQuoteEmailInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { serviceId, publicKey } = config.emailjs;
  const privateKey = getEmailJsPrivateKey();
  const templateId = getQuoteEmailTemplateId();

  if (!serviceId || !publicKey) {
    return { ok: false, error: 'EmailJS no está configurado (service id / public key)' };
  }

  if (!privateKey) {
    return {
      ok: false,
      error:
        'Falta EMAILJS_PRIVATE_KEY en Vercel. EmailJS → Account → API keys → Private Key (modo strict).',
    };
  }

  if (!templateId) {
    return {
      ok: false,
      error:
        'Falta plantilla de cotización. Define EMAILJS_QUOTE_TEMPLATE_ID en Vercel (solo servidor).',
    };
  }

  const templateParams = {
    to_email: input.to_email,
    client_name: input.client_name,
    quote_number: input.quote_number,
    total_amount: `$${input.total_amount.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
    })}`,
    download_url: input.download_url,
    pdf_link: input.download_url,
  };

  try {
    const response = await fetch(EMAILJS_SEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: templateParams,
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      return {
        ok: false,
        error: text || `EmailJS respondió ${response.status}`,
      };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al enviar correo';
    return { ok: false, error: message };
  }
}
