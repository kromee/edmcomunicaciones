import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuthenticatedApi } from '@/lib/api-security';
import { normalizeQuoteItemUnit } from '@/lib/quote-item-units';
import { catalogApiErrorMessage } from '@/lib/catalog-api-errors';

export async function POST(request: NextRequest) {
  const auth = await requireAuthenticatedApi();
  if (auth instanceof NextResponse) return auth;

  const body = await request.json();
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  if (!title) {
    return NextResponse.json(
      { success: false, error: 'El título es requerido' },
      { status: 400 }
    );
  }

  const supabase = createClient();

  const row = {
    title,
    description: typeof body.description === 'string' ? body.description : '',
    default_quantity: Math.max(
      0,
      Number.parseInt(String(body.default_quantity ?? 1), 10) || 1
    ),
    unit: normalizeQuoteItemUnit(body.unit),
    default_unit_price: Number.parseFloat(String(body.default_unit_price ?? 0)) || 0,
    default_percentage: Number.parseFloat(String(body.default_percentage ?? 0)) || 0,
    category:
      typeof body.category === 'string' && body.category.trim()
        ? body.category.trim()
        : null,
    is_active: body.is_active !== false,
    sort_order: Number.parseInt(String(body.sort_order ?? 0), 10) || 0,
    created_by: auth.session.id,
  };

  let { data, error } = await supabase.from('catalog_items').insert(row).select().single();

  if (error?.code === '23503') {
    const { created_by: _omit, ...withoutUser } = row;
    ({ data, error } = await supabase
      .from('catalog_items')
      .insert(withoutUser)
      .select()
      .single());
  }

  if (error) {
    console.error('Error creating catalog item:', error);
    return NextResponse.json(
      {
        success: false,
        error: catalogApiErrorMessage(error, 'No se pudo crear el concepto'),
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, item: data });
}
