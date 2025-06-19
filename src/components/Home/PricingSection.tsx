import React from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Zap, Shield, Bot, BookCheck, FileText, Image, Languages } from 'lucide-react';
import { stripeProducts } from '../../stripe-config';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppStore } from '../../store/appStore';

export default function PricingSection() {
  const { t } = useTranslation();
  const { setCurrentView } = useAppStore();
  
  const freePlan = stripeProducts[0];
  const proPlan = stripeProducts[1];
  const proPlusPlan = stripeProducts[2];

  const tiers = [
    {
      name: freePlan.name,
      price: freePlan.price,
      description: freePlan.description,
      features: freePlan.features || [],
      icon: Zap,
      color: 'from-slate-500 to-slate-600',
      popular: false
    },
    {
      name: proPlan.name,
      price: proPlan.price,
      description: proPlan.description,
      features: proPlan.features || [],
      icon: Crown,
      color: 'from-indigo-500 to-purple-600',
      popular: true
    },
    {
      name: proPlusPlan.name,
      price: proPlusPlan.price,
      description: proPlusPlan.description,
      features: proPlusPlan.features || [],
      icon: Shield,
      color: 'from-purple-500 to-pink-600',
      popular: false
    }
  ];

  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2);
  };

  const handleChoosePlan = () => {
    setCurrentView('settings');
    // Scroll to subscription section after navigation
    setTimeout(() => {
      const element = document.getElementById('subscription-manager');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Select the perfect plan for your needs and unlock the full potential of AI-powered writing tools
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative glass-card p-8 rounded-2xl ${tier.popular ? 'ring-2 ring-indigo-500' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className={`p-3 bg-gradient-to-r ${tier.color} rounded-2xl`}>
                    <tier.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                  {tier.name}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {tier.description}
                </p>

                <div className="flex items-baseline justify-center space-x-1">
                  {tier.price === 0 ? (
                    <span className="text-4xl font-bold text-slate-800 dark:text-white">
                      Free
                    </span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-slate-800 dark:text-white">
                        €{formatPrice(tier.price)}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        /month
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {tier.features.slice(0, 6).map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                  </div>
                ))}
                
                {tier.features.length > 6 && (
                  <div className="flex items-center space-x-3 text-indigo-600 dark:text-indigo-400">
                    <span>+{tier.features.length - 6} more features</span>
                  </div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 ${
                  tier.price === 0
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
                }`}
                onClick={handleChoosePlan}
              >
                {tier.price === 0 ? (
                  <span>Current Free Plan</span>
                ) : (
                  <>
                    <Crown className="w-5 h-5" />
                    <span>Choose {tier.name}</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Feature Icons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mt-16">
          <div className="glass-card p-6 rounded-2xl text-center">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl mx-auto w-16 h-16 flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Unlimited Operations</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">No daily limits with our premium plans</p>
          </div>
          
          <div className="glass-card p-6 rounded-2xl text-center">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl mx-auto w-16 h-16 flex items-center justify-center mb-4">
              <BookCheck className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Advanced Grammar</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">Professional-grade grammar and style checking</p>
          </div>
          
          <div className="glass-card p-6 rounded-2xl text-center">
            <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl mx-auto w-16 h-16 flex items-center justify-center mb-4">
              <Image className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-2">OCR Technology</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">Extract text from images with high accuracy</p>
          </div>
          
          <div className="glass-card p-6 rounded-2xl text-center">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl mx-auto w-16 h-16 flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-2">AI Humanizer</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">Transform AI content to sound human-written</p>
          </div>
        </div>
      </div>
    </div>
  );
}