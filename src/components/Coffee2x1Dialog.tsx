import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Product } from '@/types/product';
import { products } from '@/data/products';

interface Coffee2x1DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCoffee: Product;
  onConfirm: (secondCoffee: Product) => void;
}

export const Coffee2x1Dialog = ({ open, onOpenChange, selectedCoffee, onConfirm }: Coffee2x1DialogProps) => {
  const [selectedSecondCoffee, setSelectedSecondCoffee] = useState<string>('');

  // Get all coffee products (hot, iced, cold brew)
  const coffeeCategories = ['hot-coffees', 'iced-coffees', 'cold-brews'];
  const availableCoffees = products.filter(p => 
    coffeeCategories.includes(p.category) && p.id !== selectedCoffee.id
  );

  useEffect(() => {
    if (open) {
      setSelectedSecondCoffee('');
    }
  }, [open]);

  const handleConfirm = () => {
    if (selectedSecondCoffee) {
      const secondCoffee = availableCoffees.find(p => p.id === selectedSecondCoffee);
      if (secondCoffee) {
        onConfirm(secondCoffee);
        setSelectedSecondCoffee('');
        onOpenChange(false);
      }
    }
  };

  const handleClose = (openState: boolean) => {
    if (!openState) {
      setSelectedSecondCoffee('');
    }
    onOpenChange(openState);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">2x1 Coffee Offer</DialogTitle>
          <DialogDescription>
            Select your second coffee for free! You've selected: <strong>{selectedCoffee.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Selected Coffee Info */}
          <div className="bg-muted/50 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Your First Coffee:</p>
                <p className="text-base font-semibold">{selectedCoffee.name}</p>
                <p className="text-sm text-muted-foreground">₹{selectedCoffee.price}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground">You Pay:</p>
                <p className="text-xl font-bold text-primary">₹{selectedCoffee.price}</p>
              </div>
            </div>
          </div>

          {/* Second Coffee Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Select Your Free Coffee:</Label>
            <RadioGroup value={selectedSecondCoffee} onValueChange={setSelectedSecondCoffee}>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {availableCoffees.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No other coffees available
                  </p>
                ) : (
                  availableCoffees.map((coffee) => (
                    <div key={coffee.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                      <RadioGroupItem value={coffee.id} id={`coffee-${coffee.id}`} />
                      <Label htmlFor={`coffee-${coffee.id}`} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{coffee.name}</p>
                            {coffee.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1">{coffee.description}</p>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <span className="text-sm text-muted-foreground line-through">₹{coffee.price}</span>
                            <span className="text-sm font-bold text-green-600 ml-2">FREE</span>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </RadioGroup>
          </div>

          {/* Summary */}
          {selectedSecondCoffee && (
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Regular Price (2 coffees):</span>
                <span className="text-muted-foreground line-through">
                  ₹{selectedCoffee.price + (availableCoffees.find(p => p.id === selectedSecondCoffee)?.price || 0)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>You Pay:</span>
                <span className="text-primary">₹{selectedCoffee.price}</span>
              </div>
              <div className="text-xs text-green-600 font-semibold">
                You save ₹{availableCoffees.find(p => p.id === selectedSecondCoffee)?.price || 0}!
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedSecondCoffee}>
            Add Both to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

