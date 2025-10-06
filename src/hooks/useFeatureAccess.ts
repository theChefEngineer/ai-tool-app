import { useState } from 'react';
import { Feature, FeatureAccessControl } from '../lib/featureAccess';
import toast from 'react-hot-toast';

export function useFeatureAccess() {
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<string>('');
  const [upgradeFeature, setUpgradeFeature] = useState<string>('');

  const checkAccess = (feature: Feature): boolean => {
    const result = FeatureAccessControl.checkFeatureAccess(feature);

    if (!result.hasAccess) {
      if (result.upgradeRequired) {
        setUpgradeReason(result.reason || 'Upgrade required');
        setUpgradeFeature(feature);
        setShowUpgradePrompt(true);
      } else {
        toast.error(result.reason || 'Access denied');
      }
      return false;
    }

    return true;
  };

  const performOperation = async (operation: Feature): Promise<boolean> => {
    const result = await FeatureAccessControl.performOperation(operation);

    if (!result.hasAccess) {
      if (result.upgradeRequired) {
        setUpgradeReason(result.reason || 'Upgrade required');
        setUpgradeFeature(operation);
        setShowUpgradePrompt(true);
      } else {
        toast.error(result.reason || 'Operation failed');
      }
      return false;
    }

    return true;
  };

  const closeUpgradePrompt = () => {
    setShowUpgradePrompt(false);
    setUpgradeReason('');
    setUpgradeFeature('');
  };

  return {
    checkAccess,
    performOperation,
    showUpgradePrompt,
    upgradeReason,
    upgradeFeature,
    closeUpgradePrompt
  };
}
