import { create } from 'zustand';
import { CartItem, Product } from '@/types/product';
import { products } from '@/data/products';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, selectedAddOns?: string[]) => void;
  removeItem: (itemKey: string) => void;
  updateQuantity: (itemKey: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

// Helper to generate unique key for cart items
const getItemKey = (item: CartItem): string => {
  return `${item.id}-${item.selectedAddOns?.sort().join(',') || ''}`;
};

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  
  addItem: (product, selectedAddOns) => {
    set((state) => {
      // Create a unique key for this item with its add-ons
      const itemKey = `${product.id}-${selectedAddOns?.sort().join(',') || ''}`;
      const existingItem = state.items.find(item => {
        const itemKey2 = `${item.id}-${item.selectedAddOns?.sort().join(',') || ''}`;
        return itemKey === itemKey2;
      });
      
      if (existingItem) {
        return {
          items: state.items.map(item => {
            const itemKey2 = `${item.id}-${item.selectedAddOns?.sort().join(',') || ''}`;
            if (itemKey === itemKey2) {
              return { ...item, quantity: item.quantity + 1 };
            }
            return item;
          })
        };
      }
      
      return {
        items: [...state.items, { ...product, quantity: 1, selectedAddOns: selectedAddOns || [] }]
      };
    });
  },
  
  removeItem: (itemKey) => {
    set((state) => ({
      items: state.items.filter(item => getItemKey(item) !== itemKey)
    }));
  },
  
  updateQuantity: (itemKey, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemKey);
      return;
    }
    
    set((state) => ({
      items: state.items.map(item =>
        getItemKey(item) === itemKey
          ? { ...item, quantity }
          : item
      )
    }));
  },
  
  clearCart: () => set({ items: [] }),
  
  getTotal: () => {
    return get().items.reduce((total, item) => {
      const itemPrice = item.price * item.quantity;
      const addOnsPrice = item.selectedAddOns?.reduce((sum, addOnId) => {
        const addOnProduct = products.find((p: Product) => p.id === addOnId);
        return sum + ((addOnProduct?.price || 0) * item.quantity);
      }, 0) || 0;
      return total + itemPrice + addOnsPrice;
    }, 0);
  }
}));
