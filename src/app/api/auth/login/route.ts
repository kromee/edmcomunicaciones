import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import bcrypt from 'bcryptjs';
import {
  encodeSessionCookie,
  getCredentialVersion,
  sessionCookieMaxAge,
  type SignedSessionUser,
} from '@/lib/session-token';
import { getClientIpFromHeaders } from '@/lib/rate-limit';
import { createHmac } from 'crypto';
import { verify } from 'otplib';
import { decryptMfaSecret, hashRecoveryCode } from '@/lib/mfa';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';
    const mfaCode = typeof body?.mfaCode === 'string' ? body.mfaCode.trim() : '';
    if (!email || email.length > 254 || !password || password.length > 1024) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const sessionSecret = process.env.SESSION_SECRET?.trim();
    if (!sessionSecret) {
      console.error('SESSION_SECRET missing');
      return NextResponse.json(
        {
          success: false,
          error: 'Configuración del servidor incorrecta',
        },
        { status: 500 }
      );
    }

    // Verificar variables de entorno
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { success: false, error: 'Configuración del servidor incorrecta' },
        { status: 500 }
      );
    }

    const supabase = createAdminClient();

    const rateKey = (value: string) => createHmac('sha256', sessionSecret)
      .update(value).digest('hex');
    const rateChecks = await Promise.all([
      supabase.rpc('check_login_attempt', {
        p_key_hash: rateKey(`account:${email}`), p_limit: 8, p_window_seconds: 900,
      }),
      supabase.rpc('check_login_attempt', {
        p_key_hash: rateKey(`ip:${getClientIpFromHeaders(request.headers)}`),
        p_limit: 30, p_window_seconds: 900,
      }),
    ]);
    if (rateChecks.some(({ error, data }) =>
      error || !Array.isArray(data) || data.length !== 1 ||
      typeof data[0]?.allowed !== 'boolean' ||
      typeof data[0]?.retry_after_seconds !== 'number'
    )) {
      console.error('Login rate limit unavailable');
      return NextResponse.json(
        { success: false, error: 'Acceso temporalmente no disponible' },
        { status: 503 }
      );
    }
    const retryAfter = Math.max(...rateChecks.map(({ data }) =>
      data?.[0]?.allowed === false ? Number(data[0].retry_after_seconds) || 1 : 0
    ));
    if (retryAfter > 0) {
      return NextResponse.json(
        { success: false, error: 'Demasiados intentos. Intenta más tarde.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }

    // Buscar usuario por email (bypassing RLS with service role)
    const emailNorm = String(email).trim().toLowerCase();
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .ilike('email', emailNorm)
      .maybeSingle();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Error de base de datos', code: 'DB_ERROR' },
        { status: 500 }
      );
    }

    if (!user) {
        return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }


    // Verificar contraseña
    const passwordHash =
      typeof user.password_hash === 'string' ? user.password_hash : '';
    if (!passwordHash) {
      console.error('User has no password_hash');
      return NextResponse.json(
        { success: false, error: 'Configuración del servidor incorrecta', code: 'NO_PASSWORD_HASH' },
        { status: 500 }
      );
    }

    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(password, passwordHash);
    } catch (bcryptError) {
      console.error('bcrypt error:', bcryptError);
      return NextResponse.json(
        { success: false, error: 'Error al verificar contraseña', code: 'BCRYPT_ERROR' },
        { status: 500 }
      );
    }

    if (!isValidPassword) {
        return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const mfaEnabled = user.role === 'admin' && user.mfa_enabled === true;
    if (mfaEnabled) {
      if (!mfaCode) {
        return NextResponse.json(
          { success: false, mfaRequired: true, error: 'Ingresa el código de tu app autenticadora o uno de recuperación.' },
          { status: 401 }
        );
      }
      if (mfaCode.length > 50 || !user.mfa_secret_encrypted) {
        return NextResponse.json(
          { success: false, mfaRequired: true, error: 'Código inválido' },
          { status: 401 }
        );
      }

      if (/^\d{6}$/.test(mfaCode)) {
        let result;
        try {
          result = await verify({
            secret: decryptMfaSecret(user.mfa_secret_encrypted),
            token: mfaCode,
            epochTolerance: 30,
            afterTimeStep: Number(user.mfa_last_step ?? -1),
          });
        } catch {
          console.error('MFA verification unavailable');
          return NextResponse.json(
            { success: false, error: 'Acceso temporalmente no disponible' },
            { status: 503 }
          );
        }
        if (!result.valid || !('timeStep' in result) ||
            typeof result.timeStep !== 'number') {
          return NextResponse.json(
            { success: false, mfaRequired: true, error: 'Código inválido o ya utilizado' },
            { status: 401 }
          );
        }
        const { data: consumed, error: consumeError } = await supabase
          .from('users')
          .update({ mfa_last_step: result.timeStep })
          .eq('id', user.id)
          .lt('mfa_last_step', result.timeStep)
          .select('id')
          .maybeSingle();
        if (consumeError) {
          console.error('MFA step update failed');
          return NextResponse.json(
            { success: false, error: 'Acceso temporalmente no disponible' },
            { status: 503 }
          );
        }
        if (!consumed) {
          return NextResponse.json(
            { success: false, mfaRequired: true, error: 'Código ya utilizado' },
            { status: 401 }
          );
        }
      } else {
        const codeHash = hashRecoveryCode(mfaCode);
        if (!codeHash) {
          return NextResponse.json(
            { success: false, mfaRequired: true, error: 'Código inválido' },
            { status: 401 }
          );
        }
        const { data: consumed, error: consumeError } = await supabase.rpc(
          'consume_mfa_recovery_code',
          { p_user_id: String(user.id), p_code_hash: codeHash }
        );
        if (consumeError) {
          console.error('MFA recovery code unavailable');
          return NextResponse.json(
            { success: false, error: 'Acceso temporalmente no disponible' },
            { status: 503 }
          );
        }
        if (consumed !== true) {
          return NextResponse.json(
            { success: false, mfaRequired: true, error: 'Código inválido o ya utilizado' },
            { status: 401 }
          );
        }
      }
    }

    // Crear sesión (guardar en cookie)
    const sessionData: SignedSessionUser = {
      id: String(user.id),
      email: String(user.email),
      name: typeof user.name === 'string' && user.name.trim() ? user.name.trim() : String(user.email),
      role: user.role === 'admin' ? 'admin' : 'viewer',
      credentialVersion: await getCredentialVersion(passwordHash),
      mfaVerified: mfaEnabled,
    };

    let signedSession: string;
    try {
      signedSession = await encodeSessionCookie(sessionData);
    } catch (signError) {
      console.error('Error signing session:', signError);
      const detail =
        signError instanceof Error ? signError.message : String(signError);
      const error =
        detail.includes('SESSION_SECRET') ?
          'No se pudo firmar la sesión: revisa SESSION_SECRET en Vercel y redeploy.'
        : 'Error al crear sesión';
      return NextResponse.json(
        { success: false, error, code: 'SESSION_SIGN_FAILED' },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: { id: sessionData.id, email: sessionData.email, name: sessionData.name, role: sessionData.role },
    });

    try {
      response.cookies.set('session', signedSession, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: sessionCookieMaxAge,
        path: '/',
      });
    } catch (cookieSetError) {
      console.error('response.cookies.set failed:', cookieSetError);
      return NextResponse.json(
        {
          success: false,
          error: 'No se pudo guardar la cookie de sesión',
          code: 'COOKIE_SET_FAILED',
        },
        { status: 500 }
      );
    }

    return response;
  } catch (error) {
    console.error('Login error:', error);
    const detail = error instanceof Error ? error.message : 'Error del servidor';
    return NextResponse.json(
      {
        success: false,
        error: 'Error del servidor',
        code: 'UNHANDLED',
        detail: process.env.NODE_ENV === 'production' ? undefined : detail,
      },
      { status: 500 }
    );
  }
}
