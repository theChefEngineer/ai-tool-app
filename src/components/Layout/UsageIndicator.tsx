import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Crown, AlertTriangle, CheckCircle } from 'lucide-react';
import { useUsageStore } from '../../store/usageStore';
import { StripeService } from '../../lib/stripe';
import { useAuthStore } from '../../store/authStore';

export default function UsageIndicator() {
  const { user } = useAuthStore();
  const { dailyOperations, getRemainingOperations, loadUsage } = useUsageStore();
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUsage();
      checkPremiumStatus();
    }
  }, [user, loadUsage]);

  const checkPremiumStatus = async () => {
    try {
      const subscription = await StripeService.getUserSubscription();
      setIsPremium(subscription?.subscription_status === 'active');
    } catch (error) {
      console.error('Error checking premium status:', error);
      setIsPremium(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || isLoading) {
    return null;
  }

  if (isPremium) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 glass-card rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-200 dark:border-indigo-800/30"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                Premium Active
              </span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-xs text-indigo-600 dark:text-indigo-400">
              Unlimited operations
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  const remaining = getRemainingOperations();
  const usagePercentage = (dailyOperations / 20) * 100;
  const isLowUsage = remaining <= 5;
  const isNoUsage = remaining === 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 glass-card rounded-xl ${
        isNoUsage 
          ? 'bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-200 dark:border-red-800/30'
          : isLowUsage
          ? 'bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-200 dark:border-orange-800/30'
          : 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-200 dark:border-blue-800/30'
      }`}
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className={`p-2 rounded-lg ${
          isNoUsage 
            ? 'bg-gradient-to-r from-red-500 to-orange-500'
            : isLowUsage
            ? 'bg-gradient-to-r from-orange-500 to-yellow-500'
            : 'bg-gradient-to-r from-blue-500 to-indigo-500'
        }`}>
          {isNoUsage ? (
            <AlertTriangle className="w-5 h-5 text-white" />
          ) : (
            <Zap className="w-5 h-5 text-white" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className={`text-sm font-semibold ${
              isNoUsage 
                ? 'text-red-700 dark:text-red-300'
                : isLowUsage
                ? 'text-orange-700 dark:text-orange-300'
                : 'text-blue-700 dark:text-blue-300'
            }`}>
              Daily Usage
            </span>
            <span className={`text-sm font-bold ${
              isNoUsage 
                ? 'text-red-600 dark:text-red-400'
                : isLowUsage
                ? 'text-orange-600 dark:text-orange-400'
                : 'text-blue-600 dark:text-blue-400'
            }`}>
              {dailyOperations} / 20
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${usagePercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`h-2 rounded-full transition-all duration-300 ${
                isNoUsage 
                  ? 'bg-gradient-to-r from-red-500 to-orange-500'
                  : isLowUsage
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500'
              }`}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isNoUsage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/30"
          >
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                Daily limit reached
              </span>
            </div>
            <p className="text-xs text-red-600 dark:text-red-400 mb-2">
              You've used all 20 operations for today. Upgrade to Premium for unlimited access.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                // Scroll to subscription section or navigate to settings
                const element = document.getElementById('subscription-manager');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                } else {
                  // If not on settings page, you could navigate there
                  window.location.href = '/settings';
                }
              }}
              className="w-full px-3 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1"
            >
              <Crown className="w-3 h-3" />
              <span>Upgrade to Premium</span>
            </motion.button>
          </motion.div>
        )}

        {isLowUsage && !isNoUsage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800/30"
          >
            <div className="flex items-center space-x-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                {remaining} operations remaining
              </span>
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              Consider upgrading to Premium for unlimited access.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className={`text-xs mt-2 ${
        isNoUsage 
          ? 'text-red-500 dark:text-red-400'
          : isLowUsage
          ? 'text-orange-500 dark:text-orange-400'
          : 'text-blue-500 dark:text-blue-400'
      }`}>
        Resets daily at midnight
      </p>
    </motion.div>
  );
}