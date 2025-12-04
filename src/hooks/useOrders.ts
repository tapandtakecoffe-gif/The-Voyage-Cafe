import { create } from 'zustand';
import { Order } from '@/types/product';
import { supabase, orderToRow, rowToOrder } from '@/lib/supabase';

interface OrdersStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getUserOrders: (userId: string) => Order[];
  loadOrders: () => void;
  clearAllOrders: () => void;
  wsConnected: boolean;
}

const STORAGE_KEY = 'tap_n_take_orders_v6';

// Limpiar claves antiguas del localStorage
if (typeof window !== 'undefined') {
  ['tap_n_take_orders_v1', 'tap_n_take_orders_v2', 'tap_n_take_orders_v3', 'tap_n_take_orders_v4', 'tap_n_take_orders_v5'].forEach(key => {
    localStorage.removeItem(key);
  });
}

// Helper to save orders to localStorage (fallback)
const saveOrdersToLocal = (orders: Order[]) => {
  try {
    const serialized = JSON.stringify(orders.map(order => ({
      ...order,
      timestamp: order.timestamp instanceof Date ? order.timestamp.toISOString() : order.timestamp
    })));
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Error saving orders to localStorage:', error);
  }
};

// Helper to load orders from localStorage (fallback)
const loadOrdersFromLocal = (): Order[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((order: any) => ({
        ...order,
        timestamp: new Date(order.timestamp)
      }));
    }
  } catch (error) {
    console.error('Error loading orders from localStorage:', error);
  }
  return [];
};

// Verificar si Supabase está configurado
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';
  const configured = !!(url && key && url.length > 0 && key.length > 0 && url.startsWith('http'));
  
  // Debug en consola
  if (!configured && typeof window !== 'undefined') {
    console.warn('⚠️ Supabase no está configurado correctamente');
    console.warn('URL:', url || 'VACÍA');
    console.warn('Key:', key ? 'Configurada' : 'VACÍA');
    console.warn('Verifica las variables de entorno en Vercel: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY');
  }
  
  return configured;
};

