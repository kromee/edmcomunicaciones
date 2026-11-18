import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdminApi } from '@/lib/api-security';
import { checkMfaActionLimit, encryptMfaSecret } from '@/lib/mfa';
import { generateSecret, generateURI } from 'otplib';
import QRCode from 'qrcode';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => null);
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!password || password.length > 1024) {
    return NextResponse.json({ success: false, error: 'Ingresa tu contraseña actual' }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const limit = await checkMfaActionLimit(supabase, auth.session.id, 'setup', 5);
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Demasiados intentos. Intenta más tarde.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } }
      );
    }

    const { data: user, error } = await supabase.from('users')
      .select('email, password_hash, mfa_enabled')
      .eq('id', auth.session.id).maybeSingle();
    if (error || !user) {
      return NextResponse.json({ success: false, error: 'Acceso temporalmente no disponible' }, { status: 503 });
    }
    if (user.mfa_enabled) {
      return NextResponse.json({ success: false, error: 'El segundo factor ya está activo' }, { status: 409 });
    }
    if (!await bcrypt.compare(password, user.password_hash)) {
      return NextResponse.json({ success: false, error: 'Contraseña incorrecta' }, { status: 403 });
    }

    const secret = generateSecret();
    const uri = generateURI({ issuer: 'EDM Comunicaciones', label: user.email, secret });
    const encrypted = encryptMfaSecret(secret);
    const { data: updated, error: updateError } = await supabase.from('users').update({
      mfa_pending_secret_encrypted: encrypted,
      mfa_pending_until: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    }).eq('id', auth.session.id).eq('mfa_enabled', false)
      .select('id').maybeSingle();
    if (updateError || !updated) {
      return NextResponse.json({ success: false, error: 'No se pudo iniciar la configuración' }, { status: 503 });
    }

    const qrDataUrl = await QRCode.toDataURL(uri, { width: 220, margin: 2 });
    return NextResponse.json(
      { success: true, secret, qrDataUrl },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('MFA setup unavailable:', error);
    return NextResponse.json({ success: false, error: 'Segundo factor temporalmente no disponible' }, { status: 503 });
  }
}
