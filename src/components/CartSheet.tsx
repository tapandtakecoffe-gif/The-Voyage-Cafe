import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/hooks/useCart';
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, Wallet } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { products } from '@/data/products';
import { useState } from 'react';

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCheckout: (tableNumber: string, paymentMethod: 'stripe' | 'counter') => void;
}

export const CartSheet = ({ open, onOpenChange, onCheckout }: CartSheetProps) => {
  const { items, updateQuantity, removeItem, getTotal, getCoffeeDiscount } = useCart();
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'counter'>('stripe');
  
  const getItemKey = (item: typeof items[0]) => {
    return `${item.id}-${item.selectedAddOns?.sort().join(',') || ''}`;
  };

  const handleCheckout = () => {
    if (!tableNumber.trim()) {
      return;
    }
    onCheckout(tableNumber.trim(), paymentMethod);
    onOpenChange(false);
    setTableNumber('');
    setPaymentMethod('stripe'); // Reset to default
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Order
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p>Your cart is empty</p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item, index) => {
                  const itemKey = `${item.id}-${item.selectedAddOns?.sort().join(',') || ''}`;
                  const addOnProducts = item.selectedAddOns?.map(id => products.find(p => p.id === id)).filter(Boolean) || [];
                  const addOnsTotal = addOnProducts.reduce((sum, addOn) => sum + (addOn?.price || 0), 0);
                  const itemTotal = (item.price + addOnsTotal) * item.quantity;
                  
                  return (
                    <div key={`${itemKey}-${index}`} className="flex gap-4 bg-card rounded-lg p-3 border">
                      <div className="w-20 h-20 rounded-md bg-muted overflow-hidden flex items-center justify-center">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground text-center px-2">No image</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)}</p>
                        {addOnProducts.length > 0 && (
                          <div className="mt-1 space-y-0.5">
                            {addOnProducts.map((addOn) => (
                              <p key={addOn?.id} className="text-xs text-muted-foreground">
                                + {addOn?.name}: ₹{addOn?.price.toFixed(2)}
                              </p>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(getItemKey(item), item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(getItemKey(item), item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 ml-auto text-destructive hover:text-destructive"
                            onClick={() => removeItem(getItemKey(item))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right font-semibold">
                        ₹{itemTotal.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <SheetFooter className="flex-col gap-4 sm:flex-col">
              <div className="w-full space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="table-number">Table Number or Name</Label>
                  <Input
                    id="table-number"
                    type="text"
                    placeholder="Enter table number or name"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                {/* Payment Method Selection */}
                <div className="space-y-3">
                  <Label>Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'stripe' | 'counter')}>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="stripe" id="stripe" />
                      <Label htmlFor="stripe" className="flex-1 cursor-pointer flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Pay Online (Stripe)</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="counter" id="counter" />
                      <Label htmlFor="counter" className="flex-1 cursor-pointer flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        <span>Pay at Counter</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2 py-2 border-t">
                  {getCoffeeDiscount() > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Coffee 2x1 Offer Applied</span>
                      <span className="text-green-600 font-semibold">-₹{getCoffeeDiscount().toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary">₹{getTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Button 
                onClick={handleCheckout} 
                size="lg" 
                className="w-full"
                disabled={!tableNumber.trim() || items.length === 0}
              >
                {paymentMethod === 'counter' ? 'Place Order (Pay at Counter)' : 'Place Order & Pay'}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
