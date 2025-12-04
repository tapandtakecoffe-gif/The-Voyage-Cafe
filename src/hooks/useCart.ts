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
  getCoffeeDiscount: () => number;
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
    const state = get();
    
    // Calculate regular total (coffees with price 0 are already free)
    const regularTotal = state.items.reduce((total, item) => {
      const itemPrice = item.price * item.quantity;
      const addOnsPrice = item.selectedAddOns?.reduce((sum, addOnId) => {
        const addOnProduct = products.find((p: Product) => p.id === addOnId);
        return sum + ((addOnProduct?.price || 0) * item.quantity);
      }, 0) || 0;
      return total + itemPrice + addOnsPrice;
    }, 0);
    
    return regularTotal;
  },
  
  getCoffeeDiscount: () => {
    // Calculate discount from free coffees (price = 0)
    const state = get();
    const coffeeCategories = ['hot-coffees', 'iced-coffees', 'cold-brews'];
    const freeCoffees = state.items.filter(item => 
      coffeeCategories.includes(item.category) && item.price === 0
    );
    
    // Get original prices from description or by finding matching products
    const discount = freeCoffees.reduce((sum, freeCoffee) => {
      // Try to extract original price from description
      const priceMatch = freeCoffee.description?.match(/\[Original Price: ₹(\d+)\]/);
      if (priceMatch) {
        return sum + (parseInt(priceMatch[1]) * freeCoffee.quantity);
      }
      
      // Fallback: find original product by ID (remove -2x1-free suffix)
      const originalId = freeCoffee.id.replace('-2x1-free', '');
      const originalCoffee = products.find((p: Product) => p.id === originalId);
      return sum + ((originalCoffee?.price || 0) * freeCoffee.quantity);
    }, 0);
    
    return discount;
  }
}));
