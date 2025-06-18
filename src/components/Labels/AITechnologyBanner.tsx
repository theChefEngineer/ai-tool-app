import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Sparkles, BarChart3, Gauge } from 'lucide-react';

interface AITechnologyBannerProps {
  type: 'analysis' | 'summarization' | 'extraction' | 'premium';
  className?: string;
}

export default function AITechnologyBanner({ type, className = '' }: AITechnologyBannerProps) {
  const getBannerContent = () => {
    switch (type) {
      case 'analysis':
        return {
          title: 'Advanced Text Analysis',
          description: 'Utilizing state-of-the-art neural networks for comprehensive language understanding and pattern recognition.',
          icon: Brain,
          colors: 'from-blue-500 to-indigo-600',
          metrics: [
            { label: 'Accuracy', value: '98.7%' },
            { label: 'Processing Speed', value: '500ms' },
            { label: 'Language Support', value: '94+' }
          ]
        };
      case 'summarization':
        return {
          title: 'Intelligent Summarization Engine',
          description: 'Context-aware content distillation that preserves key information while reducing text volume by up to 80%.',
          icon: BarChart3,
          colors: 'from-emerald-500 to-teal-600',
          metrics: [
            { label: 'Retention Rate', value: '95.2%' },
            { label: 'Compression', value: '75%' },
            { label: 'Coherence', value: '9.4/10' }
          ]
        };
      case 'extraction':
        return {
          title: 'Neural Text Extraction',
          description: 'Precision content identification from documents using advanced semantic understanding algorithms.',
          icon: Zap,
          colors: 'from-purple-500 to-indigo-600',
          metrics: [
            { label: 'Extraction Rate', value: '99.3%' },
            { label: 'Structure Preservation', value: '96.8%' },
            { label: 'Format Support', value: '12+' }
          ]
        };
      case 'premium':
        return {
          title: 'Enterprise-Grade AI Technology',
          description: 'Unlock the full potential of our advanced machine learning systems with premium processing capabilities.',
          icon: Gauge,
          colors: 'from-amber-500 to-orange-600',
          metrics: [
            { label: 'Processing Power', value: '10x' },
            { label: 'Model Parameters', value: '175B+' },
            { label: 'Response Time', value: '<250ms' }
          ]
        };
      default:
        return {
          title: 'Advanced AI Technology',
          description: 'Cutting-edge machine learning algorithms delivering exceptional results for text processing and analysis.',
          icon: Sparkles,
          colors: 'from-indigo-500 to-purple-600',
          metrics: [
            { label: 'Accuracy', value: '97.5%' },
            { label: 'Speed', value: '2x' },
            { label: 'Efficiency', value: '99.1%' }
          ]
        };
    }
  };

  const content = getBannerContent();
  const Icon = content.icon;

  return (
    <div className={`glass-card p-6 rounded-2xl overflow-hidden relative ${className}`}>
      {/* Background gradient effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br opacity-20 blur-3xl pointer-events-none" style={{ background: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${content.colors}`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {content.title}
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 max-w-2xl">
              {content.description}
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden md:flex items-center justify-center"
          >
            <div className={`p-3 rounded-full bg-gradient-to-r ${content.colors}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-2">
          {content.metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="text-center p-3 glass-card rounded-xl"
            >
              <div className={`text-xl font-bold bg-gradient-to-r ${content.colors} bg-clip-text text-transparent`}>
                {metric.value}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{metric.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AITechnologyMetricCard({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  colors = 'from-indigo-500 to-purple-600',
  className = '' 
}: { 
  title: string; 
  value: string | number;
  icon: React.ElementType;
  trend?: { value: number; isPositive: boolean };
  colors?: string;
  className?: string;
}) {
  return (
    <div className={`glass-card p-4 rounded-xl ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</h3>
        <div className={`p-2 rounded-lg bg-gradient-to-r ${colors}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div className={`text-2xl font-bold bg-gradient-to-r ${colors} bg-clip-text text-transparent`}>
          {value}
        </div>
        
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}