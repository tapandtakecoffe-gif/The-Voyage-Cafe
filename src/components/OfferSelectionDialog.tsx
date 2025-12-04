import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Product } from '@/types/product';
import { products } from '@/data/products';

interface OfferSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: Product;
  onConfirm: (selectedProducts: Product[]) => void;
}

export const OfferSelectionDialog = ({ open, onOpenChange, offer, onConfirm }: OfferSelectionDialogProps) => {
  // Determine which products to show based on offer type
  const getAvailableProducts = () => {
    if (offer.id === 'today-offer-0') {
      // 2x1 Coffee Offer - show all coffees
      const coffees = products.filter(p => 
        ['hot-coffees', 'iced-coffees', 'cold-brews'].includes(p.category) && !p.isAddOn
      );
      return {
        category1: coffees,
        category2: [],
        label1: 'Select Your First Coffee',
        label2: '',
        isCoffee2x1: true
      };
    } else if (offer.id === 'today-offer-1') {
      // Mocktail + Pizza
      return {
        category1: products.filter(p => p.category === 'mocktails-iced-teas'),
        category2: products.filter(p => p.category === 'thin-crust-pizza'),
        label1: 'Select Mocktail',
        label2: 'Select Pizza'
      };
    } else if (offer.id === 'today-offer-2') {
      // Mocktail + Burger
      return {
        category1: products.filter(p => p.category === 'mocktails-iced-teas'),
        category2: products.filter(p => p.category === 'burgers'),
        label1: 'Select Mocktail',
        label2: 'Select Burger'
      };
    } else if (offer.id === 'today-offer-3') {
      // Pancake + Coffee/Shake
      const pancakes = products.filter(p => 
        p.category === 'all-day-breakfast' && 
        (p.name.toLowerCase().includes('pancake') || p.name.toLowerCase().includes('crepe'))
      );
      const coffees = products.filter(p => 
        ['hot-coffees', 'iced-coffees', 'cold-brews'].includes(p.category)
      );
      const shakes = products.filter(p => p.category === 'shakes');
      return {
        category1: pancakes,
        category2: [...coffees, ...shakes],
        label1: 'Select Pancake',
        label2: 'Select Coffee or Shake'
      };
    }
    return { category1: [], category2: [], label1: '', label2: '' };
  };

  const { category1, category2, label1, label2, isCoffee2x1 } = getAvailableProducts();
  const [selected1, setSelected1] = useState<string>('');
  const [selected2, setSelected2] = useState<string>('');

  const handleConfirm = () => {
    if (isCoffee2x1) {
      // For 2x1 coffee offer, we need both coffees selected
      if (selected1 && selected2) {
        const product1 = category1.find(p => p.id === selected1);
        const product2 = category1.find(p => p.id === selected2);
        if (product1 && product2) {
          onConfirm([product1, product2]);
          setSelected1('');
          setSelected2('');
          onOpenChange(false);
        }
      }
    } else {
      // Regular combo offers
      if (selected1 && selected2) {
        const product1 = category1.find(p => p.id === selected1);
        const product2 = category2.find(p => p.id === selected2);
        if (product1 && product2) {
          onConfirm([product1, product2]);
          setSelected1('');
          setSelected2('');
          onOpenChange(false);
        }
      }
    }
  };

  const handleClose = (openState: boolean) => {
    if (!openState) {
      setSelected1('');
      setSelected2('');
    }
    onOpenChange(openState);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{offer.name}</DialogTitle>
          <DialogDescription>
            {isCoffee2x1 
              ? 'Select two coffees - pay for one, get the second free!'
              : `Select your preferred items for this special offer. Total: ₹${offer.price}`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* First Category Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">{label1}</Label>
            <RadioGroup value={selected1} onValueChange={setSelected1}>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {category1.map((product) => (
                  <div key={product.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                    <RadioGroupItem value={product.id} id={`cat1-${product.id}`} disabled={isCoffee2x1 && selected2 === product.id} />
                    <Label htmlFor={`cat1-${product.id}`} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          {product.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground ml-4">
                          {isCoffee2x1 && selected1 === product.id ? `₹${product.price}` : `₹${product.price}`}
                        </span>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Second Category Selection - For coffee 2x1, show same list */}
          {isCoffee2x1 ? (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Select Your Free Coffee:</Label>
              <RadioGroup value={selected2} onValueChange={setSelected2}>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {category1.filter(p => p.id !== selected1).map((product) => (
                    <div key={product.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                      <RadioGroupItem value={product.id} id={`cat2-${product.id}`} />
                      <Label htmlFor={`cat2-${product.id}`} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{product.name}</p>
                            {product.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <span className="text-sm text-muted-foreground line-through">₹{product.price}</span>
                            <span className="text-sm font-bold text-green-600 ml-2">FREE</span>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          ) : (
            <div className="space-y-3">
              <Label className="text-base font-semibold">{label2}</Label>
              <RadioGroup value={selected2} onValueChange={setSelected2}>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {category2.map((product) => (
                    <div key={product.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                      <RadioGroupItem value={product.id} id={`cat2-${product.id}`} />
                      <Label htmlFor={`cat2-${product.id}`} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{product.name}</p>
                            {product.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground ml-4">
                            ₹{product.price}
                          </span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Price Summary */}
          {selected1 && selected2 && (
            <div className="border-t pt-4 space-y-2">
              {isCoffee2x1 ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Regular Price (2 coffees):</span>
                    <span className="text-muted-foreground line-through">
                      ₹{(category1.find(p => p.id === selected1)?.price || 0) + (category1.find(p => p.id === selected2)?.price || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>You Pay:</span>
                    <span className="text-primary">₹{category1.find(p => p.id === selected1)?.price || 0}</span>
                  </div>
                  <div className="text-xs text-green-600 font-semibold">
                    You save ₹{category1.find(p => p.id === selected2)?.price || 0}!
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Regular Price:</span>
                    <span className="text-muted-foreground line-through">
                      ₹{(category1.find(p => p.id === selected1)?.price || 0) + (category2.find(p => p.id === selected2)?.price || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Offer Price:</span>
                    <span className="text-primary">₹{offer.price}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    You save ₹{((category1.find(p => p.id === selected1)?.price || 0) + (category2.find(p => p.id === selected2)?.price || 0)) - offer.price}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selected1 || !selected2}>
            Add to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

