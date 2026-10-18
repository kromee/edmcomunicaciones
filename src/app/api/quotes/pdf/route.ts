import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { generateQuotePDF } from '@/lib/pdf-generator';
import { buildQuotePDFDataFromRecord } from '@/lib/quote-pdf-payload';
import { requireAuthenticatedApi } from '@/lib/api-security';

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedApi();
    if (auth instanceof NextResponse) return auth;

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
      .order('sort_order', { foreignTable: 'quote_items', ascending: true })
      .single();

    if (error || !quote) {
      return NextResponse.json(
        { success: false, error: 'Cotización no encontrada' },
        { status: 404 }
      );
    }

    const quoteForPDF = buildQuotePDFDataFromRecord(quote);

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
