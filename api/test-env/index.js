// Test endpoint to verify environment variables are available
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const envVars = {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 
      `${process.env.STRIPE_SECRET_KEY.substring(0, 10)}...` : 'NOT SET',
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? 
      `${process.env.STRIPE_WEBHOOK_SECRET.substring(0, 10)}...` : 'NOT SET',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'NOT SET',
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ? 
      `${process.env.VITE_SUPABASE_URL.substring(0, 20)}...` : 'NOT SET',
  };
  
  return res.status(200).json({
    message: 'Environment variables check',
    variables: envVars,
    allSet: Object.values(envVars).every(v => v !== 'NOT SET')
  });
}

