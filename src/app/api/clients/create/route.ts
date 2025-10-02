import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    console.log('=== CREATE CLIENT API CALLED ===');
    
    const session = await getSession();
    console.log('Session:', session ? 'Authenticated' : 'Not authenticated');
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const {
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

    console.log('Request data:', { name, email, phone, company });

    // Validar campos requeridos
    if (!name || !email) {
      console.log('Validation failed: missing name or email');
      return NextResponse.json(
        { success: false, error: 'Nombre y email son requeridos' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    console.log('Supabase client created');

    // Verificar si ya existe un cliente con ese email
    console.log('Checking for existing client with email:', email);
    const { data: existingClient, error: checkError } = await supabase
      .from('clients')
      .select('id')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing client:', checkError);
      return NextResponse.json(
        { success: false, error: 'Error al verificar cliente existente' },
        { status: 500 }
      );
    }

    if (existingClient) {
      console.log('Client already exists with email:', email);
      return NextResponse.json(
        { success: false, error: 'Ya existe un cliente con ese email' },
        { status: 400 }
      );
    }

    console.log('Creating new client...');
    const { data, error } = await supabase
      .from('clients')
      .insert({
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
        status: status || 'active',
        created_by: session.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating client:', error);
      return NextResponse.json(
        { success: false, error: `Error al crear cliente: ${error.message}` },
        { status: 500 }
      );
    }

    console.log('Client created successfully:', data);
    return NextResponse.json({ success: true, client: data });
  } catch (error) {
    console.error('Error in create client:', error);
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    );
  }
}
