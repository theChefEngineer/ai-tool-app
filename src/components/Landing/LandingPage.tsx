import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  FileText,
  Languages,
  CheckCircle2,
  Zap,
  BookOpen,
  MessageSquare,
  Shield,
  ArrowRight,
  TrendingUp,
  Globe,
  Brain,
  Scan
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const { t } = useTranslation();

  const features = [
    {
      icon: Sparkles,
      title: 'AI Paraphrasing',
      description: 'Rewrite text in multiple styles while preserving meaning',
      gradient: 'from-violet-500 to-purple-600'
    },
    {
      icon: FileText,
      title: 'Smart Summarization',
      description: 'Generate concise summaries from lengthy documents',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Languages,
      title: 'Multi-Language Translation',
      description: 'Translate content across 100+ languages instantly',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      icon: CheckCircle2,
      title: 'Grammar Checking',
      description: 'Advanced grammar and style corrections',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      icon: Brain,
      title: 'AI Content Detection',
      description: 'Detect and humanize AI-generated text',
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      icon: Scan,
      title: 'OCR & Document Processing',
      description: 'Extract text from images and documents',
      gradient: 'from-indigo-500 to-blue-600'
    },
    {
      icon: MessageSquare,
      title: 'AI Chat Assistant',
      description: 'Interactive writing companion powered by AI',
      gradient: 'from-teal-500 to-cyan-600'
    },
    {
      icon: Shield,
      title: 'Plagiarism Detection',
      description: 'Ensure content originality with advanced analysis',
      gradient: 'from-amber-500 to-orange-600'
    }
  ];

  const aiDetectors = [
    { name: 'Copyleaks', color: 'from-purple-600 to-purple-700', textColor: 'text-purple-600' },
    { name: 'ZeroGPT', color: 'from-green-600 to-green-700', textColor: 'text-green-600' },
    { name: 'QuillBot', color: 'from-teal-600 to-teal-700', textColor: 'text-teal-600' },
    { name: 'Grammarly', color: 'from-emerald-600 to-emerald-700', textColor: 'text-emerald-600' }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '0',
      period: 'month',
      description: 'Get started with essential AI writing tools',
      features: [
        '10 operations per day',
        'All 8 core features',
        'AI Paraphrasing',
        'Text Summarization',
        'Translation (100+ languages)',
        'Grammar Checking',
        'Export to PDF & DOCX'
      ],
      popular: false,
      gradient: 'from-gray-500 to-gray-600'
    },
    {
      name: 'Pro',
      price: '14.99',
      period: 'month',
      description: 'Unlimited operations with all premium features',
      features: [
        'UNLIMITED operations',
        'No daily limits',
        'All paraphrasing modes',
        'Advanced summarization',
        'Multi-language translation',
        'Advanced grammar checking',
        'OCR & Document processing',
        'AI Content Detection',
        'Plagiarism checking',
        'Priority support'
      ],
      popular: true,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      name: 'Enterprise',
      price: '29.99',
      period: 'month',
      description: 'Advanced features for power users and teams',
      features: [
        'Everything in Pro',
        'Priority AI processing',
        'AI Content Humanizer',
        'Usage analytics',
        'Batch processing',
        'Team collaboration',
        'API access',
        'Custom AI tuning',
        'Dedicated support',
        'Early access to features'
      ],
      popular: false,
      gradient: 'from-purple-500 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Powered by Advanced AI Technology
              </span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
              Transform Your Writing with AI
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Professional AI-powered writing assistant for paraphrasing, summarization, translation, and more
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold text-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
              >
                Watch Demo
              </motion.button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>100+ languages supported</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Trusted by 10,000+ users</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Powerful AI Writing Tools
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to create, enhance, and perfect your content
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Detectors Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                Verified & Trusted
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Tested and Proven
            </h2>
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Across All AI-Detectors
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our humanized content consistently passes the most rigorous AI detection tools
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl" />
            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 p-8 max-w-4xl mx-auto">
              {aiDetectors.map((detector, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all group"
                >
                  <div className="mb-4 text-center">
                    <div className={`text-2xl font-bold bg-gradient-to-r ${detector.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform inline-block`}>
                      {detector.name}
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-medium">Pass</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-green-500" />
                <span className="font-semibold text-gray-900 dark:text-white">100% Pass Rate</span>
              </div>
              <div className="hidden sm:block w-px h-8 bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-blue-500" />
                <span className="font-semibold text-gray-900 dark:text-white">Instantly Humanized</span>
              </div>
              <div className="hidden sm:block w-px h-8 bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-purple-500" />
                <span className="font-semibold text-gray-900 dark:text-white">Guaranteed Quality</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Start free, upgrade when you need more power
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative ${plan.popular ? 'md:-mt-4 md:scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <div className={`h-full p-8 rounded-2xl ${plan.popular ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-2xl' : 'bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600 shadow-lg'}`}>
                  <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {plan.name}
                  </h3>
                  <p className={`mb-6 ${plan.popular ? 'text-blue-100' : 'text-gray-600 dark:text-gray-300'}`}>
                    {plan.description}
                  </p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold">${plan.price}</span>
                    <span className={`text-lg ${plan.popular ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'}`}>
                      /{plan.period}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-blue-100' : 'text-green-500'}`} />
                        <span className={plan.popular ? 'text-blue-50' : 'text-gray-700 dark:text-gray-300'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onGetStarted}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      plan.popular
                        ? 'bg-white text-blue-600 hover:bg-blue-50'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg'
                    }`}
                  >
                    Get Started
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
              Ready to Transform Your Writing?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of users and experience the power of AI-assisted writing
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
            >
              Start Writing for Free
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                ParaText Pro
              </span>
              <p className="text-sm mt-2">Powered by Advanced AI</p>
            </div>
            <div className="text-sm">
              © 2025 ParaText Pro. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
