import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, service, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('contacts')
      .insert({
        name,
        email,
        phone: phone || null,
        company: company || null,
        service: service || null,
        message,
        status: 'new'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating contact:', error);
      return NextResponse.json(
        { success: false, error: 'Error al guardar contacto' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, contact: data });
  } catch (error) {
    console.error('Error in create contact:', error);
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    );
  }
}
