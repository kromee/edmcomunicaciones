import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyQuoteDownloadToken } from '@/lib/quote-download-token';
import { generateQuotePDF } from '@/lib/pdf-generator';
import { buildQuotePDFDataFromRecord } from '@/lib/quote-pdf-payload';
import { fetchQuoteWithItems } from '@/lib/quote-pdf-send';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ error: 'Enlace inválido' }, { status: 400 });
  }

  const verified = verifyQuoteDownloadToken(token);
  if (!verified) {
    return NextResponse.json(
      { error: 'Enlace expirado o inválido' },
      { status: 403 }
    );
  }

  const supabase = createClient();
  const quote = await fetchQuoteWithItems(supabase, verified.quoteId);
  if (!quote) {
    return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 });
  }

  try {
    const pdf = await generateQuotePDF(buildQuotePDFDataFromRecord(quote));
    const bytes = pdf.output('arraybuffer') as ArrayBuffer;
    const fileName = `${quote.quote_number || 'cotizacion'}.pdf`;

    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (err) {
    console.error('public-download PDF error:', err);
    return NextResponse.json({ error: 'No se pudo generar el PDF' }, { status: 500 });
  }
}
