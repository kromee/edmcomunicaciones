import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSession } from '@/lib/session';
import { normalizeQuoteItemUnit } from '@/lib/quote-item-units';
import { dateInputToISO } from '@/lib/quote-dates';
import { allocateQuoteNumber } from '@/lib/quote-number';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      client_name,
      client_email,
      client_phone,
      client_company,
      service_type,
      description,
      valid_until,
      quote_date,
      notes,
      custom_commercial_terms,
      show_valid_until,
      items,
      subtotal,
      tax,
      total_amount,
      client_id: bodyClientId,
      contact_id: contactId,
    } = body;

    const supabase = await createClient();

    console.log('Creating quote for user:', session.id);
    console.log('Request body:', { client_name, client_email, service_type });

    let resolvedClientId: string | null =
      typeof bodyClientId === 'string' && bodyClientId ? bodyClientId : null;

    if (!resolvedClientId && client_email) {
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .ilike('email', client_email.trim())
        .maybeSingle();

      if (existingClient) {
        resolvedClientId = existingClient.id;
      } else {
        console.log('Client not found, creating new client...');
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert({
            name: client_name,
            email: client_email.trim(),
            phone: client_phone || null,
            company: client_company || null,
            country: 'México',
            status: 'active',
            created_by: session.id,
          })
          .select('id')
          .single();

        if (clientError) {
          console.error('Error creating client:', clientError);
        } else if (newClient) {
          resolvedClientId = newClient.id;
          console.log('New client created successfully');
        }
      }
    }

    const allocated = await allocateQuoteNumber(supabase);
    if ('error' in allocated) {
      console.error('Quote number allocation failed:', allocated.error);
      return NextResponse.json(
        { success: false, error: allocated.error },
        { status: 500 }
      );
    }
    const quote_number = allocated.quote_number;

    console.log('Generated quote number:', quote_number);

    // Crear cotización
    const insertPayload: Record<string, unknown> = {
        quote_number,
        client_name,
        client_email,
        client_phone: client_phone || null,
        client_company: client_company || null,
        service_type,
        description: description || null,
        subtotal: Number(subtotal),
        tax: Number(tax),
        total_amount: Number(total_amount),
        valid_until: valid_until || null,
        notes: notes || null,
        custom_commercial_terms: custom_commercial_terms || null,
        show_valid_until: show_valid_until !== undefined ? show_valid_until : true,
        status: 'pending',
        created_by: session.id,
      };

    if (resolvedClientId) {
      insertPayload.client_id = resolvedClientId;
    }

    if (typeof quote_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(quote_date)) {
      insertPayload.created_at = dateInputToISO(quote_date);
    }

    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert(insertPayload)
      .select()
      .single();

    if (quoteError) {
      console.error('Error creating quote:', quoteError);
      return NextResponse.json(
        { success: false, error: `Error al crear cotización: ${quoteError.message}` },
        { status: 500 }
      );
    }

    console.log('Quote created successfully:', quote.id);

    if (contactId && resolvedClientId) {
      await supabase
        .from('contacts')
        .update({
          client_id: resolvedClientId,
          status: 'contacted',
          assigned_to: session.id,
        })
        .eq('id', contactId);
    }

    // Crear items de cotización (incluye corridas vacías; orden = posición)
    const quoteItems = items.map((item: any, index: number) => ({
      quote_id: quote.id,
      item_name: item.description?.trim() ? item.description : `Corrida ${index + 1}`,
      description: item.description ?? '',
      quantity: parseInt(item.quantity) || 0,
      unit: normalizeQuoteItemUnit(item.unit),
      unit_price: parseFloat(item.unit_price) || 0,
      percentage: parseFloat(item.percentage) || 0,
      total: parseFloat(item.total) || 0,
      sort_order: index,
    }));

    console.log('Quote items to insert:', quoteItems);

    const { error: itemsError } = await supabase
      .from('quote_items')
      .insert(quoteItems);

    if (itemsError) {
      console.error('Error creating quote items:', itemsError);
      // Eliminar cotización si falla la creación de items
      await supabase.from('quotes').delete().eq('id', quote.id);
      return NextResponse.json(
        { success: false, error: 'Error al crear items de cotización' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      quote: {
        id: quote.id,
        quote_number: quote.quote_number
      },
    });
  } catch (error) {
    console.error('Error in create quote:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error details:', errorMessage);
    return NextResponse.json(
      { success: false, error: `Error del servidor: ${errorMessage}` },
      { status: 500 }
    );
  }
}
