import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSession } from '@/lib/session';

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const {
      id,
      name,
      email,
      phone,
      company,
      address,
      city,
      state,
      postal_code,
      country,
      tax_id,
      notes,
      status
    } = await request.json();

    // Validar campos requeridos
    if (!id || !name || !email) {
      return NextResponse.json(
        { success: false, error: 'ID, nombre y email son requeridos' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verificar si ya existe otro cliente con ese email
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('email', email)
      .neq('id', id)
      .single();

    if (existingClient) {
      return NextResponse.json(
        { success: false, error: 'Ya existe otro cliente con ese email' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('clients')
      .update({
        name,
        email,
        phone: phone || null,
        company: company || null,
        address: address || null,
        city: city || null,
        state: state || null,
        postal_code: postal_code || null,
        country: country || 'México',
        tax_id: tax_id || null,
        notes: notes || null,
        status: status || 'active'
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating client:', error);
      return NextResponse.json(
        { success: false, error: 'Error al actualizar cliente' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, client: data });
  } catch (error) {
    console.error('Error in update client:', error);
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    );
  }
}
