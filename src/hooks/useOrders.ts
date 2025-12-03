import { create } from 'zustand';
import { Order } from '@/types/product';

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

// Get server URL - use current hostname with port 3000 for server
const getServerUrl = () => {
  if (typeof window === 'undefined') return '';
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const hostname = window.location.hostname;
  const port = '3000';
  return `${protocol}//${hostname}:${port}`;
};

const getApiUrl = () => {
  if (typeof window === 'undefined') return '';
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = '3000';
  return `${protocol}//${hostname}:${port}`;
};

// Check if server is available
const checkServerAvailable = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const response = await fetch(`${getApiUrl()}/api/orders`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
};

const STORAGE_KEY = 'tap_n_take_orders_v5';

// Limpiar claves antiguas del localStorage
if (typeof window !== 'undefined') {
  ['tap_n_take_orders_v1', 'tap_n_take_orders_v2', 'tap_n_take_orders_v3', 'tap_n_take_orders_v4'].forEach(key => {
    localStorage.removeItem(key);
  });
}

// Helper to save orders to localStorage
const saveOrders = (orders: Order[]) => {
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

// Helper to load orders from localStorage
const loadOrders = (): Order[] => {
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

// WebSocket connection management
let ws: WebSocket | null = null;
let reconnectTimeout: NodeJS.Timeout | null = null;

export const useOrders = create<OrdersStore>((set, get) => {
  const connectWebSocket = async () => {
    if (typeof window === 'undefined') return;
    
    // Check if server is available first
    const serverAvailable = await checkServerAvailable();
    if (!serverAvailable) {
      console.log('Server not available, using localStorage only');
      set({ wsConnected: false });
      const loaded = loadOrders();
      set({ orders: loaded });
      return;
    }
    
    const wsUrl = getServerUrl();
    if (!wsUrl) return;
    
    // Close existing connection
    if (ws) {
      ws.close();
    }
    
    try {
      ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        set({ wsConnected: true });
        // Request current orders
        fetch(`${getApiUrl()}/api/orders`)
          .then(res => res.json())
          .then(orders => {
            const parsedOrders = orders.map((order: any) => ({
              ...order,
              timestamp: new Date(order.timestamp)
            }));
            set({ orders: parsedOrders });
            saveOrders(parsedOrders);
          })
          .catch(err => {
            console.error('Error fetching orders:', err);
            // Fallback to localStorage
            const loaded = loadOrders();
            set({ orders: loaded });
          });
      };
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'orders') {
            const parsedOrders = message.data.map((order: any) => ({
              ...order,
              timestamp: new Date(order.timestamp)
            }));
            set({ orders: parsedOrders });
            saveOrders(parsedOrders);
          } else if (message.type === 'new_order') {
            const order = {
              ...message.data,
              timestamp: new Date(message.data.timestamp)
            };
            const newOrders = [order, ...get().orders];
            set({ orders: newOrders });
            saveOrders(newOrders);
          } else if (message.type === 'order_updated') {
            const updatedOrder = {
              ...message.data,
              timestamp: new Date(message.data.timestamp)
            };
            const updatedOrders = get().orders.map(order =>
              order.id === updatedOrder.id ? updatedOrder : order
            );
            set({ orders: updatedOrders });
            saveOrders(updatedOrders);
          } else if (message.type === 'orders_cleared') {
            set({ orders: [] });
            localStorage.removeItem(STORAGE_KEY);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        set({ wsConnected: false });
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected');
        set({ wsConnected: false });
        // Only reconnect if we're not in a manual close
        if (reconnectTimeout) clearTimeout(reconnectTimeout);
        reconnectTimeout = setTimeout(() => {
          connectWebSocket();
        }, 5000);
      };
    } catch (error) {
      console.error('Error connecting WebSocket:', error);
      set({ wsConnected: false });
      // Fallback to localStorage
      const loaded = loadOrders();
      set({ orders: loaded });
    }
  };
  
  const store = {
    orders: loadOrders(),
    wsConnected: false,
    
    loadOrders: () => {
      // Try to fetch from server first, fallback to localStorage
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      fetch(`${getApiUrl()}/api/orders`, {
        signal: controller.signal
      })
        .finally(() => clearTimeout(timeoutId))
        .then(res => res.json())
        .then(orders => {
          const parsedOrders = orders.map((order: any) => ({
            ...order,
            timestamp: new Date(order.timestamp)
          }));
          set({ orders: parsedOrders });
          saveOrders(parsedOrders);
        })
        .catch(() => {
          // Fallback to localStorage if server unavailable
          const loaded = loadOrders();
          set({ orders: loaded });
        });
    },
    
    addOrder: async (order) => {
      // Save locally first for immediate feedback
      const newOrders = [order, ...get().orders];
      set({ orders: newOrders });
      saveOrders(newOrders);
      
      // Try to send to server (non-blocking)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const response = await fetch(`${getApiUrl()}/api/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...order,
            timestamp: order.timestamp instanceof Date ? order.timestamp.toISOString() : order.timestamp
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error('Failed to sync order');
      } catch (error) {
        // Silently fail - order is already saved locally
        // Only log in development
        if (import.meta.env.DEV) {
          console.log('Server not available, order saved locally only');
        }
      }
    },
    
    updateOrderStatus: async (orderId, status) => {
      // Update locally first
      const updatedOrders = get().orders.map(order =>
        order.id === orderId ? { ...order, status } : order
      );
      set({ orders: updatedOrders });
      saveOrders(updatedOrders);
      
      // Try to send to server (non-blocking)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const response = await fetch(`${getApiUrl()}/api/orders/${orderId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error('Failed to sync status update');
      } catch (error) {
        // Silently fail - status is already updated locally
        if (import.meta.env.DEV) {
          console.log('Server not available, status updated locally only');
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
      
      // Clear on server
      try {
        await fetch(`${getApiUrl()}/api/orders`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error clearing orders on server:', error);
      }
    }
  };
  
  // Connect WebSocket after store is created (only if server available)
  if (typeof window !== 'undefined') {
    // Try to connect asynchronously after a small delay to ensure store is ready
    setTimeout(() => {
      connectWebSocket();
    }, 100);
  }
  
  return store;
});
