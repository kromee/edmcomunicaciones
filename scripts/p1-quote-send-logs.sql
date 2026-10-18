-- P1-3: Historial de envíos de cotizaciones (sin almacenar PDF en disco)
-- Ejecutar una vez en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS quote_send_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'email',
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'skipped')),
  error_message TEXT,
  sent_by UUID REFERENCES users(id),
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quote_send_logs_quote ON quote_send_logs(quote_id, sent_at DESC);

COMMENT ON TABLE quote_send_logs IS 'Historial de envíos por email; el PDF se genera al vuelo, no se guarda en Storage';

ALTER TABLE quote_send_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "App access quote_send_logs" ON quote_send_logs;
CREATE POLICY "App access quote_send_logs" ON quote_send_logs
  FOR ALL USING (true) WITH CHECK (true);
