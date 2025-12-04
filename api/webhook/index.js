import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  
  if (!sig) {
    console.error('Missing stripe-signature header');
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET environment variable');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  // In Vercel, req.body might be parsed or raw depending on Content-Type
  // For Stripe webhooks, we need the raw body as a string
  let body;
  
  // Try different ways to get the raw body
  if (typeof req.body === 'string') {
    // Best case: body is already a string (raw)
    body = req.body;
  } else if (Buffer.isBuffer(req.body)) {
    // Body is a buffer - convert to string
    body = req.body.toString('utf8');
  } else if (req.body && typeof req.body === 'object') {
    // Body was parsed as JSON - this is problematic for signature verification
    // We need to reconstruct it, but JSON.stringify might change formatting
    // Try to preserve the exact format by using no spacing
    body = JSON.stringify(req.body);
  } else {
    console.error('Unexpected body type:', typeof req.body);
    return res.status(400).json({ error: 'Invalid request body format' });
  }

  if (!body || body.length === 0) {
    console.error('Empty request body');
    return res.status(400).json({ error: 'Empty request body' });
  }

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    console.error('Signature header present:', !!sig);
    console.error('Body type:', typeof body);
    console.error('Body length:', body ? body.length : 0);
    console.error('Webhook secret configured:', !!webhookSecret);
    
    // If signature verification fails and body was parsed, this is likely the issue
    if (typeof req.body === 'object' && req.body !== null) {
      console.error('⚠️ Body was parsed as JSON - this may cause signature verification to fail');
      console.error('Stripe requires the exact raw body for signature verification');
    }
    
    return res.status(400).json({ 
      error: `Webhook Error: ${err.message}`,
      hint: 'Make sure the request body is not parsed before signature verification'
    });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const { orderId, tableNumber } = session.metadata || {};
      
      console.log('✅ Payment successful for order:', orderId);
      console.log('Table number:', tableNumber);
      console.log('Session ID:', session.id);
      console.log('Amount paid:', session.amount_total / 100);
      
      const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
      
      if (orderId && supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
          const { createClient } = await import('@supabase/supabase-js');
          const supabase = createClient(
            supabaseUrl,
            process.env.SUPABASE_SERVICE_ROLE_KEY
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
            console.log('✅✅✅ Order payment status updated successfully');
            console.log('Order ID:', orderId, 'now has payment_status: paid');
          }
        } catch (error) {
          console.error('❌ Exception updating order in Supabase:', error);
        }
      } else {
        console.warn('⚠️ Cannot update order - missing required variables');
      }
      break;
      
    case 'payment_intent.succeeded':
      console.log('PaymentIntent succeeded:', event.data.object.id);
      break;
      
    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object.id);
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return res.status(200).json({ received: true });
}
