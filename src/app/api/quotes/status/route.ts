import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import type { QuoteStatusDb } from '@/lib/quote-status';

const ALLOWED: QuoteStatusDb[] = [
  'pending',
  'sent',
  'approved',
  'rejected',
  'paid',
];

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { quoteId, status } = body as {
      quoteId?: string;
      status?: string;
    };

    if (!quoteId || !status) {
      return NextResponse.json(
        { success: false, error: 'quoteId y status son requeridos' },
        { status: 400 }
      );
    }

    if (!ALLOWED.includes(status as QuoteStatusDb)) {
      return NextResponse.json(
        { success: false, error: 'Estado no válido' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from('quotes')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', quoteId);

    if (error) {
      console.error('Error actualizando estado:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('PATCH /api/quotes/status:', e);
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    );
  }
}
