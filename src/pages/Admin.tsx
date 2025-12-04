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
  const { orders, updateOrderStatus, loadOrders, clearAllOrders } = useOrders();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

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
  const dateFilteredOrders = useMemo(() => {
    if (!selectedDate) return orders;
    return orders.filter(order => isOrderFromDate(order, selectedDate));
  }, [orders, selectedDate]);

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = dateFilteredOrders;

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
  
  // Calculate total for selected date (or today)
  const dateTotal = useMemo(() => {
    const targetDate = selectedDate || new Date();
    targetDate.setHours(0, 0, 0, 0);
    
    return dateFilteredOrders
      .filter(o => {
        const orderDate = new Date(o.timestamp);
        orderDate.setHours(0, 0, 0, 0);
        return o.status === 'completed' && orderDate.getTime() === targetDate.getTime();
      })
      .reduce((sum, order) => sum + order.total, 0);
  }, [dateFilteredOrders, selectedDate]);


  // Calculate orders per hour for selected date
  const ordersPerHour = useMemo(() => {
    const targetDate = selectedDate || new Date();
    targetDate.setHours(0, 0, 0, 0);
    
    const dayOrders = dateFilteredOrders.filter(o => {
      const orderDate = new Date(o.timestamp);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === targetDate.getTime();
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

  const handleLogout = () => {
    localStorage.removeItem('admin_access');
    toast({
      title: "Session closed",
      description: "You have logged out of the café dashboard",
    });
    navigate('/');
  };

  const handleClearAllOrders = () => {
    if (confirm('Are you sure you want to delete ALL orders? This action cannot be undone.')) {
      clearAllOrders();
      toast({
        title: "All orders deleted",
        description: "All orders have been permanently removed",
      });
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
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(order.timestamp).toLocaleString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
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