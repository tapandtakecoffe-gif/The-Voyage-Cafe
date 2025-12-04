import { useEffect, useState, useMemo } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { products } from '@/data/products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';
import { ArrowLeft, LogOut, MoreVertical, Search, CheckCircle2, XCircle, UserCircle2, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Order } from '@/types/product';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';

const Admin = () => {
  const { orders, updateOrderStatus, updatePaymentStatus, loadOrders, clearAllOrders } = useOrders();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [showPendingPayments, setShowPendingPayments] = useState(false);

  // Load orders on mount
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Helper to check if order is from a specific date
  const isOrderFromDate = (order: Order, date: Date | null) => {
    if (!date) return true; // Show all if no date selected
    
    const orderDate = new Date(order.timestamp);
    orderDate.setHours(0, 0, 0, 0);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return orderDate.getTime() === targetDate.getTime();
  };

  // Get orders for selected date (or all if no date selected)
  // PROVISIONAL: Show ALL orders (admin validates all payments manually)
  const dateFilteredOrders = useMemo(() => {
    if (!selectedDate) return orders;
    return orders.filter(order => isOrderFromDate(order, selectedDate));
  }, [orders, selectedDate]);

  // Filter and sort orders - PROVISIONAL: Show ALL orders (admin validates manually)
  const filteredAndSortedOrders = useMemo(() => {
    // Show all orders - admin validates all payments manually
    let filtered = [...dateFilteredOrders];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(o => !['completed', 'cancelled'].includes(o.status));
      } else {
        filtered = filtered.filter(o => o.status === statusFilter);
      }
    }

    // Sort by most recent
    filtered = [...filtered].sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return filtered;
  }, [dateFilteredOrders, searchQuery, statusFilter]);

  const activeOrders = filteredAndSortedOrders.filter(o => !['completed', 'cancelled'].includes(o.status));
  const completedOrders = filteredAndSortedOrders.filter(o => ['completed', 'cancelled'].includes(o.status));
  
  // Get all pending payment orders (not filtered by payment status)
  // PROVISIONAL: Show all orders that need payment validation
  const pendingPaymentOrders = useMemo(() => {
    return orders.filter(order => 
      (order.paymentStatus === 'pending' || order.paymentStatus === 'counter_pending') && 
      (!selectedDate || isOrderFromDate(order, selectedDate))
    ).sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [orders, selectedDate]);
  
  // Calculate total for selected date (or today) - Only count paid orders
  const dateTotal = useMemo(() => {
    const targetDate = selectedDate || new Date();
    targetDate.setHours(0, 0, 0, 0);
    
    return dateFilteredOrders
      .filter(o => {
        const orderDate = new Date(o.timestamp);
        orderDate.setHours(0, 0, 0, 0);
        // Only count completed orders that are paid
        return o.status === 'completed' && 
               o.paymentStatus === 'paid' &&
               orderDate.getTime() === targetDate.getTime();
      })
      .reduce((sum, order) => sum + order.total, 0);
  }, [dateFilteredOrders, selectedDate]);


  // Calculate orders per hour for selected date - Only count paid orders
  const ordersPerHour = useMemo(() => {
    const targetDate = selectedDate || new Date();
    targetDate.setHours(0, 0, 0, 0);
    
    const dayOrders = dateFilteredOrders.filter(o => {
      const orderDate = new Date(o.timestamp);
      orderDate.setHours(0, 0, 0, 0);
      // Only count paid orders
      return orderDate.getTime() === targetDate.getTime() &&
             o.paymentStatus === 'paid';
    });
    
    if (dayOrders.length === 0) return 0;
    
    if (selectedDate) {
      // For historical dates, calculate based on full day (24 hours)
      return Math.round((dayOrders.length / 24) * 10) / 10;
    }
    
    // For today, calculate based on hours passed
    const hours = (Date.now() - targetDate.getTime()) / (1000 * 60 * 60);
    return hours > 0 ? Math.round((dayOrders.length / hours) * 10) / 10 : dayOrders.length;
  }, [dateFilteredOrders, selectedDate]);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    toast({
      title: "Status updated",
      description: `Order #${orderId} status changed to ${newStatus}`,
    });
  };


  const handleQuickAction = (orderId: string, action: 'complete' | 'cancel') => {
    if (action === 'complete') {
      handleStatusChange(orderId, 'completed');
    } else {
      handleStatusChange(orderId, 'cancelled');
    }
  };

  const handleMarkAsPaid = async (orderId: string) => {
    await updatePaymentStatus(orderId, 'paid');
    toast({
      title: "Payment confirmed",
      description: `Order #${orderId} has been marked as paid`,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_access');
    toast({
      title: "Session closed",
      description: "You have logged out of the café dashboard",
    });
    navigate('/');
  };

  const handleClearAllOrders = async () => {
    if (confirm('⚠️ Are you sure you want to delete ALL orders?\n\nThis will delete:\n- All orders from the database\n- All local storage data\n\nThis action CANNOT be undone!')) {
      try {
        await clearAllOrders();
        // Recargar pedidos después de eliminar
        await loadOrders();
        toast({
          title: "✅ All orders deleted",
          description: "All orders have been permanently removed. Starting fresh!",
          duration: 5000,
        });
        // Recargar la página para asegurar que todo esté limpio
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error('Error clearing orders:', error);
        toast({
          title: "Error",
          description: "There was an error deleting orders. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Historical dashboard functions
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setHistoryDialogOpen(false);
    }
  };

  const handleBackToToday = () => {
    setSelectedDate(null);
  };


  const OrderCard = ({ order }: { order: Order }) => {
    const isActive = !['completed', 'cancelled'].includes(order.status);
    const isReady = order.status === 'ready';

    return (
      <Card className={isActive ? 'border-primary/20' : ''}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg">Order #{order.id}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1.5">
                  <UserCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{order.customerName}</p>
                  {order.tableNumber && (
                    <span className="text-xs text-muted-foreground">• Table {order.tableNumber}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-muted-foreground">
                  {new Date(order.timestamp).toLocaleString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
                {order.paymentStatus === 'paid' && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    ✓ Paid
                  </span>
                )}
                {order.paymentStatus === 'counter_pending' && (
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                    💰 Pay at Counter
                  </span>
                )}
                {order.paymentStatus === 'pending' && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                    ⏳ Payment Pending
                  </span>
                )}
              </div>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.name}</span>
                <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center font-bold">
            <span>Total</span>
            <span className="text-primary">₹{order.total.toFixed(2)}</span>
          </div>

          {isActive && (
            <div className="space-y-3">
              {/* Mark as Paid button - PROVISIONAL: Show for all pending payment orders */}
              {(order.paymentStatus === 'counter_pending' || order.paymentStatus === 'pending') && (
                <Button
                  size="sm"
                  className="w-full h-9 bg-green-600 hover:bg-green-700"
                  onClick={() => handleMarkAsPaid(order.id)}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark as Paid
                </Button>
              )}
              
              {/* Quick Actions for ready orders */}
              {isReady && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 h-9"
                    onClick={() => handleQuickAction(order.id, 'complete')}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-9"
                    onClick={() => handleQuickAction(order.id, 'cancel')}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <Select
                value={order.status}
                onValueChange={(value) => handleStatusChange(order.id, value as Order['status'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-card border-b shadow-sm backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-primary transition-colors h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold tracking-tight">
              {selectedDate 
                ? `Historical Dashboard - ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                : 'The Voyage Cafe - Admin Panel'
              }
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {selectedDate && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToToday}
                className="h-8"
              >
                Back to Today
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-muted-foreground hover:text-primary transition-colors h-8 w-8"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setHistoryDialogOpen(true)}>
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  View Order History
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleClearAllOrders}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Clear All Orders
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeOrders.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {selectedDate ? 'Day Total' : "Today's Total"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">₹{dateTotal.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{completedOrders.length}</div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" />
                Orders/Hour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{ordersPerHour}</div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Payments Section */}
        {pendingPaymentOrders.length > 0 && (
          <Card className="mb-6 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">⚠️ Pending Payments</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {pendingPaymentOrders.length} order{pendingPaymentOrders.length !== 1 ? 's' : ''} with pending payment status
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPendingPayments(!showPendingPayments)}
                >
                  {showPendingPayments ? 'Hide' : 'Show'} Pending
                </Button>
              </div>
            </CardHeader>
            {showPendingPayments && (
              <CardContent>
                <div className="space-y-3">
                  {pendingPaymentOrders.map((order) => (
                    <Card key={order.id} className="bg-white dark:bg-gray-900">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.customerName} • {new Date(order.timestamp).toLocaleString('en-US')}
                            </p>
                            <p className="text-sm font-medium mt-1">Total: ₹{order.total.toFixed(2)}</p>
                          </div>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              handleMarkAsPaid(order.id);
                              toast({
                                title: "Payment confirmed",
                                description: `Order #${order.id} marked as paid`,
                              });
                            }}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Mark as Paid
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Active Orders</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}

        {/* Completed Orders */}
        {completedOrders.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">History</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedOrders.slice(0, 15).map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
            {completedOrders.length > 15 && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Showing 15 most recent orders
              </p>
            )}
          </div>
        )}

        {/* Empty State */}
        {filteredAndSortedOrders.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <p className="text-lg mb-2">No orders found</p>
              <p className="text-sm">
                {selectedDate
                  ? `No orders found for ${selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                  : searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'No orders have been placed yet'}
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Calendar Dialog */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Select Date</DialogTitle>
            <DialogDescription>
              Choose a date to view the dashboard
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <Calendar
              mode="single"
              selected={selectedDate || undefined}
              onSelect={handleDateSelect}
              disabled={(date) => {
                // Disable future dates
                const today = new Date();
                today.setHours(23, 59, 59, 999);
                return date > today;
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;