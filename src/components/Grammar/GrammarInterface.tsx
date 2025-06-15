import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  Check, 
  RotateCcw, 
  BookCheck,
  Loader2,
  X,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Sparkles
} from 'lucide-react';
import { deepseekService } from '../../lib/deepseek';
import { UsageChecker } from '../../lib/usageChecker';
import { useTranslation } from '../../hooks/useTranslation';
import toast from 'react-hot-toast';
import GrammarComparison from './GrammarComparison';
import UsageLimitModal from '../Layout/UsageLimitModal';

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

interface GrammarResult {
  originalText: string;
  correctedText: string;
  errors: GrammarError[];
  overallScore: number;
  improvements: string[];
}

export default function GrammarInterface() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<GrammarResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [showUsageLimitModal, setShowUsageLimitModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedErrors, setSelectedErrors] = useState<Set<string>>(new Set());
  const { t } = useTranslation();

  const handleCheckGrammar = async () => {
    if (!inputText.trim()) {
      toast.error(t('messages.error.validation'));
      return;
    }

    // Check usage limit before processing
    const canProceed = await UsageChecker.checkAndIncrementUsage('grammar');
    if (!canProceed) {
      setShowUsageLimitModal(true);
      return;
    }

    setIsProcessing(true);
    try {
      const response = await deepseekService.checkGrammarAdvanced(inputText);
      setResult(response);
      setSelectedErrors(new Set(response.errors.map(e => e.id)));
      toast.success(t('messages.success.grammarChecked'));
    } catch (error: any) {
      toast.error(error.message || 'Failed to check grammar');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (result?.correctedText) {
      await navigator.clipboard.writeText(result.correctedText);
      setCopied(true);
      toast.success(t('messages.success.copied'));
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setInputText('');
    setResult(null);
    setSelectedErrors(new Set());
  };

  const handleAcceptError = (errorId: string) => {
    if (!result) return;
    
    setResult(prev => ({
      ...prev!,
      errors: prev!.errors.map(error => 
        error.id === errorId 
          ? { ...error, accepted: true, rejected: false }
          : error
      )
    }));
    setSelectedErrors(prev => new Set([...prev, errorId]));
  };

  const handleRejectError = (errorId: string) => {
    if (!result) return;
    
    setResult(prev => ({
      ...prev!,
      errors: prev!.errors.map(error => 
        error.id === errorId 
          ? { ...error, accepted: false, rejected: true }
          : error
      )
    }));
    setSelectedErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(errorId);
      return newSet;
    });
  };

  const handleAcceptAll = () => {
    if (!result) return;
    
    setResult(prev => ({
      ...prev!,
      errors: prev!.errors.map(error => ({ ...error, accepted: true, rejected: false }))
    }));
    setSelectedErrors(new Set(result.errors.map(e => e.id)));
    
    // Automatically apply all corrections when accepting all
    applyCorrections(result.errors);
  };

  const handleRejectAll = () => {
    if (!result) return;
    
    setResult(prev => ({
      ...prev!,
      errors: prev!.errors.map(error => ({ ...error, accepted: false, rejected: true }))
    }));
    setSelectedErrors(new Set());
  };

  const applyCorrections = (errorsToApply?: GrammarError[]) => {
    if (!result) return;

    // Use provided errors or get accepted errors from current result
    const acceptedErrors = errorsToApply || result.errors.filter(error => error.accepted);
    
    if (acceptedErrors.length === 0) {
      toast('No corrections selected to apply');
      return;
    }

    let correctedText = inputText;

    // Apply corrections in reverse order to maintain indices
    acceptedErrors
      .sort((a, b) => b.startIndex - a.startIndex)
      .forEach(error => {
        correctedText = 
          correctedText.slice(0, error.startIndex) + 
          error.suggestion + 
          correctedText.slice(error.endIndex);
      });

    // Update the input text with corrections
    setInputText(correctedText);
    
    // Clear the result to show the corrected text in the input
    setResult(null);
    setSelectedErrors(new Set());
    
    toast.success(t('messages.success.correctionsApplied'));
  };

  const getErrorTypeColor = (type: string) => {
    switch (type) {
      case 'grammar': return 'text-red-600 dark:text-red-400';
      case 'spelling': return 'text-orange-600 dark:text-orange-400';
      case 'style': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getErrorTypeBg = (type: string) => {
    switch (type) {
      case 'grammar': return 'bg-red-100 dark:bg-red-900/30';
      case 'spelling': return 'bg-orange-100 dark:bg-orange-900/30';
      case 'style': return 'bg-blue-100 dark:bg-blue-900/30';
      default: return 'bg-slate-100 dark:bg-slate-800/50';
    }
  };

  const renderTextWithHighlights = (text: string, errors: GrammarError[]) => {
    if (!errors.length) return text;

    const segments: Array<{ text: string; error?: GrammarError }> = [];
    let lastIndex = 0;

    errors
      .sort((a, b) => a.startIndex - b.startIndex)
      .forEach(error => {
        // Add text before error
        if (error.startIndex > lastIndex) {
          segments.push({ text: text.slice(lastIndex, error.startIndex) });
        }
        
        // Add error segment
        segments.push({ 
          text: text.slice(error.startIndex, error.endIndex), 
          error 
        });
        
        lastIndex = error.endIndex;
      });

    // Add remaining text
    if (lastIndex < text.length) {
      segments.push({ text: text.slice(lastIndex) });
    }

    return (
      <div className="leading-relaxed">
        {segments.map((segment, index) => (
          <span key={index}>
            {segment.error ? (
              <span
                className={`relative cursor-pointer px-1 rounded ${
                  segment.error.accepted 
                    ? 'bg-green-200 dark:bg-green-900/40 text-green-800 dark:text-green-200'
                    : segment.error.rejected
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    : 'bg-red-200 dark:bg-red-900/40 text-red-800 dark:text-red-200 underline decoration-wavy'
                }`}
                title={segment.error.explanation}
                onClick={() => {
                  if (segment.error!.accepted) {
                    handleRejectError(segment.error!.id);
                  } else {
                    handleAcceptError(segment.error!.id);
                  }
                }}
              >
                {segment.text}
              </span>
            ) : (
              segment.text
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-4">
          {t('grammar.title')}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          {t('grammar.subtitle')}
        </p>
      </motion.div>

      {/* Main Interface */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                {t('grammar.originalText')}
              </h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {inputText.length} {t('common.characters')}
              </span>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('grammar.placeholder')}
              className="w-full h-48 p-4 glass-input rounded-xl resize-none"
              disabled={isProcessing}
            />

            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="px-4 py-2 glass-button rounded-xl flex items-center space-x-2"
                  disabled={isProcessing}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t('common.reset')}</span>
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCheckGrammar}
                disabled={isProcessing || !inputText.trim()}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t('grammar.processing')}</span>
                  </>
                ) : (
                  <>
                    <BookCheck className="w-5 h-5" />
                    <span>{t('grammar.checkGrammarButton')}</span>
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
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                  {t('grammar.correctedText')}
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                      {result.errors.length === 0 ? t('grammar.noErrors') : `${result.errors.length} ${t('grammar.errorsFound')}`}
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
                {renderTextWithHighlights(inputText, result.errors)}
              </div>

              {result.errors.length > 0 && (
                <div className="flex items-center space-x-2 mb-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAcceptAll}
                    className="px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium flex items-center space-x-1"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{t('grammar.acceptAll')}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRejectAll}
                    className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium flex items-center space-x-1"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>{t('grammar.rejectAll')}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => applyCorrections()}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm font-medium flex items-center space-x-1"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{t('grammar.applyChanges')}</span>
                  </motion.button>
                </div>
              )}

              {result.improvements && result.improvements.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {t('grammar.suggestions')}
                  </h4>
                  <ul className="space-y-1">
                    {result.improvements.map((improvement: string, index: number) => (
                      <li key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-6 rounded-2xl h-64 flex items-center justify-center">
              <div className="text-center">
                <BookCheck className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">
                  {t('grammar.emptyState')}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Error Details */}
      {result && result.errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 rounded-2xl"
        >
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            {t('grammar.corrections')} ({result.errors.length})
          </h3>
          
          <div className="space-y-4">
            {result.errors.map((error, index) => (
              <motion.div
                key={error.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  error.accepted 
                    ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                    : error.rejected
                    ? 'border-slate-300 bg-slate-50 dark:bg-slate-800/50'
                    : 'border-red-300 bg-red-50 dark:bg-red-900/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getErrorTypeBg(error.type)} ${getErrorTypeColor(error.type)}`}>
                        {error.type === 'grammar' ? t('grammar.grammarErrors') : 
                         error.type === 'spelling' ? t('grammar.spellingErrors') : 
                         t('grammar.styleImprovements')}
                      </span>
                      {error.accepted && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                          Accepted
                        </span>
                      )}
                      {error.rejected && (
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full text-xs font-medium">
                          Rejected
                        </span>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Original:</h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300 bg-red-100 dark:bg-red-900/30 p-2 rounded">
                          "{error.original}"
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Suggestion:</h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300 bg-green-100 dark:bg-green-900/30 p-2 rounded">
                          "{error.suggestion}"
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {error.explanation}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAcceptError(error.id)}
                      className={`p-2 rounded-lg ${
                        error.accepted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                      }`}
                      title={t('grammar.accept')}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRejectError(error.id)}
                      className={`p-2 rounded-lg ${
                        error.rejected 
                          ? 'bg-red-500 text-white' 
                          : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                      }`}
                      title={t('grammar.reject')}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Grammar Comparison */}
      {result && (
        <GrammarComparison
          originalText={inputText}
          correctedText={result.correctedText}
          errors={result.errors}
          overallScore={result.overallScore}
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