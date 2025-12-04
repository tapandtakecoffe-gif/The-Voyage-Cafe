import { Product } from '@/types/product';
// Reusing existing images
import espressoImg from '@/assets/espresso.jpg';
import cappuccinoImg from '@/assets/cappuccino.jpg';
import latteImg from '@/assets/latte.jpg';
import americanoImg from '@/assets/americano.jpg';
import icedLatteImg from '@/assets/iced-latte.jpg';
import frappuccinoImg from '@/assets/frappuccino.jpg';
import orangeJuiceImg from '@/assets/orange-juice.jpg';
import croissantImg from '@/assets/croissant.jpg';
import croissantCheeseImg from '@/assets/4.jpg';
import croissantPeanutImg from '@/assets/5.jpg';
import croissantMushroomsImg from '@/assets/6.jpg';
import croissantHamCheeseImg from '@/assets/7.jpg';
import croissantChickenCheeseImg from '@/assets/8.jpg';
import croissantSmokedSalmonImg from '@/assets/10.jpg';
import hashBrownAvocadoImg from '@/assets/11.jpg';
import napolitanaImg from '@/assets/napolitana.jpg';
import bolloSuizoImg from '@/assets/bollo-suizo.jpg';
import magdalenaImg from '@/assets/magdalena.jpg';
import sandwichImg from '@/assets/sandwich.jpg';
import avocadoToastImg from '@/assets/avocado-toast.jpg';
import parisienneEggsImg from '@/assets/1.jpg';
import cheeseOmeletteImg from '@/assets/2.jpg';
import cheeseScrambledImg from '@/assets/3.jpg';

// Available images array
const images = [
  espressoImg, cappuccinoImg, latteImg, americanoImg, icedLatteImg,
  frappuccinoImg, orangeJuiceImg, croissantImg, napolitanaImg,
  bolloSuizoImg, magdalenaImg, sandwichImg, avocadoToastImg,
  croissantCheeseImg, croissantPeanutImg, croissantMushroomsImg,
  croissantHamCheeseImg, croissantChickenCheeseImg, croissantSmokedSalmonImg,
  hashBrownAvocadoImg, parisienneEggsImg, cheeseOmeletteImg, cheeseScrambledImg
];

// Helper function to get a consistent image based on product ID
const getImage = (productId: string) => {
  // Simple hash function to convert string ID to number
  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    const char = productId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Use absolute value and modulo to get index
  const index = Math.abs(hash) % images.length;
  return images[index];
};

// Helper to map category names from table to category IDs
const mapCategory = (tableCategory: string): Product['category'] => {
  const categoryMap: Record<string, Product['category']> = {
    'Voyage Breakfast Board': 'voyage-breakfast-board',
    'Voyage Eggs': 'voyage-eggs',
    'Eggs Benedict': 'eggs-benedict',
    'All Day Breakfast': 'all-day-breakfast',
    'Open Toasties and Tartines': 'open-toasties',
    'Smoothie Bowls': 'smoothie-bowls',
    'Appetizing Morsels': 'appetizing-morsels',
    'Panini Sandwiches': 'panini-sandwiches',
    'Burgers': 'burgers',
    'Homemade Soups': 'homemade-soups',
    'Farm Fresh Salads': 'farm-fresh-salads',
    'Thin Crust Pizza': 'thin-crust-pizza',
    'Veg Pasta': 'veg-pasta',
    'Non Veg Pasta': 'non-veg-pasta',
    'Meal Bowls': 'meal-bowls',
    'The Voyage Special Steaks': 'voyage-steaks',
    'Keto': 'keto',
    'Desserts': 'desserts',
    'Hot Coffees': 'hot-coffees',
    'Iced Coffees': 'iced-coffees',
    'Cold Brews': 'cold-brews',
    'Specialty Tea': 'specialty-tea',
    'Shakes': 'shakes',
    'Mocktails and Iced Teas': 'mocktails-iced-teas',
    'Fresh Fruit Juices and Coolers': 'fresh-juices-coolers',
  };
  return categoryMap[tableCategory] || 'voyage-breakfast-board';
};

