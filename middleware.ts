import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeSessionCookie } from '@/lib/session-token';

const PROTECTED_PAGE_PREFIXES = ['/dashboard', '/cotizador'];

const PUBLIC_API_PREFIXES = [
  '/api/auth/login',
  '/api/auth/logout',
  '/api/contacts/create',
];

function isProtectedPage(pathname: string): boolean {
  return PROTECTED_PAGE_PREFIXES.some((route) => pathname.startsWith(route));
}

function isPublicApi(pathname: string): boolean {
  return PUBLIC_API_PREFIXES.some((route) => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
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

  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/cotizador/:path*',
    '/login',
    '/api/:path*',
  ],
};
