import { useState, useMemo } from 'react';
import { products, categoryNames } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { CartSheet } from '@/components/CartSheet';
import { AdminAccessDialog } from '@/components/AdminAccessDialog';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ShoppingBag, LayoutDashboard, Search, Leaf, UtensilsCrossed } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/types/product';
import { generateOrderId } from '@/utils/orderUtils';
import voyageCafeLogo from '@/assets/Voyage Logo.png';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';

const Menu = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [dietFilter, setDietFilter] = useState<'all' | 'veggie' | 'non-veggie'>('all');
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const { items, addItem, clearCart, getTotal } = useCart();
  const { addOrder } = useOrders();
  const { toast } = useToast();
  const navigate = useNavigate();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (product: Product, selectedAddOns?: string[]) => {
    addItem(product, selectedAddOns);
    const addOnNames = selectedAddOns && selectedAddOns.length > 0
      ? ` with ${selectedAddOns.length} add-on${selectedAddOns.length > 1 ? 's' : ''}`
      : '';
    toast({
      title: "Added to cart",
      description: `${product.name}${addOnNames} added successfully`,
    });
  };

  const handleCheckout = (tableNumber: string) => {
    const order = {
      id: generateOrderId(),
      items: [...items],
      total: getTotal(),
      status: 'pending' as const,
      customerName: `Table ${tableNumber}`,
      tableNumber: tableNumber,
      timestamp: new Date()
    };
    
    addOrder(order);
    clearCart();
    
    toast({
      title: "Order placed!",
      description: `Your order #${order.id} has been received for Table ${tableNumber}`,
      duration: 5000,
    });
  };

  const handleAdminAccess = () => {
    const hasAccess = localStorage.getItem('admin_access') === 'true';
    if (hasAccess) {
      navigate('/admin');
    } else {
      setAdminDialogOpen(true);
    }
  };

  const handleAdminSuccess = () => {
    navigate('/admin');
  };

  const categories = Object.entries(categoryNames).map(([value, label]) => ({
    value,
    label
  }));

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Don't show add-on products in the main list
      if (product.isAddOn) return false;
      
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower);
      
      const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
      
      const matchesDiet = dietFilter === 'all' || 
        (dietFilter === 'veggie' && product.isVeggie === true) ||
        (dietFilter === 'non-veggie' && product.isVeggie === false);
      
      return matchesSearch && matchesCategory && matchesDiet;
    });
  }, [searchQuery, selectedCategory, dietFilter]);

  // Group products by category when no specific category is selected
  const groupedProducts = useMemo(() => {
    if (selectedCategory !== '') {
      return { [selectedCategory]: filteredProducts };
    }
    
    const groups: Record<string, typeof filteredProducts> = {};
    filteredProducts.forEach(product => {
      if (!groups[product.category]) {
        groups[product.category] = [];
      }
      groups[product.category].push(product);
    });
    
    // Order categories according to categoryNames order
    const orderedGroups: Record<string, typeof filteredProducts> = {};
    categories.forEach(({ value }) => {
      if (groups[value] && groups[value].length > 0) {
        orderedGroups[value] = groups[value];
      }
    });
    
    return orderedGroups;
  }, [filteredProducts, selectedCategory, categories]);

  return (
    <div className="min-h-screen bg-background flex flex-col w-full overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-card border-b shadow-md backdrop-blur-md bg-card/95 w-full">
        <div className="w-full max-w-full px-4 sm:px-6 py-4 overflow-x-hidden">
          <div className="flex items-center justify-between gap-2 sm:gap-4 w-full max-w-full overflow-x-hidden">
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 min-w-0">
              <img 
                src={voyageCafeLogo} 
                alt="The Voyage Cafe Logo" 
                className="h-12 w-12 sm:h-16 sm:w-16 object-contain cursor-pointer flex-shrink-0"
                onClick={() => navigate('/')}
              />
              <div className="flex flex-col justify-center min-w-0">
                <h1 className="text-sm sm:text-base font-bold leading-tight truncate" style={{ color: 'hsl(225, 75%, 22%)' }}>The Voyage Cafe</h1>
                <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">The Voyage Cafe - Koregaon Park</p>
              </div>
            </div>

            <div className="relative flex-1 max-w-lg mx-8 hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 text-sm w-full"
              />
            </div>

            {/* Desktop Header Actions */}
            <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
              <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDietFilter('all')}
                  className={`h-8 px-4 text-xs font-medium transition-all ${
                    dietFilter === 'all' 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDietFilter('veggie')}
                  className={`h-8 px-4 text-xs font-medium transition-all gap-1.5 ${
                    dietFilter === 'veggie' 
                      ? 'bg-green-50 text-green-700 shadow-sm border border-green-200' 
                      : 'text-muted-foreground hover:text-green-600'
                  }`}
                >
                  <Leaf className="h-3.5 w-3.5" />
                  Veggie
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDietFilter('non-veggie')}
                  className={`h-8 px-4 text-xs font-medium transition-all gap-1.5 ${
                    dietFilter === 'non-veggie' 
                      ? 'bg-amber-50 text-amber-700 shadow-sm border border-amber-200' 
                      : 'text-muted-foreground hover:text-amber-600'
                  }`}
                >
                  <UtensilsCrossed className="h-3.5 w-3.5" />
                  Non Veggie
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleAdminAccess}
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-primary"
                  title="Admin panel"
                >
                  <LayoutDashboard className="h-5 w-5" />
                </Button>
              </div>

              <Button 
                onClick={() => setCartOpen(true)}
                size="default"
                className="relative gap-2 h-11 px-4 shadow-lg hover:shadow-xl transition-shadow"
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
                <span className="font-semibold">Cart</span>
              </Button>
            </div>

            {/* Mobile Header Actions - Admin only */}
            <div className="lg:hidden flex items-center gap-2 flex-shrink-0">
              <Button 
                onClick={handleAdminAccess}
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-primary"
                title="Admin panel"
              >
                <LayoutDashboard className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Section */}
          <div className="lg:hidden space-y-3 mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-sm w-full rounded-2xl"
              />
            </div>
            <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDietFilter('all')}
                className={`h-9 px-3 text-xs font-medium flex-1 transition-all ${
                  dietFilter === 'all' 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground'
                }`}
              >
                All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDietFilter('veggie')}
                className={`h-9 px-3 text-xs font-medium flex-1 gap-1.5 transition-all ${
                  dietFilter === 'veggie' 
                    ? 'bg-green-50 text-green-700 shadow-sm border border-green-200' 
                    : 'text-muted-foreground'
                }`}
              >
                <Leaf className="h-3.5 w-3.5" />
                Veggie
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDietFilter('non-veggie')}
                className={`h-9 px-3 text-xs font-medium flex-1 gap-1.5 transition-all ${
                  dietFilter === 'non-veggie' 
                    ? 'bg-amber-50 text-amber-700 shadow-sm border border-amber-200' 
                    : 'text-muted-foreground'
                }`}
              >
                <UtensilsCrossed className="h-3.5 w-3.5" />
                Non Veggie
              </Button>
            </div>
            <div className="flex items-center justify-end">
              <Button 
                onClick={() => setCartOpen(true)}
                size="default"
                className="relative gap-2 h-11 px-4 shadow-lg hover:shadow-xl transition-shadow w-full"
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
                <span className="font-semibold">Cart</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden w-full max-w-full">
        {/* Sidebar - Categories */}
        <aside className="hidden lg:block w-48 bg-transparent flex-shrink-0 overflow-y-auto sticky top-[116px] h-[calc(100vh-116px)]">
          <div className="p-4 pr-6 max-w-full">
            <h2 className="text-base font-semibold text-foreground mb-4">Menu</h2>
            <nav className="space-y-1 [&_button]:!bg-transparent [&_button:hover]:!bg-transparent [&_button:hover]:!text-muted-foreground [&_button:active]:!bg-transparent">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-3 py-2.5 text-sm rounded-lg relative ${
                  selectedCategory === ''
                    ? 'text-foreground font-medium !bg-primary/10'
                    : 'text-muted-foreground !bg-transparent'
                }`}
              >
                {selectedCategory === '' && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r" />
                )}
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`w-full text-left px-3 py-2.5 text-sm rounded-lg relative ${
                    selectedCategory === category.value
                      ? 'text-foreground font-medium !bg-primary/10'
                      : 'text-muted-foreground !bg-transparent'
                  }`}
                >
                  {selectedCategory === category.value && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r" />
                  )}
                  {category.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full max-w-full overflow-x-hidden">
          <div className="p-4 sm:p-6 lg:p-8 w-full max-w-full lg:max-w-5xl lg:mx-auto">
            {selectedCategory && (
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {categories.find(c => c.value === selectedCategory)?.label || 'All Products'}
              </h2>
            )}
            
            {Object.keys(groupedProducts).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedProducts).map(([categoryId, categoryProducts]) => (
                  <div key={categoryId} className="space-y-3">
                    {/* Category Section Title */}
                    <h2 className="text-xl font-bold text-foreground">
                      {categoryNames[categoryId as keyof typeof categoryNames] || categoryId}
                    </h2>
                    
                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {categoryProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onAddToCart={handleAddToCart}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} onCheckout={handleCheckout} />
      <AdminAccessDialog 
        open={adminDialogOpen} 
        onOpenChange={setAdminDialogOpen}
        onSuccess={handleAdminSuccess}
      />

      {/* Floating menu for mobile */}
      <div className="lg:hidden fixed bottom-6 right-4 z-30">
        <Button
          className="rounded-full h-16 w-16 shadow-2xl flex items-center justify-center text-xs font-semibold tracking-wide"
          onClick={() => setCategorySheetOpen(true)}
        >
          Menu
        </Button>
      </div>

      <Sheet open={categorySheetOpen} onOpenChange={setCategorySheetOpen}>
        <SheetContent side="bottom" className="max-h-[70vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Categories</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-2">
            <button
              onClick={() => {
                setSelectedCategory('');
                setCategorySheetOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl border ${
                selectedCategory === '' ? 'border-primary text-primary font-semibold' : 'border-border text-foreground'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={`sheet-${category.value}`}
                onClick={() => {
                  setSelectedCategory(category.value);
                  setCategorySheetOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl border ${
                  selectedCategory === category.value ? 'border-primary text-primary font-semibold' : 'border-border text-foreground'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Menu;
