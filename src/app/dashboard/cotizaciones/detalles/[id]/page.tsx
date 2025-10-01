import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DetallesCotizacionClient from './detalles-cotizacion-client';

type QuoteData = {
  id: string;
  quote_number: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  client_company: string | null;
  service_type: string;
  description: string;
  valid_until: string;
  notes: string | null;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  quote_items: Array<{
    id: string;
    item_name: string;
    description: string;
    quantity: number;
    unit: string;
    unit_price: number;
    total: number;
  }>;
};

export default async function DetallesCotizacionPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  // Obtener la cotización
  const { data: quote, error } = await supabase
    .from('quotes')
    .select(`
      *,
      quote_items (*)
    `)
    .eq('id', params.id)
    .single();

  if (error || !quote) {
    redirect('/dashboard/cotizaciones');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Detalles de Cotización #{quote.quote_number}
            </h1>
            <p className="text-gray-600 mt-1">
              Cliente: {quote.client_name}
            </p>
          </div>
          <a
            href="/dashboard/cotizaciones"
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-100 transition"
          >
            ← Volver
          </a>
        </div>

        <DetallesCotizacionClient quote={quote as QuoteData} />
      </div>
    </div>
  );
}
