import { createClient } from '@supabase/supabase-js';
import { Order } from '@/types/product';

// Tipos para la base de datos
export interface OrderRow {
  id: string;
  items: string; // JSON string
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  customer_name: string;
  table_number?: string;
  timestamp: string;
  created_at?: string;
}

// Obtener las variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase no está configurado. Las órdenes se guardarán solo localmente.');
  console.warn('Por favor, configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo .env');
}

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Helper para convertir Order a OrderRow
export const orderToRow = (order: Order): Omit<OrderRow, 'created_at'> => ({
  id: order.id,
  items: JSON.stringify(order.items),
  total: order.total,
  status: order.status,
  customer_name: order.customerName,
  table_number: order.tableNumber || null,
  timestamp: order.timestamp instanceof Date 
    ? order.timestamp.toISOString() 
    : order.timestamp
});

// Helper para convertir OrderRow a Order
export const rowToOrder = (row: OrderRow): Order => ({
  id: row.id,
  items: JSON.parse(row.items),
  total: row.total,
  status: row.status,
  customerName: row.customer_name,
  tableNumber: row.table_number || undefined,
  timestamp: new Date(row.timestamp)
});

