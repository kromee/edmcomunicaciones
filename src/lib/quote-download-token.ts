import { createHmac, timingSafeEqual } from 'crypto';

const TTL_SEC = 60 * 60 * 24 * 14;

function getSecret(): string {
  const secret = process.env.SESSION_SECRET?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET required for download links');
  }
  return 'dev-insecure-session-secret-set-SESSION_SECRET';
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

/** Token firmado para descargar PDF sin login (válido 14 días). */
export function createQuoteDownloadToken(quoteId: string): string {
  const exp = Math.floor(Date.now() / 1000) + TTL_SEC;
  const payload = `${quoteId}.${exp}`;
  return `${Buffer.from(payload, 'utf8').toString('base64url')}.${sign(payload)}`;
}

export function verifyQuoteDownloadToken(
  token: string
): { quoteId: string } | null {
  if (!token) return null;
  const dot = token.indexOf('.');
  if (dot === -1) return null;

  const payloadB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  let payload: string;
  try {
    payload = Buffer.from(payloadB64, 'base64url').toString('utf8');
  } catch {
    return null;
  }

  const expected = sign(payload);
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  const [quoteId, expStr] = payload.split('.');
  const exp = Number.parseInt(expStr || '', 10);
  if (!quoteId || !Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return { quoteId };
}
