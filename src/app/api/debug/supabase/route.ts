import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    console.log('Testing Supabase connection...');
    
    // Verificar variables de entorno
    const envCheck = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      nodeEnv: process.env.NODE_ENV,
    };

    if (!envCheck.hasSupabaseUrl || !envCheck.hasSupabaseAnonKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing Supabase environment variables',
        envCheck
      }, { status: 500 });
    }

    // Crear cliente Supabase
    const supabase = await createClient();
    console.log('Supabase client created');

    // Probar conexión con una consulta simple
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Supabase connection error:', error);
      return NextResponse.json({
        success: false,
        error: 'Supabase connection failed',
        details: error.message,
        envCheck
      }, { status: 500 });
    }

    console.log('Supabase connection successful');
    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      envCheck,
      data
    });

  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({
      success: false,
      error: 'Debug endpoint error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
