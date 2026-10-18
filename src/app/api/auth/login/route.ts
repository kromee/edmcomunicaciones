import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import bcrypt from 'bcryptjs';
import {
  encodeSessionCookie,
  sessionCookieMaxAge,
} from '@/lib/session-token';
import type { SessionUser } from '@/types/session';

export async function POST(request: NextRequest) {
  try {
    console.log('Login attempt started');
    
    const { email, password } = await request.json();
    console.log('Login attempt for email:', email);

    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json(
        { success: false, error: 'Email y contraseña son requeridos' },
        { status: 400 }
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
      console.log('User not found for email:', emailNorm);
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    console.log('User found:', user.email);

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
      console.log('Invalid password for user:', email);
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    console.log('Password verified successfully');

    // Crear sesión (guardar en cookie)
    console.log('Creating session...');
    const sessionData: SessionUser = {
      id: String(user.id),
      email: String(user.email),
      name: typeof user.name === 'string' && user.name.trim() ? user.name.trim() : String(user.email),
      role: user.role === 'admin' ? 'admin' : 'viewer',
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

    console.log('Login successful for user:', email);
    const response = NextResponse.json({
      success: true,
      user: sessionData,
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
