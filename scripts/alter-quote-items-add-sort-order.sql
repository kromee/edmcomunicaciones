-- Orden de partidas/corridas en cotizaciones.
-- Ejecutar en Supabase SQL Editor.

ALTER TABLE quote_items
  ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

-- Rellenar orden actual por fecha de creación
WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY quote_id
      ORDER BY created_at ASC, id ASC
    ) - 1 AS rn
  FROM quote_items
)
UPDATE quote_items qi
SET sort_order = ranked.rn
FROM ranked
WHERE qi.id = ranked.id;

CREATE INDEX IF NOT EXISTS idx_quote_items_quote_sort
  ON quote_items (quote_id, sort_order);

COMMENT ON COLUMN quote_items.sort_order IS
  'Posición de la partida/corrida dentro de la cotización (0-based). Incluye corridas vacías.';
