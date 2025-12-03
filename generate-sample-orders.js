// Script para generar órdenes de ejemplo de los últimos 7 días
// Ejecuta este script en la consola del navegador (F12 > Console) cuando tengas la aplicación abierta

const STORAGE_KEY = 'tap_n_take_orders_v5';

// IDs de productos reales del catálogo (diversos)
const productIds = [
  'voyage-breakfast-board-1', 'voyage-breakfast-board-2', 'voyage-breakfast-board-3', 'voyage-breakfast-board-4',
  'voyage-eggs-1', 'voyage-eggs-2', 'voyage-eggs-3', 'voyage-eggs-4', 'voyage-eggs-5',
  'eggs-benedict-1', 'eggs-benedict-2', 'eggs-benedict-3',
  'all-day-breakfast-1', 'all-day-breakfast-2', 'all-day-breakfast-3', 'all-day-breakfast-4', 'all-day-breakfast-5',
  'open-toasties-1', 'open-toasties-2', 'open-toasties-3', 'open-toasties-4', 'open-toasties-5', 'open-toasties-6',
  'smoothie-bowls-1', 'smoothie-bowls-2', 'smoothie-bowls-3', 'smoothie-bowls-4', 'smoothie-bowls-5', 'smoothie-bowls-6', 'smoothie-bowls-7',
  'appetizing-morsels-1', 'appetizing-morsels-2', 'appetizing-morsels-3', 'appetizing-morsels-7', 'appetizing-morsels-8', 'appetizing-morsels-9',
  'panini-sandwiches-1', 'panini-sandwiches-2', 'panini-sandwiches-3', 'panini-sandwiches-4', 'panini-sandwiches-5',
  'burgers-1', 'burgers-2', 'burgers-3', 'burgers-4', 'burgers-5', 'burgers-6', 'burgers-7',
  'homemade-soups-1', 'homemade-soups-2', 'homemade-soups-3', 'homemade-soups-4', 'homemade-soups-5', 'homemade-soups-6',
  'thin-crust-pizza-1', 'thin-crust-pizza-2', 'thin-crust-pizza-3', 'thin-crust-pizza-4', 'thin-crust-pizza-7',
  'veg-pasta-1', 'veg-pasta-2', 'veg-pasta-3', 'veg-pasta-4', 'veg-pasta-5',
  'hot-coffees-1', 'hot-coffees-2', 'hot-coffees-4', 'hot-coffees-5', 'hot-coffees-6',
  'iced-coffees-1', 'iced-coffees-2', 'iced-coffees-3', 'iced-coffees-4',
  'cold-brews-1', 'cold-brews-2', 'cold-brews-3', 'cold-brews-4',
  'desserts-1', 'desserts-2', 'desserts-3', 'desserts-4',
  'shakes-1', 'shakes-2', 'shakes-3', 'shakes-4', 'shakes-5',
];

// Precios de productos (mapeo simplificado - solo los más comunes)
const productPrices = {
  'voyage-breakfast-board-1': 405, 'voyage-breakfast-board-2': 405, 'voyage-breakfast-board-3': 405, 'voyage-breakfast-board-4': 405,
  'voyage-eggs-1': 215, 'voyage-eggs-2': 275, 'voyage-eggs-3': 315, 'voyage-eggs-4': 345, 'voyage-eggs-5': 405,
  'eggs-benedict-1': 375, 'eggs-benedict-2': 445, 'eggs-benedict-3': 785,
  'all-day-breakfast-1': 345, 'all-day-breakfast-2': 345, 'all-day-breakfast-3': 345, 'all-day-breakfast-4': 405, 'all-day-breakfast-5': 405,
  'open-toasties-1': 405, 'open-toasties-2': 405, 'open-toasties-3': 655, 'open-toasties-4': 445, 'open-toasties-5': 445, 'open-toasties-6': 785,
  'smoothie-bowls-1': 465, 'smoothie-bowls-2': 465, 'smoothie-bowls-3': 465, 'smoothie-bowls-4': 535, 'smoothie-bowls-5': 535, 'smoothie-bowls-6': 535, 'smoothie-bowls-7': 535,
  'appetizing-morsels-1': 215, 'appetizing-morsels-2': 275, 'appetizing-morsels-3': 345, 'appetizing-morsels-7': 195, 'appetizing-morsels-8': 275, 'appetizing-morsels-9': 405,
  'panini-sandwiches-1': 445, 'panini-sandwiches-2': 445, 'panini-sandwiches-3': 445, 'panini-sandwiches-4': 445, 'panini-sandwiches-5': 465,
  'burgers-1': 405, 'burgers-2': 405, 'burgers-3': 445, 'burgers-4': 465, 'burgers-5': 465, 'burgers-6': 495, 'burgers-7': 535,
  'homemade-soups-1': 215, 'homemade-soups-2': 215, 'homemade-soups-3': 215, 'homemade-soups-4': 215, 'homemade-soups-5': 245, 'homemade-soups-6': 245,
  'thin-crust-pizza-1': 405, 'thin-crust-pizza-2': 465, 'thin-crust-pizza-3': 465, 'thin-crust-pizza-4': 535, 'thin-crust-pizza-7': 555,
  'veg-pasta-1': 405, 'veg-pasta-2': 405, 'veg-pasta-3': 445, 'veg-pasta-4': 465, 'veg-pasta-5': 465,
  'hot-coffees-1': 125, 'hot-coffees-2': 155, 'hot-coffees-4': 195, 'hot-coffees-5': 195, 'hot-coffees-6': 195,
  'iced-coffees-1': 225, 'iced-coffees-2': 200, 'iced-coffees-3': 225, 'iced-coffees-4': 250,
  'cold-brews-1': 200, 'cold-brews-2': 225, 'cold-brews-3': 250, 'cold-brews-4': 250,
  'desserts-1': 275, 'desserts-2': 275, 'desserts-3': 275, 'desserts-4': 275,
  'shakes-1': 225, 'shakes-2': 225, 'shakes-3': 235, 'shakes-4': 235, 'shakes-5': 235,
};

