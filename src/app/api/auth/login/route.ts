import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

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

    // Verificar variables de entorno
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { success: false, error: 'Configuración del servidor incorrecta' },
        { status: 500 }
      );
    }

    console.log('Creating Supabase client...');
    const supabase = await createClient();
    console.log('Supabase client created successfully');

    // Buscar usuario por email
    console.log('Searching for user in database...');
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Error de base de datos' },
        { status: 500 }
      );
    }

    if (!user) {
      console.log('User not found for email:', email);
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    console.log('User found:', user.email);

    // Verificar contraseña
    console.log('Verifying password...');
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

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
    const sessionData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    // Guardar sesión en cookie
    try {
      const cookieStore = await cookies();
      cookieStore.set('session', JSON.stringify(sessionData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 días
        path: '/',
      });
      console.log('Session cookie set successfully');
    } catch (cookieError) {
      console.error('Error setting session cookie:', cookieError);
      return NextResponse.json(
        { success: false, error: 'Error al crear sesión' },
        { status: 500 }
      );
    }

    console.log('Login successful for user:', email);
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    );
  }
}
