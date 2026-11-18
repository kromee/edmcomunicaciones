import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes } from 'crypto';
import type { SupabaseClient } from '@supabase/supabase-js';

function encryptionKey(): Buffer {
  const configured = process.env.MFA_ENCRYPTION_KEY?.trim() || '';
  const key = Buffer.from(configured, 'base64');
  if (key.length !== 32 || key.toString('base64') !== configured) {
    throw new Error('MFA_ENCRYPTION_KEY must be a base64-encoded 32-byte key');
  }
  return key;
}

export function encryptMfaSecret(secret: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
  return `v1:${iv.toString('base64')}:${cipher.getAuthTag().toString('base64')}:${encrypted.toString('base64')}`;
}

export function decryptMfaSecret(value: string): string {
  const [version, ivB64, tagB64, encryptedB64] = value.split(':');
  if (version !== 'v1' || !ivB64 || !tagB64 || !encryptedB64) {
    throw new Error('Invalid MFA secret format');
  }
  const decipher = createDecipheriv(
    'aes-256-gcm', encryptionKey(), Buffer.from(ivB64, 'base64')
  );
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedB64, 'base64')),
    decipher.final(),
  ]).toString('utf8');
}

export function createRecoveryCodes(): string[] {
  return Array.from({ length: 8 }, () =>
    randomBytes(10).toString('hex').toUpperCase().match(/.{4}/g)!.join('-')
  );
}

export function hashRecoveryCode(code: string): string | null {
  const normalized = code.trim().replace(/-/g, '').toUpperCase();
  if (!/^[0-9A-F]{20}$/.test(normalized)) return null;
  return createHash('sha256').update(normalized).digest('hex');
}

export async function checkMfaActionLimit(
  supabase: SupabaseClient,
  userId: string,
  action: 'setup' | 'confirm',
  limit: number
): Promise<{ allowed: boolean; retryAfterSec: number }> {
  const secret = process.env.SESSION_SECRET?.trim();
  if (!secret) throw new Error('SESSION_SECRET missing');
  const keyHash = createHmac('sha256', secret)
    .update(`mfa:${action}:${userId}`).digest('hex');
  const { data, error } = await supabase.rpc('check_login_attempt', {
    p_key_hash: keyHash,
    p_limit: limit,
    p_window_seconds: 900,
  });
  if (error || !Array.isArray(data) || data.length !== 1 ||
      typeof data[0]?.allowed !== 'boolean') {
    throw new Error('MFA rate limit unavailable');
  }
  return {
    allowed: data[0].allowed,
    retryAfterSec: Number(data[0].retry_after_seconds) || 1,
  };
}