export const useOrders = create<OrdersStore>((set, get) => {
  let supabaseChannel: ReturnType<typeof supabase.channel> | null = null;
  let reconnectTimeout: NodeJS.Timeout | null = null;

  const connectSupabase = async () => {
    if (typeof window === 'undefined') return;
    
    // Si Supabase no está configurado, usar solo localStorage
    if (!isSupabaseConfigured()) {
      console.log('Supabase no configurado, usando localStorage solo');
      set({ wsConnected: false });
      const loaded = loadOrdersFromLocal();
      set({ orders: loaded });
      return;
    }

    try {
      // Cargar órdenes iniciales desde Supabase (sin límite explícito)
      // PostgREST tiene un límite por defecto, pero podemos usar range para obtener más
      const { data: initialOrders, error: fetchError, count } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .order('timestamp', { ascending: false })
        .range(0, 99999); // Rango muy amplio para cargar todas las órdenes

      if (fetchError) {
        console.error('Error cargando órdenes desde Supabase:', fetchError);
        // Fallback a localStorage
        const loaded = loadOrdersFromLocal();
        set({ orders: loaded });
        set({ wsConnected: false });
        return;
      }

      // Debug: Ver cuántas órdenes se cargaron
      console.log(`📦 Órdenes cargadas desde Supabase: ${initialOrders?.length || 0} de ${count || 'desconocido'} totales`);

      // Convertir órdenes de la base de datos al formato de la app
      const orders = initialOrders ? initialOrders.map(rowToOrder) : [];
      set({ orders });
      saveOrdersToLocal(orders); // Guardar como backup local
      set({ wsConnected: true });

      // Configurar suscripción en tiempo real
      if (supabaseChannel) {
        await supabaseChannel.unsubscribe();
      }

      supabaseChannel = supabase
        .channel('orders-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders'
          },
          async (payload) => {
            console.log('Cambio recibido desde Supabase:', payload.eventType);

            if (payload.eventType === 'INSERT') {
              // Nueva orden
              const newOrder = rowToOrder(payload.new as any);
              const currentOrders = get().orders;
              // Verificar que no existe ya (evitar duplicados)
              if (!currentOrders.find(o => o.id === newOrder.id)) {
                const updatedOrders = [newOrder, ...currentOrders];
                set({ orders: updatedOrders });
                saveOrdersToLocal(updatedOrders);
              }
            } else if (payload.eventType === 'UPDATE') {
              // Orden actualizada
              const updatedOrder = rowToOrder(payload.new as any);
              const updatedOrders = get().orders.map(order =>
                order.id === updatedOrder.id ? updatedOrder : order
              );
              set({ orders: updatedOrders });
              saveOrdersToLocal(updatedOrders);
            } else if (payload.eventType === 'DELETE') {
              // Orden eliminada
              const deletedId = payload.old.id;
              const updatedOrders = get().orders.filter(order => order.id !== deletedId);
              set({ orders: updatedOrders });
              saveOrdersToLocal(updatedOrders);
            }
          }
        )
        .subscribe((status) => {
          console.log('Estado de suscripción Supabase:', status);
          if (status === 'SUBSCRIBED') {
            set({ wsConnected: true });
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            set({ wsConnected: false });
            // Intentar reconectar después de 5 segundos
            if (reconnectTimeout) clearTimeout(reconnectTimeout);
            reconnectTimeout = setTimeout(() => {
              connectSupabase();
            }, 5000);
          }
        });

    } catch (error) {
      console.error('Error conectando a Supabase:', error);
      set({ wsConnected: false });
      // Fallback a localStorage
      const loaded = loadOrdersFromLocal();
      set({ orders: loaded });
    }
  };

  const store = {
    orders: loadOrdersFromLocal(),
    wsConnected: false,
    
    loadOrders: async () => {
      if (!isSupabaseConfigured()) {
        const loaded = loadOrdersFromLocal();
        set({ orders: loaded });
        return;
      }

      try {
        const { data, error, count } = await supabase
          .from('orders')
          .select('*', { count: 'exact' })
          .order('timestamp', { ascending: false })
          .range(0, 99999); // Rango muy amplio para cargar todas las órdenes

        if (error) throw error;

        // Debug: Ver cuántas órdenes se cargaron
        console.log(`📦 Órdenes recargadas desde Supabase: ${data?.length || 0} de ${count || 'desconocido'} totales`);

        const orders = data ? data.map(rowToOrder) : [];
        set({ orders });
        saveOrdersToLocal(orders);
      } catch (error) {
        console.error('Error cargando órdenes:', error);
        const loaded = loadOrdersFromLocal();
        set({ orders: loaded });
      }
    },
    
    addOrder: async (order) => {
      // Guardar localmente primero para feedback inmediato
      const newOrders = [order, ...get().orders];
      set({ orders: newOrders });
      saveOrdersToLocal(newOrders);

      // Si Supabase está configurado, guardar en la base de datos
      if (isSupabaseConfigured()) {
        try {
          const orderRow = orderToRow(order);
          const { error } = await supabase
            .from('orders')
            .insert([orderRow]);

          if (error) {
            console.error('Error guardando orden en Supabase:', error);
            // La orden ya está guardada localmente, así que no es crítico
          }
        } catch (error) {
          console.error('Error guardando orden:', error);
        }
      }
    },
    
    updateOrderStatus: async (orderId, status) => {
      // Actualizar localmente primero
      const updatedOrders = get().orders.map(order =>
        order.id === orderId ? { ...order, status } : order
      );
      set({ orders: updatedOrders });
      saveOrdersToLocal(updatedOrders);

      // Si Supabase está configurado, actualizar en la base de datos
      if (isSupabaseConfigured()) {
        try {
          const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId);

          if (error) {
            console.error('Error actualizando estado en Supabase:', error);
          }
        } catch (error) {
          console.error('Error actualizando estado:', error);
        }
      }
    },
    
    getOrderById: (orderId) => {
      const allOrders = get().orders;
      return allOrders.find(order => order.id === orderId);
    },
    
    getUserOrders: (userId) => {
      const allOrders = get().orders;
      return allOrders.filter(order => order.userId === userId);
    },
    
    clearAllOrders: async () => {
      set({ orders: [] });
      localStorage.removeItem(STORAGE_KEY);

      // Si Supabase está configurado, eliminar todas las órdenes
      if (isSupabaseConfigured()) {
        try {
          // Obtener todos los IDs primero
          const { data: allOrders } = await supabase
            .from('orders')
            .select('id');
          
          if (allOrders && allOrders.length > 0) {
            const ids = allOrders.map(o => o.id);
            const { error } = await supabase
              .from('orders')
              .delete()
              .in('id', ids);

            if (error) {
              console.error('Error eliminando órdenes en Supabase:', error);
            }
          }
        } catch (error) {
          console.error('Error eliminando órdenes:', error);
        }
      }
    }
  };
  
  // Conectar a Supabase después de crear el store
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      connectSupabase();
    }, 100);
  }
  
  return store;
});
