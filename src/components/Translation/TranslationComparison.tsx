import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, FileText } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface TranslationComparisonProps {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export default function TranslationComparison({
  originalText,
  translatedText,
  sourceLanguage,
  targetLanguage,
}: TranslationComparisonProps) {
  const { t, isRTL } = useTranslation();
  const originalWords = originalText.split(/\s+/).length;
  const translatedWords = translatedText.split(/\s+/).length;
  const wordDifference = translatedWords - originalWords;
  const percentageChange = originalWords > 0 ? Math.round((wordDifference / originalWords) * 100) : 0;

  const getLanguageFlag = (code: string) => {
    const flags: { [key: string]: string } = {
      'en': '🇺🇸', 'es': '🇪🇸', 'fr': '🇫🇷', 'de': '🇩🇪', 'it': '🇮🇹',
      'pt': '🇵🇹', 'ru': '🇷🇺', 'ja': '🇯🇵', 'ko': '🇰🇷', 'zh': '🇨🇳',
      'ar': '🇸🇦', 'hi': '🇮🇳', 'th': '🇹🇭', 'vi': '🇻🇳', 'nl': '🇳🇱',
      'sv': '🇸🇪', 'da': '🇩🇰', 'no': '🇳🇴', 'fi': '🇫🇮'
    };
    return flags[code] || '🌐';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-4 md:p-6 rounded-2xl mobile-friendly-card"
    >
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 mobile-friendly-heading">
        {t('translation.comparisonTitle')}
      </h3>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Original Text */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getLanguageFlag(sourceLanguage)}</span>
              <h4 className="font-medium text-slate-700 dark:text-slate-300 mobile-friendly-text">
                {t('translation.original')} ({sourceLanguage.toUpperCase()})
              </h4>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400 mobile-friendly-text">
              {originalWords} {t('common.words')}
            </span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-l-4 border-slate-300 max-h-48 overflow-y-auto">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mobile-friendly-text" dir="auto">
              {originalText}
            </p>
          </div>
        </div>

       
        {/* Translated Text */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getLanguageFlag(targetLanguage)}</span>
              <h4 className="font-medium text-slate-700 dark:text-slate-300 mobile-friendly-text">
                {t('translation.translated')} ({targetLanguage.toUpperCase()})
              </h4>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-500 dark:text-slate-400 mobile-friendly-text">
                {translatedWords} {t('common.words')}
              </span>
              {wordDifference !== 0 && (
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                  wordDifference > 0 
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                }`}>
                  <span>{wordDifference > 0 ? '+' : ''}{percentageChange}%</span>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-l-4 border-blue-300 max-h-48 overflow-y-auto">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mobile-friendly-text" dir="auto">
              {translatedText}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-3 glass-card rounded-xl">
          <div className="text-xl md:text-2xl font-bold text-slate-600 dark:text-slate-400">
            {originalWords}
          </div>
          <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{t('translation.sourceWords')}</div>
        </div>
        <div className="text-center p-3 glass-card rounded-xl">
          <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
            {translatedWords}
          </div>
          <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{t('translation.translatedWords')}</div>
        </div>
        <div className="text-center p-3 glass-card rounded-xl">
          <div className={`text-xl md:text-2xl font-bold ${
            wordDifference > 0 
              ? 'text-orange-600 dark:text-orange-400' 
              : wordDifference < 0
              ? 'text-green-600 dark:text-green-400'
              : 'text-slate-600 dark:text-slate-400'
          }`}>
            {wordDifference > 0 ? '+' : ''}{wordDifference}
          </div>
          <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{t('translation.wordDifference')}</div>
        </div>
      </div>
    </motion.div>
  );
}