import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

interface TextComparisonProps {
  originalText: string;
  paraphrasedText: string;
}

export default function TextComparison({ originalText, paraphrasedText }: TextComparisonProps) {
  const originalWords = originalText.split(/\s+/).length;
  const paraphrasedWords = paraphrasedText.split(/\s+/).length;
  const wordDifference = paraphrasedWords - originalWords;
  const percentageChange = Math.round((wordDifference / originalWords) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6 rounded-2xl"
    >
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
        Side-by-Side Comparison
      </h3>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Original Text */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-slate-700 dark:text-slate-300">Original</h4>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {originalWords} words
            </span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-l-4 border-red-300">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {originalText}
            </p>
          </div>
        </div>

        {/* Arrow */}
      

        {/* Paraphrased Text */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-slate-700 dark:text-slate-300">Paraphrased</h4>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {paraphrasedWords} words
              </span>
              {wordDifference !== 0 && (
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                  wordDifference > 0 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                }`}>
                  {wordDifference > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{Math.abs(percentageChange)}%</span>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-l-4 border-green-300">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {paraphrasedText}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-3 glass-card rounded-xl">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {originalWords}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Original Words</div>
        </div>
        <div className="text-center p-3 glass-card rounded-xl">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {paraphrasedWords}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Paraphrased Words</div>
        </div>
        <div className="text-center p-3 glass-card rounded-xl">
          <div className={`text-2xl font-bold ${
            wordDifference > 0 
              ? 'text-green-600 dark:text-green-400' 
              : wordDifference < 0
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-600 dark:text-slate-400'
          }`}>
            {wordDifference > 0 ? '+' : ''}{wordDifference}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Word Difference</div>
        </div>
      </div>
    </motion.div>
  );
}