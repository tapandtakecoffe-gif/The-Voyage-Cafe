import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';
import { CountdownTimer } from '@/components/CountdownTimer';
import { ArrowLeft, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Order } from '@/types/product';

const OrderHistory = () => {
  const { user, isAuthenticated } = useAuth();
  const { getUserOrders, loadOrders } = useOrders();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      loadOrders();
    }
  }, [isAuthenticated, navigate, loadOrders]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const userOrders = getUserOrders(user.id);
  const sortedOrders = [...userOrders].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-card border-b shadow-sm backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold tracking-tight">Order History</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            {user.name}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {sortedOrders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <p className="text-lg mb-2">No orders yet</p>
              <p className="text-sm mb-4">Start ordering to see your history here</p>
              <Button onClick={() => navigate('/')}>Browse Menu</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/order/${order.id}`)}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">Order #{order.id}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Clock className="h-4 w-4" />
                        {order.timestamp.toLocaleString('en-US')}
                      </div>
                      {order.estimatedPickupTime && !['completed', 'cancelled'].includes(order.status) && (
                        <div className="mt-2">
                          <CountdownTimer targetTime={order.estimatedPickupTime} />
                        </div>
                      )}
                    </div>
                    <OrderStatusBadge status={order.status} showIcon />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-3">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={`${item.id}-${index}`} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-md bg-muted overflow-hidden flex items-center justify-center shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-muted-foreground text-center px-1">No image</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.quantity}x added</p>
                        </div>
                        <span className="text-sm font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{order.items.length - 3} more item{order.items.length - 3 > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-primary">₹{order.total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderHistory;

