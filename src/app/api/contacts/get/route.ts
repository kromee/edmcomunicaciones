import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'id es requerido' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: contact, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !contact) {
      return NextResponse.json(
        { success: false, error: 'Contacto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, contact });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    );
  }
}
