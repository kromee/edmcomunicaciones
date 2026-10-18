-- Si ya creaste catalog_items pero falla el acceso, ejecuta solo esto:

ALTER TABLE catalog_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "App access catalog_items" ON catalog_items;
CREATE POLICY "App access catalog_items" ON catalog_items
  FOR ALL USING (true) WITH CHECK (true);
