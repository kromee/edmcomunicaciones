import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { normalizeQuoteItemUnit } from '@/lib/quote-item-units';
import { getSession } from '@/lib/session';
import { dateInputToISO } from '@/lib/quote-dates';

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const supabase = await createClient();
    const body = await request.json();
    
    const {
      quoteId,
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
      status,
      items,
      total_amount
    } = body;

    console.log('Updating quote:', quoteId);
    console.log('Items to update:', items);

    // Actualizar la cotización principal
    const updateData: Record<string, unknown> = {
      service_type,
      description,
      valid_until,
      notes,
      custom_commercial_terms,
      status,
      total_amount,
      updated_at: new Date().toISOString()
    };

    if (typeof client_name === 'string' && client_name.trim()) {
      updateData.client_name = client_name.trim();
    }
    if (typeof client_email === 'string' && client_email.trim()) {
      updateData.client_email = client_email.trim();
    }
    if (client_phone !== undefined) {
      updateData.client_phone =
        typeof client_phone === 'string' && client_phone.trim()
          ? client_phone.trim()
          : null;
    }
    if (client_company !== undefined) {
      updateData.client_company =
        typeof client_company === 'string' && client_company.trim()
          ? client_company.trim()
          : null;
    }
    
    // Solo incluir show_valid_until si se proporciona
    if (show_valid_until !== undefined) {
      updateData.show_valid_until = show_valid_until;
    }

    if (typeof quote_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(quote_date)) {
      updateData.created_at = dateInputToISO(quote_date);
    }
    
    const { error: quoteError } = await supabase
      .from('quotes')
      .update(updateData)
      .eq('id', quoteId);

    if (quoteError) {
      console.error('Error updating quote:', quoteError);
      return NextResponse.json(
        { success: false, error: 'Error al actualizar la cotización' },
        { status: 500 }
      );
    }

    // Eliminar items existentes
    const { error: deleteError } = await supabase
      .from('quote_items')
      .delete()
      .eq('quote_id', quoteId);

    if (deleteError) {
      console.error('Error deleting existing items:', deleteError);
      return NextResponse.json(
        { success: false, error: 'Error al eliminar items existentes' },
        { status: 500 }
      );
    }

    // Insertar nuevos items
    if (items && items.length > 0) {
      const itemsToInsert = items.map((item: any) => ({
        quote_id: quoteId,
        item_name: item.item_name || item.description,
        description: item.description,
        quantity: parseInt(item.quantity) || 1,
        unit: normalizeQuoteItemUnit(item.unit),
        unit_price: parseFloat(item.unit_price) || 0,
        total: parseFloat(item.total) || 0
      }));

      console.log('Inserting items:', itemsToInsert);

      const { error: itemsError } = await supabase
        .from('quote_items')
        .insert(itemsToInsert);

      if (itemsError) {
        console.error('Error inserting items:', itemsError);
        return NextResponse.json(
          { success: false, error: 'Error al insertar items de cotización' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating quote:', error);
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    );
  }
}
