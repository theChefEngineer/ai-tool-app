import { supabase } from './supabase';

export interface SubscriptionData {
  customer_id: string | null;
  subscription_id: string | null;
  subscription_status: string;
  price_id: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean | null;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}

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
        return { url: data.url };
      } else {
        throw new Error('No checkout URL returned from server');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  static async getUserSubscription(): Promise<SubscriptionData | null> {
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

  static async getSubscriptionStatus() {
    // Keep this method for backward compatibility
    return this.getUserSubscription();
  }

  static formatPrice(price: number, currency: string = 'EUR'): string {
    try {
      // Convert cents to currency units (assuming price is in cents)
      const amount = price / 100;
      
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      console.error('Error formatting price:', error);
      // Fallback formatting
      const amount = price / 100;
      const symbol = currency.toUpperCase() === 'EUR' ? '€' : '$';
      return `${symbol}${amount.toFixed(2)}`;
    }
  }

  static formatDate(timestamp: number): string {
    try {
      const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
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