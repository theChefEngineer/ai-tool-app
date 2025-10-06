import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface SubscriptionState {
  tier: SubscriptionTier;
  priceId: string | null;
  subscriptionId: string | null;
  status: string;
  currentPeriodEnd: number | null;
  loading: boolean;
  fetchSubscription: () => Promise<void>;
  setSubscription: (tier: SubscriptionTier, priceId?: string) => void;
  hasFeatureAccess: (feature: string) => boolean;
  canPerformOperation: (operation: string) => boolean;
}

const TIER_FEATURES: Record<SubscriptionTier, string[]> = {
  free: [
    'paraphrase',
    'summary',
    'translation',
    'grammar',
    'ocr',
    'transcription',
    'ai-detection',
    'plagiarism',
    'chat',
    'export'
  ],
  pro: [
    'paraphrase',
    'summary',
    'translation',
    'grammar',
    'ocr',
    'transcription',
    'ai-detection',
    'plagiarism',
    'chat',
    'export',
    'unlimited'
  ],
  enterprise: [
    'paraphrase',
    'summary',
    'translation',
    'grammar',
    'ocr',
    'transcription',
    'ai-detection',
    'plagiarism',
    'chat',
    'export',
    'unlimited',
    'humanizer',
    'batch-processing',
    'api-access',
    'team-collaboration',
    'priority-processing',
    'analytics'
  ]
};

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  tier: 'free',
  priceId: null,
  subscriptionId: null,
  status: 'inactive',
  currentPeriodEnd: null,
  loading: false,

  fetchSubscription: async () => {
    const { user } = useAuthStore.getState();
    if (!user) {
      set({ tier: 'free', priceId: null, subscriptionId: null, status: 'inactive' });
      return;
    }

    set({ loading: true });

    try {
      const { data: customerData } = await supabase
        .from('stripe_customers')
        .select('customer_id')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .maybeSingle();

      if (!customerData) {
        set({
          tier: 'free',
          priceId: null,
          subscriptionId: null,
          status: 'inactive',
          loading: false
        });
        return;
      }

      const { data: subscriptionData } = await supabase
        .from('stripe_subscriptions')
        .select('*')
        .eq('customer_id', customerData.customer_id)
        .is('deleted_at', null)
        .maybeSingle();

      if (!subscriptionData || subscriptionData.status !== 'active') {
        set({
          tier: 'free',
          priceId: null,
          subscriptionId: null,
          status: subscriptionData?.status || 'inactive',
          loading: false
        });
        return;
      }

      const tier = getTierFromPriceId(subscriptionData.price_id);

      set({
        tier,
        priceId: subscriptionData.price_id,
        subscriptionId: subscriptionData.subscription_id,
        status: subscriptionData.status,
        currentPeriodEnd: subscriptionData.current_period_end,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching subscription:', error);
      set({
        tier: 'free',
        priceId: null,
        subscriptionId: null,
        status: 'inactive',
        loading: false
      });
    }
  },

  setSubscription: (tier: SubscriptionTier, priceId?: string) => {
    set({ tier, priceId: priceId || null });
  },

  hasFeatureAccess: (feature: string): boolean => {
    const { tier } = get();
    return TIER_FEATURES[tier].includes(feature);
  },

  canPerformOperation: (operation: string): boolean => {
    const { tier } = get();

    if (tier === 'pro' || tier === 'enterprise') {
      return true;
    }

    return false;
  }
}));

function getTierFromPriceId(priceId: string | null): SubscriptionTier {
  if (!priceId) return 'free';

  if (priceId === 'price_1RaI60QuiDoWEii08tD5PN6o') {
    return 'pro';
  }

  if (priceId === 'price_proplus') {
    return 'enterprise';
  }

  return 'free';
}
