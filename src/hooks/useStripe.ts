import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export const useStripeCheckout = () => {
  const createCheckoutSession = async (items: any[], tableNumber: string, orderId: string) => {
    try {
      // Get Stripe instance
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe no está configurado. Verifica VITE_STRIPE_PUBLISHABLE_KEY');
      }

      // Get the base URL (for Vercel or local development)
      const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
      
      // Call your API to create checkout session
      const response = await fetch(`${baseUrl}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          tableNumber,
          orderId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al crear sesión de pago');
      }

      const { sessionId, url } = await response.json();

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else if (sessionId) {
        // Alternative: use redirectToCheckout method
        const result = await stripe.redirectToCheckout({
          sessionId: sessionId,
        });

        if (result.error) {
          throw new Error(result.error.message);
        }
      } else {
        throw new Error('No se recibió URL de checkout');
      }
    } catch (error) {
      console.error('Error en checkout de Stripe:', error);
      throw error;
    }
  };

  return { createCheckoutSession };
};

