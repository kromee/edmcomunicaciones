-- =====================================================
-- EDM Comunicaciones - Schema de Base de Datos
-- Supabase PostgreSQL
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Tabla: users (Usuarios Admin)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer')),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =====================================================
-- Tabla: quotes (Cotizaciones)
-- =====================================================
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_number TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  client_company TEXT,
  service_type TEXT NOT NULL,
  description TEXT,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'sent')),
  pdf_url TEXT,
  notes TEXT,
  valid_until DATE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para quotes
CREATE INDEX idx_quotes_number ON quotes(quote_number);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_client_email ON quotes(client_email);
CREATE INDEX idx_quotes_created_by ON quotes(created_by);
CREATE INDEX idx_quotes_created_at ON quotes(created_at DESC);

-- =====================================================
-- Tabla: quote_items (Items de Cotización)
-- =====================================================
CREATE TABLE IF NOT EXISTS quote_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'PZA' CHECK (unit IN ('PZA', 'SERV')),
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para quote_items
CREATE INDEX idx_quote_items_quote_id ON quote_items(quote_id);

-- =====================================================
-- Tabla: clients (Clientes)
-- =====================================================
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
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_company ON clients(company);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_created_at ON clients(created_at DESC);
CREATE INDEX idx_clients_name ON clients(name);

-- =====================================================
-- Tabla: contacts (Contactos del Formulario)
-- =====================================================
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  service TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  notes TEXT,
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para contacts
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);

-- =====================================================
-- Funciones y Triggers
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para users
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para quotes
CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para clients
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para contacts
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para generar número de cotización automático
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TEXT AS $$
DECLARE
  year_month TEXT;
  sequence_num INTEGER;
  quote_num TEXT;
BEGIN
  year_month := TO_CHAR(NOW(), 'YYYYMM');
  
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(quote_number FROM 'COT-' || year_month || '-(\d+)') AS INTEGER)
  ), 0) + 1 INTO sequence_num
  FROM quotes
  WHERE quote_number LIKE 'COT-' || year_month || '-%';
  
  quote_num := 'COT-' || year_month || '-' || LPAD(sequence_num::TEXT, 4, '0');
  
  RETURN quote_num;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Políticas para users (solo admins pueden ver usuarios)
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para quotes (usuarios autenticados)
CREATE POLICY "Authenticated users can view quotes" ON quotes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create quotes" ON quotes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own quotes" ON quotes
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Admins can update all quotes" ON quotes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para quote_items
CREATE POLICY "Users can view quote items" ON quote_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_items.quote_id
      AND (quotes.created_by = auth.uid() OR EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
      ))
    )
  );

CREATE POLICY "Users can create quote items" ON quote_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Políticas para clients
CREATE POLICY "Authenticated users can view clients" ON clients
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create clients" ON clients
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update clients" ON clients
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete clients" ON clients
  FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para contacts
CREATE POLICY "Authenticated users can view contacts" ON contacts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create contacts" ON contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Assigned users can update contacts" ON contacts
  FOR UPDATE USING (
    assigned_to = auth.uid() OR EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- Datos iniciales (Usuario admin por defecto)
-- =====================================================

-- Insertar usuario admin inicial
-- Contraseña: admin123 (cambiar después del primer login)
-- Hash bcrypt de 'admin123'
INSERT INTO users (email, name, role, password_hash)
VALUES (
  'admin@edmcomunicaciones.com',
  'Administrador',
  'admin',
  '$2a$10$YourBcryptHashHere' -- Cambiar con hash real
)
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- Comentarios de documentación
-- =====================================================

COMMENT ON TABLE users IS 'Usuarios administradores del sistema';
COMMENT ON TABLE quotes IS 'Cotizaciones generadas para clientes';
COMMENT ON TABLE quote_items IS 'Items/productos/servicios de cada cotización';
COMMENT ON TABLE clients IS 'Base de datos de clientes de la empresa';
COMMENT ON TABLE contacts IS 'Contactos recibidos desde el formulario web';

COMMENT ON COLUMN quote_items.unit IS 'Unidad de medida: PZA (Pieza) o SERV (Servicio)';
COMMENT ON COLUMN quotes.status IS 'Estado: pending (pendiente), approved (aprobada), rejected (rechazada), sent (enviada)';
COMMENT ON COLUMN contacts.status IS 'Estado: new (nuevo), contacted (contactado), closed (cerrado)';
