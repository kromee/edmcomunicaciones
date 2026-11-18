import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { createAdminClient } from '@/lib/supabase/admin';
import ProfileClient from './profile-client';

export default async function ProfilePage() {
  try {
    const session = await getSession();

    if (!session) {
      redirect('/login');
    }

    const supabase = createAdminClient();
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role, created_at')
      .eq('id', session.id)
      .single();

    if (error || !user) {
      redirect('/dashboard');
    }

    return <ProfileClient user={user} />;
  } catch (error) {
    console.error('Error in profile:', error);
    redirect('/dashboard');
  }
}
