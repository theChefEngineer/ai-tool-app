import { useUsageStore } from '../store/usageStore';
import { StripeService } from './stripe';
import toast from 'react-hot-toast';

export class UsageChecker {
  static async checkAndIncrementUsage(operationType: string): Promise<boolean> {
    try {
      // Check if user has premium subscription first
      const subscription = await StripeService.getUserSubscription();
      if (subscription?.subscription_status === 'active') {
        return true; // Premium users have unlimited usage
      }

      // For free users, check and increment usage
      const { incrementUsage, getRemainingOperations } = useUsageStore.getState();
      
      const canProceed = await incrementUsage();
      
      if (!canProceed) {
        const remaining = getRemainingOperations();
        if (remaining === 0) {
          toast.error('Daily limit reached! Upgrade to Premium for unlimited access.');
        } else {
          toast.error(`Only ${remaining} operations remaining today.`);
        }
        return false;
      }

      // Show warning when approaching limit
      const remainingAfter = getRemainingOperations();
      if (remainingAfter <= 5 && remainingAfter > 0) {
        toast.warning(`${remainingAfter} operations remaining today. Consider upgrading to Premium.`);
      }

      return true;
    } catch (error) {
      console.error('Error checking usage:', error);
      // In case of error, allow the operation but log it
      return true;
    }
  }

  static async getRemainingOperations(): Promise<number> {
    try {
      // Check if user has premium subscription
      const subscription = await StripeService.getUserSubscription();
      if (subscription?.subscription_status === 'active') {
        return Infinity; // Premium users have unlimited usage
      }

      const { getRemainingOperations } = useUsageStore.getState();
      return getRemainingOperations();
    } catch (error) {
      console.error('Error getting remaining operations:', error);
      return 0;
    }
  }

  static async isPremiumUser(): Promise<boolean> {
    try {
      const subscription = await StripeService.getUserSubscription();
      return subscription?.subscription_status === 'active';
    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  }
}