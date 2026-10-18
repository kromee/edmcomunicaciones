import { NextResponse } from 'next/server';
import { guardDebugRoute } from '@/lib/api-security';

export async function GET() {
  const blocked = await guardDebugRoute();
  if (blocked) return blocked;

  const envCheck = {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    nodeEnv: process.env.NODE_ENV,
    supabaseUrlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
  };

  return NextResponse.json(envCheck);
}
