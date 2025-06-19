import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Crown, X, Clock, Zap } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useTranslation } from '../../hooks/useTranslation';

interface UsageLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export default function UsageLimitModal({ isOpen, onClose, onUpgrade }: UsageLimitModalProps) {
  const { setCurrentView } = useAppStore();
  const { t } = useTranslation();

  const handleUpgrade = () => {
    onClose();
    setCurrentView('settings');
    // Scroll to subscription section after a brief delay
    setTimeout(() => {
      const element = document.getElementById('subscription-manager');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-card max-w-md w-full p-8 rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  {t('usage.dailyLimitReachedTitle')}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 glass-button rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="text-center mb-8">
              <div className="mb-4">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                    10 / 10 {t('usage.operationsUsed')}
                  </span>
                </div>
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                {t('usage.reachedDailyLimit').replace('20', '10')}
              </p>

              {/* Reset Time */}
              <div className="flex items-center justify-center space-x-2 mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  {t('usage.usageResetsAtMidnight')}
                </span>
              </div>
            </div>

            {/* Premium Benefits */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 text-center">
                {t('usage.premiumBenefitsTitle')}
              </h3>
              <ul className="space-y-3">
                {[
                  t('usage.unlimitedDailyOperations'),
                  t('usage.priorityProcessingSpeed'),
                  t('usage.advancedAiModels'),
                  t('usage.exportCapabilities'),
                  t('usage.premiumSupport'),
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Crown className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpgrade}
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold flex items-center justify-center space-x-2"
              >
                <Crown className="w-5 h-5" />
                <span>Upgrade to Premium - €8.99/month</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full px-6 py-3 glass-button rounded-xl font-semibold"
              >
                {t('usage.continueWithFreePlan')}
              </motion.button>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('usage.freeOperationsReset')}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}