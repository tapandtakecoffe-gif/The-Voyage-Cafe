-- Agregar columnas de pago a la tabla orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'not_required',
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

