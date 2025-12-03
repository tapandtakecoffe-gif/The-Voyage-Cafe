import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, LayoutDashboard } from 'lucide-react';
import voyageCafeLogo from '@/assets/Voyage Logo.png';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="mb-8">
            <div className="flex justify-start mb-4">
              <img 
                src={voyageCafeLogo} 
                alt="The Voyage Cafe Logo" 
                className="h-32 md:h-40 object-contain"
              />
            </div>
            <p className="text-xl text-muted-foreground mb-2">Digital Café</p>
            <p className="text-muted-foreground max-w-md mx-auto">
              Place your order quickly and easily. Choose, pay, and pick up.
            </p>
          </div>

          <div className="grid gap-4 max-w-sm mx-auto">
            <Button 
              size="lg" 
              className="w-full gap-2 h-14 text-lg"
              onClick={() => navigate('/menu')}
            >
              <ShoppingBag className="h-5 w-5" />
              View Menu & Place Order
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="w-full gap-2 h-14 text-lg"
              onClick={() => navigate('/admin')}
            >
              <LayoutDashboard className="h-5 w-5" />
              Café Dashboard
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            Functional demo without authentication
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
