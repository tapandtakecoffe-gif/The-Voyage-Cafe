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
  payment_status?: 'not_required' | 'pending' | 'paid' | 'failed' | 'counter_pending';
  stripe_session_id?: string;
  payment_method?: 'stripe' | 'counter'; // Opcional - solo para mostrar
}

// Obtener las variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';

// Debug: Verificar variables (siempre, para diagnosticar en producción)
if (typeof window !== 'undefined') {
  console.log('🔍 Variables de entorno Supabase:');
  console.log('URL:', supabaseUrl || '❌ VACÍA');
  console.log('Key:', supabaseAnonKey ? '✅ Configurada (' + supabaseAnonKey.substring(0, 20) + '...)' : '❌ VACÍA');
  console.log('URL válida:', supabaseUrl.startsWith('http') ? '✅' : '❌');
}

// Verificar si Supabase está configurado correctamente
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && 
  supabaseUrl.length > 0 && supabaseAnonKey.length > 0 &&
  supabaseUrl.startsWith('http');

// Exportar función para verificar configuración
export const isSupabaseAvailable = () => isSupabaseConfigured;

// Crear cliente de Supabase de forma segura
// Si no está configurado, usamos valores placeholder válidos
const finalUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co';
const finalKey = isSupabaseConfigured ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

let supabase: ReturnType<typeof createClient>;
try {
  supabase = createClient(finalUrl, finalKey, {
    realtime: {
      params: {
        eventsPerSecond: 2  // Reducido de 10 a 2 para menor frecuencia
      }
    }
  });
  
  if (!isSupabaseConfigured) {
    console.warn('⚠️ Supabase no está configurado. Las órdenes se guardarán solo localmente.');
    console.warn('Por favor, configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en las variables de entorno de Vercel.');
    console.warn('URL recibida:', supabaseUrl || 'NINGUNA');
    console.warn('Key recibida:', supabaseAnonKey ? 'SÍ (pero puede ser inválida)' : 'NINGUNA');
  } else {
    console.log('✅ Supabase configurado correctamente');
  }
} catch (error) {
  // Si hay un error, intentar crear un cliente mínimo
  console.error('Error inicializando Supabase:', error);
  supabase = createClient('https://placeholder.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0');
}

export { supabase };

// Helper para convertir Order a OrderRow
export const orderToRow = (order: Order): Omit<OrderRow, 'created_at'> => {
  // Asegurar que timestamp sea una cadena ISO válida
  let timestampStr: string;
  if (order.timestamp instanceof Date) {
    timestampStr = order.timestamp.toISOString();
  } else if (typeof order.timestamp === 'string') {
    timestampStr = order.timestamp;
  } else {
    timestampStr = new Date().toISOString();
  }

  const row: any = {
    id: order.id,
    items: JSON.stringify(order.items),
    total: Number(order.total), // Asegurar que sea número
    status: order.status,
    customer_name: order.customerName,
    table_number: order.tableNumber || null,
    timestamp: timestampStr,
    payment_status: order.paymentStatus,
    stripe_session_id: order.stripeSessionId || null
  };
  
  // Agregar payment_method si existe (opcional, no crítico si la columna no existe)
  if (order.paymentMethod) {
    row.payment_method = order.paymentMethod;
  }
  
  return row;
};

// Helper para convertir OrderRow a Order
export const rowToOrder = (row: OrderRow): Order => ({
  id: row.id,
  items: JSON.parse(row.items),
  total: row.total,
  status: row.status,
  customerName: row.customer_name,
  tableNumber: row.table_number || undefined,
  timestamp: new Date(row.timestamp),
  paymentStatus: row.payment_status,
  stripeSessionId: row.stripe_session_id,
  paymentMethod: row.payment_method // Opcional - solo para mostrar
});

