import Stripe from 'stripe';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if Stripe secret key is configured
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not configured');
    return res.status(500).json({ 
      error: 'Stripe is not configured',
      message: 'STRIPE_SECRET_KEY environment variable is missing'
    });
  }

  // Initialize Stripe
  let stripe;
  try {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    });
  } catch (stripeInitError) {
    console.error('Error initializing Stripe:', stripeInitError);
    return res.status(500).json({ 
      error: 'Stripe initialization failed',
      message: stripeInitError.message || 'Failed to initialize Stripe'
    });
  }

  try {
    const { items, tableNumber, orderId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    if (!tableNumber) {
      return res.status(400).json({ error: 'Table number is required' });
    }

    // Calculate total amount (Stripe uses cents, so multiply by 100)
    const totalAmount = items.reduce((sum, item) => {
      const itemPrice = item.price || 0;
      const addOnsTotal = (item.selectedAddOns || []).reduce((addOnSum, addOnId) => {
        // You might want to fetch add-on prices from your database
        // For now, assuming add-ons are included in the item price
        return addOnSum;
      }, 0);
      return sum + (itemPrice + addOnsTotal) * (item.quantity || 1);
    }, 0);

    // Convert to cents (assuming prices are in INR)
    const amountInCents = Math.round(totalAmount * 100);

    // Create line items for Stripe
    const lineItems = items.map((item) => {
      const itemPrice = item.price || 0;
      const addOnsTotal = (item.selectedAddOns || []).reduce((sum) => sum, 0);
      const unitAmount = Math.round((itemPrice + addOnsTotal) * 100);
      
      // Convert relative image URLs to absolute URLs
      let imageUrl = null;
      if (item.image) {
        // If it's already an absolute URL, use it; otherwise make it absolute
        if (item.image.startsWith('http://') || item.image.startsWith('https://')) {
          imageUrl = item.image;
        } else {
          // Get the base URL from environment or request
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                         (req.headers.origin || 'https://the-voyage-cafe.vercel.app');
          imageUrl = `${baseUrl}${item.image.startsWith('/') ? '' : '/'}${item.image}`;
        }
      }
      
      return {
        price_data: {
          currency: 'inr', // Change to your currency
          product_data: {
            name: item.name || 'Item',
            description: item.description || '',
            images: imageUrl ? [imageUrl] : [],
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity || 1,
      };
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || req.headers.origin || 'http://localhost:8080'}/order/${orderId}?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || req.headers.origin || 'http://localhost:8080'}/?payment=cancelled`,
      metadata: {
        orderId: orderId,
        tableNumber: tableNumber,
      },
      customer_email: undefined, // You can add customer email if available
    });

    return res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    console.error('Error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      stack: error.stack,
      raw: error.raw ? JSON.stringify(error.raw) : null
    });
    
    // Return more detailed error information for debugging
    return res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: error.message || 'Unknown error occurred',
      type: error.type || 'unknown',
      code: error.code || 'unknown'
    });
  }
}

