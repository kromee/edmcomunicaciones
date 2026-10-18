import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuthenticatedApi } from '@/lib/api-security';
import { catalogApiErrorMessage } from '@/lib/catalog-api-errors';

export async function GET(request: NextRequest) {
  const auth = await requireAuthenticatedApi();
  if (auth instanceof NextResponse) return auth;

  const activeOnly = request.nextUrl.searchParams.get('active') !== '0';
  const supabase = createClient();

  let query = supabase
    .from('catalog_items')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('title', { ascending: true });

  if (activeOnly) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error listing catalog:', error);
    return NextResponse.json(
      {
        success: false,
        error: catalogApiErrorMessage(error, 'Error al cargar catálogo'),
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, items: data || [] });
}
