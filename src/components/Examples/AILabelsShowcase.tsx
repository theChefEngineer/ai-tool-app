import React from 'react';
import { motion } from 'framer-motion';
import { 
  AITechnologyLabel, 
  AITechnologyLabelGroup, 
  AICapabilityBadge,
  AIProcessingIndicator,
  AITechnologyFeatureList,
  AITechnologyBanner,
  AITechnologyMetricCard,
  AIProcessingLabel,
  AIProcessingStages,
  AIPerformanceMetrics
} from '../Labels';
import { Brain, Zap, Gauge, Sparkles } from 'lucide-react';

export default function AILabelsShowcase() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
          AI Technology Labels
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Professional, beautiful labels highlighting our cutting-edge AI technology for text analysis and summarization.
        </p>
      </motion.div>

      {/* Technology Labels Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8 rounded-2xl"
      >
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
          AI Technology Labels
        </h2>
        
        <div className="space-y-8">
          {/* Pill Variants */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              Pill Variants
            </h3>
            <div className="flex flex-wrap gap-3">
              <AITechnologyLabel type="analysis" />
              <AITechnologyLabel type="summarization" />
              <AITechnologyLabel type="extraction" />
              <AITechnologyLabel type="processing" />
              <AITechnologyLabel type="intelligence" />
              <AITechnologyLabel type="performance" />
            </div>
          </div>
          
          {/* Badge Variants */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              Badge Variants
            </h3>
            <div className="flex flex-wrap gap-3">
              <AITechnologyLabel type="analysis" variant="badge" />
              <AITechnologyLabel type="summarization" variant="badge" />
              <AITechnologyLabel type="extraction" variant="badge" />
              <AITechnologyLabel type="processing" variant="badge" />
            </div>
          </div>
          
          {/* Tag Variants */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              Tag Variants
            </h3>
            <div className="flex flex-wrap gap-3">
              <AITechnologyLabel type="analysis" variant="tag" />
              <AITechnologyLabel type="summarization" variant="tag" />
              <AITechnologyLabel type="extraction" variant="tag" />
              <AITechnologyLabel type="processing" variant="tag" />
            </div>
          </div>
          
          {/* Card Variants */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              Card Variants
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AITechnologyLabel type="analysis" variant="card" />
              <AITechnologyLabel type="summarization" variant="card" />
              <AITechnologyLabel type="extraction" variant="card" />
            </div>
          </div>
          
          {/* Size Variants */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              Size Variants
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <AITechnologyLabel type="analysis" size="sm" />
              <AITechnologyLabel type="analysis" size="md" />
              <AITechnologyLabel type="analysis" size="lg" />
            </div>
          </div>
          
          {/* Capability Badges */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              Capability Badges
            </h3>
            <div className="flex flex-wrap gap-3">
              <AICapabilityBadge capability="Semantic Analysis" score={98} />
              <AICapabilityBadge capability="Context Awareness" score={95} />
              <AICapabilityBadge capability="Pattern Recognition" score={97} />
              <AICapabilityBadge capability="Language Processing" score={99} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Processing Indicators Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8 rounded-2xl"
      >
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
          AI Processing Indicators
        </h2>
        
        <div className="space-y-8">
          {/* Processing Indicators */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              Processing Stages
            </h3>
            <div className="flex flex-col space-y-4">
              <AIProcessingIndicator stage="analyzing" progress={25} />
              <AIProcessingIndicator stage="processing" progress={50} />
              <AIProcessingIndicator stage="generating" progress={75} />
              <AIProcessingIndicator stage="optimizing" progress={90} />
              <AIProcessingIndicator stage="finalizing" progress={95} />
            </div>
          </div>
          
          {/* Processing Label Variants */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              Processing Label Variants
            </h3>
            <div className="space-y-4">
              <AIProcessingLabel stage="analyzing" variant="inline" />
              <AIProcessingLabel stage="processing" variant="card" progress={65} />
              <AIProcessingLabel stage="generating" variant="banner" progress={80} />
            </div>
          </div>
          
          {/* Processing Stages */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              Processing Pipeline
            </h3>
            <AIProcessingStages currentStage={2} />
          </div>
        </div>
      </motion.div>

      {/* Performance Metrics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-8 rounded-2xl"
      >
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
          AI Performance Metrics
        </h2>
        
        <div className="space-y-8">
          {/* Metrics Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              Performance Metrics Cards
            </h3>
            <AIPerformanceMetrics 
              metrics={{ 
                accuracy: 97.5, 
                speed: 95.2, 
                quality: 96.8, 
                efficiency: 98.3 
              }} 
            />
          </div>
          
          {/* Inline Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              Inline Performance Metrics
            </h3>
            <AIPerformanceMetrics 
              metrics={{ 
                accuracy: 97.5, 
                speed: 95.2, 
                quality: 96.8, 
                efficiency: 98.3 
              }}
              variant="inline"
            />
          </div>
          
          {/* Banner Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              Banner Performance Metrics
            </h3>
            <AIPerformanceMetrics 
              metrics={{ 
                accuracy: 97.5, 
                speed: 95.2, 
                quality: 96.8, 
                efficiency: 98.3 
              }}
              variant="banner"
            />
          </div>
          
          {/* Metric Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              Individual Metric Cards
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <AITechnologyMetricCard 
                title="Accuracy" 
                value="97.5%" 
                icon={CheckCircle}
                trend={{ value: 2.3, isPositive: true }}
                colors="from-blue-500 to-indigo-600"
              />
              <AITechnologyMetricCard 
                title="Processing Speed" 
                value="250ms" 
                icon={Zap}
                trend={{ value: 15, isPositive: true }}
                colors="from-purple-500 to-pink-600"
              />
              <AITechnologyMetricCard 
                title="Neural Depth" 
                value="175B" 
                icon={Brain}
                colors="from-emerald-500 to-teal-600"
              />
              <AITechnologyMetricCard 
                title="Efficiency" 
                value="98.3%" 
                icon={Gauge}
                trend={{ value: 1.2, isPositive: true }}
                colors="from-amber-500 to-orange-600"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Technology Banners Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-8 rounded-2xl"
      >
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
          AI Technology Banners
        </h2>
        
        <div className="space-y-6">
          <AITechnologyBanner type="analysis" />
          <AITechnologyBanner type="summarization" />
          <AITechnologyBanner type="extraction" />
          <AITechnologyBanner type="premium" />
        </div>
      </motion.div>

      {/* Technology Stack Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-8 rounded-2xl"
      >
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
          AI Technology Stack
        </h2>
        
        <AITechnologyFeatureList />
      </motion.div>
    </div>
  );
}