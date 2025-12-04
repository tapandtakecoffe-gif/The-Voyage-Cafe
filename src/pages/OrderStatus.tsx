import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';
import { CountdownTimer } from '@/components/CountdownTimer';
import { ArrowLeft, Clock, RefreshCw, Share2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Order } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

const OrderStatus = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById, loadOrders } = useOrders();
  const { user } = useAuth();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | undefined>(orderId ? getOrderById(orderId) : undefined);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh every 3 seconds to get latest updates and persist order
  useEffect(() => {
    if (!orderId) return;

    const refreshOrder = async () => {
      // Always load orders first to ensure we have the latest data
      await loadOrders();
      
      // Small delay to ensure orders are loaded
      setTimeout(() => {
        const updatedOrder = getOrderById(orderId);
        if (updatedOrder) {
          // Check if user has access to this order
          if (user && updatedOrder.userId && updatedOrder.userId !== user.id) {
            toast({
              title: "Access denied",
              description: "This order does not belong to you",
              variant: "destructive",
            });
            navigate('/');
            return;
          }
          setOrder(updatedOrder);
          // Persist order ID in localStorage so it survives page reloads
          localStorage.setItem('last_viewed_order', orderId);
        } else {
          // If order not found, try to load from localStorage
          const lastOrderId = localStorage.getItem('last_viewed_order');
          if (lastOrderId === orderId) {
            // Order was deleted or doesn't exist anymore
            localStorage.removeItem('last_viewed_order');
          }
        }
      }, 100);
    };

    // Initial load
    refreshOrder();

    // Set up interval for auto-refresh
    const interval = setInterval(refreshOrder, 3000);

    return () => clearInterval(interval);
  }, [orderId, getOrderById, loadOrders, user, toast, navigate]);

  // Load order from localStorage on mount if orderId is missing
  useEffect(() => {
    if (!orderId) {
      const lastOrderId = localStorage.getItem('last_viewed_order');
      if (lastOrderId) {
        navigate(`/order/${lastOrderId}`, { replace: true });
      }
    }
  }, [orderId, navigate]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadOrders();
    const updatedOrder = orderId ? getOrderById(orderId) : undefined;
    if (updatedOrder) {
      setOrder(updatedOrder);
      toast({
        title: "Order updated",
        description: "Latest status has been loaded",
      });
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/order/${orderId}`;
    if (navigator.share) {
      navigator.share({
        title: `Order #${orderId}`,
        text: `Track your order #${orderId}`,
        url: url,
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "Order link has been copied to clipboard",
        });
      });
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Order link has been copied to clipboard",
      });
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Order not found</h2>
            <p className="text-muted-foreground mb-6">Could not find the requested order</p>
            <Button onClick={() => navigate('/')}>Back to Menu</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-card border-b shadow-sm backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
            <h1 className="text-2xl font-bold tracking-tight">Your Order</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh order status"
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleShare}
              title="Share order link"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <div>
                <CardTitle className="text-2xl mb-2">Order #{order.id}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {order.timestamp.toLocaleString('en-US')}
                </div>
              </div>
              <OrderStatusBadge status={order.status} showIcon />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Payment Status */}
            {order.paymentStatus && (
              <div className="bg-muted p-4 rounded-lg">
                {order.paymentStatus === 'paid' && (
                  <div className="flex items-center gap-2 text-green-700">
                    <span className="text-lg">✓</span>
                    <p className="text-sm font-semibold">Payment confirmed</p>
                  </div>
                )}
                {order.paymentStatus === 'counter_pending' && (
                  <div className="flex items-center gap-2 text-yellow-700">
                    <span className="text-lg">⏳</span>
                    <p className="text-sm font-semibold">Payment pending at counter - Please pay when your order is ready</p>
                  </div>
                )}
                {order.paymentStatus === 'pending' && (
                  <div className="flex items-center gap-2 text-yellow-700">
                    <span className="text-lg">⏳</span>
                    <p className="text-sm font-semibold">Payment pending - Please complete your payment</p>
                  </div>
                )}
                {order.paymentStatus === 'failed' && (
                  <div className="flex items-center gap-2 text-red-700">
                    <span className="text-lg">✗</span>
                    <p className="text-sm font-semibold">Payment failed - Please try again</p>
                  </div>
                )}
              </div>
            )}

            {/* Status Messages */}
            <div className="bg-muted p-4 rounded-lg space-y-3">
              {order.status === 'pending' && (
                <p className="text-sm">Your order has been received and will be processed shortly.</p>
              )}
              {order.status === 'preparing' && (
                <p className="text-sm">We're preparing your order! It won't be long.</p>
              )}
              {order.status === 'ready' && (
                <p className="text-sm font-semibold text-success">Your order is ready for pickup!</p>
              )}
              {order.status === 'completed' && (
                <p className="text-sm font-semibold text-green-600">Order completed. Thank you!</p>
              )}
              {order.status === 'cancelled' && (
                <p className="text-sm font-semibold text-red-600">This order has been cancelled.</p>
              )}
              
              {/* Countdown Timer */}
              {order.estimatedPickupTime && !['completed', 'cancelled', 'ready'].includes(order.status) && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Estimated time until ready:</p>
                  <CountdownTimer 
                    targetTime={order.estimatedPickupTime}
                    onComplete={() => {
                      // Optionally update status to ready when timer completes
                    }}
                  />
                </div>
              )}
              
              {order.estimatedPickupTime && order.status === 'ready' && (
                <div className="pt-2 border-t">
                  <p className="text-sm font-semibold text-green-600">
                    Ready for pickup at {new Date(order.estimatedPickupTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-4">Order Details</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded bg-muted"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Total */}
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total</span>
              <span className="text-primary">₹{order.total.toFixed(2)}</span>
            </div>

            <Button onClick={() => navigate('/')} variant="outline" className="w-full">
              Back to Menu
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OrderStatus;
