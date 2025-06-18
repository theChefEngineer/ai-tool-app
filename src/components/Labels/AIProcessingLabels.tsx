import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Brain, 
  Zap, 
  BarChart3, 
  Gauge, 
  Sparkles, 
  Network, 
  Lightbulb,
  Layers,
  Workflow
} from 'lucide-react';

interface AIProcessingLabelProps {
  stage: 'analyzing' | 'processing' | 'generating' | 'optimizing' | 'finalizing';
  progress?: number;
  showProgress?: boolean;
  variant?: 'inline' | 'card' | 'banner';
  className?: string;
}

export default function AIProcessingLabel({
  stage,
  progress,
  showProgress = true,
  variant = 'inline',
  className = ''
}: AIProcessingLabelProps) {
  const getStageInfo = () => {
    switch (stage) {
      case 'analyzing':
        return {
          label: 'Neural Analysis',
          description: 'Semantic pattern recognition in progress',
          icon: Brain,
          color: 'from-blue-500 to-indigo-600',
          bgLight: 'bg-blue-50',
          bgDark: 'dark:bg-blue-900/20',
          textLight: 'text-blue-700',
          textDark: 'dark:text-blue-300'
        };
      case 'processing':
        return {
          label: 'Cognitive Processing',
          description: 'Multi-dimensional content evaluation',
          icon: Cpu,
          color: 'from-indigo-500 to-purple-600',
          bgLight: 'bg-indigo-50',
          bgDark: 'dark:bg-indigo-900/20',
          textLight: 'text-indigo-700',
          textDark: 'dark:text-indigo-300'
        };
      case 'generating':
        return {
          label: 'Content Generation',
          description: 'Creating optimized output with context awareness',
          icon: Sparkles,
          color: 'from-purple-500 to-pink-600',
          bgLight: 'bg-purple-50',
          bgDark: 'dark:bg-purple-900/20',
          textLight: 'text-purple-700',
          textDark: 'dark:text-purple-300'
        };
      case 'optimizing':
        return {
          label: 'Semantic Optimization',
          description: 'Refining output for maximum clarity and accuracy',
          icon: Gauge,
          color: 'from-emerald-500 to-teal-600',
          bgLight: 'bg-emerald-50',
          bgDark: 'dark:bg-emerald-900/20',
          textLight: 'text-emerald-700',
          textDark: 'dark:text-emerald-300'
        };
      case 'finalizing':
        return {
          label: 'Quality Assurance',
          description: 'Final verification and enhancement',
          icon: BarChart3,
          color: 'from-amber-500 to-orange-600',
          bgLight: 'bg-amber-50',
          bgDark: 'dark:bg-amber-900/20',
          textLight: 'text-amber-700',
          textDark: 'dark:text-amber-300'
        };
      default:
        return {
          label: 'AI Processing',
          description: 'Advanced analysis in progress',
          icon: Zap,
          color: 'from-gray-500 to-slate-600',
          bgLight: 'bg-gray-50',
          bgDark: 'dark:bg-gray-900/20',
          textLight: 'text-gray-700',
          textDark: 'dark:text-gray-300'
        };
    }
  };

  const stageInfo = getStageInfo();
  const Icon = stageInfo.icon;
  
  // Card variant
  if (variant === 'card') {
    return (
      <div className={`${stageInfo.bgLight} ${stageInfo.bgDark} p-4 rounded-xl ${className}`}>
        <div className="flex items-center space-x-3 mb-2">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${stageInfo.color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className={`font-semibold ${stageInfo.textLight} ${stageInfo.textDark}`}>
              {stageInfo.label}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {stageInfo.description}
            </p>
          </div>
        </div>
        
        {showProgress && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">Progress</span>
              {progress !== undefined && (
                <span className={`text-xs font-medium ${stageInfo.textLight} ${stageInfo.textDark}`}>
                  {progress}%
                </span>
              )}
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <motion.div 
                className={`h-1.5 rounded-full bg-gradient-to-r ${stageInfo.color}`}
                initial={{ width: 0 }}
                animate={{ 
                  width: progress !== undefined ? `${progress}%` : '90%',
                  x: progress !== undefined ? 0 : ['-100%', '100%']
                }}
                transition={progress !== undefined ? 
                  { duration: 0.5 } : 
                  { duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }
                }
              />
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Banner variant
  if (variant === 'banner') {
    return (
      <div className={`glass-card p-6 rounded-2xl ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${stageInfo.color}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {stageInfo.label}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {stageInfo.description}
              </p>
            </div>
          </div>
          
          {progress !== undefined && (
            <div className={`text-2xl font-bold ${stageInfo.textLight} ${stageInfo.textDark}`}>
              {progress}%
            </div>
          )}
        </div>
        
        {showProgress && (
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <motion.div 
              className={`h-2 rounded-full bg-gradient-to-r ${stageInfo.color}`}
              initial={{ width: 0 }}
              animate={{ 
                width: progress !== undefined ? `${progress}%` : '90%',
                x: progress !== undefined ? 0 : ['-100%', '100%']
              }}
              transition={progress !== undefined ? 
                { duration: 0.5 } : 
                { duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }
              }
            />
          </div>
        )}
      </div>
    );
  }
  
  // Inline variant (default)
  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <div className={`p-1.5 rounded-lg bg-gradient-to-r ${stageInfo.color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <span className={`font-medium ${stageInfo.textLight} ${stageInfo.textDark}`}>
        {stageInfo.label}
      </span>
      {showProgress && progress !== undefined && (
        <span className="text-sm text-slate-500 dark:text-slate-400">
          ({progress}%)
        </span>
      )}
    </div>
  );
}

export function AICapabilityIndicator({
  capability,
  level = 'advanced',
  className = ''
}: {
  capability: string;
  level?: 'standard' | 'advanced' | 'premium' | 'enterprise';
  className?: string;
}) {
  const getLevelInfo = () => {
    switch (level) {
      case 'standard':
        return {
          icon: Zap,
          color: 'from-blue-500 to-indigo-600',
          bgLight: 'bg-blue-50',
          bgDark: 'dark:bg-blue-900/20',
          textLight: 'text-blue-700',
          textDark: 'dark:text-blue-300'
        };
      case 'advanced':
        return {
          icon: Brain,
          color: 'from-indigo-500 to-purple-600',
          bgLight: 'bg-indigo-50',
          bgDark: 'dark:bg-indigo-900/20',
          textLight: 'text-indigo-700',
          textDark: 'dark:text-indigo-300'
        };
      case 'premium':
        return {
          icon: Sparkles,
          color: 'from-purple-500 to-pink-600',
          bgLight: 'bg-purple-50',
          bgDark: 'dark:bg-purple-900/20',
          textLight: 'text-purple-700',
          textDark: 'dark:text-purple-300'
        };
      case 'enterprise':
        return {
          icon: Network,
          color: 'from-emerald-500 to-teal-600',
          bgLight: 'bg-emerald-50',
          bgDark: 'dark:bg-emerald-900/20',
          textLight: 'text-emerald-700',
          textDark: 'dark:text-emerald-300'
        };
      default:
        return {
          icon: Zap,
          color: 'from-gray-500 to-slate-600',
          bgLight: 'bg-gray-50',
          bgDark: 'dark:bg-gray-900/20',
          textLight: 'text-gray-700',
          textDark: 'dark:text-gray-300'
        };
    }
  };

  const levelInfo = getLevelInfo();
  const Icon = levelInfo.icon;

  return (
    <div className={`inline-flex items-center ${levelInfo.bgLight} ${levelInfo.bgDark} px-3 py-1.5 rounded-lg ${className}`}>
      <Icon className={`w-4 h-4 ${levelInfo.textLight} ${levelInfo.textDark} mr-2`} />
      <span className={`text-sm font-medium ${levelInfo.textLight} ${levelInfo.textDark}`}>
        {capability}
      </span>
    </div>
  );
}

export function AITechnologyStack({ className = '' }: { className?: string }) {
  const technologies = [
    {
      icon: Brain,
      name: 'Neural Networks',
      description: 'Deep learning architecture for advanced pattern recognition',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Workflow,
      name: 'Natural Language Processing',
      description: 'Contextual understanding of language nuances and semantics',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: Layers,
      name: 'Multi-dimensional Analysis',
      description: 'Comprehensive evaluation across semantic layers',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Network,
      name: 'Adaptive Learning',
      description: 'Self-improving algorithms for enhanced accuracy',
      color: 'from-emerald-500 to-teal-600'
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">
        Powered by Advanced Technology
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {technologies.map((tech, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-4 rounded-xl"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${tech.color}`}>
                <tech.icon className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-white">
                {tech.name}
              </h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 pl-10">
              {tech.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}