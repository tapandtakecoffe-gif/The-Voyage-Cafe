import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Product } from '@/types/product';
import { Separator } from '@/components/ui/separator';
import { Flame, Utensils } from 'lucide-react';

interface ProductInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export const ProductInfoDialog = ({ open, onOpenChange, product }: ProductInfoDialogProps) => {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-24 h-24 object-cover rounded-lg bg-muted"
            />
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{product.name}</DialogTitle>
              <DialogDescription className="text-base">
                {product.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Calories */}
          {product.calories && (
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Flame className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Calories</p>
                <p className="text-2xl font-bold text-primary">{product.calories} kcal</p>
              </div>
            </div>
          )}

          {/* Ingredients */}
          {product.ingredients && product.ingredients.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold text-lg">Ingredients</h3>
                </div>
                <ul className="space-y-2 pl-7">
                  {product.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Price */}
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Price</span>
            <span className="text-2xl font-bold text-primary">₹{product.price.toFixed(2)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

