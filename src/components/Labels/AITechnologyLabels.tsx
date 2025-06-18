import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Brain, 
  Zap, 
  BarChart3, 
  FileText, 
  Layers, 
  Cpu, 
  Network, 
  Lightbulb,
  Gauge
} from 'lucide-react';

interface AITechnologyLabelProps {
  type: 'analysis' | 'summarization' | 'extraction' | 'processing' | 'intelligence' | 'performance';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'pill' | 'badge' | 'tag' | 'card';
  showIcon?: boolean;
  className?: string;
}

export default function AITechnologyLabel({ 
  type, 
  size = 'md', 
  variant = 'pill',
  showIcon = true,
  className = '' 
}: AITechnologyLabelProps) {
  const getLabel = () => {
    switch (type) {
      case 'analysis':
        return {
          text: 'Advanced Text Analysis',
          description: 'Powered by neural language processing',
          icon: Brain,
          colors: 'from-blue-500 to-indigo-600 text-white',
          bgLight: 'bg-blue-50',
          bgDark: 'dark:bg-blue-900/20',
          borderLight: 'border-blue-200',
          borderDark: 'dark:border-blue-800/30',
          textLight: 'text-blue-700',
          textDark: 'dark:text-blue-300'
        };
      case 'summarization':
        return {
          text: 'Intelligent Summarization',
          description: 'Context-aware content distillation',
          icon: FileText,
          colors: 'from-emerald-500 to-teal-600 text-white',
          bgLight: 'bg-emerald-50',
          bgDark: 'dark:bg-emerald-900/20',
          borderLight: 'border-emerald-200',
          borderDark: 'dark:border-emerald-800/30',
          textLight: 'text-emerald-700',
          textDark: 'dark:text-emerald-300'
        };
      case 'extraction':
        return {
          text: 'Neural Text Extraction',
          description: 'Precision content identification',
          icon: Layers,
          colors: 'from-purple-500 to-indigo-600 text-white',
          bgLight: 'bg-purple-50',
          bgDark: 'dark:bg-purple-900/20',
          borderLight: 'border-purple-200',
          borderDark: 'dark:border-purple-800/30',
          textLight: 'text-purple-700',
          textDark: 'dark:text-purple-300'
        };
      case 'processing':
        return {
          text: 'Cognitive Processing',
          description: 'Multi-dimensional text understanding',
          icon: Cpu,
          colors: 'from-orange-500 to-red-600 text-white',
          bgLight: 'bg-orange-50',
          bgDark: 'dark:bg-orange-900/20',
          borderLight: 'border-orange-200',
          borderDark: 'dark:border-orange-800/30',
          textLight: 'text-orange-700',
          textDark: 'dark:text-orange-300'
        };
      case 'intelligence':
        return {
          text: 'Adaptive Intelligence',
          description: 'Self-improving language comprehension',
          icon: Lightbulb,
          colors: 'from-yellow-500 to-amber-600 text-white',
          bgLight: 'bg-yellow-50',
          bgDark: 'dark:bg-yellow-900/20',
          borderLight: 'border-yellow-200',
          borderDark: 'dark:border-yellow-800/30',
          textLight: 'text-yellow-700',
          textDark: 'dark:text-yellow-300'
        };
      case 'performance':
        return {
          text: 'High-Performance Analysis',
          description: 'Optimized for speed and accuracy',
          icon: Gauge,
          colors: 'from-cyan-500 to-blue-600 text-white',
          bgLight: 'bg-cyan-50',
          bgDark: 'dark:bg-cyan-900/20',
          borderLight: 'border-cyan-200',
          borderDark: 'dark:border-cyan-800/30',
          textLight: 'text-cyan-700',
          textDark: 'dark:text-cyan-300'
        };
      default:
        return {
          text: 'AI-Powered',
          description: 'Advanced machine learning technology',
          icon: Sparkles,
          colors: 'from-indigo-500 to-purple-600 text-white',
          bgLight: 'bg-indigo-50',
          bgDark: 'dark:bg-indigo-900/20',
          borderLight: 'border-indigo-200',
          borderDark: 'dark:border-indigo-800/30',
          textLight: 'text-indigo-700',
          textDark: 'dark:text-indigo-300'
        };
    }
  };

  const label = getLabel();
  const Icon = label.icon;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs py-1 px-2';
      case 'lg':
        return 'text-base py-2 px-4';
      case 'md':
      default:
        return 'text-sm py-1.5 px-3';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'badge':
        return `${label.bgLight} ${label.bgDark} ${label.textLight} ${label.textDark} rounded-md`;
      case 'tag':
        return `bg-gradient-to-r ${label.colors} rounded-md shadow-sm`;
      case 'card':
        return `${label.bgLight} ${label.bgDark} border ${label.borderLight} ${label.borderDark} ${label.textLight} ${label.textDark} rounded-xl p-3`;
      case 'pill':
      default:
        return `bg-gradient-to-r ${label.colors} rounded-full shadow-sm`;
    }
  };

  if (variant === 'card') {
    return (
      <div className={`${getVariantClasses()} ${className}`}>
        <div className="flex items-center space-x-2 mb-1">
          <div className={`p-1.5 rounded-lg bg-gradient-to-r ${label.colors}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="font-semibold">{label.text}</span>
        </div>
        <p className="text-xs opacity-80">{label.description}</p>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`inline-flex items-center font-medium ${getSizeClasses()} ${getVariantClasses()} ${className}`}
    >
      {showIcon && <Icon className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} ${variant !== 'pill' && variant !== 'tag' ? '' : 'mr-1.5'}`} />}
      <span>{label.text}</span>
    </motion.div>
  );
}

