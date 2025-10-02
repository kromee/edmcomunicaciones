import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id, status, notes } = await request.json();

    const supabase = await createClient();

    const updateData: any = { status };
    if (notes !== undefined) {
      updateData.notes = notes;
    }
    updateData.assigned_to = session.id;

    const { error } = await supabase
      .from('contacts')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating contact:', error);
      return NextResponse.json(
        { success: false, error: 'Error al actualizar contacto' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in update contact:', error);
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    );
  }
}
