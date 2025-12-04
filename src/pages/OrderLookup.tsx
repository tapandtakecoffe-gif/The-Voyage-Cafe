import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, ArrowLeft } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';

const OrderLookup = () => {
  const [orderId, setOrderId] = useState('');
  const navigate = useNavigate();
  const { getOrderById, loadOrders } = useOrders();

  const handleSearch = () => {
    if (!orderId.trim()) return;
    
    // Load latest orders from localStorage
    loadOrders();
    const order = getOrderById(orderId.trim());
    
    if (order) {
      navigate(`/order/${orderId.trim()}`);
    } else {
      // Show error - order not found
      alert(`Order #${orderId.trim()} not found. Please check the order ID and try again.`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-0"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="text-2xl mb-2">Track Your Order</CardTitle>
          <CardDescription>
            Enter your order ID to view the current status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter order ID (e.g., ORD-1234)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleSearch} 
            className="w-full"
            disabled={!orderId.trim()}
          >
            <Search className="h-4 w-4 mr-2" />
            Track Order
          </Button>

          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Menu
          </Button>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Don't have an order ID? Make a new order from the menu.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderLookup;