export function AITechnologyLabelGroup({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <AITechnologyLabel type="analysis" />
      <AITechnologyLabel type="summarization" />
      <AITechnologyLabel type="extraction" />
      <AITechnologyLabel type="processing" />
      <AITechnologyLabel type="intelligence" />
      <AITechnologyLabel type="performance" />
    </div>
  );
}

export function AICapabilityBadge({ 
  capability, 
  score = 95,
  size = 'md',
  className = '' 
}: { 
  capability: string; 
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'text-xs py-1 px-2';
      case 'lg': return 'text-base py-2 px-4';
      default: return 'text-sm py-1.5 px-3';
    }
  };

  return (
    <div className={`inline-flex items-center space-x-2 ${getSizeClasses()} bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200 dark:border-indigo-800/30 text-indigo-700 dark:text-indigo-300 rounded-lg ${className}`}>
      <Sparkles className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} text-indigo-500`} />
      <span className="font-medium">{capability}</span>
      {score !== undefined && (
        <>
          <span className="text-slate-400">|</span>
          <span className="font-semibold">{score}%</span>
        </>
      )}
    </div>
  );
}

export function AIProcessingIndicator({ 
  stage = 'processing',
  progress,
  className = ''
}: { 
  stage?: 'analyzing' | 'processing' | 'generating' | 'optimizing' | 'finalizing';
  progress?: number;
  className?: string;
}) {
  const getStageInfo = () => {
    switch (stage) {
      case 'analyzing':
        return { 
          text: 'Neural Analysis', 
          icon: Brain,
          color: 'text-blue-500'
        };
      case 'generating':
        return { 
          text: 'Content Generation', 
          icon: Sparkles,
          color: 'text-purple-500'
        };
      case 'optimizing':
        return { 
          text: 'Semantic Optimization', 
          icon: Gauge,
          color: 'text-emerald-500'
        };
      case 'finalizing':
        return { 
          text: 'Quality Assurance', 
          icon: BarChart3,
          color: 'text-amber-500'
        };
      case 'processing':
      default:
        return { 
          text: 'Cognitive Processing', 
          icon: Cpu,
          color: 'text-indigo-500'
        };
    }
  };

  const stageInfo = getStageInfo();
  const Icon = stageInfo.icon;

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="p-2 glass-card rounded-lg">
        <Icon className={`w-5 h-5 ${stageInfo.color} animate-pulse`} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-slate-700 dark:text-slate-300">{stageInfo.text}</span>
          {progress !== undefined && (
            <span className="text-sm text-slate-500">{progress}%</span>
          )}
        </div>
        {progress !== undefined && (
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
            <motion.div 
              className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function AITechnologyFeatureList({ className = '' }: { className?: string }) {
  const features = [
    {
      icon: Brain,
      title: 'Neural Language Processing',
      description: 'Advanced pattern recognition for contextual understanding',
      color: 'text-blue-500'
    },
    {
      icon: Layers,
      title: 'Multi-dimensional Analysis',
      description: 'Comprehensive evaluation across semantic layers',
      color: 'text-purple-500'
    },
    {
      icon: Network,
      title: 'Adaptive Learning',
      description: 'Self-improving algorithms for enhanced accuracy',
      color: 'text-emerald-500'
    },
    {
      icon: Zap,
      title: 'High-Performance Processing',
      description: 'Optimized for speed without sacrificing quality',
      color: 'text-amber-500'
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {features.map((feature, index) => (
        <div key={index} className="p-4 glass-card rounded-xl">
          <div className="flex items-center space-x-3 mb-2">
            <feature.icon className={`w-5 h-5 ${feature.color}`} />
            <h3 className="font-semibold text-slate-800 dark:text-white">{feature.title}</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 pl-8">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}