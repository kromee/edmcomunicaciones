import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSession } from '@/lib/session';

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID del cliente es requerido' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verificar si el cliente tiene cotizaciones asociadas
    const { data: quotes } = await supabase
      .from('quotes')
      .select('id')
      .eq('client_email', (await supabase.from('clients').select('email').eq('id', id).single()).data?.email)
      .limit(1);

    if (quotes && quotes.length > 0) {
      return NextResponse.json(
        { success: false, error: 'No se puede eliminar el cliente porque tiene cotizaciones asociadas' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting client:', error);
      return NextResponse.json(
        { success: false, error: 'Error al eliminar cliente' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in delete client:', error);
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    );
  }
}
