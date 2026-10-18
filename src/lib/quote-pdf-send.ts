import type { SupabaseClient } from '@supabase/supabase-js';
import { generateQuotePDF } from '@/lib/pdf-generator';
import {
  buildQuotePDFDataFromRecord,
  type QuoteWithItemsRow,
} from '@/lib/quote-pdf-payload';
import { sendQuoteEmail, isQuoteEmailConfigured } from '@/lib/quote-email';

export async function fetchQuoteWithItems(
  supabase: SupabaseClient,
  quoteId: string
): Promise<QuoteWithItemsRow | null> {
  const { data, error } = await supabase
    .from('quotes')
    .select(`*, quote_items (*)`)
    .eq('id', quoteId)
    .order('sort_order', { foreignTable: 'quote_items', ascending: true })
    .single();

  if (error || !data) return null;
  return data as QuoteWithItemsRow;
}

async function generateQuotePdfBase64(
  quote: QuoteWithItemsRow
): Promise<string> {
  const pdfData = buildQuotePDFDataFromRecord(quote);
  const pdf = await generateQuotePDF(pdfData);
  return pdf.output('datauristring').split(',')[1] || '';
}

export async function logQuoteSend(
  supabase: SupabaseClient,
  input: {
    quoteId: string;
    recipientEmail: string;
    status: 'sent' | 'failed' | 'skipped';
    errorMessage?: string | null;
    sentBy: string | null;
  }
) {
  await supabase.from('quote_send_logs').insert({
    quote_id: input.quoteId,
    recipient_email: input.recipientEmail,
    channel: 'email',
    status: input.status,
    error_message: input.errorMessage || null,
    sent_by: input.sentBy,
  });
}

/**
 * Genera el PDF en memoria, envía por correo si EmailJS está configurado
 * y registra el historial. No guarda archivos en Storage.
 */
export async function sendQuotePdfByEmail(
  supabase: SupabaseClient,
  quoteId: string,
  sentBy: string | null,
  recipientEmail?: string
): Promise<{
  ok: boolean;
  error?: string;
  hint?: string;
  emailStatus?: 'sent' | 'failed' | 'skipped';
}> {
  const quote = await fetchQuoteWithItems(supabase, quoteId);
  if (!quote) {
    return { ok: false, error: 'Cotización no encontrada' };
  }

  const to = (recipientEmail || quote.client_email || '').trim();
  if (!to) {
    return { ok: false, error: 'Falta el correo del cliente' };
  }

  if (!isQuoteEmailConfigured()) {
    await logQuoteSend(supabase, {
      quoteId,
      recipientEmail: to,
      status: 'skipped',
      errorMessage: 'EmailJS no configurado',
      sentBy,
    });
    return { ok: true, emailStatus: 'skipped' };
  }

  let pdfBase64: string;
  try {
    pdfBase64 = await generateQuotePdfBase64(quote);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al generar PDF';
    return { ok: false, error: message };
  }

  const emailResult = await sendQuoteEmail({
    to_email: to,
    client_name: quote.client_name,
    quote_number: quote.quote_number,
    total_amount: quote.total_amount,
    pdfBase64,
  });

  if (emailResult.ok) {
    await logQuoteSend(supabase, {
      quoteId,
      recipientEmail: to,
      status: 'sent',
      sentBy,
    });
    await supabase.from('quotes').update({ status: 'sent' }).eq('id', quoteId);
    return { ok: true, emailStatus: 'sent' };
  }

  await logQuoteSend(supabase, {
    quoteId,
    recipientEmail: to,
    status: 'failed',
    errorMessage: emailResult.error,
    sentBy,
  });

  return {
    ok: false,
    error: emailResult.error,
    emailStatus: 'failed',
  };
}

export function quoteSendLogsTableHint(errorMessage: string): string | undefined {
  const msg = errorMessage.toLowerCase();
  if (msg.includes('quote_send_logs') && msg.includes('does not exist')) {
    return 'Ejecuta scripts/p1-quote-send-logs.sql en Supabase.';
  }
  return undefined;
}