export const products: Product[] = [
  // ========== TODAY'S OFFERS ==========
  {
    id: 'today-offer-1',
    name: 'Mocktail + Pizza',
    description: 'Any Mocktail + Any Pizza - Special combo offer',
    price: 550,
    image: '', // No image for combo offers
    category: 'today-offers',
    isVeggie: true,
    isSpecialOffer: true
  },
  {
    id: 'today-offer-2',
    name: 'Mocktail + Burger',
    description: 'Any Mocktail + Any Burger - Special combo offer',
    price: 550,
    image: '', // No image for combo offers
    category: 'today-offers',
    isVeggie: false,
    isSpecialOffer: true
  },
  {
    id: 'today-offer-3',
    name: 'Pancake + Coffee/Shake',
    description: 'Any Pancake + Any Coffee or Shake - Special combo offer',
    price: 400,
    image: '', // No image for combo offers
    category: 'today-offers',
    isVeggie: true,
    isSpecialOffer: true
  },
  
  // ========== VOYAGE BREAKFAST BOARD ==========
  {
    id: 'voyage-breakfast-board-1',
    name: 'Tofu Scrambled with Sauteed Vegetable',
    description: 'Tofu scrambles tossed with garlic, onion, tomato, mushroom with spiced sauteed vegetable on the side served with a mixed fruit pot. Served with a choice of healthy shot jaggery lemonade or lemon honey water and a choice of bread whole wheat and gluten free',
    price: 405,
    image: '', // No image - doesn't match product
    category: 'voyage-breakfast-board',
    isVeggie: true
  },
  {
    id: 'voyage-breakfast-board-2',
    name: 'Crispy Ghee Fried Eggs',
    description: 'Served on toast with tint of indian spiced sauteed vegetable on the side served with a mixed fruit pot. Served with a choice of healthy shot jaggery lemonade or lemon honey water and a choice of bread whole wheat and gluten free',
    price: 405,
    image: '', // No image - doesn't match product
    category: 'voyage-breakfast-board',
    isVeggie: false
  },
  {
    id: 'voyage-breakfast-board-3',
    name: 'Paneer Akuri with Sauteed Spinach',
    description: '[Voyage special]. Cottage cheese scrambles tossed with garlic, onion, tomato with spiced, sauteed spinach on the side served with a mixed fruit pot. Served with a choice of healthy shot jaggery lemonade or lemon honey water and a choice of bread whole wheat and gluten free',
    price: 405,
    image: '', // No image - doesn't match product
    category: 'voyage-breakfast-board',
    isVeggie: true
  },
  {
    id: 'voyage-breakfast-board-4',
    name: 'Bombay Style Masala Eggs Bhurji with Bread',
    description: 'Bombay style egg bhurji, indian spiced, served with butter toasted bread and a mixed fruit pot. Served with a choice of healthy shot jaggery lemonade or lemon honey water and a choice of bread whole wheat and gluten free',
    price: 405,
    image: '', // No image - doesn't match product
    category: 'voyage-breakfast-board',
    isVeggie: false
  },
  
  // ========== VOYAGE EGGS ==========
  {
    id: 'voyage-eggs-1',
    name: 'Choice of Eggs',
    description: 'Plain omelette or masala omelette or scrambled eggs or sunny side up or poached eggs or masala scrambled eggs. Rich in protein and vitamins. Served with grilled tomato and choice of bread whole wheat and gluten free',
    price: 215,
    image: '', // No image - doesn't match product
    category: 'voyage-eggs',
    isVeggie: false
  },
  {
    id: 'voyage-eggs-2',
    name: 'Sauteed Garlic Spinach Omelette',
    description: '3 Eggs, sauteed garlic, sauteed spinach, crushed pepper served with toasted bread and grilled tomato. Rice in protein and vitamins. Served with grilled tomato and choice of bread whole wheat and gluten free',
    price: 275,
    image: '', // No image - doesn't match product
    category: 'voyage-eggs',
    isVeggie: false
  },
  {
    id: 'voyage-eggs-3',
    name: 'Fresh Herbs Mushroom Stuffed Omelette with Feta Cheese',
    description: '3 Eggs, mix herbs, bottom mushroom feta on top served with toasted bread and grilled tomato. Rice in protein and vitamins. Served with grilled tomato and choice of bread whole wheat and gluten free',
    price: 315,
    image: '', // No image - doesn't match product
    category: 'voyage-eggs',
    isVeggie: false
  },
  {
    id: 'voyage-eggs-4',
    name: 'Scrambled Eggs with Truffle Oil',
    description: '[Voyage special]. 3 Eggs cooked in truffle oil, salt and pepper to taste served with toasted bread and grilled tomato. Rice in protein and vitamins. Served with grilled tomato and choice of bread whole wheat and gluten free',
    price: 345,
    image: '', // No image - doesn't match product
    category: 'voyage-eggs',
    isVeggie: false
  },
  {
    id: 'voyage-eggs-5',
    name: 'Shakshuka Baked Eggs',
    description: '3 Eggs, grilled vegetable cooked in tomato sauce, fresh herbs, parmesan cheese, served with toasted bread and grilled tomato. Rice in protein and vitamins. Served with grilled tomato and choice of bread whole wheat and gluten free',
    price: 405,
    image: '', // No image - doesn't match product
    category: 'voyage-eggs',
    isVeggie: false
  },
  
  // ========== EGGS BENEDICT ==========
  {
    id: 'eggs-benedict-1',
    name: 'Sauteed Spinach Poached Eggs Hollandaise',
    description: '2 Poached eggs, sauteed spinach hollandaise on top served with toasted bread and grilled tomato. Immune boosting or healthy heart or inflammatory or poached eggs topped with hollandaise and choice of bread whole wheat and gluten free',
    price: 375,
    image: '', // No image - doesn't match product
    category: 'eggs-benedict',
    isVeggie: false
  },
  {
    id: 'eggs-benedict-2',
    name: 'Chicken Jalapeno and Garlic Hollandaise',
    description: '[Voyage special]. Grilled chicken breast on lettuce, sliced jalapeno hollandaise on top served with toasted bread and grilled tomato. Immune boosting or healthy heart or inflammatory or poached eggs topped with hollandaise and choice of bread whole wheat and gluten free',
    price: 445,
    image: '', // No image - doesn't match product
    category: 'eggs-benedict',
    isVeggie: false
  },
  {
    id: 'eggs-benedict-3',
    name: 'Smoked Salmon Cream Capers Hollandaise',
    description: 'Smoked salmon on toast, cream cheese, capers, hollandaise on top served with toasted bread and grilled tomato. Immune boosting or healthy heart or inflammatory or poached eggs topped with hollandaise and choice of bread whole wheat and gluten free',
    price: 785,
    image: '', // No image - doesn't match product
    category: 'eggs-benedict',
    isVeggie: false
  },
  
  // ========== ALL DAY BREAKFAST ==========
  {
    id: 'all-day-breakfast-1',
    name: 'French Toast with Dates Syrup',
    description: 'Served with dates syrup and cinnamon dust',
    price: 345,
    image: '', // No image - doesn't match product
    category: 'all-day-breakfast',
    isVeggie: true
  },
  {
    id: 'all-day-breakfast-2',
    name: 'Classic American Pancakes',
    description: 'Served with maple syrup and sugar dust',
    price: 345,
    image: '', // No image - doesn't match product
    category: 'all-day-breakfast',
    isVeggie: true
  },
  {
    id: 'all-day-breakfast-3',
    name: 'Chocolate Banana Pancake',
    description: 'Served with sliced banana, chocolate ganache, roasted nut on top',
    price: 345,
    image: '', // No image - doesn't match product
    category: 'all-day-breakfast',
    isVeggie: true
  },
  {
    id: 'all-day-breakfast-4',
    name: 'Nutella Crepes with Roasted Walnut',
    description: 'Vanilla crepes, nutella, banana, roasted hazelnut chunks',
    price: 405,
    image: '', // No image - doesn't match product
    category: 'all-day-breakfast',
    isVeggie: true
  },
  {
    id: 'all-day-breakfast-5',
    name: 'Pesto Mushroom Sauteed Spinach Crepes',
    description: 'Inhouse pesto, sauteed herbs mushroom, feta cheese served with inhouse salad and dips',
    price: 405,
    image: '', // No image - doesn't match product
    category: 'all-day-breakfast',
    isVeggie: true
  },
  
  // ========== OPEN TOASTIES AND TARTINES ==========
  {
    id: 'open-toasties-1',
    name: 'Sauteed Mushroom Goat Cheese and Herbs Ricotta on Toast',
    description: 'Toast, goat cheese, herbs, ricotta spread served with inhouse salad and dips. Served with choice of bread whole wheat and gluten free + voyage salad and homemade dips',
    price: 405,
    image: '', // No image - doesn't match product
    category: 'open-toasties',
    isVeggie: true
  },
  {
    id: 'open-toasties-2',
    name: 'Roasted Bell Pepper Pesto Feta Cheese on Toast',
    description: 'Toast, pesto sauce, roasted bell pepper, feta cheese on top served with inhouse salad and dips. Served with choice of bread whole wheat and gluten free + voyage salad and homemade dips',
    price: 405,
    image: '', // No image - doesn't match product
    category: 'open-toasties',
    isVeggie: true
  },
  {
    id: 'open-toasties-3',
    name: 'Avocado Guacamole on Toast with Feta Cheese',
    description: 'Toast, crushed avocado, onion, tomato, cilantro, olive oil feta on top served with inhouse salad and dips. Served with choice of bread whole wheat and gluten free + voyage salad and homemade dips',
    price: 655,
    image: '', // No image - doesn't match product
    category: 'open-toasties',
    isVeggie: true
  },
  {
    id: 'open-toasties-4',
    name: 'Peri Peri Chicken with 3 Bell Pepper on Toast',
    description: 'Toast, chicken tossed with garlic, onion in creamy peri peri sauce served with inhouse salad and dips. Served with choice of bread whole wheat and gluten free + voyage salad and homemade dips',
    price: 445,
    image: '', // No image - doesn't match product
    category: 'open-toasties',
    isVeggie: false
  },
  {
    id: 'open-toasties-5',
    name: 'Creamy Chicken Mayo on Toast',
    description: 'Toast, roasted chicken shredded, green bell pepper, creamy mayo. Served with choice of bread whole wheat and gluten free + voyage salad and homemade dips',
    price: 445,
    image: '', // No image - doesn't match product
    category: 'open-toasties',
    isVeggie: false
  },
  {
    id: 'open-toasties-6',
    name: 'Smoked Salmon Cream Cheese on Toast',
    description: 'Toast, spread with cream cheese, lettuce, smoked salmon dill leaves on top served with inhouse salad and dips. Served with choice of bread whole wheat and gluten free + voyage salad and homemade dips',
    price: 785,
    image: '', // No image - doesn't match product
    category: 'open-toasties',
    isVeggie: false
  },
  
  // ========== SMOOTHIE BOWLS ==========
  {
    id: 'smoothie-bowls-1',
    name: 'Berry Nutty Bowl',
    description: 'Mix berries, banana, yogurt, fresh fruits and nuts',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'smoothie-bowls',
    isVeggie: true
  },
  {
    id: 'smoothie-bowls-2',
    name: 'Mango Mint Banana Bowl',
    description: 'Mango pulp, mint leave, banana, yogurt topped with sliced banana, chia seeds, almond flakes',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'smoothie-bowls',
    isVeggie: true
  },
  {
    id: 'smoothie-bowls-3',
    name: 'Chocolate Peanut Butter Bowl',
    description: 'Dark chocolate, banana,, yogurt, peanut butter topped with banana and dry roasted nuts',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'smoothie-bowls',
    isVeggie: true
  },
  {
    id: 'smoothie-bowls-4',
    name: 'Blush Breakfast Bowl',
    description: 'Beetroot, pears, banana topped with crushed coconut, walnuts, pumpkin seeds, pineapple, kiwi, chia seeds',
    price: 535,
    image: '', // No image - doesn't match product
    category: 'smoothie-bowls',
    isVeggie: true
  },
  {
    id: 'smoothie-bowls-5',
    name: 'Chocolate Nutella Bowl',
    description: 'Dark chocolate, nutella,, yogurt, banana topped with dry roasted nuts and banana',
    price: 535,
    image: '', // No image - doesn't match product
    category: 'smoothie-bowls',
    isVeggie: true
  },
  {
    id: 'smoothie-bowls-6',
    name: 'The Voyage Tropical Breakfast Bowl',
    description: 'Spinach, shredded coconuts, dates, banana, watermelon, muskmelon, sunflower seeds, pomegranate, apricots',
    price: 535,
    image: '', // No image - doesn't match product
    category: 'smoothie-bowls',
    isVeggie: true
  },
  {
    id: 'smoothie-bowls-7',
    name: 'The Green Booster',
    description: '[Voyage special]. Kiwi, spinach, green apple, pista, banana served with roasted coconut flakes and chia seeds',
    price: 535,
    image: '', // No image - doesn't match product
    category: 'smoothie-bowls',
    isVeggie: true
  },
  
  // ========== APPETIZING MORSELS ==========
  {
    id: 'appetizing-morsels-1',
    name: 'Classic French Fries',
    description: 'Golden french fries sprinkled with salt served with tomato ketchup',
    price: 215,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: true
  },
  {
    id: 'appetizing-morsels-2',
    name: 'Peri Peri French Fries',
    description: 'Golden french fries sprinkled with peri peri spiced salt served with thousand sauce',
    price: 275,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: true
  },
  {
    id: 'appetizing-morsels-3',
    name: 'Masala French Fries with Thousand Sauce',
    description: 'Coated fries with fresh herbs and dried herbs served with garlic chipotle sauce',
    price: 345,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: true
  },
  {
    id: 'appetizing-morsels-4',
    name: 'Brown Potato Wedges Fresh Herbs',
    description: 'Home made potato wedges marinated with herbs served with tomato ketchup',
    price: 345,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: true
  },
  {
    id: 'appetizing-morsels-5',
    name: 'Cheese Corn Balls',
    description: '[Voyage special]. Monterey jack cheese, american corn seasoned with herbs served with thousand sauce',
    price: 345,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: true
  },
  {
    id: 'appetizing-morsels-6',
    name: 'Cheese Jalapeno Cigars',
    description: '[Voyage special]. Monterey jack cheese, potato, jalapeno, seasoned with herbs served with garlic mayonnaise',
    price: 365,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: true
  },
  {
    id: 'appetizing-morsels-7',
    name: 'Garlic Bread',
    description: 'Crispy toasted bread with garlic butter',
    price: 195,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: true
  },
  {
    id: 'appetizing-morsels-8',
    name: 'Cheese Garlic Bread',
    description: 'Crispy toasted bread with garlic butter topped with mozzarella cheese',
    price: 275,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: true
  },
  {
    id: 'appetizing-morsels-9',
    name: 'Nachos with Cheese Sauce',
    description: 'Homemade tortillas chips, topped with monterey jack cheese served with salsa sauce',
    price: 405,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: true
  },
  {
    id: 'appetizing-morsels-10',
    name: 'Veg The Voyage Nachos Overloaded',
    description: 'Homemade tortillas topped with monterey jack cheese, refried beans, capsicum jalapeno served with salsa sauce',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: true
  },
  {
    id: 'appetizing-morsels-11',
    name: 'Veg Tacos',
    description: 'Crispy shell, purple cabbage, refried beans, corn, paneer, cream cheese served with salsa',
    price: 405,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: true
  },
  {
    id: 'appetizing-morsels-12',
    name: 'Chicken Tacos',
    description: 'Crispy shell, purple cabbage, refried beans, corn, paneer, cream cheese served with salsa',
    price: 535,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: false
  },
  {
    id: 'appetizing-morsels-13',
    name: 'Bruschetta Al Pomodoro',
    description: 'Crispy toasted bread topped with fresh tomato, basil, herbs, drizzled with olive oil',
    price: 445,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: true
  },
  {
    id: 'appetizing-morsels-14',
    name: 'Mushroom Crostini with Arugula',
    description: 'Crispy toasted bread topped with sauteed garlic, mushroom, parmesan cheese',
    price: 445,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: true
  },
  {
    id: 'appetizing-morsels-15',
    name: 'Stuffed Cheese Mushroom',
    description: 'Bottom mushroom, stuffed cheese, bell pepper, garlic, herbs fried served with thousand sauce',
    price: 445,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: true
  },
  {
    id: 'appetizing-morsels-16',
    name: 'Tossed Paneer Burnt Garlic',
    description: 'Diced cut paneer tossed with garlic, onion, capsicum in soy sauce',
    price: 445,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: true
  },
  {
    id: 'appetizing-morsels-17',
    name: 'Chicken with Lemon Pepper Sauce',
    description: 'Diced cut chicken tossed with garlic, onion, capsicum in lemon pepper sauce',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: false
  },
  {
    id: 'appetizing-morsels-18',
    name: 'Spicy Bbq Chicken Wings',
    description: 'Chicken wings tossed with smokey bbq and pepper sauce',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: false
  },
  {
    id: 'appetizing-morsels-19',
    name: 'Peri Peri Chicken Wings',
    description: 'Chicken wings tossed with smokey bbq and pepper sauce',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: false
  },
  {
    id: 'appetizing-morsels-20',
    name: 'Oriental Style Chicken',
    description: 'Crispy fried chicken sprinkled with peri peri spiced served garlic mayonnaise sauce',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: false
  },
  {
    id: 'appetizing-morsels-21',
    name: 'Devil Paneer',
    description: 'Basil, tomato, 3b bell pepper, onion, spicy paneer',
    price: 365,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: true
  },
  {
    id: 'appetizing-morsels-22',
    name: 'Devil Chicken',
    description: 'Basil, tomato, 3b bell pepper, onion, spicy chicken',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: false
  },
  {
    id: 'appetizing-morsels-23',
    name: 'Chicken Satay with Peanut Brown Chilly Sauce',
    description: 'Boneless chicken cooked slowly on the griller and topped with peanut and brown chilli sauce',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: false
  },
  {
    id: 'appetizing-morsels-24',
    name: 'Cilantro Chicken Wings',
    description: 'Chicken wings cooked slowly on the griller in cilantro sauce',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: false
  },
  {
    id: 'appetizing-morsels-25',
    name: 'The Basil Chicken',
    description: 'Minced chicken, garlic, thai basil, soy sauce whisked together to flavour the recipe',
    price: 535,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: false
  },
  {
    id: 'appetizing-morsels-26',
    name: 'Lemon Butter Garlic Prawns',
    description: 'Fresh prawns marinated with garlic and herbs toast with in lemon butter sauce',
    price: 655,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: false
  },
  {
    id: 'appetizing-morsels-27',
    name: 'Crispy Prawns with Thousand Island Sauce',
    description: 'Fresh prawns marinated with herbs, lime juice, eggs white fried and served with thousand sauce',
    price: 655,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: false
  },
  {
    id: 'appetizing-morsels-28',
    name: 'Chicken The Voyage Nachos Overloaded',
    description: 'Homemade tortillas topped with monterey jack cheese, refried beans, capsicum jalapeno served with salsa sauce',
    price: 535,
    image: '', // No image - doesn't match product
    category: 'appetizing-morsels',
    isVeggie: false
  },
  
  // ========== PANINI SANDWICHES ==========
  {
    id: 'panini-sandwiches-1',
    name: 'Grilled Vegetable Spicy Jalapeno',
    description: '[Voyage special]. Grilled broccoli, bellpepper, zucchini, black olives, jalapeno served with inhouse salad and wafers. Served with a choice of bread whole wheat and gluten free + voyage salad and homemade dips',
    price: 445,
    image: '', // No image - doesn't match product
    category: 'panini-sandwiches',
    isVeggie: true
  },
  {
    id: 'panini-sandwiches-2',
    name: 'Paneer Pesto Bell Pepper',
    description: 'Inhouse pesto, onion, bellepper, cottage cheese served with salads and wafers. Served with a choice of bread whole wheat and gluten free + voyage salad and homemade dips',
    price: 445,
    image: '', // No image - doesn't match product
    category: 'panini-sandwiches',
    isVeggie: true
  },
  {
    id: 'panini-sandwiches-3',
    name: 'Corn Mushroom Spinach',
    description: 'Spinach, corn, mushroom, onion rings, capsicum rings, creamy cheese sauce served with salads and wafers. Served with a choice of bread whole wheat and gluten free + voyage salad and homemade dips',
    price: 445,
    image: '', // No image - doesn't match product
    category: 'panini-sandwiches',
    isVeggie: true
  },
  {
    id: 'panini-sandwiches-4',
    name: 'Creamy Chicken Mayo',
    description: 'Roasted chicken shreds, green bell pepper in a rich creamy dressing served with salads and wafers. Served with a choice of bread whole wheat and gluten free + voyage salad and homemade dips',
    price: 445,
    image: '', // No image - doesn't match product
    category: 'panini-sandwiches',
    isVeggie: false
  },
  {
    id: 'panini-sandwiches-5',
    name: 'Paneer Fajita',
    description: 'Paneer toasted in cajun spice, onion, 3b bell pepper, lettuce, cheese sauce served with salads and wafers. Served with a choice of bread whole wheat and gluten free + voyage salad and homemade dips',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'panini-sandwiches',
    isVeggie: true
  },
  {
    id: 'panini-sandwiches-6',
    name: 'Caramelized Onion Bbq Chicken',
    description: 'Chicken tossed with caramelized onion, garlic,bell pepper in bbq sauce served with salad and wafers. Served with a choice of bread whole wheat and gluten free + voyage salad and homemade dips',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'panini-sandwiches',
    isVeggie: false
  },
  {
    id: 'panini-sandwiches-7',
    name: 'The Voyage Banh Mi',
    description: 'Spicy minced veg patty, carrot, cucumber, tomato, mint, coriander sauce served with salad and wafers. Served with a choice of bread whole wheat and gluten free + voyage salad and homemade dips',
    price: 505,
    image: '', // No image - doesn't match product
    category: 'panini-sandwiches',
    isVeggie: true
  },
  
  // ========== BURGERS ==========
  {
    id: 'burgers-1',
    name: 'Beetroot and Spinach Burger',
    description: 'Beetroot, spinach, quinoa base patty, caramelized onion, cucumber and mint yogurt sauce. Served with a choice of bread whole wheat and gluten free + voyage salad + fries and homemade dips',
    price: 405,
    image: '', // No image - doesn't match product
    category: 'burgers',
    isVeggie: true
  },
  {
    id: 'burgers-2',
    name: 'Crunchy Veg and Cheese Burger',
    description: 'Inhouse mix veg patty, cheese, tomato, onion, lettuce. Served with a choice of bread whole wheat and gluten free + voyage salad + fries and homemade dips',
    price: 405,
    image: '', // No image - doesn't match product
    category: 'burgers',
    isVeggie: true
  },
  {
    id: 'burgers-3',
    name: 'Fried Grilled Paneer Burger',
    description: 'Grilled paneer in spicy sauce, cheese, lettuce, peri-peri sauce, onion, cucumber served with fries. Served with a choice of bread whole wheat and gluten free + voyage salad + fries and homemade dips',
    price: 445,
    image: '', // No image - doesn't match product
    category: 'burgers',
    isVeggie: true
  },
  {
    id: 'burgers-4',
    name: 'Chicken Barbeque Burger',
    description: 'Homemade chicken patties, lettuce, bbq sauce, onion, cucumber served with fries. Served with a choice of bread whole wheat and gluten free + voyage salad + fries and homemade dips',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'burgers',
    isVeggie: false
  },
  {
    id: 'burgers-5',
    name: 'Grilled Chicken Burger',
    description: 'Grilled chicken patty grilled and served with spicy sauce, sliced cheese, tomato, onion, capsicum, mint mayonnaise. Served with a choice of bread whole wheat and gluten free + voyage salad + fries and homemade dips',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'burgers',
    isVeggie: false
  },
  {
    id: 'burgers-6',
    name: 'Cheese Hamburger Stuck',
    description: 'Minced chicken patty, mozzarella cheese, spicy sriracha sauce served with broccoli, cherry, tomato and potato veggies. Served with a choice of bread whole wheat and gluten free + voyage salad + fries and homemade dips',
    price: 495,
    image: '', // No image - doesn't match product
    category: 'burgers',
    isVeggie: false
  },
  {
    id: 'burgers-7',
    name: 'Loaded Patty Chicken Burger',
    description: '[Voyage special]. Tender and juicy homemade chicken patty cooked to drenched with a double cheese layer and creamy mayo. Served with a choice of bread whole wheat and gluten free + voyage salad + fries and homemade dips',
    price: 535,
    image: '', // No image - doesn't match product
    category: 'burgers',
    isVeggie: false
  },
  
  // ========== HOMEMADE SOUPS ==========
  {
    id: 'homemade-soups-1',
    name: 'Cream of Tomato Basil Soup',
    description: '[Voyage special]. Rich in vitamin c, tomato soup with fresh parsley served with crunchy croutons',
    price: 215,
    image: '', // No image - doesn't match product
    category: 'homemade-soups',
    isVeggie: true
  },
  {
    id: 'homemade-soups-2',
    name: 'Cream of Mushroom and Rosemary',
    description: 'Rich in fibre, antioxidants and low in calorie, a blend of mushroom and rosemary',
    price: 215,
    image: '', // No image - doesn't match product
    category: 'homemade-soups',
    isVeggie: true
  },
  {
    id: 'homemade-soups-3',
    name: 'Broccoli and Green Peas Soup',
    description: '[Voyage special]. Rich in folate, potassium, blend of broccoli and green peas paste cooked with fresh cream',
    price: 215,
    image: '', // No image - doesn't match product
    category: 'homemade-soups',
    isVeggie: true
  },
  {
    id: 'homemade-soups-4',
    name: 'Roasted Pumpkin and Carrot Soup',
    description: 'Rich in copper, manganese, roasted pumpkin tempered with garlic and cooked with fresh cream',
    price: 215,
    image: '', // No image - doesn't match product
    category: 'homemade-soups',
    isVeggie: true
  },
  {
    id: 'homemade-soups-5',
    name: 'Cream of Chicken Soup',
    description: 'Rich in aminos, a classic cream of chicken soup',
    price: 245,
    image: '', // No image - doesn't match product
    category: 'homemade-soups',
    isVeggie: false
  },
  {
    id: 'homemade-soups-6',
    name: 'Chicken Clear with Fresh Basil Soup',
    description: '[Voyage special]. Rich in aminos and antioxidants, chicken chunks cooked in chicken broth infused with fresh basil',
    price: 245,
    image: '', // No image - doesn't match product
    category: 'homemade-soups',
    isVeggie: false
  },
  
  // ========== FARM FRESH SALADS ==========
  {
    id: 'farm-fresh-salads-1',
    name: 'Roasted Beet Orange Quinoa Salad with Feta',
    description: '[Voyage special]. Mixed lettuce, orange sliced, quinoa, mix seeds dressed with orange reduction and balsamic vinaigrette dressing garnish with feta cheese',
    price: 405,
    image: '', // No image - doesn't match product
    category: 'farm-fresh-salads',
    isVeggie: true
  },
  {
    id: 'farm-fresh-salads-2',
    name: 'Watermelon Feta with Rocket Leaves',
    description: 'Diced cut watermelon, rucola leaves dressing with honey mustard, scrambled feta on top balsamic vinegar',
    price: 405,
    image: '', // No image - doesn't match product
    category: 'farm-fresh-salads',
    isVeggie: true
  },
  {
    id: 'farm-fresh-salads-3',
    name: 'Classic Caesar Salad',
    description: 'Tender lettuce leaves, black olives, roasted croutons dressed with mayonnaise and sprinkled with parmesan cheese',
    price: 405,
    image: '', // No image - doesn't match product
    category: 'farm-fresh-salads',
    isVeggie: true
  },
  {
    id: 'farm-fresh-salads-4',
    name: 'Green Apple Spinach Walnut Salad',
    description: 'Sliced green apple, baby spinach, mix lettuce dressed with cranberry vinaigrette dressing topped with parmesan cheese',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'farm-fresh-salads',
    isVeggie: true
  },
  {
    id: 'farm-fresh-salads-5',
    name: 'Chicken Caesar Salad',
    description: 'Tender lettuce leaves, finger chicken, black olives, roasted croutons dressed with mayonnaise and sprinkled with parmesan cheese',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'farm-fresh-salads',
    isVeggie: false
  },
  {
    id: 'farm-fresh-salads-6',
    name: 'Grilled Chicken Warm Vegetable Tossed Salad',
    description: 'Diced cut grilled chicken, grilled vegetable tossed with pineapple balsamic vinaigrette dressing',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'farm-fresh-salads',
    isVeggie: false
  },
  
  // ========== THIN CRUST PIZZA ==========
  {
    id: 'thin-crust-pizza-1',
    name: 'Classic Margherita Pizza',
    description: 'Fresh tomato sauce, mozzarella, fresh basil. Fresh dough hand stretched to order, topped with our house made tomato sauce and mozzarella',
    price: 405,
    image: '', // No image - doesn't match product
    category: 'thin-crust-pizza',
    isVeggie: true
  },
  {
    id: 'thin-crust-pizza-2',
    name: 'Corn Capsicum Jalapeno Pizza',
    description: 'Fresh tomato sauce, mozzarella cheese, green capsicum, sweet corn, onion and jalapeno. Fresh dough hand stretched to order, topped with our house made tomato sauce and mozzarella',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'thin-crust-pizza',
    isVeggie: true
  },
  {
    id: 'thin-crust-pizza-3',
    name: 'Ultimate Pizza',
    description: 'Fresh tomato sauce, mozzarella, paneer, green capsicum, black olives, oregano. Fresh dough hand stretched to order, topped with our house made tomato sauce and mozzarella',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'thin-crust-pizza',
    isVeggie: true
  },
  {
    id: 'thin-crust-pizza-4',
    name: 'Mushroom Delight Pizza',
    description: 'Spicy tomato sauce, mozzarella cheese, pickle onion, olives, sundried tomato mushrooms. Fresh dough hand stretched to order, topped with our house made tomato sauce and mozzarella',
    price: 535,
    image: '', // No image - doesn't match product
    category: 'thin-crust-pizza',
    isVeggie: true
  },
  {
    id: 'thin-crust-pizza-5',
    name: 'Pizza Mexicano',
    description: 'Spicy tomato sauce, capsicum, mushrooms, refried beans, onion, mozzarella. Fresh dough hand stretched to order, topped with our house made tomato sauce and mozzarella',
    price: 535,
    image: '', // No image - doesn't match product
    category: 'thin-crust-pizza',
    isVeggie: true
  },
  {
    id: 'thin-crust-pizza-6',
    name: 'Pizza Melino',
    description: '[Voyage special]. Fresh tomato sauce, mozzarella cheese, spinach, mushroom, bell pepper, jalapeno, capsicum and olives. Fresh dough hand stretched to order, topped with our house made tomato sauce and mozzarella',
    price: 555,
    image: '', // No image - doesn't match product
    category: 'thin-crust-pizza',
    isVeggie: true
  },
  {
    id: 'thin-crust-pizza-7',
    name: 'Paneer Tikka Pizza',
    description: 'Spicy tomato sauce, mozzarella, indian spiced paneer, onion, capsicum, coriander. Fresh dough hand stretched to order, topped with our house made tomato sauce and mozzarella',
    price: 555,
    image: '', // No image - doesn't match product
    category: 'thin-crust-pizza',
    isVeggie: true
  },
  {
    id: 'thin-crust-pizza-8',
    name: 'Pesto Chicken Pizza',
    description: 'In house pesto sauce, mozzarella cheese, chicken, black olives. Fresh dough hand stretched to order, topped with our house made tomato sauce and mozzarella',
    price: 565,
    image: '', // No image - doesn't match product
    category: 'thin-crust-pizza',
    isVeggie: false
  },
  {
    id: 'thin-crust-pizza-9',
    name: 'Chicken Tikka and Herbs Pizza',
    description: 'Spicy tomato sauce, mozzarella, mushrooms, garlic, fresh basil, tandoori spiced chicken. Fresh dough hand stretched to order, topped with our house made tomato sauce and mozzarella',
    price: 615,
    image: '', // No image - doesn't match product
    category: 'thin-crust-pizza',
    isVeggie: false
  },
  {
    id: 'thin-crust-pizza-10',
    name: 'Smoky Barbeque Chicken Pizza',
    description: '[Voyage special]. Smokey barbeque sauce, mozzarella, bell pepper, cube chicken marinated in barbeque sauce. Fresh dough hand stretched to order, topped with our house made tomato sauce and mozzarella',
    price: 615,
    image: '', // No image - doesn't match product
    category: 'thin-crust-pizza',
    isVeggie: false
  },
  
  // ========== VEG PASTA ==========
  {
    id: 'veg-pasta-1',
    name: 'Veg Arrabiata Pasta',
    description: 'Fresh tomato sauce, garlic, paprika and parsley',
    price: 405,
    image: '', // No image - doesn't match product
    category: 'veg-pasta',
    isVeggie: true
  },
  {
    id: 'veg-pasta-2',
    name: 'Veg Aglio Olio E Peperoncino Pasta',
    description: 'Dry pasta tossed in olive oil classic sauce with garlic, olive oil, red paprika and parsley',
    price: 405,
    image: '', // No image - doesn't match product
    category: 'veg-pasta',
    isVeggie: true
  },
  {
    id: 'veg-pasta-3',
    name: 'Veg Creamy Alfredo Pasta',
    description: 'Fresh home cream sauce with garlic, olive oil, chilli flakes and parsley',
    price: 445,
    image: '', // No image - doesn't match product
    category: 'veg-pasta',
    isVeggie: true
  },
  {
    id: 'veg-pasta-4',
    name: 'Veg Pesto Alla Genovese Pasta',
    description: 'Fresh basil crushed with garlic, pine nuts, olive oil and cheese',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'veg-pasta',
    isVeggie: true
  },
  {
    id: 'veg-pasta-5',
    name: 'Veg Cream Sauce Pasta with Corn and Bell Pepper',
    description: 'Simply delicious cream sauce pasta tempered with fresh garlic, paprika, corn, parsley sprinkled with parmesan cheese',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'veg-pasta',
    isVeggie: true
  },
  {
    id: 'veg-pasta-6',
    name: 'Veg Pink Sauce Pasta',
    description: 'A classic noble sauce with bechamel, tomato sauce red paprika and parmesan cheese',
    price: 495,
    image: '', // No image - doesn't match product
    category: 'veg-pasta',
    isVeggie: true
  },
  {
    id: 'veg-pasta-7',
    name: 'Veg Pasta Saporita',
    description: '[Voyage special]. Creamy sauce with fresh broccoli, chopped tomatoes, garlic, parsley, sun dried tomatoes, parmesan cheese and chili paper',
    price: 495,
    image: '', // No image - doesn't match product
    category: 'veg-pasta',
    isVeggie: true
  },
  {
    id: 'veg-pasta-8',
    name: 'Veg Pasta Del Italiana',
    description: 'Fresh homemade tomato sauce, onion, garlic, capers, red yellow capsicum, olives, parsley, mushroom, olive oil',
    price: 495,
    image: '', // No image - doesn't match product
    category: 'veg-pasta',
    isVeggie: true
  },
  {
    id: 'veg-pasta-9',
    name: 'Veg Pasta Con Verdure',
    description: 'A creamy sauce with oregano, rosemary, fresh basil, dry basil, parsley, chili flakes, red yellow green pepper, corn, broccoli, baby corn, carrot, and beans',
    price: 565,
    image: '', // No image - doesn't match product
    category: 'veg-pasta',
    isVeggie: true
  },
  
  // ========== NON VEG PASTA ==========
  {
    id: 'non-veg-pasta-1',
    name: 'Non Veg Arrabiata Pasta',
    description: 'Fresh tomato sauce, garlic, paprika and parsley',
    price: 495,
    image: '', // No image - doesn't match product
    category: 'non-veg-pasta',
    isVeggie: false
  },
  {
    id: 'non-veg-pasta-2',
    name: 'Non Veg Aglio Olio E Peperoncino Pasta',
    description: 'Dry pasta tossed in olive oil classic sauce with garlic, olive oil, red paprika and parsley',
    price: 495,
    image: '', // No image - doesn't match product
    category: 'non-veg-pasta',
    isVeggie: false
  },
  {
    id: 'non-veg-pasta-3',
    name: 'Non Veg Creamy Alfredo Pasta',
    description: 'Fresh home cream sauce with garlic, olive oil, chilli flakes and parsley',
    price: 535,
    image: '', // No image - doesn't match product
    category: 'non-veg-pasta',
    isVeggie: false
  },
  {
    id: 'non-veg-pasta-4',
    name: 'Non Veg Pesto Alla Genovese Pasta',
    description: 'Fresh basil crushed with garlic, pine nuts, olive oil and cheese',
    price: 565,
    image: '', // No image - doesn't match product
    category: 'non-veg-pasta',
    isVeggie: false
  },
  {
    id: 'non-veg-pasta-5',
    name: 'Non Veg Cream Sauce Pasta with Corn and Bell Pepper',
    description: 'Simply delicious cream sauce pasta tempered with fresh garlic, paprika, corn, parsley sprinkled with parmesan cheese',
    price: 565,
    image: '', // No image - doesn't match product
    category: 'non-veg-pasta',
    isVeggie: false
  },
  {
    id: 'non-veg-pasta-6',
    name: 'Non Veg Pink Sauce Pasta',
    description: 'A classic noble sauce with bechamel, tomato sauce red paprika and parmesan cheese',
    price: 565,
    image: '', // No image - doesn't match product
    category: 'non-veg-pasta',
    isVeggie: false
  },
  {
    id: 'non-veg-pasta-7',
    name: 'Non Veg Pasta Saporita',
    description: '[Voyage special]. Creamy sauce with fresh broccoli, chopped tomatoes, garlic, parsley, sun dried tomatoes, parmesan cheese and chili paper',
    price: 595,
    image: '', // No image - doesn't match product
    category: 'non-veg-pasta',
    isVeggie: false
  },
  {
    id: 'non-veg-pasta-8',
    name: 'Non Veg Pasta Del Italiana',
    description: 'Fresh homemade tomato sauce, onion, garlic, capers, red yellow capsicum, olives, parsley, mushroom, olive oil',
    price: 575,
    image: '', // No image - doesn't match product
    category: 'non-veg-pasta',
    isVeggie: false
  },
  {
    id: 'non-veg-pasta-9',
    name: 'Non Veg Pasta Con Verdure',
    description: 'A creamy sauce with oregano, rosemary, fresh basil, dry basil, parsley, chili flakes, red yellow green pepper, corn, broccoli, baby corn, carrot, and beans',
    price: 655,
    image: '', // No image - doesn't match product
    category: 'non-veg-pasta',
    isVeggie: false
  },
  
  // ========== MEAL BOWLS ==========
  {
    id: 'meal-bowls-4',
    name: 'Veg Mexican Bowl',
    description: '[Voyage special]. Burrito rice served with refried beans, corn, sour cream , tortillas chips and salsa',
    price: 535,
    image: '', // No image - doesn't match product
    category: 'meal-bowls',
    isVeggie: true
  },
  {
    id: 'meal-bowls-6',
    name: 'Veg Thai Curry',
    description: 'Served with basil rice',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'meal-bowls',
    isVeggie: true
  },
  {
    id: 'meal-bowls-7',
    name: 'Chicken Thai Curry',
    description: 'Served with basil rice',
    price: 535,
    image: '', // No image - doesn't match product
    category: 'meal-bowls',
    isVeggie: false
  },
  {
    id: 'meal-bowls-8',
    name: 'Chicken Mexican Bowl',
    description: '[Voyage special]. Burrito rice served with refried beans, corn, sour cream , tortillas chips and salsa',
    price: 595,
    image: '', // No image - doesn't match product
    category: 'meal-bowls',
    isVeggie: false
  },
  {
    id: 'meal-bowls-1',
    name: 'Veg Hakka Noodles with Paneer',
    description: '',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'meal-bowls',
    isVeggie: true
  },
  {
    id: 'meal-bowls-2',
    name: 'Burnt Garlic Noodles with Paneer',
    description: '',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'meal-bowls',
    isVeggie: true
  },
  {
    id: 'meal-bowls-3',
    name: 'Paneer Thick Gravy with Steam Rice',
    description: '',
    price: 495,
    image: '', // No image - doesn't match product
    category: 'meal-bowls',
    isVeggie: true
  },
  {
    id: 'meal-bowls-5',
    name: 'Burnt Garlic Noodles with Chicken in Schezwan Sauce',
    description: '',
    price: 535,
    image: '', // No image - doesn't match product
    category: 'meal-bowls',
    isVeggie: false
  },
  {
    id: 'meal-bowls-9',
    name: 'Veg Manchurian with Roasted Garlic Cilantro Rice Bowl',
    description: '',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'meal-bowls',
    isVeggie: true
  },
  {
    id: 'meal-bowls-10',
    name: 'Stuffed Veg Mushroom Black Pepper Sauce with Veg Fried Rice',
    description: '',
    price: 465,
    image: '', // No image - doesn't match product
    category: 'meal-bowls',
    isVeggie: true
  },
  {
    id: 'meal-bowls-11',
    name: 'Paneer Soya Chilli Sauce with Burnt Garlic Fried Rice',
    description: '',
    price: 495,
    image: '', // No image - doesn't match product
    category: 'meal-bowls',
    isVeggie: true
  },
  {
    id: 'meal-bowls-12',
    name: 'Chicken Oriental Sauce with 3 Bell Pepper Fried Rice',
    description: '',
    price: 535,
    image: '', // No image - doesn't match product
    category: 'meal-bowls',
    isVeggie: false
  },
  {
    id: 'meal-bowls-13',
    name: 'Chicken Dhaba Style Curry with Ghee Rice',
    description: '',
    price: 535,
    image: '', // No image - doesn't match product
    category: 'meal-bowls',
    isVeggie: false
  },
  {
    id: 'meal-bowls-14',
    name: 'Prawns Curry with Coriander Rice',
    description: '',
    price: 695,
    image: '', // No image - doesn't match product
    category: 'meal-bowls',
    isVeggie: false
  },
  {
    id: 'meal-bowls-15',
    name: 'Prawns Hot and Garlic Sauce with Butter Parsley Rice',
    description: '',
    price: 695,
    image: '', // No image - doesn't match product
    category: 'meal-bowls',
    isVeggie: false
  },
  {
    id: 'meal-bowls-16',
    name: 'Chicken Hakka Noodles Hot and Garlic Sauce',
    description: '',
    price: 535,
    image: '', // No image - doesn't match product
    category: 'meal-bowls',
    isVeggie: false
  },
  
  // ========== THE VOYAGE SPECIAL STEAKS ==========
  {
    id: 'voyage-steaks-1',
    name: 'Paneer Shashlik Peri Peri Peanut Sauce with Herbs Rice',
    description: '',
    price: 535,
    image: '', // No image - doesn't match product
    category: 'voyage-steaks',
    isVeggie: true
  },
  {
    id: 'voyage-steaks-2',
    name: 'Grilled Paneer Steak with Vegetable Mushroom and Marinara Sauce',
    description: '',
    price: 535,
    image: '', // No image - doesn't match product
    category: 'voyage-steaks',
    isVeggie: true
  },
  {
    id: 'voyage-steaks-3',
    name: 'Grilled Chicken Steak with Lemon Cream Capers',
    description: '',
    price: 595,
    image: '', // No image - doesn't match product
    category: 'voyage-steaks',
    isVeggie: false
  },
  {
    id: 'voyage-steaks-4',
    name: 'Grilled Chicken Steak with Grilled Vegetable with Smokey Bbq Sauce',
    description: '',
    price: 595,
    image: '', // No image - doesn't match product
    category: 'voyage-steaks',
    isVeggie: false
  },
  {
    id: 'voyage-steaks-5',
    name: 'Grilled Prawns with Grilled Vegetable with Lemon Pepper Sauce',
    description: '',
    price: 695,
    image: '', // No image - doesn't match product
    category: 'voyage-steaks',
    isVeggie: false
  },
  
  // ========== KETO ==========
  {
    id: 'keto-1',
    name: 'Caprese Stuffed Mushrooms',
    description: 'Button mushroom, cherry tomato mozzarella cheese extra virgin olive oil, balsamic vinegar with fresh basil',
    price: 445,
    image: '', // No image - doesn't match product
    category: 'keto',
    isVeggie: true
  },
  {
    id: 'keto-2',
    name: 'Zucchini Fritters with Sour Cream Dip',
    description: '[Voyage special]. Zucchini grated, dice red bell pepper parmesan cheese, with sour cream',
    price: 535,
    image: '', // No image - doesn't match product
    category: 'keto',
    isVeggie: true
  },
  {
    id: 'keto-3',
    name: 'Smoked Salmon and Cream Cheese Rolls',
    description: 'Smoked salmon, cheese, cream dill',
    price: 775,
    image: '', // No image - doesn't match product
    category: 'keto',
    isVeggie: false
  },
  
  // ========== DESSERTS ==========
  {
    id: 'desserts-1',
    name: 'Blueberry Cheesecake',
    description: '',
    price: 275,
    image: '', // No image - doesn't match product
    category: 'desserts',
    isVeggie: true
  },
  {
    id: 'desserts-2',
    name: 'Mango Cheese Cake',
    description: '',
    price: 275,
    image: '', // No image - doesn't match product
    category: 'desserts',
    isVeggie: true
  },
  {
    id: 'desserts-3',
    name: 'Chocolate Mousse Cake',
    description: '',
    price: 275,
    image: '', // No image - doesn't match product
    category: 'desserts',
    isVeggie: true
  },
  {
    id: 'desserts-4',
    name: 'Cream Caramel',
    description: '',
    price: 275,
    image: '', // No image - doesn't match product
    category: 'desserts',
    isVeggie: true
  },
  {
    id: 'desserts-5',
    name: 'Chocolate Walnut Brownie on Sizzler',
    description: '',
    price: 405,
    image: '', // No image - doesn't match product
    category: 'desserts',
    isVeggie: true
  },
  {
    id: 'desserts-6',
    name: 'Chocolate Lava Cake with Vanilla Ice Cream with Chocolate Sauce',
    description: '',
    price: 405,
    image: '', // No image - doesn't match product
    category: 'desserts',
    isVeggie: true
  },
  
  // ========== HOT COFFEES ==========
  {
    id: 'hot-coffees-1',
    name: 'Espresso',
    description: 'Concentrated form of coffee served in shots of our house blend',
    price: 125,
    image: '', // No image - doesn't match product
    category: 'hot-coffees',
    isVeggie: true
  },
  {
    id: 'hot-coffees-2',
    name: 'Americano',
    description: 'Shot of espresso with water, for a lighter brew',
    price: 155,
    image: getImage('hot-coffees-2'),
    category: 'hot-coffees',
    isVeggie: true
  },
  {
    id: 'hot-coffees-3',
    name: 'Espresso Macchiato',
    description: 'Shot of espresso with a dollop of foam',
    price: 155,
    image: getImage('hot-coffees-3'),
    category: 'hot-coffees',
    isVeggie: true
  },
  {
    id: 'hot-coffees-4',
    name: 'Cappuccino',
    description: 'Espresso blended with steamed and foamed milk',
    price: 195,
    image: getImage('hot-coffees-4'),
    category: 'hot-coffees',
    isVeggie: true
  },
  {
    id: 'hot-coffees-5',
    name: 'Latte',
    description: 'For if you love milkier coffees',
    price: 195,
    image: getImage('hot-coffees-5'),
    category: 'hot-coffees',
    isVeggie: true
  },
  {
    id: 'hot-coffees-6',
    name: 'Mocha',
    description: 'Espresso blended with chocolate and milk',
    price: 195,
    image: getImage('hot-coffees-6'),
    category: 'hot-coffees',
    isVeggie: true
  },
  {
    id: 'hot-coffees-7',
    name: 'Affogato',
    description: 'Ice Cream topped with our house blended espresso',
    price: 225,
    image: getImage('hot-coffees-7'),
    category: 'hot-coffees',
    isVeggie: true
  },
  {
    id: 'hot-coffees-8',
    name: 'Hot Chocolate',
    description: 'Smells chocolatey, will transport you cold winter mornings',
    price: 250,
    image: getImage('hot-coffees-8'),
    category: 'hot-coffees',
    isVeggie: true
  },
  
  // ========== ICED COFFEES ==========
  {
    id: 'iced-coffees-1',
    name: 'Iced Latte',
    description: 'Simply ice, milk and espresso',
    price: 225,
    image: getImage('iced-coffees-1'),
    category: 'iced-coffees',
    isVeggie: true
  },
  {
    id: 'iced-coffees-2',
    name: 'Shaken Americano',
    description: 'Barista special shaken iced americano',
    price: 200,
    image: getImage('iced-coffees-2'),
    category: 'iced-coffees',
    isVeggie: true
  },
  {
    id: 'iced-coffees-3',
    name: 'Iced Mocha',
    description: 'A cold mocha that you all drool over',
    price: 225,
    image: getImage('iced-coffees-3'),
    category: 'iced-coffees',
    isVeggie: true
  },
  {
    id: 'iced-coffees-4',
    name: 'Signature Cold Coffee',
    description: 'A smooth blend of coffee and ice cream',
    price: 250,
    image: getImage('iced-coffees-4'),
    category: 'iced-coffees',
    isVeggie: true
  },
  
  // ========== COLD BREWS ==========
  {
    id: 'cold-brews-1',
    name: 'Classic Cold Brew',
    description: '48 hrs steeped single estate single origin speciality coffee',
    price: 200,
    image: getImage('cold-brews-1'),
    category: 'cold-brews',
    isVeggie: true
  },
  {
    id: 'cold-brews-2',
    name: 'Vietnamese Cold Brew',
    description: 'Our classic cold brew with condensed milk',
    price: 225,
    image: getImage('cold-brews-2'),
    category: 'cold-brews',
    isVeggie: true
  },
  {
    id: 'cold-brews-3',
    name: 'Hibiscus Rose Cold Brew',
    description: 'Shaken and beautifully blended hibiscus and rose tea',
    price: 250,
    image: getImage('cold-brews-3'),
    category: 'cold-brews',
    isVeggie: true
  },
  {
    id: 'cold-brews-4',
    name: 'Sunrise Cold Brew',
    description: 'Orange or pineapple juice topped with our cold brew',
    price: 250,
    image: getImage('cold-brews-4'),
    category: 'cold-brews',
    isVeggie: true
  },
  
  // ========== SPECIALTY TEA ==========
  {
    id: 'specialty-tea-1',
    name: 'Regular Masala Tea',
    description: 'Tea pots to make you feel at home away from home',
    price: 165,
    image: getImage('specialty-tea-1'),
    category: 'specialty-tea',
    isVeggie: true
  },
  {
    id: 'specialty-tea-2',
    name: 'Ginger Tea',
    description: 'Tea pots to make you feel at home away from home',
    price: 165,
    image: getImage('specialty-tea-2'),
    category: 'specialty-tea',
    isVeggie: true
  },
  {
    id: 'specialty-tea-3',
    name: 'Earl Grey Tea Pot',
    description: 'Tea pots to make you feel at home away from home',
    price: 250,
    image: getImage('specialty-tea-3'),
    category: 'specialty-tea',
    isVeggie: true
  },
  {
    id: 'specialty-tea-4',
    name: 'Hibiscus Rose Tea Pot',
    description: 'Tea pots to make you feel at home away from home',
    price: 250,
    image: getImage('specialty-tea-4'),
    category: 'specialty-tea',
    isVeggie: true
  },
  {
    id: 'specialty-tea-5',
    name: 'Ginger Lemon Honey Tea Pot',
    description: 'Tea pots to make you feel at home away from home',
    price: 250,
    image: getImage('specialty-tea-5'),
    category: 'specialty-tea',
    isVeggie: true
  },
  {
    id: 'specialty-tea-6',
    name: 'Green Tea Pot',
    description: 'Tea pots to make you feel at home away from home',
    price: 250,
    image: getImage('specialty-tea-6'),
    category: 'specialty-tea',
    isVeggie: true
  },
  
  // ========== SHAKES ==========
  {
    id: 'shakes-1',
    name: 'Vanilla Milkshake',
    description: '',
    price: 225,
    image: getImage('shakes-1'),
    category: 'shakes',
    isVeggie: true
  },
  {
    id: 'shakes-2',
    name: 'Banana Milk Shake',
    description: '',
    price: 225,
    image: getImage('shakes-2'),
    category: 'shakes',
    isVeggie: true
  },
  {
    id: 'shakes-3',
    name: 'Strawberry Milkshake',
    description: '',
    price: 235,
    image: getImage('shakes-3'),
    category: 'shakes',
    isVeggie: true
  },
  {
    id: 'shakes-4',
    name: 'Chocolate Milk Shake',
    description: '',
    price: 235,
    image: getImage('shakes-4'),
    category: 'shakes',
    isVeggie: true
  },
  {
    id: 'shakes-5',
    name: 'Mango Milk Shake',
    description: '',
    price: 235,
    image: getImage('shakes-5'),
    category: 'shakes',
    isVeggie: true
  },
  {
    id: 'shakes-6',
    name: 'Kit Kat and Nut Shake',
    description: '',
    price: 275,
    image: getImage('shakes-6'),
    category: 'shakes',
    isVeggie: true
  },
  {
    id: 'shakes-7',
    name: 'Cold Mocha Frappe',
    description: '',
    price: 275,
    image: getImage('shakes-7'),
    category: 'shakes',
    isVeggie: true
  },
  {
    id: 'shakes-8',
    name: 'Oreo Frappe',
    description: '',
    price: 275,
    image: getImage('shakes-8'),
    category: 'shakes',
    isVeggie: true
  },
  
  // ========== MOCKTAILS AND ICED TEAS ==========
  {
    id: 'mocktails-iced-teas-1',
    name: 'Peach Iced Tea',
    description: '',
    price: 205,
    image: getImage('mocktails-iced-teas-1'),
    category: 'mocktails-iced-teas',
    isVeggie: true
  },
  {
    id: 'mocktails-iced-teas-2',
    name: 'Virgin Mojito',
    description: '',
    price: 215,
    image: getImage('mocktails-iced-teas-2'),
    category: 'mocktails-iced-teas',
    isVeggie: true
  },
  {
    id: 'mocktails-iced-teas-3',
    name: 'Green Apple Mojito',
    description: '',
    price: 265,
    image: getImage('mocktails-iced-teas-3'),
    category: 'mocktails-iced-teas',
    isVeggie: true
  },
  {
    id: 'mocktails-iced-teas-4',
    name: 'Fruit Punch',
    description: '',
    price: 265,
    image: getImage('mocktails-iced-teas-4'),
    category: 'mocktails-iced-teas',
    isVeggie: true
  },
  {
    id: 'mocktails-iced-teas-5',
    name: 'Blue Moon',
    description: '',
    price: 265,
    image: getImage('mocktails-iced-teas-5'),
    category: 'mocktails-iced-teas',
    isVeggie: true
  },
  {
    id: 'mocktails-iced-teas-6',
    name: 'Virgin Pina Colada',
    description: '',
    price: 265,
    image: getImage('mocktails-iced-teas-6'),
    category: 'mocktails-iced-teas',
    isVeggie: true
  },
  {
    id: 'mocktails-iced-teas-7',
    name: 'Bottle Water',
    description: '',
    price: 45,
    image: getImage('mocktails-iced-teas-7'),
    category: 'mocktails-iced-teas',
    isVeggie: true
  },
  {
    id: 'mocktails-iced-teas-8',
    name: 'Soft Drinks',
    description: '',
    price: 90,
    image: getImage('mocktails-iced-teas-8'),
    category: 'mocktails-iced-teas',
    isVeggie: true
  },
  {
    id: 'mocktails-iced-teas-9',
    name: 'Fresh Coconut Water',
    description: '',
    price: 115,
    image: getImage('mocktails-iced-teas-9'),
    category: 'mocktails-iced-teas',
    isVeggie: true
  },
  {
    id: 'mocktails-iced-teas-10',
    name: 'Fresh Lime Water',
    description: '',
    price: 135,
    image: getImage('mocktails-iced-teas-10'),
    category: 'mocktails-iced-teas',
    isVeggie: true
  },
  {
    id: 'mocktails-iced-teas-11',
    name: 'Fresh Lime Soda',
    description: '',
    price: 155,
    image: getImage('mocktails-iced-teas-11'),
    category: 'mocktails-iced-teas',
    isVeggie: true
  },
  {
    id: 'mocktails-iced-teas-12',
    name: 'Fresh Brewed Lemon Iced Tea',
    description: '',
    price: 195,
    image: getImage('mocktails-iced-teas-12'),
    category: 'mocktails-iced-teas',
    isVeggie: true
  },
  
  // ========== FRESH FRUIT JUICES AND COOLERS ==========
  {
    id: 'fresh-juices-coolers-1',
    name: 'Water Melon Juice',
    description: '',
    price: 250,
    image: getImage('fresh-juices-coolers-1'),
    category: 'fresh-juices-coolers',
    isVeggie: true
  },
  {
    id: 'fresh-juices-coolers-2',
    name: 'Pineapple Juice',
    description: '',
    price: 250,
    image: getImage('fresh-juices-coolers-2'),
    category: 'fresh-juices-coolers',
    isVeggie: true
  },
  {
    id: 'fresh-juices-coolers-3',
    name: 'Orange Juice',
    description: '',
    price: 250,
    image: getImage('fresh-juices-coolers-3'),
    category: 'fresh-juices-coolers',
    isVeggie: true
  },
  {
    id: 'fresh-juices-coolers-4',
    name: 'Pomegranate Juice',
    description: '',
    price: 315,
    image: getImage('fresh-juices-coolers-4'),
    category: 'fresh-juices-coolers',
    isVeggie: true
  },
  {
    id: 'fresh-juices-coolers-5',
    name: 'Apple Beetroot Carrot',
    description: '',
    price: 315,
    image: getImage('fresh-juices-coolers-5'),
    category: 'fresh-juices-coolers',
    isVeggie: true
  },
  {
    id: 'fresh-juices-coolers-6',
    name: 'Pineapple Orange Mint and Chia Seeds',
    description: '',
    price: 315,
    image: getImage('fresh-juices-coolers-6'),
    category: 'fresh-juices-coolers',
    isVeggie: true
  },
  {
    id: 'fresh-juices-coolers-7',
    name: 'Cucumber Pineapple Spinach',
    description: '',
    price: 315,
    image: getImage('fresh-juices-coolers-7'),
    category: 'fresh-juices-coolers',
    isVeggie: true
  },
  {
    id: 'fresh-juices-coolers-8',
    name: 'Sweet Lime Juice',
    description: '',
    price: 250,
    image: getImage('fresh-juices-coolers-8'),
    category: 'fresh-juices-coolers',
    isVeggie: true
  }
];

