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
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';

// Verificar si Supabase está configurado correctamente
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && 
  supabaseUrl.length > 0 && supabaseAnonKey.length > 0 &&
  supabaseUrl.startsWith('http');

// Crear cliente de Supabase de forma segura
// Si no está configurado, usamos valores placeholder válidos
const finalUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co';
const finalKey = isSupabaseConfigured ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

let supabase: ReturnType<typeof createClient>;
try {
  supabase = createClient(finalUrl, finalKey, {
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  });
  
  if (!isSupabaseConfigured) {
    console.warn('⚠️ Supabase no está configurado. Las órdenes se guardarán solo localmente.');
    console.warn('Por favor, configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en las variables de entorno de Vercel.');
  }
} catch (error) {
  // Si hay un error, intentar crear un cliente mínimo
  console.error('Error inicializando Supabase:', error);
  supabase = createClient('https://placeholder.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0');
}

export { supabase };

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

