-- Crear la tabla de órdenes
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  items TEXT NOT NULL, -- JSON string con los items de la orden
  total NUMERIC NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
  customer_name TEXT NOT NULL,
  table_number TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índice para búsquedas rápidas por timestamp
CREATE INDEX IF NOT EXISTS idx_orders_timestamp ON orders(timestamp DESC);

-- Habilitar Realtime para la tabla (esto permite sincronización en tiempo real)
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- Configurar políticas de seguridad (permite lectura y escritura para todos)
-- ⚠️ IMPORTANTE: En producción, deberías restringir esto según tus necesidades
CREATE POLICY "Enable all access for orders" ON orders
  FOR ALL
  USING (true)
  WITH CHECK (true);

