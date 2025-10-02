import { cookies } from 'next/headers';

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'viewer';
};

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