// Nombres de productos (para referencia)
const productNames = {
  'voyage-breakfast-board-1': 'Tofu Scrambled with Sauteed Vegetable',
  'voyage-breakfast-board-2': 'Crispy Ghee Fried Eggs',
  'voyage-breakfast-board-3': 'Paneer Akuri with Sauteed Spinach',
  'voyage-breakfast-board-4': 'Bombay Style Masala Eggs Bhurji with Bread',
  'voyage-eggs-1': 'Choice of Eggs',
  'voyage-eggs-2': 'Sauteed Garlic Spinach Omelette',
  'voyage-eggs-3': 'Fresh Herbs Mushroom Stuffed Omelette with Feta Cheese',
  'voyage-eggs-4': 'Scrambled Eggs with Truffle Oil',
  'voyage-eggs-5': 'Shakshuka Baked Eggs',
  'eggs-benedict-1': 'Sauteed Spinach Poached Eggs Hollandaise',
  'eggs-benedict-2': 'Chicken Jalapeno and Garlic Hollandaise',
  'eggs-benedict-3': 'Smoked Salmon Cream Capers Hollandaise',
  'all-day-breakfast-1': 'French Toast with Dates Syrup',
  'all-day-breakfast-2': 'Classic American Pancakes',
  'all-day-breakfast-3': 'Chocolate Banana Pancake',
  'all-day-breakfast-4': 'Nutella Crepes with Roasted Walnut',
  'all-day-breakfast-5': 'Pesto Mushroom Sauteed Spinach Crepes',
  'open-toasties-1': 'Sauteed Mushroom Goat Cheese and Herbs Ricotta on Toast',
  'open-toasties-2': 'Roasted Bell Pepper Pesto Feta Cheese on Toast',
  'open-toasties-3': 'Avocado Guacamole on Toast with Feta Cheese',
  'open-toasties-4': 'Peri Peri Chicken with 3 Bell Pepper on Toast',
  'open-toasties-5': 'Creamy Chicken Mayo on Toast',
  'open-toasties-6': 'Smoked Salmon Cream Cheese on Toast',
  'smoothie-bowls-1': 'Berry Nutty Bowl',
  'smoothie-bowls-2': 'Mango Mint Banana Bowl',
  'smoothie-bowls-3': 'Chocolate Peanut Butter Bowl',
  'smoothie-bowls-4': 'Blush Breakfast Bowl',
  'smoothie-bowls-5': 'Chocolate Nutella Bowl',
  'smoothie-bowls-6': 'The Voyage Tropical Breakfast Bowl',
  'smoothie-bowls-7': 'The Green Booster',
  'appetizing-morsels-1': 'Classic French Fries',
  'appetizing-morsels-2': 'Peri Peri French Fries',
  'appetizing-morsels-3': 'Masala French Fries with Thousand Sauce',
  'appetizing-morsels-7': 'Garlic Bread',
  'appetizing-morsels-8': 'Cheese Garlic Bread',
  'appetizing-morsels-9': 'Nachos with Cheese Sauce',
  'panini-sandwiches-1': 'Grilled Vegetable Spicy Jalapeno',
  'panini-sandwiches-2': 'Paneer Pesto Bell Pepper',
  'panini-sandwiches-3': 'Corn Mushroom Spinach',
  'panini-sandwiches-4': 'Creamy Chicken Mayo',
  'panini-sandwiches-5': 'Paneer Fajita',
  'burgers-1': 'Beetroot and Spinach Burger',
  'burgers-2': 'Crunchy Veg and Cheese Burger',
  'burgers-3': 'Fried Grilled Paneer Burger',
  'burgers-4': 'Chicken Barbeque Burger',
  'burgers-5': 'Grilled Chicken Burger',
  'burgers-6': 'Cheese Hamburger Stuck',
  'burgers-7': 'Loaded Patty Chicken Burger',
  'homemade-soups-1': 'Cream of Tomato Basil Soup',
  'homemade-soups-2': 'Cream of Mushroom and Rosemary',
  'homemade-soups-3': 'Broccoli and Green Peas Soup',
  'homemade-soups-4': 'Roasted Pumpkin and Carrot Soup',
  'homemade-soups-5': 'Cream of Chicken Soup',
  'homemade-soups-6': 'Chicken Clear with Fresh Basil Soup',
  'thin-crust-pizza-1': 'Classic Margherita Pizza',
  'thin-crust-pizza-2': 'Corn Capsicum Jalapeno Pizza',
  'thin-crust-pizza-3': 'Ultimate Pizza',
  'thin-crust-pizza-4': 'Mushroom Delight Pizza',
  'thin-crust-pizza-7': 'Paneer Tikka Pizza',
  'veg-pasta-1': 'Veg Arrabiata Pasta',
  'veg-pasta-2': 'Veg Aglio Olio E Peperoncino Pasta',
  'veg-pasta-3': 'Veg Creamy Alfredo Pasta',
  'veg-pasta-4': 'Veg Pesto Alla Genovese Pasta',
  'veg-pasta-5': 'Veg Cream Sauce Pasta with Corn and Bell Pepper',
  'hot-coffees-1': 'Espresso',
  'hot-coffees-2': 'Americano',
  'hot-coffees-4': 'Cappuccino',
  'hot-coffees-5': 'Latte',
  'hot-coffees-6': 'Mocha',
  'iced-coffees-1': 'Iced Latte',
  'iced-coffees-2': 'Shaken Americano',
  'iced-coffees-3': 'Iced Mocha',
  'iced-coffees-4': 'Signature Cold Coffee',
  'cold-brews-1': 'Classic Cold Brew',
  'cold-brews-2': 'Vietnamese Cold Brew',
  'cold-brews-3': 'Hibiscus Rose Cold Brew',
  'cold-brews-4': 'Sunrise Cold Brew',
  'desserts-1': 'Blueberry Cheesecake',
  'desserts-2': 'Mango Cheese Cake',
  'desserts-3': 'Chocolate Mousse Cake',
  'desserts-4': 'Cream Caramel',
  'shakes-1': 'Vanilla Milkshake',
  'shakes-2': 'Banana Milk Shake',
  'shakes-3': 'Strawberry Milkshake',
  'shakes-4': 'Chocolate Milk Shake',
  'shakes-5': 'Mango Milk Shake',
};

