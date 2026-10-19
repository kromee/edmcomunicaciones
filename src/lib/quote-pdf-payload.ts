import type { QuotePDFData } from '@/lib/pdf-generator';
import { normalizeQuoteItemUnit } from '@/lib/quote-item-units';
import { sortQuoteItems } from '@/lib/quote-item-order';

export type QuoteWithItemsRow = {
  quote_number: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  client_company: string | null;
  service_type: string;
  description: string | null;
  valid_until: string | null;
  custom_commercial_terms?: string | null;
  show_valid_until?: boolean | null;
  subtotal?: number | null;
  tax?: number | null;
  total_amount: number;
  created_at: string;
  quote_items?: Array<{
    item_name: string;
    description: string | null;
    quantity: number;
    unit: string;
    unit_price: number;
    percentage: number | null;
    total: number;
    sort_order?: number | null;
  }> | null;
};

export function buildQuotePDFDataFromRecord(quote: QuoteWithItemsRow): QuotePDFData {
  const orderedItems = sortQuoteItems(quote.quote_items || []);

  return {
    quote_number: quote.quote_number,
    client_name: quote.client_name,
    client_email: quote.client_email,
    client_phone: quote.client_phone || '',
    client_company: quote.client_company || '',
    service_type: quote.service_type,
    description: quote.description || '',
    valid_until: quote.valid_until || '',
    custom_commercial_terms: quote.custom_commercial_terms,
    show_valid_until: quote.show_valid_until !== undefined ? quote.show_valid_until : true,
    items: orderedItems.map((item) => ({
      item_name: item.item_name,
      description: item.description || '',
      quantity: item.quantity,
      unit: normalizeQuoteItemUnit(item.unit),
      unit_price: item.unit_price,
      percentage: item.percentage || 0,
      total: item.total,
    })),
    subtotal: Number(quote.subtotal ?? quote.total_amount),
    tax: Number(quote.tax ?? 0),
    total_amount: quote.total_amount,
    created_at: quote.created_at,
  };
}
