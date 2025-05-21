import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { validate as validateRazorpaySignature } from 'https://esm.sh/razorpay@2.8.6/dist/utils/razorpay-utils.js';

console.log(`Function "verify-razorpay-payment" up and running!`);

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key for authentication
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the JWT token from the Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(jwt);
    if (!user) {
      throw new Error('Unauthorized');
    }

    // Parse request body
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json();
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      throw new Error('Missing required fields: razorpay_payment_id, razorpay_order_id, razorpay_signature');
    }

    // Verify the payment signature
    const generatedSignature = validateRazorpaySignature(
      `${razorpay_order_id}|${razorpay_payment_id}`,
      Deno.env.get('RAZORPAY_KEY_SECRET') ?? ''
    );

    const isValid = generatedSignature === razorpay_signature;

    return new Response(JSON.stringify({ verified: isValid }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in verify-razorpay-payment:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});