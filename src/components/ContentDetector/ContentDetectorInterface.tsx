import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  User, 
  Search, 
  Wand2,
  Copy,
  Check,
  RotateCcw,
  Download,
  TrendingUp,
  TrendingDown,
  Brain,
  Zap,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle,
  Settings,
  Sliders
} from 'lucide-react';
import { deepseekService } from '../../lib/deepseek';
import { useTranslation } from '../../hooks/useTranslation';
import toast from 'react-hot-toast';

interface AIDetectionResult {
  aiProbability: number;
  confidence: number;
  status: 'human' | 'mixed' | 'ai';
  analysis: {
    writingStyle: number;
    patternRecognition: number;
    vocabularyDiversity: number;
    sentenceStructure: number;
  };
  highlightedSegments: Array<{
    text: string;
    isAI: boolean;
    confidence: number;
  }>;
}

interface HumanizedResult {
  humanizedText: string;
  improvements: string[];
  humanScore: number;
  changes: Array<{
    original: string;
    humanized: string;
    reason: string;
  }>;
}

export default function ContentDetectorInterface() {
  const [inputText, setInputText] = useState('');
  const [detectionResult, setDetectionResult] = useState<AIDetectionResult | null>(null);
  const [humanizedResult, setHumanizedResult] = useState<HumanizedResult | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [copied, setCopied] = useState<'original' | 'humanized' | null>(null);
  const [activeTab, setActiveTab] = useState<'detection' | 'humanized'>('detection');
  const [humanizeSettings, setHumanizeSettings] = useState({
    creativityLevel: 'medium' as 'low' | 'medium' | 'high',
    preserveMeaning: true,
  });
  const [showSettings, setShowSettings] = useState(false);
  const { t } = useTranslation();

  const handleDetectAI = async () => {
    if (!inputText.trim()) {
      toast.error(t('messages.error.validation'));
      return;
    }

    if (inputText.trim().split(' ').length < 50) {
      toast.error(t('messages.error.minimumWordsRequired').replace('{count}', '50'));
      return;
    }

    setIsDetecting(true);
    try {
      const result = await deepseekService.detectAI({ text: inputText });
      setDetectionResult(result);
      setActiveTab('detection');
      toast.success('AI detection analysis completed!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to analyze text');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleHumanizeText = async () => {
    if (!inputText.trim()) {
      toast.error(t('messages.error.validation'));
      return;
    }

    setIsHumanizing(true);
    try {
      const result = await deepseekService.humanizeText({
        text: inputText,
        creativityLevel: humanizeSettings.creativityLevel,
        preserveMeaning: humanizeSettings.preserveMeaning,
      });

      setHumanizedResult(result);
      setActiveTab('humanized');
      toast.success('Text humanized successfully with DeepSeek R1!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to humanize text');
    } finally {
      setIsHumanizing(false);
    }
  };

  const handleCopy = async (type: 'original' | 'humanized') => {
    const textToCopy = type === 'original' ? inputText : humanizedResult?.humanizedText || '';
    await navigator.clipboard.writeText(textToCopy);
    setCopied(type);
    toast.success(t('messages.success.copied'));
    setTimeout(() => setCopied(null), 2000);
  };

  const handleReset = () => {
    setInputText('');
    setDetectionResult(null);
    setHumanizedResult(null);
    setActiveTab('detection');
  };

  const handleDownloadReport = () => {
    if (!detectionResult && !humanizedResult) return;

    const report = {
      analysis_date: new Date().toISOString(),
      original_text: inputText,
      ai_detection: detectionResult ? {
        ai_probability: `${detectionResult.aiProbability}%`,
        confidence: `${detectionResult.confidence}%`,
        status: detectionResult.status,
        detailed_analysis: detectionResult.analysis,
      } : null,
      humanization: humanizedResult ? {
        humanized_text: humanizedResult.humanizedText,
        human_score: `${humanizedResult.humanScore}%`,
        improvements: humanizedResult.improvements,
        changes: humanizedResult.changes,
        settings: humanizeSettings,
      } : null,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-content-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(t('messages.success.exported'));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'human': return 'text-green-600 dark:text-green-400';
      case 'mixed': return 'text-yellow-600 dark:text-yellow-400';
      case 'ai': return 'text-red-600 dark:text-red-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'human': return User;
      case 'mixed': return Brain;
      case 'ai': return Bot;
      default: return Search;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'human': return 'Human Written';
      case 'mixed': return 'Mixed Content';
      case 'ai': return 'AI Generated';
      default: return 'Unknown';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
          {t('contentDetector.title')}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          {t('contentDetector.subtitle')}
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 rounded-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
              {t('contentDetector.contentAnalysis')}
            </h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 glass-button rounded-xl"
          >
            <Settings className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Humanization Settings */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/30"
            >
              <div className="flex items-center space-x-2 mb-3">
                <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h4 className="font-medium text-blue-800 dark:text-blue-200">{t('contentDetector.humanizationSettings')}</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                    {t('contentDetector.creativityLevel')}
                  </label>
                  <select
                    value={humanizeSettings.creativityLevel}
                    onChange={(e) => setHumanizeSettings({
                      ...humanizeSettings,
                      creativityLevel: e.target.value as 'low' | 'medium' | 'high'
                    })}
                    className="w-full p-2 glass-input rounded-xl text-sm"
                  >
                    <option value="low">Low - Minimal changes</option>
                    <option value="medium">Medium - Balanced approach</option>
                    <option value="high">High - Extensive humanization</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="preserveMeaning"
                    checked={humanizeSettings.preserveMeaning}
                    onChange={(e) => setHumanizeSettings({
                      ...humanizeSettings,
                      preserveMeaning: e.target.checked
                    })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="preserveMeaning" className="text-sm text-blue-700 dark:text-blue-300">
                    {t('contentDetector.preserveMeaning')}
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t('contentDetector.placeholder')}
          className="w-full h-48 p-4 glass-input rounded-xl resize-none mb-4"
          disabled={isDetecting || isHumanizing}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
            <span>{inputText.length} {t('common.characters')}</span>
            <span>{inputText.trim().split(' ').filter(word => word.length > 0).length} {t('common.words')}</span>
            {inputText.trim().split(' ').filter(word => word.length > 0).length < 50 && (
              <span className="text-orange-600 dark:text-orange-400 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{t('usage.minimumWords')}</span>
              </span>
            )}
          </div>

          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="px-4 py-2 glass-button rounded-xl flex items-center space-x-2"
              disabled={isDetecting || isHumanizing}
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('common.reset')}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDetectAI}
              disabled={isDetecting || isHumanizing || !inputText.trim()}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDetecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t('contentDetector.analyzing')}</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Detect AI</span>
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleHumanizeText}
              disabled={isDetecting || isHumanizing || !inputText.trim()}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isHumanizing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t('contentDetector.humanizing')}</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>{t('contentDetector.humanizeButton')}</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Results Section */}
      {(detectionResult || humanizedResult) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Tab Navigation */}
          <div className="glass-card p-2 rounded-2xl">
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('detection')}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === 'detection'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>AI Detection Results</span>
                  {detectionResult && (
                    <span className="text-xs px-2 py-1 bg-white/20 rounded-full">
                      {detectionResult.aiProbability}%
                    </span>
                  )}
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('humanized')}
                disabled={!humanizedResult}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeTab === 'humanized'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Wand2 className="w-5 h-5" />
                  <span>{t('contentDetector.humanizedVersion')}</span>
                  {humanizedResult && (
                    <span className="text-xs px-2 py-1 bg-white/20 rounded-full">
                      {humanizedResult.humanScore}% Human
                    </span>
                  )}
                  {!humanizedResult && (
                    <span className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">
                      Click Humanize
                    </span>
                  )}
                </div>
              </motion.button>
            </div>
          </div>

          {/* Detection Results Tab */}
          <AnimatePresence mode="wait">
            {activeTab === 'detection' && detectionResult && (
              <motion.div
                key="detection"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Main Detection Results */}
                <div className="glass-card p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                      {t('contentDetector.aiDetectionResults')}
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDownloadReport}
                      className="p-2 glass-button rounded-xl"
                    >
                      <Download className="w-4 h-4" />
                    </motion.button>
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
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - detectionResult.aiProbability / 100)}`}
                            className={`${getStatusColor(detectionResult.status)} transition-all duration-1000`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-bold text-slate-800 dark:text-white">
                            {detectionResult.aiProbability}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        {React.createElement(getStatusIcon(detectionResult.status), {
                          className: `w-5 h-5 ${getStatusColor(detectionResult.status)}`
                        })}
                        <span className={`font-semibold ${getStatusColor(detectionResult.status)}`}>
                          {getStatusLabel(detectionResult.status)}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        {t('contentDetector.confidence')}: {detectionResult.confidence}%
                      </div>
                    </div>
                  </div>

                  {/* Detailed Analysis */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 glass-card rounded-xl">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        {detectionResult.analysis.writingStyle}%
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">Writing Style</div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${detectionResult.analysis.writingStyle}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-center p-4 glass-card rounded-xl">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                        {detectionResult.analysis.patternRecognition}%
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">Pattern Recognition</div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${detectionResult.analysis.patternRecognition}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-center p-4 glass-card rounded-xl">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                        {detectionResult.analysis.vocabularyDiversity}%
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">Vocabulary Diversity</div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${detectionResult.analysis.vocabularyDiversity}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-center p-4 glass-card rounded-xl">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                        {detectionResult.analysis.sentenceStructure}%
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">Sentence Structure</div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${detectionResult.analysis.sentenceStructure}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text Highlighting */}
                <div className="glass-card p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                      Content Analysis with Highlighting
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCopy('original')}
                      className="p-2 glass-button rounded-xl"
                    >
                      {copied === 'original' ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </motion.button>
                  </div>
                  
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl leading-relaxed mb-4">
                    {detectionResult.highlightedSegments.map((segment, index) => (
                      <span
                        key={index}
                        className={`${
                          segment.isAI
                            ? 'bg-red-200 dark:bg-red-900/40 text-red-800 dark:text-red-200 px-1 rounded'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                        title={segment.isAI ? `AI-generated (${segment.confidence}% confidence)` : 'Human-like'}
                      >
                        {segment.text}{' '}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-200 dark:bg-red-900/40 rounded"></div>
                      <span className="text-slate-600 dark:text-slate-400">AI-generated content</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-slate-100 dark:bg-slate-700 rounded"></div>
                      <span className="text-slate-600 dark:text-slate-400">Human-like content</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Humanized Results Tab */}
            {activeTab === 'humanized' && (
              <motion.div
                key="humanized"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {humanizedResult ? (
                  <>
                    {/* Humanized Text */}
                    <div className="glass-card p-6 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                          Humanized Version (DeepSeek R1)
                        </h3>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-medium text-green-700 dark:text-green-300">
                              {humanizedResult.humanScore}% Human-like
                            </span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCopy('humanized')}
                            className="p-2 glass-button rounded-xl"
                          >
                            {copied === 'humanized' ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </motion.button>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border-l-4 border-green-400">
                        <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                          {humanizedResult.humanizedText}
                        </p>
                      </div>
                    </div>

                    {/* Improvements */}
                    <div className="glass-card p-6 rounded-2xl">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                        {t('contentDetector.improvements')}
                      </h3>
                      <ul className="space-y-3">
                        {humanizedResult.improvements.map((improvement, index) => (
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
                            <span className="text-slate-700 dark:text-slate-300">{improvement}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Changes */}
                    {humanizedResult.changes.length > 0 && (
                      <div className="glass-card p-6 rounded-2xl">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                          {t('contentDetector.keyChanges')}
                        </h3>
                        <div className="space-y-4">
                          {humanizedResult.changes.map((change, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                            >
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">Original:</h4>
                                  <p className="text-sm text-slate-700 dark:text-slate-300 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                                    "{change.original}"
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">Humanized:</h4>
                                  <p className="text-sm text-slate-700 dark:text-slate-300 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                                    "{change.humanized}"
                                  </p>
                                </div>
                              </div>
                              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                  <span className="font-medium">Reason:</span> {change.reason}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Comparison */}
                    <div className="glass-card p-6 rounded-2xl">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
                        Before & After Comparison
                      </h3>

                      <div className="grid lg:grid-cols-2 gap-6">
                        {/* Original */}
                        <div>
                          <div className="flex items-center space-x-2 mb-3">
                            <Bot className="w-5 h-5 text-red-500" />
                            <h4 className="font-medium text-slate-700 dark:text-slate-300">
                              Original {detectionResult && `(AI: ${detectionResult.aiProbability}%)`}
                            </h4>
                          </div>
                          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border-l-4 border-red-300 max-h-48 overflow-y-auto">
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                              {inputText}
                            </p>
                          </div>
                        </div>

                        {/* Humanized */}
                        <div>
                          <div className="flex items-center space-x-2 mb-3">
                            <User className="w-5 h-5 text-green-500" />
                            <h4 className="font-medium text-slate-700 dark:text-slate-300">
                              Humanized ({humanizedResult.humanScore}% Human-like)
                            </h4>
                          </div>
                          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border-l-4 border-green-300 max-h-48 overflow-y-auto">
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                              {humanizedResult.humanizedText}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Statistics */}
                      <div className="mt-6 grid grid-cols-3 gap-4">
                        <div className="text-center p-3 glass-card rounded-xl">
                          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {detectionResult?.aiProbability || 'N/A'}%
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Original AI Score</div>
                        </div>
                        <div className="text-center p-3 glass-card rounded-xl">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {humanizedResult.humanScore}%
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Humanized Score</div>
                        </div>
                        <div className="text-center p-3 glass-card rounded-xl">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {detectionResult ? Math.abs((detectionResult.aiProbability) - humanizedResult.humanScore) : humanizedResult.humanScore}%
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Improvement</div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="glass-card p-12 rounded-2xl text-center">
                    <Wand2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Ready to Humanize with DeepSeek R1
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                      Click the "Humanize with R1" button to transform your content into natural, 
                      human-like text while preserving the original meaning using advanced AI.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleHumanizeText}
                      disabled={isHumanizing || !inputText.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
                    >
                      {isHumanizing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>{t('contentDetector.humanizing')}</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-5 h-5" />
                          <span>{t('contentDetector.humanizeButton')}</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Empty State */}
      {!detectionResult && !humanizedResult && !isDetecting && !isHumanizing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-12 rounded-2xl text-center"
        >
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Bot className="w-16 h-16 text-blue-400" />
            <Zap className="w-8 h-8 text-yellow-400" />
            <User className="w-16 h-16 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
            AI Content Analysis & Humanization
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
            Enter your text above to detect AI-generated content and transform it into 
            natural, human-like writing with DeepSeek R1 technology.
          </p>
          <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            {t('contentDetector.poweredBy')}
          </div>
        </motion.div>
      )}
    </div>
  );
}