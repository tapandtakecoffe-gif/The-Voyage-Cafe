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
    
    // Calculate coffee items for 2x1 offer
    const coffeeCategories = ['hot-coffees', 'iced-coffees', 'cold-brews'];
    const coffeeItems = state.items.filter(item => 
      coffeeCategories.includes(item.category)
    );
    
    // Calculate total coffee quantity
    const totalCoffeeQuantity = coffeeItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Calculate coffee discount (2x1: pay for half rounded up)
    const coffeeDiscount = coffeeItems.reduce((discount, item) => {
      // For each pair, customer pays for 1 instead of 2
      const pairs = Math.floor(item.quantity / 2);
      const freeItems = pairs; // Number of free items
      return discount + (item.price * freeItems);
    }, 0);
    
    // Calculate regular total
    const regularTotal = state.items.reduce((total, item) => {
      const itemPrice = item.price * item.quantity;
      const addOnsPrice = item.selectedAddOns?.reduce((sum, addOnId) => {
        const addOnProduct = products.find((p: Product) => p.id === addOnId);
        return sum + ((addOnProduct?.price || 0) * item.quantity);
      }, 0) || 0;
      return total + itemPrice + addOnsPrice;
    }, 0);
    
    // Apply coffee discount
    return regularTotal - coffeeDiscount;
  },
  
  getCoffeeDiscount: () => {
    const state = get();
    const coffeeCategories = ['hot-coffees', 'iced-coffees', 'cold-brews'];
    const coffeeItems = state.items.filter(item => 
      coffeeCategories.includes(item.category)
    );
    
    const coffeeDiscount = coffeeItems.reduce((discount, item) => {
      const pairs = Math.floor(item.quantity / 2);
      const freeItems = pairs;
      return discount + (item.price * freeItems);
    }, 0);
    
    return coffeeDiscount;
  }
}));
