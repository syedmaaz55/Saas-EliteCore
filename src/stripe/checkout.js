import { loadStripe } from '@stripe/stripe-js';

// process.env ki jagah Vite mein import.meta.env use hota hai
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const handleCheckout = async (priceId) => {
  const stripe = await stripePromise;

  const { error } = await stripe.redirectToCheckout({
    lineItems: [{
      price: priceId, 
      quantity: 1,
    }],
    mode: 'subscription',
    successUrl: `${window.location.origin}/dashboard`,
    cancelUrl: `${window.location.origin}/pricing`,
  });

  if (error) {
    console.error("Stripe Error:", error.message);
  }
};