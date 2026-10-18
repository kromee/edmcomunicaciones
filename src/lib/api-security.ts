import { NextRequest, NextResponse } from 'next/server';
import { getSession, requireAdmin, type SessionUser } from '@/lib/session';

/** Debug routes: 404 en producción; en dev exige admin. */
export async function guardDebugRoute(): Promise<NextResponse | null> {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }
  try {
    await requireAdmin();
    return null;
  } catch {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
  }
}

export async function requireAuthenticatedApi(): Promise<
  { session: SessionUser } | NextResponse
> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: 'No autorizado' },
      { status: 401 }
    );
  }
  return { session };
}

export async function requireAdminApi(): Promise<
  { session: SessionUser } | NextResponse
> {
  const auth = await requireAuthenticatedApi();
  if (auth instanceof NextResponse) return auth;
  if (auth.session.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Se requiere rol administrador' },
      { status: 403 }
    );
  }
  return auth;
}

/** Reduce spam al formulario público de contacto (POST cross-site). */
export function rejectUntrustedContactOrigin(request: NextRequest): NextResponse | null {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (!origin || !host) return null;

  try {
    if (new URL(origin).host !== host) {
      return NextResponse.json(
        { success: false, error: 'Origen no permitido' },
        { status: 403 }
      );
    }
  } catch {
    return NextResponse.json(
      { success: false, error: 'Origen no válido' },
      { status: 403 }
    );
  }

  return null;
}
