import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Copy, Check, RotateCcw, Wand2, Download, FileText, File as FileIcon } from 'lucide-react';
import { useAppStore, type ParaphraseMode } from '../../store/appStore';
import { aiService } from '../../lib/aiService';
import { useFeatureAccess } from '../../hooks/useFeatureAccess';
import { useTranslation } from '../../hooks/useTranslation';
import toast from 'react-hot-toast';
import ModeSelector from './ModeSelector';
import TextComparison from './TextComparison';
import UpgradePrompt from '../Common/UpgradePrompt';
import ExportMenu from './ExportMenu';

export default function ParaphraseInterface() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const { currentMode, isProcessing, setProcessing, addToHistory } = useAppStore();
  const { t, isRTL } = useTranslation();
  const { performOperation, showUpgradePrompt, upgradeReason, upgradeFeature, closeUpgradePrompt } = useFeatureAccess();

  const handleParaphrase = async () => {
    if (!inputText.trim()) {
      toast.error(t('messages.error.validation'));
      return;
    }

    const hasAccess = await performOperation('paraphrase');
    if (!hasAccess) {
      return;
    }

    setProcessing(true);
    try {
      const response = await aiService.paraphrase({
        text: inputText,
        mode: currentMode,
      });

      setResult(response);
      addToHistory(response);
      toast.success(t('messages.success.paraphrased'));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (result?.paraphrasedText) {
      await navigator.clipboard.writeText(result.paraphrasedText);
      setCopied(true);
      toast.success(t('messages.success.copied'));
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setInputText('');
    setResult(null);
  };

  const toggleExportMenu = () => {
    setShowExportMenu(!showExportMenu);
  };

  return (
    <div className={`max-w-6xl mx-auto space-y-8 ${isRTL ? 'rtl' : ''}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-4 mobile-friendly-heading">
          {t('paraphrase.title')}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mobile-friendly-text">
          {t('paraphrase.subtitle')}
        </p>
      </motion.div>

      {/* Mode Selector */}
      <ModeSelector />

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
                {t('paraphrase.originalText')}
              </h3>
              <span className="text-sm text-slate-500 dark:text-slate-400 mobile-friendly-text">
                {inputText.length} {t('common.characters')}
              </span>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('paraphrase.placeholder')}
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
                onClick={handleParaphrase}
                disabled={isProcessing || !inputText.trim()}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mobile-friendly-button"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t('paraphrase.processing')}</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    <span>{t('paraphrase.paraphraseButton')}</span>
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
                  {t('paraphrase.paraphrasedText')}
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-700 dark:text-green-300 font-medium mobile-friendly-text">
                      {t('paraphrase.readabilityScore')}: {result.readabilityScore}/10
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleExportMenu}
                      className="p-2 glass-button rounded-xl relative"
                    >
                      <Download className="w-4 h-4" />
                      <AnimatePresence>
                        {showExportMenu && (
                          <ExportMenu 
                            onClose={() => setShowExportMenu(false)}
                            text={result.paraphrasedText}
                            title="Paraphrased Text"
                            originalText={inputText}
                          />
                        )}
                      </AnimatePresence>
                    </motion.button>
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
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-4">
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed mobile-friendly-text" dir="auto">
                  {result.paraphrasedText}
                </p>
              </div>

              {result.improvements && result.improvements.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 mobile-friendly-text">
                    {t('paraphrase.improvements')}
                  </h4>
                  <ul className="space-y-1">
                    {result.improvements.map((improvement: string, index: number) => (
                      <li key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-start space-x-2 mobile-friendly-text">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-4 md:p-6 rounded-2xl h-64 flex items-center justify-center mobile-friendly-card">
              <div className="text-center">
                <Wand2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400 mobile-friendly-text">
                  {t('paraphrase.emptyState')}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Text Comparison */}
      {result && (
        <TextComparison
          originalText={inputText}
          paraphrasedText={result.paraphrasedText}
        />
      )}

      {/* Upgrade Prompt */}
      <UpgradePrompt
        isOpen={showUpgradePrompt}
        onClose={closeUpgradePrompt}
        feature={upgradeFeature}
        reason={upgradeReason}
      />
    </div>
  );
}