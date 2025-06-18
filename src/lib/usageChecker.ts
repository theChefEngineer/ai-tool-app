import { useUsageStore } from '../store/usageStore';

export class UsageChecker {
  /**
   * Check if user can perform an operation and increment usage if allowed
   * @param operation - The type of operation (paraphrase, summary, grammar, etc.)
   * @returns Promise<boolean> - true if operation is allowed, false if limit exceeded
   */
  static async checkAndIncrementUsage(operation: string): Promise<boolean> {
    try {
      // Get the current state from the usage store
      const usageStore = useUsageStore.getState();
      
      // Check if the user can perform this operation
      const canPerform = usageStore.canPerformOperation(operation);
      
      if (canPerform) {
        // Increment the usage count for this operation
        usageStore.incrementUsage(operation);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking usage limits:', error);
      // In case of error, allow the operation but log the issue
      return true;
    }
  }

  /**
   * Get current usage statistics for a specific operation
   * @param operation - The type of operation
   * @returns Current usage count and limit
   */
  static getCurrentUsage(operation: string): { current: number; limit: number } {
    try {
      const usageStore = useUsageStore.getState();
      return usageStore.getUsageStats(operation);
    } catch (error) {
      console.error('Error getting usage stats:', error);
      return { current: 0, limit: 100 }; // Default fallback
    }
  }

  /**
   * Check if user has reached their daily limit for any operation
   * @returns boolean - true if any limit is reached
   */
  static hasReachedAnyLimit(): boolean {
    try {
      const usageStore = useUsageStore.getState();
      const operations = ['paraphrase', 'summary', 'grammar', 'translation', 'transcription'];
      
      return operations.some(operation => !usageStore.canPerformOperation(operation));
    } catch (error) {
      console.error('Error checking limits:', error);
      return false;
    }
  }

  /**
   * Reset usage counts (typically called at midnight or for premium users)
   */
  static resetUsage(): void {
    try {
      const usageStore = useUsageStore.getState();
      usageStore.resetDailyUsage();
    } catch (error) {
      console.error('Error resetting usage:', error);
    }
  }
}