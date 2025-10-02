import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    const supabase = await createClient();

    let dbQuery = supabase
      .from('clients')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (query) {
      dbQuery = dbQuery.or(`name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`);
    }

    const { data: clients, error } = await dbQuery.limit(10);

    if (error) {
      console.error('Error searching clients:', error);
      return NextResponse.json(
        { success: false, error: 'Error al buscar clientes' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, clients: clients || [] });
  } catch (error) {
    console.error('Error in search clients:', error);
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    );
  }
}