const sampleCustomers = [
  { name: 'Raj Patel', userId: 'user-1' },
  { name: 'Priya Sharma', userId: 'user-2' },
  { name: 'Amit Kumar', userId: 'user-3' },
  { name: 'Guest Customer', userId: undefined },
  { name: 'Sneha Reddy', userId: 'user-4' },
  { name: 'Guest Customer', userId: undefined },
  { name: 'Vikram Singh', userId: 'user-5' },
  { name: 'Ananya Desai', userId: 'user-6' },
  { name: 'Guest Customer', userId: undefined },
  { name: 'Rohan Mehta', userId: 'user-7' },
];

// Helper para obtener imagen (simulada - en producción usaría el hash)
function getImageUrl(productId) {
  // Simulación simple - en realidad usaría el getImage del código
  return '/assets/espresso.jpg'; // Placeholder
}

// Generar órdenes de ejemplo
function generateSampleOrders(existingOrders = []) {
  const orders = [];
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  // Configuración de órdenes por día (día 0 = hoy, día 6 = hace 6 días)
  const ordersConfig = [
    { day: 0, count: 3 },  // Hoy
    { day: 1, count: 5 },  // Ayer
    { day: 2, count: 4 },  // Hace 2 días
    { day: 3, count: 6 },  // Hace 3 días
    { day: 4, count: 3 },  // Hace 4 días
    { day: 5, count: 7 },  // Hace 5 días
    { day: 6, count: 4 },  // Hace 6 días
  ];

  // Get existing order IDs to avoid duplicates
  const existingOrderIds = new Set(existingOrders.map(order => order.id));

  ordersConfig.forEach(({ day, count }) => {
    const orderDate = new Date(today);
    orderDate.setDate(orderDate.getDate() - day);
    
    // Track order numbers for this day to ensure consecutive numbering (001, 002, 003...)
    let orderNumber = 1;
    
    for (let i = 0; i < count; i++) {
      // Hora aleatoria del día (entre 8 AM y 8 PM)
      const hour = 8 + Math.floor(Math.random() * 12);
      const minute = Math.floor(Math.random() * 60);
      const orderTime = new Date(orderDate);
      orderTime.setHours(hour, minute, 0, 0);
      
      // Seleccionar productos aleatorios (1-3 items)
      const numItems = Math.floor(Math.random() * 3) + 1;
      const selectedProducts = [];
      let total = 0;
      
      for (let j = 0; j < numItems; j++) {
        const productId = productIds[Math.floor(Math.random() * productIds.length)];
        const quantity = Math.floor(Math.random() * 2) + 1; // 1-2 quantity
        const price = productPrices[productId] || 300; // Default si no está en el mapa
        const name = productNames[productId] || 'Product';
        
        selectedProducts.push({
          id: productId,
          name: name,
          description: '',
          price: price,
          image: getImageUrl(productId),
          category: productId.split('-').slice(0, -1).join('-'),
          isVeggie: productId.includes('veg') || productId.includes('burger-1') || productId.includes('burger-2') || productId.includes('burger-3'),
          quantity: quantity
        });
        
        total += price * quantity;
      }
      
      // Seleccionar cliente aleatorio
      const customer = sampleCustomers[Math.floor(Math.random() * sampleCustomers.length)];
      
      // Estado según el día
      let status;
      if (day === 0) {
        // Hoy: algunos activos, algunos completados
        const rand = Math.random();
        if (rand > 0.6) status = 'completed';
        else if (rand > 0.3) status = 'ready';
        else if (rand > 0.1) status = 'preparing';
        else status = 'pending';
      } else {
        // Días pasados: mayoría completados, algunos cancelados
        status = Math.random() > 0.9 ? 'cancelled' : 'completed';
      }
      
      // Tiempo estimado de recogida (solo para completados o ready)
      let estimatedPickupTime;
      if (status === 'completed' || status === 'ready') {
        estimatedPickupTime = new Date(orderTime);
        estimatedPickupTime.setMinutes(estimatedPickupTime.getMinutes() + 15 + Math.floor(Math.random() * 30));
      }
      
      // Generate unique order ID for this day with consecutive numbering
      // Format: DEMO[day][orderNumber] where day is 01-07 and orderNumber is 001, 002, 003...
      let orderId;
      
      // Generate base ID with consecutive number for this day
      orderId = `DEMO${String(day + 1).padStart(2, '0')}${String(orderNumber).padStart(3, '0')}`;
      
      // Check if ID already exists (from existing orders or already generated in this batch)
      // If it exists, increment orderNumber until we find a unique one
      while (existingOrderIds.has(orderId) || orders.some(o => o.id === orderId)) {
        orderNumber++;
        orderId = `DEMO${String(day + 1).padStart(2, '0')}${String(orderNumber).padStart(3, '0')}`;
      }

      // Increment for next order in this day (ensures consecutive numbering)
      orderNumber++;

      // Add to existing IDs set to avoid duplicates in same batch
      existingOrderIds.add(orderId);
      
      orders.push({
        id: orderId,
        items: selectedProducts,
        total: total,
        status: status,
        customerName: customer.name,
        userId: customer.userId,
        timestamp: orderTime.toISOString(),
        estimatedPickupTime: estimatedPickupTime ? estimatedPickupTime.toISOString() : undefined
      });
    }
  });
  
  return orders;
}

// Función principal
try {
  // Obtener órdenes existentes primero
  const existingOrdersJson = localStorage.getItem(STORAGE_KEY);
  let existingOrders = [];
  
  if (existingOrdersJson) {
    try {
      existingOrders = JSON.parse(existingOrdersJson);
    } catch (e) {
      console.error('Error parsing existing orders:', e);
    }
  }
  
  // Generar nuevas órdenes usando las existentes para evitar duplicados
  const sampleOrders = generateSampleOrders(existingOrders);
  
  // Combinar órdenes (las nuevas primero)
  const allOrders = [...sampleOrders, ...existingOrders];
  
  // Guardar en localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allOrders));
  
  console.log(`✅ Se generaron ${sampleOrders.length} órdenes de ejemplo`);
  console.log(`📦 Total de órdenes en el sistema: ${allOrders.length}`);
  console.log(`📅 Órdenes distribuidas en los últimos 7 días`);
  console.log('\n💡 Recarga la página para ver las nuevas órdenes en el admin panel');
  
} catch (error) {
  console.error('❌ Error generando órdenes:', error);
}