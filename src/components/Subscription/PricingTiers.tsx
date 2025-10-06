import React from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Zap, Shield, Bot, BookCheck, FileText, Image, Languages } from 'lucide-react';
import { stripeProducts } from '../../stripe-config';
import { useTranslation } from '../../hooks/useTranslation';

export default function PricingTiers() {
  const { t } = useTranslation();
  
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

  const featureComparison = [
    {
      name: 'Daily Operations',
      free: '10 per day',
      pro: 'Unlimited',
      proPlus: 'Unlimited'
    },
    {
      name: 'Paraphrasing',
      free: 'All 5 modes',
      pro: 'All 5 modes',
      proPlus: 'All 5 modes + enhanced'
    },
    {
      name: 'Summarization',
      free: 'All 5 modes',
      pro: 'All 5 modes',
      proPlus: 'All 5 modes + enhanced'
    },
    {
      name: 'Translation',
      free: '100+ languages',
      pro: '100+ languages',
      proPlus: '100+ languages'
    },
    {
      name: 'Grammar Checking',
      free: 'Yes',
      pro: 'Advanced',
      proPlus: 'Professional'
    },
    {
      name: 'Document Processing',
      free: 'Yes',
      pro: 'Full access',
      proPlus: 'Enhanced accuracy'
    },
    {
      name: 'Image OCR',
      free: 'Yes',
      pro: 'Yes',
      proPlus: 'Advanced OCR'
    },
    {
      name: 'AI Content Detection',
      free: 'Yes',
      pro: 'Yes',
      proPlus: 'Yes'
    },
    {
      name: 'Plagiarism Detection',
      free: 'Yes',
      pro: 'Yes',
      proPlus: 'Yes'
    },
    {
      name: 'AI Content Humanizer',
      free: 'No',
      pro: 'No',
      proPlus: 'Yes'
    },
    {
      name: 'Chat Assistant',
      free: 'Yes',
      pro: 'Yes',
      proPlus: 'Priority processing'
    },
    {
      name: 'Export Capabilities',
      free: 'Yes',
      pro: 'Yes',
      proPlus: 'Advanced formats'
    },
    {
      name: 'Batch Processing',
      free: 'No',
      pro: 'No',
      proPlus: 'Yes'
    },
    {
      name: 'API Access',
      free: 'No',
      pro: 'No',
      proPlus: 'Yes'
    },
    {
      name: 'Team Collaboration',
      free: 'No',
      pro: 'No',
      proPlus: 'Yes'
    },
    {
      name: 'Support',
      free: 'Basic',
      pro: 'Priority',
      proPlus: 'Dedicated'
    }
  ];

  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2);
  };

  return (
    <div className="space-y-12">
      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8">
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
              onClick={() => {
                const element = document.getElementById('subscription-manager');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
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

      {/* Feature Comparison Table */}
      <div className="glass-card p-8 rounded-2xl overflow-x-auto">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 text-center">
          Feature Comparison
        </h3>
        
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-4 px-4 font-semibold text-slate-800 dark:text-white">Feature</th>
              <th className="text-center py-4 px-4 font-semibold text-slate-800 dark:text-white">Free</th>
              <th className="text-center py-4 px-4 font-semibold text-slate-800 dark:text-white">Pro</th>
              <th className="text-center py-4 px-4 font-semibold text-slate-800 dark:text-white">Enterprise</th>
            </tr>
          </thead>
          <tbody>
            {featureComparison.map((feature, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}>
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">{feature.name}</td>
                <td className="py-3 px-4 text-center">
                  {feature.free === 'No' ? (
                    <span className="text-red-500 dark:text-red-400">✕</span>
                  ) : feature.free === 'Yes' ? (
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  ) : (
                    <span className="text-slate-600 dark:text-slate-400 text-sm">{feature.free}</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {feature.pro === 'No' ? (
                    <span className="text-red-500 dark:text-red-400">✕</span>
                  ) : feature.pro === 'Yes' ? (
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  ) : (
                    <span className="text-slate-600 dark:text-slate-400 text-sm">{feature.pro}</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {feature.proPlus === 'No' ? (
                    <span className="text-red-500 dark:text-red-400">✕</span>
                  ) : feature.proPlus === 'Yes' ? (
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  ) : (
                    <span className="text-slate-600 dark:text-slate-400 text-sm">{feature.proPlus}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Feature Icons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
  );
}