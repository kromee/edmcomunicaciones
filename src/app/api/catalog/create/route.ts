import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuthenticatedApi } from '@/lib/api-security';
import { normalizeQuoteItemUnit } from '@/lib/quote-item-units';

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

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('catalog_items')
    .insert({
      title,
      description: typeof body.description === 'string' ? body.description : '',
      default_quantity: Math.max(0, parseInt(body.default_quantity, 10) || 1),
      unit: normalizeQuoteItemUnit(body.unit),
      default_unit_price: parseFloat(body.default_unit_price) || 0,
      default_percentage: parseFloat(body.default_percentage) || 0,
      category: body.category?.trim() || null,
      is_active: body.is_active !== false,
      sort_order: parseInt(body.sort_order, 10) || 0,
      created_by: auth.session.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating catalog item:', error);
    return NextResponse.json(
      { success: false, error: 'No se pudo crear el concepto' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, item: data });
}
