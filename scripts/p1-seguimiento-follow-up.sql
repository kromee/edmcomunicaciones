-- P1: Seguimiento comercial — próxima acción y fecha de seguimiento en contactos
-- Ejecutar una vez en Supabase SQL Editor (BD existente)

ALTER TABLE contacts
  ADD COLUMN IF NOT EXISTS follow_up_date DATE,
  ADD COLUMN IF NOT EXISTS next_action TEXT;

CREATE INDEX IF NOT EXISTS idx_contacts_follow_up_date ON contacts(follow_up_date);

COMMENT ON COLUMN contacts.follow_up_date IS 'Fecha acordada para dar seguimiento al lead';
COMMENT ON COLUMN contacts.next_action IS 'Próxima acción comercial (llamar, enviar cotización, etc.)';
