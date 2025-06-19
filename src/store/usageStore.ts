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
  operationCounts: Record<string, number>;
  canPerformOperation: (operation?: string) => boolean;
  incrementUsage: (operation?: string) => Promise<boolean>;
  resetDailyUsage: () => void;
  loadUsage: () => Promise<void>;
  getRemainingOperations: () => number;
  getUsageStats: (operation?: string) => { current: number; limit: number };
}

const DAILY_LIMIT = 10;
const OPERATION_LIMITS: Record<string, number> = {
  paraphrase: 10,
  summary: 10,
  translation: 10,
  grammar: 10,
  transcription: 10,
  ocr: 10,
  'content-detector': 10,
  'ai-detection': 10,
  default: 10
};

export const useUsageStore = create<UsageState>()(
  persist(
    (set, get) => ({
      dailyOperations: 0,
      lastResetDate: new Date().toISOString().split('T')[0],
      isLoading: false,
      operationCounts: {},

      canPerformOperation: (operation = 'default') => {
        const { dailyOperations, lastResetDate, operationCounts } = get();
        const today = new Date().toISOString().split('T')[0];
        
        // Reset if it's a new day
        if (lastResetDate !== today) {
          get().resetDailyUsage();
          return true;
        }
        
        // Check overall limit
        if (dailyOperations >= DAILY_LIMIT) {
          return false;
        }
        
        // Check operation-specific limit
        const operationCount = operationCounts[operation] || 0;
        const operationLimit = OPERATION_LIMITS[operation] || OPERATION_LIMITS.default;
        
        return operationCount < operationLimit;
      },

      incrementUsage: async (operation = 'default') => {
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

        const { canPerformOperation, dailyOperations, lastResetDate, operationCounts } = get();
        const today = new Date().toISOString().split('T')[0];

        // Reset if it's a new day
        if (lastResetDate !== today) {
          get().resetDailyUsage();
        }

        if (!canPerformOperation(operation)) {
          return false;
        }

        const newDailyCount = dailyOperations + 1;
        const newOperationCount = (operationCounts[operation] || 0) + 1;
        
        set({
          dailyOperations: newDailyCount,
          lastResetDate: today,
          operationCounts: {
            ...operationCounts,
            [operation]: newOperationCount
          }
        });

        // Save to database for persistence across devices
        try {
          await supabase
            .from('user_usage')
            .upsert({
              user_id: user.id,
              date: today,
              operations: newDailyCount,
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
          operationCounts: {}
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

      getUsageStats: (operation = 'default') => {
        const { operationCounts, lastResetDate } = get();
        const today = new Date().toISOString().split('T')[0];
        
        // If it's a new day, return zero usage
        if (lastResetDate !== today) {
          return { current: 0, limit: OPERATION_LIMITS[operation] || OPERATION_LIMITS.default };
        }
        
        const current = operationCounts[operation] || 0;
        const limit = OPERATION_LIMITS[operation] || OPERATION_LIMITS.default;
        
        return { current, limit };
      }
    }),
    {
      name: 'usage-storage',
      partialize: (state) => ({
        dailyOperations: state.dailyOperations,
        lastResetDate: state.lastResetDate,
        operationCounts: state.operationCounts
      }),
    }
  )
);