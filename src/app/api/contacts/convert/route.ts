import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSession } from '@/lib/session';

/**
 * Convierte un contacto en cliente (prospecto) o lo vincula si ya existe por email.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { contactId } = await request.json();
    if (!contactId) {
      return NextResponse.json(
        { success: false, error: 'contactId es requerido' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .single();

    if (contactError || !contact) {
      return NextResponse.json(
        { success: false, error: 'Contacto no encontrado' },
        { status: 404 }
      );
    }

    if (contact.client_id) {
      const { data: linkedClient } = await supabase
        .from('clients')
        .select('*')
        .eq('id', contact.client_id)
        .single();

      if (linkedClient) {
        return NextResponse.json({
          success: true,
          client: linkedClient,
          created: false,
          linked: true,
        });
      }
    }

    const normalizedEmail = contact.email.trim().toLowerCase();

    const { data: existingByEmail } = await supabase
      .from('clients')
      .select('*')
      .ilike('email', normalizedEmail)
      .maybeSingle();

    let client = existingByEmail;
    let created = false;

    if (!client) {
      const leadNote = [
        contact.service ? `Servicio de interés: ${contact.service}` : null,
        contact.message ? `Mensaje: ${contact.message.slice(0, 500)}` : null,
      ]
        .filter(Boolean)
        .join('\n');

      const { data: newClient, error: createError } = await supabase
        .from('clients')
        .insert({
          name: contact.name,
          email: contact.email.trim(),
          phone: contact.phone || null,
          company: contact.company || null,
          country: 'México',
          status: 'prospect',
          notes: leadNote || null,
          created_by: session.id,
        })
        .select()
        .single();

      if (createError || !newClient) {
        console.error('Error creating client from contact:', createError);
        return NextResponse.json(
          { success: false, error: 'No se pudo crear el cliente' },
          { status: 500 }
        );
      }

      client = newClient;
      created = true;
    } else {
      const patch: Record<string, string | null> = {};
      if (!client.phone && contact.phone) patch.phone = contact.phone;
      if (!client.company && contact.company) patch.company = contact.company;
      if (Object.keys(patch).length > 0) {
        await supabase.from('clients').update(patch).eq('id', client.id);
      }
    }

    const contactUpdate: Record<string, unknown> = {
      client_id: client.id,
      assigned_to: session.id,
    };
    if (contact.status === 'new') {
      contactUpdate.status = 'contacted';
    }

    const { error: linkError } = await supabase
      .from('contacts')
      .update(contactUpdate)
      .eq('id', contactId);

    if (linkError) {
      console.error('Error linking contact to client:', linkError);
      return NextResponse.json(
        {
          success: true,
          client,
          created,
          linked: false,
          warning: 'Cliente listo pero no se pudo vincular el contacto (¿migración SQL pendiente?)',
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      client,
      created,
      linked: true,
    });
  } catch (error) {
    console.error('Error in contact convert:', error);
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    );
  }
}
