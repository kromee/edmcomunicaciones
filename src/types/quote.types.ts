export type QuoteItem = {
  id: string;
  item_name: string;
  description: string;
  quantity: number;
  unit: 'PZA' | 'SERV';
  unit_price: number;
  percentage: number;
  total: number;
};

export type QuoteData = {
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
  quote_items: QuoteItem[];
};

export type QuoteFormData = {
  service_type: string;
  description: string;
  valid_until: string;
  notes: string;
  status: string;
};
