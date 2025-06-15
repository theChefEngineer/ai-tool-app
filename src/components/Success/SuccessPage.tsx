import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Crown, ArrowRight, Home, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { StripeService } from '../../lib/stripe';
import { stripeProducts } from '../../stripe-config';

export default function SuccessPage() {
  const { setCurrentView } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    // Get session_id from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      // Load subscription data after successful payment
      loadSubscriptionData();
    } else {
      setLoading(false);
    }
  }, []);

  const loadSubscriptionData = async () => {
    try {
      // Wait a moment for webhook to process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const data = await StripeService.getUserSubscription();
      setSubscription(data);
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    setCurrentView('paraphrase');
  };

  const handleGoHome = () => {
    setCurrentView('paraphrase');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Processing your subscription...
          </p>
        </div>
      </div>
    );
  }

  const currentProduct = subscription?.price_id 
    ? stripeProducts.find(p => p.priceId === subscription.price_id)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        {/* Success Card */}
        <div className="glass-card p-12 rounded-3xl text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-8"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
              Payment Successful! 🎉
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
              Welcome to ParaText Pro! Your subscription is now active.
            </p>
          </motion.div>

          {/* Subscription Details */}
          {currentProduct && subscription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800/30"
            >
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Crown className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-200">
                  {currentProduct.name}
                </h2>
              </div>
              
              <p className="text-indigo-600 dark:text-indigo-300 mb-4">
                {currentProduct.description}
              </p>
              
              <div className="flex items-center justify-center space-x-4 text-sm text-indigo-700 dark:text-indigo-300">
                <span className="font-semibold">
                  {StripeService.formatPrice(currentProduct.price, currentProduct.currency)}
                  {currentProduct.interval && `/${currentProduct.interval}`}
                </span>
                {subscription.current_period_end && (
                  <>
                    <span>•</span>
                    <span>
                      Next billing: {StripeService.formatDate(subscription.current_period_end)}
                    </span>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* Features Unlocked */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-8"
          >
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
              You now have access to:
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                'Unlimited paraphrasing',
                'Advanced AI summarization',
                'Multi-language translation',
                'AI content detection',
                'Text humanization',
                'Priority processing',
                'Export capabilities',
                'Premium support',
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-center space-x-2 text-slate-700 dark:text-slate-300"
                >
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>Start Using Pro Features</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoHome}
              className="px-8 py-4 glass-button rounded-xl font-semibold flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Go to Dashboard</span>
            </motion.button>
          </motion.div>

          {/* Support Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Need help getting started? Contact our support team at{' '}
              <a href="mailto:support@paratextpro.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                support@paratextpro.com
              </a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}