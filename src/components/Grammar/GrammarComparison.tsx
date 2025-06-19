import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, AlertTriangle, TrendingUp, FileText } from 'lucide-react';

interface GrammarError {
  id: string;
  type: 'grammar' | 'spelling' | 'style';
  original: string;
  suggestion: string;
  explanation: string;
  startIndex: number;
  endIndex: number;
  accepted?: boolean;
  rejected?: boolean;
}

interface GrammarComparisonProps {
  originalText: string;
  correctedText: string;
  errors: GrammarError[];
  overallScore: number;
}

export default function GrammarComparison({ 
  originalText, 
  correctedText, 
  errors, 
  overallScore 
}: GrammarComparisonProps) {
  const originalWords = originalText.split(/\s+/).length;
  const correctedWords = correctedText.split(/\s+/).length;
  const grammarErrors = errors.filter(e => e.type === 'grammar').length;
  const spellingErrors = errors.filter(e => e.type === 'spelling').length;
  const styleImprovements = errors.filter(e => e.type === 'style').length;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-600';
    if (score >= 70) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6 rounded-2xl"
    >
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
        Grammar Analysis Results
      </h3>

      {/* Overall Score */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <div className="w-32 h-32 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-slate-200 dark:text-slate-700"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallScore / 100)}`}
                className={`${getScoreColor(overallScore)} transition-all duration-1000`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-slate-800 dark:text-white">
                {overallScore}%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className={`w-5 h-5 ${getScoreColor(overallScore)}`} />
            <span className={`font-semibold ${getScoreColor(overallScore)}`}>
              Grammar Score
            </span>
          </div>
        </div>
      </div>

      {/* Error Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 glass-card rounded-xl">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {grammarErrors}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Grammar</div>
        </div>
        <div className="text-center p-3 glass-card rounded-xl">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {spellingErrors}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Spelling</div>
        </div>
        <div className="text-center p-3 glass-card rounded-xl">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {styleImprovements}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Style</div>
        </div>
        <div className="text-center p-3 glass-card rounded-xl">
          <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">
            {originalWords}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Words</div>
        </div>
      </div>

      {/* Before and After Comparison */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Original Text */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h4 className="font-medium text-slate-700 dark:text-slate-300">
                Original ({errors.length} issues)
              </h4>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {originalWords} words
            </span>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border-l-4 border-red-300 max-h-48 overflow-y-auto">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
              {originalText}
            </p>
          </div>
        </div>

         

        {/* Corrected Text */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h4 className="font-medium text-slate-700 dark:text-slate-300">
                Corrected ({overallScore}% score)
              </h4>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {correctedWords} words
            </span>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border-l-4 border-green-300 max-h-48 overflow-y-auto">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
              {correctedText}
            </p>
          </div>
        </div>
      </div>

      {/* Improvement Summary */}
      {errors.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-medium text-blue-800 dark:text-blue-200">
              Improvements Made
            </h4>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-blue-700 dark:text-blue-300">
                {grammarErrors} grammar fixes
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-blue-700 dark:text-blue-300">
                {spellingErrors} spelling corrections
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-blue-700 dark:text-blue-300">
                {styleImprovements} style improvements
              </span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}