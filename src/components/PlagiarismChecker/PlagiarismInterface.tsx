import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Download,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  FileText,
  TrendingUp,
  Eye,
  Loader2
} from 'lucide-react';
import { aiService } from '../../lib/aiService';
import { useTranslation } from '../../hooks/useTranslation';
import toast from 'react-hot-toast';
import { UsageChecker } from '../../lib/usageChecker';
import UsageLimitModal from '../Layout/UsageLimitModal';

interface PlagiarismResult {
  overallPercentage: number;
  status: 'low' | 'medium' | 'high';
  sources: Array<{
    id: string;
    url: string;
    title: string;
    similarity: number;
    matchedText: string;
  }>;
  highlightedText: Array<{
    text: string;
    isPlagiarized: boolean;
    sourceId?: string;
  }>;
  recommendations: string[];
  wordCount: number;
  uniqueWords: number;
}

export default function PlagiarismInterface() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [showUsageLimitModal, setShowUsageLimitModal] = useState(false);
  const { t, isRTL } = useTranslation();

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      toast.error(t('messages.error.validation'));
      return;
    }

    if (inputText.trim().split(' ').length < 100) {
      toast.error(t('messages.error.minimumWordsRequired').replace('{count}', '100'));
      return;
    }

    // Check usage limit before processing
    const canProceed = await UsageChecker.checkAndIncrementUsage('plagiarism');
    if (!canProceed) {
      setShowUsageLimitModal(true);
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const plagiarismData = await aiService.checkPlagiarism(inputText);
      
      const mockResult: PlagiarismResult = {
        overallPercentage: plagiarismData.overallPercentage || 0,
        status: plagiarismData.overallPercentage > 50 ? 'high' : plagiarismData.overallPercentage > 20 ? 'medium' : 'low',
        sources: plagiarismData.sources.map((source: any, index: number) => ({
          id: `source-${index}`,
          url: source.url,
          title: source.title,
          similarity: source.similarity,
          matchedText: source.matchedText
        })) || [],
        highlightedText: inputText.split(' ').map((word) => ({
          text: word,
          isPlagiarized: (plagiarismData.sources || []).some((s:any) => s.matchedText.includes(word)),
          sourceId: (plagiarismData.sources || []).find((s:any) => s.matchedText.includes(word))?.url,
        })),
        recommendations: [
          'Review the matched sources and add proper citations.',
          'Paraphrase sections with high similarity to ensure originality.',
          'Use quotation marks for any text taken directly from a source.',
          'Add your own analysis and insights to build upon the source material.',
          'Consider using a different structure or organization for your content.'
        ],
        wordCount: inputText.split(' ').length,
        uniqueWords: new Set(inputText.toLowerCase().split(' ')).size
      };

      setResult(mockResult);
      toast.success(t('messages.success.analyzed'));
    } catch (error: any) {
      toast.error(error.message || 'Failed to analyze text for plagiarism.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inputText);
    setCopied(true);
    toast.success(t('messages.success.copied'));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setInputText('');
    setResult(null);
    setSelectedSource(null);
  };

  const handleDownloadReport = () => {
    if (!result) return;

    const report = {
      analysis_date: new Date().toISOString(),
      overall_plagiarism: `${result.overallPercentage}%`,
      status: result.status,
      word_count: result.wordCount,
      unique_words: result.uniqueWords,
      sources_found: result.sources.length,
      sources: result.sources,
      recommendations: result.recommendations,
      original_text: inputText
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plagiarism-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(t('messages.success.exported'));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'high': return 'text-red-600 dark:text-red-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'low': return CheckCircle;
      case 'medium': return AlertTriangle;
      case 'high': return XCircle;
      default: return Shield;
    }
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage < 20) return 'from-green-500 to-emerald-600';
    if (percentage < 50) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className={`max-w-6xl mx-auto space-y-8 ${isRTL ? 'rtl' : ''}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent mb-4 mobile-friendly-heading">
          {t('plagiarism.title')}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mobile-friendly-text">
          {t('plagiarism.subtitle')}
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 md:p-6 rounded-2xl mobile-friendly-card"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Search className="w-5 h-5 text-red-600 dark:text-red-400" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mobile-friendly-heading">
            {t('plagiarism.textAnalysis')}
          </h3>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t('plagiarism.placeholder')}
          className="w-full h-48 p-4 glass-input rounded-xl resize-none mb-4"
          disabled={isAnalyzing}
          dir="auto"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400 mobile-friendly-text">
            <span>{inputText.length} {t('common.characters')}</span>
            <span>{inputText.trim().split(' ').filter(word => word.length > 0).length} {t('common.words')}</span>
            {inputText.trim().split(' ').filter(word => word.length > 0).length < 100 && (
              <span className="text-orange-600 dark:text-orange-400 flex items-center space-x-1">
                <AlertTriangle className="w-4 h-4" />
                <span>{t('usage.recommendedWords')}</span>
              </span>
            )}
          </div>

          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="px-4 py-2 glass-button rounded-xl flex items-center space-x-2 mobile-friendly-button"
              disabled={isAnalyzing}
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('common.reset')}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAnalyze}
              disabled={isAnalyzing || inputText.trim().split(' ').filter(word => word.length > 0).length < 100}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mobile-friendly-button"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t('plagiarism.analyzing')}</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>{t('plagiarism.analyze')}</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Results Section */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Overall Results */}
          <div className="glass-card p-4 md:p-6 rounded-2xl mobile-friendly-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mobile-friendly-heading">
                {t('plagiarism.plagiarismAnalysisResults')}
              </h3>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadReport}
                  className="p-2 glass-button rounded-xl"
                >
                  <Download className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Main Score */}
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
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - result.overallPercentage / 100)}`}
                      className={`${getStatusColor(result.status)} transition-all duration-1000`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-slate-800 dark:text-white">
                      {result.overallPercentage}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  {React.createElement(getStatusIcon(result.status), {
                    className: `w-5 h-5 ${getStatusColor(result.status)}`
                  })}
                  <span className={`font-semibold capitalize ${getStatusColor(result.status)}`}>
                    {result.status} Risk
                  </span>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 glass-card rounded-xl">
                <div className="text-xl md:text-2xl font-bold text-slate-600 dark:text-slate-400">
                  {result.sources.length}
                </div>
                <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{t('plagiarism.sourcesFound')}</div>
              </div>
              <div className="text-center p-3 glass-card rounded-xl">
                <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {result.wordCount}
                </div>
                <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{t('plagiarism.totalWords')}</div>
              </div>
              <div className="text-center p-3 glass-card rounded-xl">
                <div className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
                  {result.uniqueWords}
                </div>
                <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{t('plagiarism.uniqueWords')}</div>
              </div>
              <div className="text-center p-3 glass-card rounded-xl">
                <div className="text-xl md:text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.round((result.uniqueWords / result.wordCount) * 100)}%
                </div>
                <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{t('plagiarism.originality')}</div>
              </div>
            </div>
          </div>

          {/* Sources Section */}
          <div className="glass-card p-4 md:p-6 rounded-2xl mobile-friendly-card">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 mobile-friendly-heading">
              {t('plagiarism.matchedSources')}
            </h3>
            <div className="space-y-4">
              {result.sources.map((source, index) => (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    selectedSource === source.id
                      ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-red-300'
                  }`}
                  onClick={() => setSelectedSource(selectedSource === source.id ? null : source.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-slate-800 dark:text-white mobile-friendly-text">
                          {source.title}
                        </h4>
                        <div className="flex items-center space-x-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 rounded-full">
                          <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-400" />
                          <span className="text-sm font-medium text-red-700 dark:text-red-300 mobile-friendly-text">
                            {source.similarity}% {t('plagiarism.match')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 mb-3 mobile-friendly-text">
                        <ExternalLink className="w-4 h-4" />
                        <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {source.url}
                        </a>
                      </div>
                      <AnimatePresence>
                        {selectedSource === source.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                          >
                            <p className="text-sm text-slate-700 dark:text-slate-300 mobile-friendly-text">
                              <span className="font-medium">{t('plagiarism.matchedText')}:</span> {source.matchedText}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 glass-button rounded-lg"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Text Highlighting */}
          <div className="glass-card p-4 md:p-6 rounded-2xl mobile-friendly-card">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 mobile-friendly-heading">
              {t('plagiarism.contentAnalysisHighlighting')}
            </h3>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl leading-relaxed">
              {result.highlightedText.map((segment, index) => (
                <span
                  key={index}
                  className={`${
                    segment.isPlagiarized
                      ? 'bg-red-200 dark:bg-red-900/40 text-red-800 dark:text-red-200 px-1 rounded'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                  title={segment.isPlagiarized ? `${t('plagiarism.potentialMatch')} ${segment.sourceId}` : t('plagiarism.humanLike')}
                >
                  {segment.text}{' '}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center space-x-4 text-sm mobile-friendly-text">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-200 dark:bg-red-900/40 rounded"></div>
                <span className="text-slate-600 dark:text-slate-400">{t('plagiarism.potentialPlagiarism')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-slate-100 dark:bg-slate-700 rounded"></div>
                <span className="text-slate-600 dark:text-slate-400">{t('plagiarism.originalContent')}</span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="glass-card p-4 md:p-6 rounded-2xl mobile-friendly-card">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 mobile-friendly-heading">
              {t('plagiarism.recommendationsImprovement')}
            </h3>
            <ul className="space-y-3">
              {result.recommendations.map((recommendation, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
                >
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 mobile-friendly-text">{recommendation}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!result && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 md:p-12 rounded-2xl text-center mobile-friendly-card"
        >
          <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2 mobile-friendly-heading">
            {t('plagiarism.emptyState')}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mobile-friendly-text">
            {t('plagiarism.emptyStateDescription')}
          </p>
        </motion.div>
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