import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, CreditCard, Calendar, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { StripeService, type SubscriptionData } from '../../lib/stripe';
import { stripeProducts } from '../../stripe-config';
import SubscriptionCard from './SubscriptionCard';
import { useTranslation } from '../../hooks/useTranslation';

export default function SubscriptionManager() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

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
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 dark:text-green-400';
      case 'trialing':
        return 'text-blue-600 dark:text-blue-400';
      case 'past_due':
        return 'text-orange-600 dark:text-orange-400';
      case 'canceled':
      case 'unpaid':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return CheckCircle;
      case 'trialing':
        return Crown;
      case 'past_due':
      case 'canceled':
      case 'unpaid':
        return AlertCircle;
      default:
        return CreditCard;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400" />
          <span className="text-lg text-slate-600 dark:text-slate-300">{t('common.loading')}...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Current Subscription Status */}
      {subscription && subscription.subscription_status !== 'not_started' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-2xl"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Crown className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              {t('subscription.currentSubscription')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Status Overview */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {React.createElement(getStatusIcon(subscription.subscription_status), {
                  className: `w-5 h-5 ${getStatusColor(subscription.subscription_status)}`
                })}
                <div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{t('common.status')}:</span>
                  <span className={`ml-2 font-semibold capitalize ${getStatusColor(subscription.subscription_status)}`}>
                    {subscription.subscription_status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {subscription.current_period_start && subscription.current_period_end && (
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-slate-500" />
                  <div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">{t('subscription.billing.nextBilling')}:</span>
                    <div className="text-sm text-slate-800 dark:text-white">
                      {StripeService.formatDate(subscription.current_period_start)} - {StripeService.formatDate(subscription.current_period_end)}
                    </div>
                  </div>
                </div>
              )}

              {subscription.payment_method_brand && subscription.payment_method_last4 && (
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-slate-500" />
                  <div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">{t('subscription.paymentMethod')}:</span>
                    <span className="ml-2 text-sm text-slate-800 dark:text-white capitalize">
                      {subscription.payment_method_brand} •••• {subscription.payment_method_last4}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Plan Details */}
            <div className="space-y-4">
              {subscription.price_id && (
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                  {(() => {
                    const product = stripeProducts.find(p => p.priceId === subscription.price_id);
                    return product ? (
                      <div>
                        <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-indigo-600 dark:text-indigo-300 mb-2">
                          {product.description}
                        </p>
                        <div className="text-lg font-bold text-indigo-800 dark:text-indigo-200">
                          {StripeService.formatPrice(product.price, product.currency)}
                          {product.interval && <span className="text-sm font-normal">/{product.interval}</span>}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {t('subscription.planDetailsNotAvailable')}
                      </div>
                    );
                  })()}
                </div>
              )}

              {subscription.cancel_at_period_end && (
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800/30">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                      {t('subscription.subscriptionWillCancel')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Available Plans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
            {t('subscription.chooseYourPlan')}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Unlock the full potential of AI-powered writing tools with our premium subscriptions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stripeProducts.map((product, index) => (
            <SubscriptionCard
              key={product.id}
              product={product}
              isPopular={product.popular || false}
            />
          ))}
        </div>
      </motion.div>

      {/* Features Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8 rounded-2xl"
      >
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 text-center">
          {t('subscription.whatsIncluded')}
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              {t('subscription.coreFeatures')}
            </h4>
            <ul className="space-y-3">
              {[
                'Unlimited paraphrasing with 5 modes',
                'Advanced AI summarization',
                'Multi-language translation',
                'AI content detection',
                'Text humanization with Gemini 2.5',
                'Grammar and spell checking',
              ].map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              {t('subscription.premiumBenefits')}
            </h4>
            <ul className="space-y-3">
              {[
                'Priority processing speed',
                'Complete activity history',
                'Export and download capabilities',
                'Advanced analytics and insights',
                'Premium customer support',
                'Early access to new features',
              ].map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Crown className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}