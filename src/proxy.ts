import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeSessionCookie } from '@/lib/session-token';

const PROTECTED_PAGE_PREFIXES = ['/dashboard', '/cotizador'];

const PUBLIC_API_PREFIXES = [
  '/api/auth/login',
  '/api/auth/logout',
  '/api/contacts/create',
  '/api/quotes/public-download',
];

function isProtectedPage(pathname: string): boolean {
  return PROTECTED_PAGE_PREFIXES.some((route) => pathname.startsWith(route));
}

function isPublicApi(pathname: string): boolean {
  return PUBLIC_API_PREFIXES.some((route) => pathname.startsWith(route));
}

function hasTrustedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (!origin || !host) return false;

  try {
    const originUrl = new URL(origin);
    return originUrl.host === host.toLowerCase() &&
      originUrl.protocol === request.nextUrl.protocol;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/api/') &&
    !isPublicApi(pathname) &&
    !['GET', 'HEAD', 'OPTIONS'].includes(request.method)
  ) {
    if (!hasTrustedOrigin(request)) {
      return NextResponse.json(
        { success: false, error: 'Origen no permitido' },
        { status: 403 }
      );
    }
  }

  const sessionValue = request.cookies.get('session')?.value;
  let session = null;
  if (sessionValue) {
    try {
      session = await decodeSessionCookie(sessionValue);
    } catch (err) {
      console.error('Middleware session decode failed:', err);
      session = null;
    }
  }

  if (pathname.startsWith('/api/debug')) {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
  }

  if (pathname.startsWith('/api/') && !isPublicApi(pathname)) {
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }
  }

  if (isProtectedPage(pathname) && !session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/cotizador/:path*',
    '/login',
    /*
     * No ejecutar proxy en login/logout: el Route Handler fija la cookie de sesión.
     */
    '/api/((?!auth/login|auth/logout).*)',
  ],
};