// Helper function to get add-on products by IDs
export const getAddOnProducts = (addOnIds: string[]): Product[] => {
  return products.filter(p => p.isAddOn && addOnIds.includes(p.id));
};

export const categoryNames = {
  'today-offers': "Today's Offers",
  'voyage-breakfast-board': 'Voyage Breakfast Board',
  'voyage-eggs': 'Voyage Eggs',
  'eggs-benedict': 'Eggs Benedict',
  'all-day-breakfast': 'All Day Breakfast',
  'open-toasties': 'Open Toasties and Tartines',
  'smoothie-bowls': 'Smoothie Bowls',
  'appetizing-morsels': 'Appetizing Morsels',
  'panini-sandwiches': 'Panini Sandwiches',
  'burgers': 'Burgers',
  'homemade-soups': 'Homemade Soups',
  'farm-fresh-salads': 'Farm Fresh Salads',
  'thin-crust-pizza': 'Thin Crust Pizza',
  'veg-pasta': 'Veg Pasta',
  'non-veg-pasta': 'Non Veg Pasta',
  'meal-bowls': 'Meal Bowls',
  'voyage-steaks': 'The Voyage Special Steaks',
  'keto': 'Keto',
  'desserts': 'Desserts',
  'hot-coffees': 'Hot Coffees',
  'iced-coffees': 'Iced Coffees',
  'cold-brews': 'Cold Brews',
  'specialty-tea': 'Specialty Tea',
  'shakes': 'Shakes',
  'mocktails-iced-teas': 'Mocktails and Iced Teas',
  'fresh-juices-coolers': 'Fresh Fruit Juices and Coolers'
};
