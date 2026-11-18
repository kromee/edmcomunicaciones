import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdminApi } from '@/lib/api-security';
import {
  checkMfaActionLimit,
  createRecoveryCodes,
  decryptMfaSecret,
  hashRecoveryCode,
} from '@/lib/mfa';
import { verify } from 'otplib';

export async function POST(request: NextRequest) {
  const auth = await requireAdminApi();
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => null);
  const code = typeof body?.code === 'string' ? body.code.trim() : '';
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ success: false, error: 'Ingresa un código de seis dígitos' }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const limit = await checkMfaActionLimit(supabase, auth.session.id, 'confirm', 8);
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Demasiados intentos. Intenta más tarde.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } }
      );
    }

    const { data: user, error } = await supabase.from('users')
      .select('mfa_enabled, mfa_pending_secret_encrypted, mfa_pending_until')
      .eq('id', auth.session.id).maybeSingle();
    if (error || !user) {
      return NextResponse.json({ success: false, error: 'Acceso temporalmente no disponible' }, { status: 503 });
    }
    if (user.mfa_enabled || !user.mfa_pending_secret_encrypted ||
        !user.mfa_pending_until || Date.parse(user.mfa_pending_until) <= Date.now()) {
      return NextResponse.json({ success: false, error: 'Configuración vencida. Vuelve a empezar.' }, { status: 409 });
    }

    const result = await verify({
      secret: decryptMfaSecret(user.mfa_pending_secret_encrypted),
      token: code,
      epochTolerance: 30,
    });
    if (!result.valid) {
      return NextResponse.json({ success: false, error: 'Código incorrecto' }, { status: 400 });
    }

    const recoveryCodes = createRecoveryCodes();
    const hashes = recoveryCodes.map((value) => hashRecoveryCode(value)!);
    const { data: updated, error: updateError } = await supabase.from('users').update({
      mfa_enabled: true,
      mfa_secret_encrypted: user.mfa_pending_secret_encrypted,
      mfa_pending_secret_encrypted: null,
      mfa_pending_until: null,
      mfa_last_step: -1,
      mfa_recovery_hashes: hashes,
    }).eq('id', auth.session.id)
      .eq('mfa_enabled', false)
      .eq('mfa_pending_secret_encrypted', user.mfa_pending_secret_encrypted)
      .gt('mfa_pending_until', new Date().toISOString())
      .select('id').maybeSingle();
    if (updateError || !updated) {
      return NextResponse.json({ success: false, error: 'No se pudo activar el segundo factor' }, { status: 503 });
    }

    return NextResponse.json(
      { success: true, recoveryCodes },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('MFA confirmation unavailable:', error);
    return NextResponse.json({ success: false, error: 'Segundo factor temporalmente no disponible' }, { status: 503 });
  }
}
