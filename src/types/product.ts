export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'today-offers' | 'voyage-breakfast-board' | 'voyage-eggs' | 'eggs-benedict' | 'all-day-breakfast' | 'open-toasties' | 'smoothie-bowls' | 'appetizing-morsels' | 'panini-sandwiches' | 'burgers' | 'homemade-soups' | 'farm-fresh-salads' | 'thin-crust-pizza' | 'veg-pasta' | 'non-veg-pasta' | 'meal-bowls' | 'voyage-steaks' | 'keto' | 'desserts' | 'hot-coffees' | 'iced-coffees' | 'cold-brews' | 'specialty-tea' | 'shakes' | 'mocktails-iced-teas' | 'fresh-juices-coolers';
  calories?: number;
  ingredients?: string[];
  isVeggie?: boolean;
  isAddOn?: boolean; // True if this is an add-on product
  addOns?: string[]; // Array of add-on product IDs that can be added to this product
  isSpecialOffer?: boolean; // True if this is a special offer product
}

export interface CartItem extends Product {
  quantity: number;
  selectedAddOns?: string[]; // Array of selected add-on product IDs
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  customerName: string;
  tableNumber?: string; // Table number for the order
  timestamp: Date;
  paymentStatus?: 'not_required' | 'pending' | 'paid' | 'failed' | 'counter_pending'; // Estado del pago
  stripeSessionId?: string; // ID de sesión de Stripe
  paymentMethod?: 'stripe' | 'counter'; // Método de pago seleccionado
}
