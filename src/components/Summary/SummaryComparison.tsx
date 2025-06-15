import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingDown, FileText, Clock } from 'lucide-react';

interface SummaryComparisonProps {
  originalText: string;
  summaryText: string;
  compressionRatio: number;
}

export default function SummaryComparison({ originalText, summaryText, compressionRatio }: SummaryComparisonProps) {
  const originalWords = originalText.split(/\s+/).length;
  const summaryWords = summaryText.split(/\s+/).length;
  const originalReadTime = Math.ceil(originalWords / 200); // Average reading speed
  const summaryReadTime = Math.ceil(summaryWords / 200);
  const timeSaved = originalReadTime - summaryReadTime;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6 rounded-2xl"
    >
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
        Summary Comparison
      </h3>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Original Text */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-slate-700 dark:text-slate-300">Original Text</h4>
            <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
              <FileText className="w-4 h-4" />
              <span>{originalWords} words</span>
              <Clock className="w-4 h-4 ml-2" />
              <span>{originalReadTime} min read</span>
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-l-4 border-slate-300 max-h-48 overflow-y-auto">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
              {originalText}
            </p>
          </div>
        </div>

        {/* Arrow */}
        <div className="hidden lg:flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"
          >
            <ArrowRight className="w-6 h-6 text-white" />
          </motion.div>
        </div>

        {/* Summary Text */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-slate-700 dark:text-slate-300">Summary</h4>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                <FileText className="w-4 h-4" />
                <span>{summaryWords} words</span>
                <Clock className="w-4 h-4 ml-2" />
                <span>{summaryReadTime} min read</span>
              </div>
              <div className="flex items-center space-x-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-xs">
                <TrendingDown className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                  {compressionRatio}% shorter
                </span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-l-4 border-emerald-300 max-h-48 overflow-y-auto">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
              {summaryText}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="text-center p-3 glass-card rounded-xl">
          <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">
            {originalWords}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Original Words</div>
        </div>
        <div className="text-center p-3 glass-card rounded-xl">
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {summaryWords}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Summary Words</div>
        </div>
        <div className="text-center p-3 glass-card rounded-xl">
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {compressionRatio}%
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Compression</div>
        </div>
        <div className="text-center p-3 glass-card rounded-xl">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {timeSaved > 0 ? timeSaved : 0}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Min Saved</div>
        </div>
      </div>
    </motion.div>
  );
}