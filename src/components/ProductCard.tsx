import { useState, Fragment } from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Info, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ProductInfoDialog } from './ProductInfoDialog';
import { OfferSelectionDialog } from './OfferSelectionDialog';
import { Coffee2x1Dialog } from './Coffee2x1Dialog';
import { getAddOnProducts } from '@/data/products';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, selectedAddOns?: string[]) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [addOnDialogOpen, setAddOnDialogOpen] = useState(false);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [coffee2x1DialogOpen, setCoffee2x1DialogOpen] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  
  const availableAddOns = product.addOns ? getAddOnProducts(product.addOns) : [];
  const isSpecialOffer = product.isSpecialOffer && product.category === 'today-offers';
  const coffeeCategories = ['hot-coffees', 'iced-coffees', 'cold-brews'];
  const isCoffee = coffeeCategories.includes(product.category);
  
  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId) 
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };
  
  const handleAddClick = () => {
    if (isSpecialOffer) {
      setOfferDialogOpen(true);
    } else if (isCoffee) {
      // Open 2x1 dialog for coffees
      setCoffee2x1DialogOpen(true);
    } else if (availableAddOns.length > 0) {
      setAddOnDialogOpen(true);
    } else {
      onAddToCart(product);
    }
  };
  
  const handleConfirmAdd = () => {
    onAddToCart(product, selectedAddOns);
    setAddOnDialogOpen(false);
    setSelectedAddOns([]);
  };

  const handleOfferConfirm = (selectedProducts: Product[]) => {
    // Calculate the total regular price
    const regularTotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
    const discount = regularTotal - product.price;
    
    // Add each selected product with adjusted pricing to match offer price
    selectedProducts.forEach((selectedProduct, index) => {
      // Calculate proportional price adjustment
      const productRatio = selectedProduct.price / regularTotal;
      const adjustedPrice = Math.round(selectedProduct.price - (discount * productRatio));
      
      // Create a modified product with offer info
      const offerProduct: Product = {
        ...selectedProduct,
        name: `${selectedProduct.name} (${product.name})`,
        price: adjustedPrice
      };
      onAddToCart(offerProduct);
    });
    setOfferDialogOpen(false);
  };

  const handleCoffee2x1Confirm = (secondCoffee: Product) => {
    // Add first coffee at full price
    onAddToCart(product);
    
    // Add second coffee at 0 price (free) but keep original price in description for discount calculation
    const freeCoffee: Product = {
      ...secondCoffee,
      id: `${secondCoffee.id}-2x1-free`,
      name: `${secondCoffee.name} (2x1 FREE)`,
      price: 0,
      description: `${secondCoffee.description || ''} [Original Price: ₹${secondCoffee.price}]`.trim()
    };
    onAddToCart(freeCoffee);
    setCoffee2x1DialogOpen(false);
  };

  const [showFullDescription, setShowFullDescription] = useState(false);
  const hasDescription = product.description && product.description.trim().length > 0;
  const descriptionWords = hasDescription ? product.description.split(' ') : [];
  const truncatedDescription = descriptionWords.length > 0 
    ? descriptionWords.slice(0, 15).join(' ') + (descriptionWords.length > 15 ? '...' : '')
    : '';
  const hasLongDescription = descriptionWords.length > 15;

  // Function to render description with [Voyage special] in bold
  const renderDescription = (text: string) => {
    if (!text || text.trim().length === 0) {
      return null;
    }
    const parts = text.split('[Voyage special]');
    if (parts.length === 1) {
      return text;
    }
    return (
      <>
        {parts.map((part, index) => (
          <Fragment key={index}>
            {index > 0 && <strong>[Voyage special]</strong>}
            {part}
          </Fragment>
        ))}
      </>
    );
  };

  return (
    <>
      <Card className="group overflow-hidden hover:shadow-sm transition-all duration-200 border rounded-lg flex flex-row bg-card w-full max-w-full">
        {/* Image on the left */}
        <div className="relative w-28 h-28 flex-shrink-0 bg-muted overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground bg-gradient-to-br from-muted to-muted/50">
              {product.isSpecialOffer ? (
                <div className="text-center px-2">
                  <Sparkles className="h-6 w-6 mx-auto mb-1 opacity-50" />
                  <span className="text-[10px]">Special Offer</span>
                </div>
              ) : (
                'No image'
              )}
            </div>
          )}
        </div>
        
        {/* Content on the right */}
        <CardContent className="p-3 flex-1 flex flex-col min-w-0">
          {/* Product Name with Badge */}
          <div className="flex items-start gap-1.5 mb-1">
            {product.isVeggie !== undefined && (
              <div
                className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 mt-0.5 ${
                  product.isVeggie ? 'bg-green-300' : 'bg-amber-700'
                }`}
              />
            )}
            <CardTitle className="text-sm font-bold leading-tight flex-1 break-words">{product.name}</CardTitle>
            {product.isSpecialOffer && (
              <Badge variant="default" className="ml-auto flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-0">
                <Sparkles className="h-3 w-3 mr-1" />
                Offer
              </Badge>
            )}
          </div>
          
          {/* Price */}
          <div className="mb-1.5">
            <span className="text-base font-bold text-foreground">₹{Math.round(product.price)}</span>
          </div>
          
          {/* Description with More link */}
          {hasDescription && (
            <div className="flex-1 mb-2 min-h-0">
              <p className="text-xs text-muted-foreground leading-snug text-left">
                {renderDescription(showFullDescription ? product.description : truncatedDescription)}
                {hasLongDescription && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowFullDescription(!showFullDescription);
                    }}
                    className="text-primary hover:underline ml-1 font-medium"
                  >
                    {showFullDescription ? ' Less' : ' More'}
                  </button>
                )}
              </p>
            </div>
          )}
          
          {/* ADD Button */}
          <Button
            onClick={handleAddClick}
            variant="outline"
            className="w-full h-8 text-xs font-medium text-foreground border-border bg-background hover:bg-muted hover:text-foreground"
          >
            ADD
          </Button>
        </CardContent>
      </Card>
      <ProductInfoDialog 
        open={infoDialogOpen} 
        onOpenChange={setInfoDialogOpen} 
        product={product} 
      />

      {/* Offer Selection Dialog */}
      {isSpecialOffer && (
        <OfferSelectionDialog
          open={offerDialogOpen}
          onOpenChange={setOfferDialogOpen}
          offer={product}
          onConfirm={handleOfferConfirm}
        />
      )}

      {/* Coffee 2x1 Dialog */}
      {isCoffee && (
        <Coffee2x1Dialog
          open={coffee2x1DialogOpen}
          onOpenChange={setCoffee2x1DialogOpen}
          selectedCoffee={product}
          onConfirm={handleCoffee2x1Confirm}
        />
      )}
      
      {/* Add-On Selection Dialog */}
      <Dialog open={addOnDialogOpen} onOpenChange={setAddOnDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{product.name}</DialogTitle>
            <DialogDescription>
              Select add-ons to customize your order
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            {availableAddOns.map((addOn) => (
              <div key={addOn.id} className="flex items-center space-x-3 p-2 rounded-lg border hover:bg-muted/50">
                <Checkbox
                  id={addOn.id}
                  checked={selectedAddOns.includes(addOn.id)}
                  onCheckedChange={() => handleAddOnToggle(addOn.id)}
                />
                <label
                  htmlFor={addOn.id}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{addOn.name}</p>
                      <p className="text-xs text-muted-foreground">{addOn.description}</p>
                    </div>
                    <span className="text-sm font-bold text-primary ml-4">
                      +₹{addOn.price.toFixed(2)}
                    </span>
                  </div>
                </label>
              </div>
            ))}
          </div>
          
          {selectedAddOns.length > 0 && (
            <div className="border-t pt-3">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Base Price:</span>
                <span className="text-sm">₹{product.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Add-ons:</span>
                <span className="text-sm">
                  ₹{selectedAddOns.reduce((sum, id) => {
                    const addOn = availableAddOns.find(a => a.id === id);
                    return sum + (addOn?.price || 0);
                  }, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-primary">
                  ₹{(product.price + selectedAddOns.reduce((sum, id) => {
                    const addOn = availableAddOns.find(a => a.id === id);
                    return sum + (addOn?.price || 0);
                  }, 0)).toFixed(2)}
                </span>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setAddOnDialogOpen(false);
              setSelectedAddOns([]);
            }}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAdd}>
              Add to Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
