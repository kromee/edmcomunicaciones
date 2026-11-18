import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import bcrypt from 'bcryptjs';
import {
  encodeSessionCookie,
  getCredentialVersion,
  sessionCookieMaxAge,
} from '@/lib/session-token';
import type { SessionUser } from '@/types/session';
import { checkRateLimit, getClientIpFromHeaders } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';
    if (!email || email.length > 254 || !password || password.length > 1024) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Esta protección por instancia limita intentos casuales. Debe complementarse
    // con límites persistentes en la infraestructura para cubrir todas las instancias.
    const ip = getClientIpFromHeaders(request.headers);
    const ipLimit = checkRateLimit(`login:ip:${ip}`, 20, 15 * 60 * 1000);
    const accountLimit = checkRateLimit(`login:account:${email}`, 8, 15 * 60 * 1000);
    if (!ipLimit.allowed || !accountLimit.allowed) {
      const retryAfter = Math.max(
        ipLimit.allowed ? 0 : ipLimit.retryAfterSec,
        accountLimit.allowed ? 0 : accountLimit.retryAfterSec
      );
      return NextResponse.json(
        { success: false, error: 'Demasiados intentos. Intenta más tarde.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }

    if (
      process.env.NODE_ENV === 'production' &&
      !process.env.SESSION_SECRET?.trim()
    ) {
      console.error('SESSION_SECRET missing in production');
      return NextResponse.json(
        {
          success: false,
          error:
            'Falta SESSION_SECRET en Vercel (Settings → Environment Variables). Genera una clave larga aleatoria, guarda y redeploy.',
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

    console.log('Creating Supabase admin client...');
    const supabase = createAdminClient();
    console.log('Supabase admin client created successfully');

    // Buscar usuario por email (bypassing RLS with service role)
    console.log('Searching for user in database...');
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
    console.log('Verifying password...');
    const passwordHash =
      typeof user.password_hash === 'string' ? user.password_hash : '';
    if (!passwordHash) {
      console.error('User has no password_hash:', user.email);
      return NextResponse.json(
        { success: false, error: 'Usuario mal configurado en BD', code: 'NO_PASSWORD_HASH' },
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

    console.log('Password verified successfully');

    // Crear sesión (guardar en cookie)
    console.log('Creating session...');
    const sessionData: SessionUser & { credentialVersion: string } = {
      id: String(user.id),
      email: String(user.email),
      name: typeof user.name === 'string' && user.name.trim() ? user.name.trim() : String(user.email),
      role: user.role === 'admin' ? 'admin' : 'viewer',
      credentialVersion: await getCredentialVersion(passwordHash),
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
