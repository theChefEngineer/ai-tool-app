import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

export interface UsageData {
  userId: string;
  date: string; // YYYY-MM-DD format
  operations: number;
  lastReset: string;
}

interface UsageState {
  dailyOperations: number;
  lastResetDate: string;
  isLoading: boolean;
  canPerformOperation: () => boolean;
  incrementUsage: () => Promise<boolean>;
  resetDailyUsage: () => void;
  loadUsage: () => Promise<void>;
  getRemainingOperations: () => number;
}

const DAILY_LIMIT = 20;

export const useUsageStore = create<UsageState>()(
  persist(
    (set, get) => ({
      dailyOperations: 0,
      lastResetDate: new Date().toISOString().split('T')[0],
      isLoading: false,

      canPerformOperation: () => {
        const { dailyOperations, lastResetDate } = get();
        const today = new Date().toISOString().split('T')[0];
        
        // Reset if it's a new day
        if (lastResetDate !== today) {
          get().resetDailyUsage();
          return true;
        }
        
        return dailyOperations < DAILY_LIMIT;
      },

      incrementUsage: async () => {
        const { user } = useAuthStore.getState();
        if (!user) return false;

        // Check if user has premium subscription
        try {
          const { data: subscription } = await supabase
            .from('stripe_user_subscriptions')
            .select('subscription_status')
            .maybeSingle();

          // If user has active subscription, allow unlimited usage
          if (subscription?.subscription_status === 'active') {
            return true;
          }
        } catch (error) {
          console.error('Error checking subscription:', error);
        }

        const { canPerformOperation, dailyOperations, lastResetDate } = get();
        const today = new Date().toISOString().split('T')[0];

        // Reset if it's a new day
        if (lastResetDate !== today) {
          get().resetDailyUsage();
        }

        if (!canPerformOperation()) {
          return false;
        }

        const newCount = dailyOperations + 1;
        
        set({
          dailyOperations: newCount,
          lastResetDate: today,
        });

        // Save to database for persistence across devices
        try {
          await supabase
            .from('user_usage')
            .upsert({
              user_id: user.id,
              date: today,
              operations: newCount,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'user_id,date'
            });
        } catch (error) {
          console.error('Error saving usage to database:', error);
        }

        return true;
      },

      resetDailyUsage: () => {
        const today = new Date().toISOString().split('T')[0];
        set({
          dailyOperations: 0,
          lastResetDate: today,
        });
      },

      loadUsage: async () => {
        const { user } = useAuthStore.getState();
        if (!user) return;

        set({ isLoading: true });

        try {
          const today = new Date().toISOString().split('T')[0];
          
          const { data, error } = await supabase
            .from('user_usage')
            .select('operations, date')
            .eq('user_id', user.id)
            .eq('date', today)
            .maybeSingle();

          if (error && error.code !== 'PGRST116') {
            throw error;
          }

          if (data) {
            set({
              dailyOperations: data.operations,
              lastResetDate: data.date,
            });
          } else {
            // No usage record for today, reset to 0
            get().resetDailyUsage();
          }
        } catch (error) {
          console.error('Error loading usage:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      getRemainingOperations: () => {
        const { dailyOperations, lastResetDate } = get();
        const today = new Date().toISOString().split('T')[0];
        
        // If it's a new day, return full limit
        if (lastResetDate !== today) {
          return DAILY_LIMIT;
        }
        
        return Math.max(0, DAILY_LIMIT - dailyOperations);
      },
    }),
    {
      name: 'usage-storage',
      partialize: (state) => ({
        dailyOperations: state.dailyOperations,
        lastResetDate: state.lastResetDate,
      }),
    }
  )
);