import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuthenticatedApi } from '@/lib/api-security';
import { normalizeQuoteItemUnit } from '@/lib/quote-item-units';
import { catalogApiErrorMessage } from '@/lib/catalog-api-errors';

export async function PUT(request: NextRequest) {
  const auth = await requireAuthenticatedApi();
  if (auth instanceof NextResponse) return auth;

  const body = await request.json();
  const id = body.id as string | undefined;
  if (!id) {
    return NextResponse.json(
      { success: false, error: 'id es requerido' },
      { status: 400 }
    );
  }

  const update: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (typeof body.title === 'string' && body.title.trim()) {
    update.title = body.title.trim();
  }
  if (body.description !== undefined) update.description = body.description ?? '';
  if (body.default_quantity !== undefined) {
    update.default_quantity = Math.max(0, parseInt(body.default_quantity, 10) || 0);
  }
  if (body.unit !== undefined) update.unit = normalizeQuoteItemUnit(body.unit);
  if (body.default_unit_price !== undefined) {
    update.default_unit_price = parseFloat(body.default_unit_price) || 0;
  }
  if (body.default_percentage !== undefined) {
    update.default_percentage = parseFloat(body.default_percentage) || 0;
  }
  if (body.category !== undefined) {
    update.category = body.category?.trim() || null;
  }
  if (body.is_active !== undefined) update.is_active = !!body.is_active;
  if (body.sort_order !== undefined) {
    update.sort_order = parseInt(body.sort_order, 10) || 0;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('catalog_items')
    .update(update)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating catalog item:', error);
    return NextResponse.json(
      {
        success: false,
        error: catalogApiErrorMessage(error, 'No se pudo actualizar'),
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, item: data });
}
