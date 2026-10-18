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

    const { id, status, notes, client_id, follow_up_date, next_action } =
      await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'id es requerido' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const updateData: Record<string, unknown> = { assigned_to: session.id };
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (client_id !== undefined) updateData.client_id = client_id;
    if (follow_up_date !== undefined) {
      updateData.follow_up_date =
        follow_up_date === null || follow_up_date === ''
          ? null
          : follow_up_date;
    }
    if (next_action !== undefined) {
      updateData.next_action =
        typeof next_action === 'string' && next_action.trim()
          ? next_action.trim()
          : null;
    }

    if (Object.keys(updateData).length <= 1) {
      return NextResponse.json(
        { success: false, error: 'Nada que actualizar' },
        { status: 400 }
      );
    }

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
