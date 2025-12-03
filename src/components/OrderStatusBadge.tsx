import { Badge } from '@/components/ui/badge';
import { Order } from '@/types/product';
import { Clock, ChefHat, CheckCircle, XCircle } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: Order['status'];
  showIcon?: boolean;
}

const statusConfig: Record<Order['status'], {
  label: string;
  variant: 'secondary' | 'default' | 'outline' | 'destructive';
  icon: typeof Clock;
  className?: string;
}> = {
  pending: {
    label: 'Pending',
    variant: 'secondary',
    icon: Clock
  },
  preparing: {
    label: 'Preparing',
    variant: 'default',
    icon: ChefHat
  },
  ready: {
    label: 'Ready for pickup',
    variant: 'default',
    icon: CheckCircle,
    className: 'bg-success hover:bg-success/90'
  },
  completed: {
    label: 'Completed',
    variant: 'outline',
    icon: CheckCircle
  },
  cancelled: {
    label: 'Cancelled',
    variant: 'destructive',
    icon: XCircle
  }
};

export const OrderStatusBadge = ({ status, showIcon = false }: OrderStatusBadgeProps) => {
  const config = statusConfig[status];
  
  // Fallback if status is not found
  if (!config) {
    return (
      <Badge variant="outline">
        {status || 'Unknown'}
      </Badge>
    );
  }
  
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={config.className}>
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {config.label}
    </Badge>
  );
};
