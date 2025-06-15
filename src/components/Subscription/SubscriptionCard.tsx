import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Check, Loader2, CreditCard, Calendar, AlertCircle } from 'lucide-react';
import { StripeService, type SubscriptionData } from '../../lib/stripe';
import { stripeProducts, type StripeProduct } from '../../stripe-config';
import toast from 'react-hot-toast';

interface SubscriptionCardProps {
  product: StripeProduct;
  isPopular?: boolean;
  className?: string;
}

export default function SubscriptionCard({ product, isPopular = false, className = '' }: SubscriptionCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const data = await StripeService.getUserSubscription();
      setSubscription(data);
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoadingSubscription(false);
    }
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const { url } = await StripeService.createCheckoutSession(product.priceId, product.mode);
      if (url) {
        window.location.href = url;
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to start checkout');
      setIsLoading(false);
    }
  };

  const isCurrentPlan = subscription?.price_id === product.priceId && subscription?.subscription_status === 'active';
  const hasActiveSubscription = subscription?.subscription_status === 'active';

  const features = [
    'Unlimited paraphrasing',
    'Advanced AI summarization',
    'Multi-language translation',
    'AI content detection',
    'Text humanization',
    'Priority processing',
    'Export history',
    'Premium support',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative glass-card p-8 rounded-2xl ${isPopular ? 'ring-2 ring-indigo-500' : ''} ${className}`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
            Most Popular
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl">
            <Crown className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          {product.name}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {product.description}
        </p>

        <div className="flex items-baseline justify-center space-x-1">
          <span className="text-4xl font-bold text-slate-800 dark:text-white">
            {StripeService.formatPrice(product.price, product.currency)}
          </span>
          {product.interval && (
            <span className="text-slate-600 dark:text-slate-400">
              /{product.interval}
            </span>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-3"
          >
            <div className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-slate-700 dark:text-slate-300">{feature}</span>
          </motion.div>
        ))}
      </div>

      {/* Subscription Status */}
      {loadingSubscription ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-600 dark:text-indigo-400" />
        </div>
      ) : (
        <>
          {isCurrentPlan && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800/30">
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-green-700 dark:text-green-300 font-medium">
                  Current Plan
                </span>
              </div>
              {subscription?.current_period_end && (
                <div className="flex items-center space-x-2 mt-2 text-sm text-green-600 dark:text-green-400">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Renews on {StripeService.formatDate(subscription.current_period_end)}
                  </span>
                </div>
              )}
            </div>
          )}

          {hasActiveSubscription && !isCurrentPlan && (
            <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800/30">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <span className="text-orange-700 dark:text-orange-300 font-medium">
                  You have an active subscription
                </span>
              </div>
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                Cancel your current plan to switch to this one
              </p>
            </div>
          )}
        </>
      )}

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubscribe}
        disabled={isLoading || isCurrentPlan || loadingSubscription}
        className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-200 ${
          isCurrentPlan
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 cursor-not-allowed'
            : hasActiveSubscription && !isCurrentPlan
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed'
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : isCurrentPlan ? (
          <>
            <Check className="w-5 h-5" />
            <span>Current Plan</span>
          </>
        ) : hasActiveSubscription ? (
          <>
            <CreditCard className="w-5 h-5" />
            <span>Switch Plan</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span>Subscribe Now</span>
          </>
        )}
      </motion.button>

      {/* Payment Methods */}
      <div className="mt-6 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
          Secure payment powered by Stripe
        </p>
        <div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
          <span>💳</span>
          <span>Visa</span>
          <span>•</span>
          <span>Mastercard</span>
          <span>•</span>
          <span>PayPal</span>
        </div>
      </div>
    </motion.div>
  );
}