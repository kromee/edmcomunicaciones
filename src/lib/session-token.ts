import type { SessionUser } from '@/types/session';

const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

type SessionPayload = SessionUser & { exp: number };

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET must be set in production');
  }
  return 'dev-insecure-session-secret-set-SESSION_SECRET';
}

function toBase64Url(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array | null {
  try {
    const padded = value.replace(/-/g, '+').replace(/_/g, '/');
    const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
    const base64 = padded + pad;
    if (typeof Buffer !== 'undefined') {
      return new Uint8Array(Buffer.from(base64, 'base64'));
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

function getSubtleCrypto(): SubtleCrypto {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    return crypto.subtle;
  }
  throw new Error('Web Crypto no disponible en este entorno');
}

async function importHmacKey(): Promise<CryptoKey> {
  return getSubtleCrypto().importKey(
    'raw',
    encoder.encode(getSessionSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

async function signPayload(payload: string): Promise<string> {
  const key = await importHmacKey();
  const signature = await getSubtleCrypto().sign('HMAC', key, encoder.encode(payload));
  return toBase64Url(new Uint8Array(signature));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function parseSessionUser(data: unknown): SessionUser | null {
  if (!data || typeof data !== 'object') return null;
  const o = data as Record<string, unknown>;
  if (typeof o.id !== 'string' || typeof o.email !== 'string') return null;
  if (typeof o.name !== 'string') return null;
  if (o.role !== 'admin' && o.role !== 'viewer') return null;
  return { id: o.id, email: o.email, name: o.name, role: o.role };
}

/** Cookie firmada: base64url(payload).base64url(hmac) */
export async function encodeSessionCookie(user: SessionUser): Promise<string> {
  const payload: SessionPayload = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC,
  };
  const payloadJson = JSON.stringify(payload);
  const signature = await signPayload(payloadJson);
  return `${toBase64Url(encoder.encode(payloadJson))}.${signature}`;
}

export async function decodeSessionCookie(
  cookieValue: string
): Promise<SessionUser | null> {
  if (!cookieValue) return null;

  const dot = cookieValue.indexOf('.');
  if (dot === -1) {
    return null;
  }

  const payloadB64 = cookieValue.slice(0, dot);
  const signature = cookieValue.slice(dot + 1);
  const payloadBytes = fromBase64Url(payloadB64);
  if (!payloadBytes) return null;

  const payloadJson = decoder.decode(payloadBytes);
  const expectedSig = await signPayload(payloadJson);
  if (!timingSafeEqual(signature, expectedSig)) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(payloadJson);
  } catch {
    return null;
  }

  const user = parseSessionUser(parsed);
  if (!user) return null;

  const exp = (parsed as SessionPayload).exp;
  if (typeof exp !== 'number' || exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return user;
}

export const sessionCookieMaxAge = SESSION_MAX_AGE_SEC;
