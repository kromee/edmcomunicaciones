-- P1: Catálogo de conceptos reutilizables en cotizaciones
-- Ejecutar una vez en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS catalog_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  default_quantity INTEGER NOT NULL DEFAULT 1 CHECK (default_quantity >= 0),
  unit TEXT NOT NULL DEFAULT 'PZA' CHECK (unit IN ('PZA', 'SERV', 'MTR')),
  default_unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  default_percentage DECIMAL(10,2) NOT NULL DEFAULT 0,
  category TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_catalog_items_active ON catalog_items(is_active);
CREATE INDEX IF NOT EXISTS idx_catalog_items_sort ON catalog_items(sort_order, title);

COMMENT ON TABLE catalog_items IS 'Partidas reutilizables para el cotizador';
