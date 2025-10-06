import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, X, Zap, TrendingUp } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useTranslation } from '../../hooks/useTranslation';

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
  reason?: string;
}

export default function UpgradePrompt({ isOpen, onClose, feature, reason }: UpgradePromptProps) {
  const { setCurrentView } = useAppStore();
  const { t, isRTL } = useTranslation();

  const handleUpgrade = () => {
    setCurrentView('settings');
    onClose();
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`glass-card max-w-lg w-full p-8 rounded-2xl relative ${isRTL ? 'rtl' : ''}`}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="mx-auto w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4"
              >
                <Crown className="w-10 h-10 text-white" />
              </motion.div>

              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                Upgrade to Unlock
              </h2>

              {reason && (
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  {reason}
                </p>
              )}

              {feature && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {feature} is available on Pro and Enterprise plans
                </p>
              )}
            </div>

            <div className="space-y-4 mb-8">
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-1">
                      Unlimited Operations
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      No daily limits. Use all features as much as you need.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-1">
                      Premium Features
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Access advanced AI tools, priority support, and more.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
              >
                <Crown className="w-5 h-5" />
                <span>View Plans & Pricing</span>
              </motion.button>

              <button
                onClick={onClose}
                className="w-full py-3 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                Maybe Later
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Starting at €14.99/month • Cancel anytime
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
