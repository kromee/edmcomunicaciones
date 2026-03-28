import { cookies } from 'next/headers';
import { SessionUser } from '@/types/session';

export type { SessionUser };

function isDynamicServerUsageError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const d = error as { digest?: string; message?: string };
  return (
    d.digest === 'DYNAMIC_SERVER_USAGE' ||
    (typeof d.message === 'string' && d.message.includes('Dynamic server usage'))
  );
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return null;
    }

    const session = JSON.parse(sessionCookie.value);
    return session;
  } catch (error) {
    if (isDynamicServerUsageError(error)) {
      return null;
    }
    console.error('Error getting session:', error);
    return null;
  }
}

export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }

  return session;
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireAuth();
  
  if (session.role !== 'admin') {
    throw new Error('Forbidden - Admin access required');
  }

  return session;
}
