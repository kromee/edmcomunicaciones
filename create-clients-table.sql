-- =====================================================
-- Crear tabla de clientes
-- =====================================================

-- Tabla: clients (Clientes)
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'México',
  tax_id TEXT, -- RFC
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'prospect')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para clients
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_company ON clients(company);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Políticas para clients
CREATE POLICY "Authenticated users can view clients" ON clients
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create clients" ON clients
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update clients" ON clients
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete clients" ON clients
  FOR DELETE USING (auth.role() = 'authenticated');

-- Comentarios
COMMENT ON TABLE clients IS 'Base de datos de clientes de la empresa';
COMMENT ON COLUMN clients.status IS 'Estado: active (activo), inactive (inactivo), prospect (prospecto)';
