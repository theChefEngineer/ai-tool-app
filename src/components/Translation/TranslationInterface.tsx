import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Loader2, Copy, Check, RotateCcw, Languages, Volume2 } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { aiService } from '../../lib/aiService';
import { UsageChecker } from '../../lib/usageChecker';
import { useTranslation } from '../../hooks/useTranslation';
import toast from 'react-hot-toast';
import LanguageSelector from './LanguageSelector';
import TranslationComparison from './TranslationComparison';
import UsageLimitModal from '../Layout/UsageLimitModal';

export default function TranslationInterface() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [showUsageLimitModal, setShowUsageLimitModal] = useState(false);
  
  const { isProcessing, setProcessing, addToTranslationHistory } = useAppStore();
  const { t, isRTL } = useTranslation();

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast.error(t('messages.error.validation'));
      return;
    }

    if (sourceLanguage === targetLanguage && sourceLanguage !== 'auto') {
      toast.error('Source and target languages cannot be the same');
      return;
    }

    // Check usage limit before processing
    const canProceed = await UsageChecker.checkAndIncrementUsage('translation');
    if (!canProceed) {
      setShowUsageLimitModal(true);
      return;
    }

    setProcessing(true);
    try {
      const response = await aiService.translate({
        text: inputText,
        sourceLanguage,
        targetLanguage,
      });
      
      setResult(response);
      addToTranslationHistory(response);
      toast.success(t('messages.success.translated'));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (result?.translatedText) {
      await navigator.clipboard.writeText(result.translatedText);
      setCopied(true);
      toast.success(t('messages.success.copied'));
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setInputText('');
    setResult(null);
  };

  const handleSwapLanguages = () => {
    if (sourceLanguage !== 'auto') {
      const temp = sourceLanguage;
      setSourceLanguage(targetLanguage);
      setTargetLanguage(temp);
      
      // If we have a result, swap the texts
      if (result) {
        setInputText(result.translatedText);
        setResult(null);
      }
    }
  };

  return (
    <div className={`max-w-6xl mx-auto space-y-8 ${isRTL ? 'rtl' : ''}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-4 mobile-friendly-heading">
          {t('translation.title')}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mobile-friendly-text">
          {t('translation.subtitle')}
        </p>
      </motion.div>

      {/* Language Selector */}
      <LanguageSelector
        sourceLanguage={sourceLanguage}
        targetLanguage={targetLanguage}
        onSourceChange={setSourceLanguage}
        onTargetChange={setTargetLanguage}
        onSwap={handleSwapLanguages}
      />

      {/* Main Interface */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="glass-card p-4 md:p-6 rounded-2xl mobile-friendly-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mobile-friendly-heading">
                {t('translation.sourceText')}
              </h3>
              <span className="text-sm text-slate-500 dark:text-slate-400 mobile-friendly-text">
                {inputText.length} {t('common.characters')}
              </span>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('translation.placeholder')}
              className="w-full h-48 p-4 glass-input rounded-xl resize-none"
              disabled={isProcessing}
              dir="auto"
            />

            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="px-4 py-2 glass-button rounded-xl flex items-center space-x-2 mobile-friendly-button"
                  disabled={isProcessing}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t('common.reset')}</span>
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTranslate}
                disabled={isProcessing || !inputText.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mobile-friendly-button"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t('translation.processing')}</span>
                  </>
                ) : (
                  <>
                    <Languages className="w-5 h-5" />
                    <span>{t('translation.translateButton')}</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Output Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {result ? (
            <div className="glass-card p-4 md:p-6 rounded-2xl mobile-friendly-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mobile-friendly-heading">
                  {t('translation.translatedText')}
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-700 dark:text-blue-300 font-medium mobile-friendly-text">
                      {result.detectedLanguage || sourceLanguage} → {targetLanguage}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className="p-2 glass-button rounded-xl"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-4">
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed mobile-friendly-text" dir="auto">
                  {result.translatedText}
                </p>
              </div>

              {result.confidence && (
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-sm text-slate-600 dark:text-slate-400 mobile-friendly-text">
                    {t('translation.confidence')}
                  </span>
                  <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${result.confidence}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400 mobile-friendly-text">
                    {result.confidence}%
                  </span>
                </div>
              )}

              {result.alternatives && result.alternatives.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 mobile-friendly-text">
                    {t('translation.alternatives')}
                  </h4>
                  <ul className="space-y-1">
                    {result.alternatives.map((alt: string, index: number) => (
                      <li key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-start space-x-2 mobile-friendly-text">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span dir="auto">{alt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-4 md:p-6 rounded-2xl h-64 flex items-center justify-center mobile-friendly-card">
              <div className="text-center">
                <Languages className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400 mobile-friendly-text">
                  {t('translation.emptyState')}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Translation Comparison */}
      {result && (
        <TranslationComparison
          originalText={inputText}
          translatedText={result.translatedText}
          sourceLanguage={result.detectedLanguage || sourceLanguage}
          targetLanguage={targetLanguage}
        />
      )}

      {/* Usage Limit Modal */}
      <UsageLimitModal
        isOpen={showUsageLimitModal}
        onClose={() => setShowUsageLimitModal(false)}
        onUpgrade={() => setShowUsageLimitModal(false)}
      />
    </div>
  );
}