-- P0: Embudo comercial — vínculo estable contacto / cliente / cotización
-- Ejecutar en Supabase SQL Editor (una vez por entorno)

-- 1) Columnas de relación
ALTER TABLE contacts
  ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id) ON DELETE SET NULL;

ALTER TABLE quotes
  ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_contacts_client_id ON contacts(client_id);
CREATE INDEX IF NOT EXISTS idx_quotes_client_id ON quotes(client_id);

-- 2) Backfill cotizaciones existentes por email
UPDATE quotes q
SET client_id = c.id
FROM clients c
WHERE q.client_id IS NULL
  AND lower(trim(q.client_email)) = lower(trim(c.email));

-- 3) Backfill contactos existentes por email
UPDATE contacts ct
SET client_id = c.id
FROM clients c
WHERE ct.client_id IS NULL
  AND lower(trim(ct.email)) = lower(trim(c.email));

COMMENT ON COLUMN contacts.client_id IS 'Cliente vinculado al convertir el lead';
COMMENT ON COLUMN quotes.client_id IS 'Cliente al que pertenece la cotización';
