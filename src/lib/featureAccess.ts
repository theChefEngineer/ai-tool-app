import { useSubscriptionStore } from '../store/subscriptionStore';
import { useUsageStore } from '../store/usageStore';

export type Feature =
  | 'paraphrase'
  | 'summary'
  | 'translation'
  | 'grammar'
  | 'ocr'
  | 'transcription'
  | 'ai-detection'
  | 'plagiarism'
  | 'chat'
  | 'export'
  | 'humanizer'
  | 'batch-processing'
  | 'api-access'
  | 'team-collaboration'
  | 'priority-processing'
  | 'analytics';

export interface FeatureAccessResult {
  hasAccess: boolean;
  reason?: string;
  upgradeRequired?: boolean;
  limitReached?: boolean;
}

export class FeatureAccessControl {
  static checkFeatureAccess(feature: Feature): FeatureAccessResult {
    const subscriptionStore = useSubscriptionStore.getState();
    const usageStore = useUsageStore.getState();

    const hasSubscriptionAccess = subscriptionStore.hasFeatureAccess(feature);

    if (!hasSubscriptionAccess) {
      return {
        hasAccess: false,
        reason: `This feature requires a ${this.getRequiredTier(feature)} subscription`,
        upgradeRequired: true
      };
    }

    if (subscriptionStore.tier === 'free') {
      const canPerform = usageStore.canPerformOperation(feature);
      if (!canPerform) {
        return {
          hasAccess: false,
          reason: 'Daily limit reached. Upgrade to Pro for unlimited access.',
          limitReached: true,
          upgradeRequired: true
        };
      }
    }

    return { hasAccess: true };
  }

  static async performOperation(operation: Feature): Promise<FeatureAccessResult> {
    const accessCheck = this.checkFeatureAccess(operation);

    if (!accessCheck.hasAccess) {
      return accessCheck;
    }

    const subscriptionStore = useSubscriptionStore.getState();
    const usageStore = useUsageStore.getState();

    if (subscriptionStore.tier === 'free') {
      const success = await usageStore.incrementUsage(operation);
      if (!success) {
        return {
          hasAccess: false,
          reason: 'Failed to track usage. Please try again.',
          limitReached: true
        };
      }
    }

    return { hasAccess: true };
  }

  static getRequiredTier(feature: Feature): string {
    const enterpriseFeatures = [
      'humanizer',
      'batch-processing',
      'api-access',
      'team-collaboration',
      'priority-processing',
      'analytics'
    ];

    if (enterpriseFeatures.includes(feature)) {
      return 'Enterprise';
    }

    return 'Pro';
  }

  static getRemainingUsage(operation: string): number {
    const subscriptionStore = useSubscriptionStore.getState();

    if (subscriptionStore.tier !== 'free') {
      return Infinity;
    }

    const usageStore = useUsageStore.getState();
    return usageStore.getRemainingOperations();
  }

  static getUsageStats(operation: string): { current: number; limit: number | string } {
    const subscriptionStore = useSubscriptionStore.getState();

    if (subscriptionStore.tier !== 'free') {
      return { current: 0, limit: 'Unlimited' };
    }

    const usageStore = useUsageStore.getState();
    return usageStore.getUsageStats(operation);
  }
}
