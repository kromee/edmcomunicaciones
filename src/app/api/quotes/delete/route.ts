import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quoteId = searchParams.get('id');

    if (!quoteId) {
      return NextResponse.json(
        { success: false, error: 'ID de cotización requerido' },
        { status: 400 }
      );
    }

    console.log('🗑️ Intentando eliminar cotización:', quoteId);

    const supabase = await createClient();
    const cookieStore = await cookies();

    // Verificar autenticación
    const sessionCookie = cookieStore.get('session');
    if (!sessionCookie?.value) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Eliminar items de la cotización primero (por foreign key constraint)
    console.log('🗑️ Eliminando items de la cotización...');
    const { error: itemsError } = await supabase
      .from('quote_items')
      .delete()
      .eq('quote_id', quoteId);

    if (itemsError) {
      console.error('❌ Error eliminando items:', itemsError);
      return NextResponse.json(
        { success: false, error: 'Error eliminando items de la cotización' },
        { status: 500 }
      );
    }

    // Eliminar la cotización
    console.log('🗑️ Eliminando cotización...');
    const { error: quoteError } = await supabase
      .from('quotes')
      .delete()
      .eq('id', quoteId);

    if (quoteError) {
      console.error('❌ Error eliminando cotización:', quoteError);
      return NextResponse.json(
        { success: false, error: 'Error eliminando la cotización' },
        { status: 500 }
      );
    }

    console.log('✅ Cotización eliminada exitosamente');

    return NextResponse.json({
      success: true,
      message: 'Cotización eliminada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error en delete quote:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { success: false, error: `Error del servidor: ${errorMessage}` },
      { status: 500 }
    );
  }
}
