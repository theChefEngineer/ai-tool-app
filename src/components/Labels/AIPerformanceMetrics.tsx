import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Gauge, 
  Clock, 
  Zap, 
  CheckCircle, 
  Brain, 
  Sparkles 
} from 'lucide-react';

interface AIPerformanceMetricsProps {
  metrics: {
    accuracy?: number;
    speed?: number;
    quality?: number;
    efficiency?: number;
  };
  variant?: 'cards' | 'inline' | 'banner';
  className?: string;
}

export default function AIPerformanceMetrics({
  metrics,
  variant = 'cards',
  className = ''
}: AIPerformanceMetricsProps) {
  const { accuracy = 97, speed = 95, quality = 96, efficiency = 98 } = metrics;

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap gap-3 ${className}`}>
        {accuracy && (
          <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg">
            <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {accuracy}% Accuracy
            </span>
          </div>
        )}
        
        {speed && (
          <div className="inline-flex items-center space-x-2 bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-lg">
            <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              {speed}% Speed
            </span>
          </div>
        )}
        
        {quality && (
          <div className="inline-flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              {quality}% Quality
            </span>
          </div>
        )}
        
        {efficiency && (
          <div className="inline-flex items-center space-x-2 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg">
            <Gauge className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
              {efficiency}% Efficiency
            </span>
          </div>
        )}
      </div>
    );
  }

  // Banner variant
  if (variant === 'banner') {
    return (
      <div className={`glass-card p-6 rounded-2xl ${className}`}>
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              AI Performance Metrics
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Advanced analytics powered by neural language processing
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {accuracy && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Accuracy</span>
                </div>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{accuracy}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                <motion.div 
                  className="h-1.5 rounded-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${accuracy}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          )}
          
          {speed && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Speed</span>
                </div>
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{speed}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                <motion.div 
                  className="h-1.5 rounded-full bg-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${speed}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>
          )}
          
          {quality && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Quality</span>
                </div>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{quality}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                <motion.div 
                  className="h-1.5 rounded-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${quality}%` }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
              </div>
            </div>
          )}
          
          {efficiency && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Gauge className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Efficiency</span>
                </div>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{efficiency}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                <motion.div 
                  className="h-1.5 rounded-full bg-amber-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${efficiency}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Cards variant (default)
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {accuracy && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 rounded-xl"
        >
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Accuracy</h3>
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {accuracy}%
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-2">
            <motion.div 
              className="h-1.5 rounded-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${accuracy}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </motion.div>
      )}
      
      {speed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 rounded-xl"
        >
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="w-5 h-5 text-purple-500" />
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Speed</h3>
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {speed}%
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-2">
            <motion.div 
              className="h-1.5 rounded-full bg-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${speed}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </motion.div>
      )}
      
      {quality && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 rounded-xl"
        >
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Quality</h3>
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {quality}%
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-2">
            <motion.div 
              className="h-1.5 rounded-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${quality}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </motion.div>
      )}
      
      {efficiency && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4 rounded-xl"
        >
          <div className="flex items-center space-x-2 mb-3">
            <Gauge className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Efficiency</h3>
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {efficiency}%
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-2">
            <motion.div 
              className="h-1.5 rounded-full bg-amber-500"
              initial={{ width: 0 }}
              animate={{ width: `${efficiency}%` }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}

export function AIProcessingStages({ 
  currentStage = 0,
  className = ''
}: { 
  currentStage?: number;
  className?: string;
}) {
  const stages = [
    { name: 'Input Analysis', icon: Brain, description: 'Semantic pattern recognition' },
    { name: 'Content Processing', icon: Cpu, description: 'Multi-dimensional evaluation' },
    { name: 'Optimization', icon: Gauge, description: 'Quality and accuracy enhancement' },
    { name: 'Output Generation', icon: Sparkles, description: 'Final result creation' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <h3 className="text-lg font-bold text-slate-800 dark:text-white">
        Advanced Processing Pipeline
      </h3>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-6 top-6 h-[calc(100%-48px)] w-0.5 bg-slate-200 dark:bg-slate-700"></div>
        
        {/* Stages */}
        <div className="space-y-6">
          {stages.map((stage, index) => {
            const isActive = index <= currentStage;
            const Icon = stage.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start space-x-4"
              >
                <div className={`z-10 p-3 rounded-full ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600' 
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-semibold ${
                    isActive ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {stage.name}
                  </h4>
                  <p className={`text-sm ${
                    isActive ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {stage.description}
                  </p>
                </div>
                
                {isActive && index === currentStage && (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                      In Progress
                    </span>
                  </div>
                )}
                
                {isActive && index < currentStage && (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-medium text-green-700 dark:text-green-300">
                      Complete
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}