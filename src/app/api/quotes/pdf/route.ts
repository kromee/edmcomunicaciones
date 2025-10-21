import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { generateQuotePDF } from '@/lib/pdf-generator';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { quoteId } = body;

    // Obtener la cotización con sus items
    const { data: quote, error } = await supabase
      .from('quotes')
      .select(`
        *,
        quote_items (*)
      `)
      .eq('id', quoteId)
      .single();

    if (error || !quote) {
      return NextResponse.json(
        { success: false, error: 'Cotización no encontrada' },
        { status: 404 }
      );
    }

    // Preparar datos para el PDF
    const quoteForPDF = {
      quote_number: quote.quote_number,
      client_name: quote.client_name,
      client_email: quote.client_email,
      client_phone: quote.client_phone,
      client_company: quote.client_company,
      service_type: quote.service_type,
      description: quote.description,
      valid_until: quote.valid_until,
      custom_commercial_terms: quote.custom_commercial_terms,
      items: (quote.quote_items || []).map((item: any) => ({
        item_name: item.item_name,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        percentage: item.percentage,
        total: item.total
      })),
      subtotal: quote.total_amount,
      tax: 0,
      total_amount: quote.total_amount,
      created_at: quote.created_at
    };

    // Generar PDF
    const pdfDoc = await generateQuotePDF(quoteForPDF);
    const pdfArrayBuffer = pdfDoc.output('arraybuffer');

    return new NextResponse(pdfArrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="cotizacion-${quote.quote_number}.pdf"`
      }
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { success: false, error: 'Error al generar el PDF' },
      { status: 500 }
    );
  }
}
