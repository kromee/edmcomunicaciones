import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuthenticatedApi } from '@/lib/api-security';
import { catalogApiErrorMessage } from '@/lib/catalog-api-errors';

export async function DELETE(request: NextRequest) {
  const auth = await requireAuthenticatedApi();
  if (auth instanceof NextResponse) return auth;

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json(
      { success: false, error: 'id es requerido' },
      { status: 400 }
    );
  }

  const supabase = createClient();
  const { error } = await supabase.from('catalog_items').delete().eq('id', id);

  if (error) {
    console.error('Error deleting catalog item:', error);
    return NextResponse.json(
      {
        success: false,
        error: catalogApiErrorMessage(error, 'No se pudo eliminar'),
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
