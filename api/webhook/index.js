import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

// This is your Stripe webhook secret for verifying the webhook signature
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // In Vercel, the raw body is available as a Buffer
  const sig = req.headers['stripe-signature'];
  const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

  let event;

  try {
    // Verify webhook signature
    // For Vercel, we need to pass the raw body as a string or buffer
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      // Extract order information from metadata
      const { orderId, tableNumber } = session.metadata || {};
      
      console.log('Payment successful for order:', orderId);
      console.log('Table number:', tableNumber);
      console.log('Session ID:', session.id);
      console.log('Amount paid:', session.amount_total / 100);
      
      // Update order payment status in Supabase
      // Use SUPABASE_URL (not VITE_SUPABASE_URL) for serverless functions
      const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
      if (orderId && supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
          const { createClient } = await import('@supabase/supabase-js');
          const supabase = createClient(
            supabaseUrl,
            process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for server-side operations
          );
          
          const { data: updatedOrder, error: updateError } = await supabase
            .from('orders')
            .update({
              payment_status: 'paid',
              stripe_session_id: session.id
            })
            .eq('id', orderId)
            .select();
          
          if (updateError) {
            console.error('❌ Error updating order payment status:', updateError);
            console.error('Order ID:', orderId);
            console.error('Session ID:', session.id);
          } else {
            console.log('✅ Order payment status updated successfully');
            console.log('Updated order:', updatedOrder);
          }
        } catch (error) {
          console.error('Error updating order in Supabase:', error);
        }
      }
      
      break;
      
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent succeeded:', paymentIntent.id);
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      // Handle failed payment
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  return res.status(200).json({ received: true });
}
