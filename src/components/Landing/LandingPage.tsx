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
  Star,
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

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Content Writer',
      avatar: '👩‍💼',
      rating: 5,
      text: 'ParaText Pro has transformed my writing workflow. The AI paraphrasing is incredibly natural, and the grammar checker catches things I miss.'
    },
    {
      name: 'Michael Chen',
      role: 'Academic Researcher',
      avatar: '👨‍🎓',
      rating: 5,
      text: 'The summarization and translation features are game-changers for my research. I can process documents in multiple languages effortlessly.'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Marketing Manager',
      avatar: '👩‍💻',
      rating: 5,
      text: 'Best AI writing tool I\'ve used. The content detector helps ensure all our marketing materials are original and human-like.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '9.99',
      period: 'month',
      description: 'Perfect for individuals getting started',
      features: [
        '10,000 words per month',
        'All AI writing tools',
        'Basic support',
        'Export to PDF & DOCX',
        '5 languages'
      ],
      popular: false,
      gradient: 'from-gray-500 to-gray-600'
    },
    {
      name: 'Professional',
      price: '24.99',
      period: 'month',
      description: 'Ideal for professionals and content creators',
      features: [
        '50,000 words per month',
        'All AI writing tools',
        'Priority support',
        'Export to all formats',
        'All languages',
        'Advanced AI models',
        'Plagiarism checking'
      ],
      popular: true,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      name: 'Enterprise',
      price: '99.99',
      period: 'month',
      description: 'For teams and businesses',
      features: [
        'Unlimited words',
        'All AI writing tools',
        '24/7 premium support',
        'Export to all formats',
        'All languages',
        'Advanced AI models',
        'Plagiarism checking',
        'Team collaboration',
        'API access'
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
                <span>No credit card required</span>
              </div>
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

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Loved by Writers Worldwide
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of satisfied users who trust ParaText Pro
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
