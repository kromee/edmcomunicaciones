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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de cotización requerido' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: quote, error } = await supabase
      .from('quotes')
      .select(`
        id,
        quote_number,
        client_name,
        client_email,
        client_phone,
        client_company,
        service_type,
        description,
        valid_until,
        notes,
        custom_commercial_terms,
        show_valid_until,
        quote_items (
          id,
          item_name,
          description,
          quantity,
          unit,
          unit_price,
          percentage,
          total
        )
      `)
      .eq('id', id)
      .single();

    if (error || !quote) {
      return NextResponse.json(
        { success: false, error: 'Cotización no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, quote });
  } catch (error) {
    console.error('Error in get quote:', error);
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    );
  }
}
