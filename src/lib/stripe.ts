import { supabase } from './supabase';

export class StripeService {
  static async createCheckoutSession(priceId: string, mode: 'subscription' | 'payment' = 'subscription') {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Construct the correct Edge Function URL
      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`;
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          priceId,
          mode,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned from server');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  static async getSubscriptionStatus() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting subscription status:', error);
      return null;
    }
  }

  static async cancelSubscription() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // This would typically call a Supabase Edge Function to handle cancellation
      // For now, we'll just update the local state
      console.log('Cancel subscription requested for user:', user.id);
      
      // You would implement the actual cancellation logic here
      // by calling another Edge Function or Stripe API
      
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }
}