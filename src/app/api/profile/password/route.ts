import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body as {
      currentPassword?: string;
      newPassword?: string;
    };

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Contraseña actual y nueva contraseña son requeridas' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'La nueva contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', session.id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'La contraseña actual es incorrecta' },
        { status: 400 }
      );
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: newPasswordHash })
      .eq('id', session.id);

    if (updateError) {
      console.error('Error actualizando contraseña:', updateError);
      return NextResponse.json(
        { success: false, error: 'Error al actualizar la contraseña' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('POST /api/profile/password:', e);
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    );
  }
}
