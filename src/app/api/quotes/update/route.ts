import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const {
      quoteId,
      service_type,
      description,
      valid_until,
      notes,
      custom_commercial_terms,
      status,
      items,
      total_amount
    } = body;

    console.log('Updating quote:', quoteId);
    console.log('Items to update:', items);

    // Actualizar la cotización principal
    const { error: quoteError } = await supabase
      .from('quotes')
      .update({
        service_type,
        description,
        valid_until,
        notes,
        custom_commercial_terms,
        status,
        total_amount,
        updated_at: new Date().toISOString()
      })
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
        unit: item.unit || 'PZA',
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
