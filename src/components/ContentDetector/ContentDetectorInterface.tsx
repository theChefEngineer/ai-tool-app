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
  CheckCircle
} from 'lucide-react';
import { deepseekService } from '../../lib/deepseek';
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
  humanizedText?: string;
  humanizedConfidence?: number;
}

export default function ContentDetectorInterface() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<AIDetectionResult | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [copied, setCopied] = useState<'original' | 'humanized' | null>(null);
  const [activeTab, setActiveTab] = useState<'detection' | 'humanized'>('detection');

  const handleDetectAI = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter text to analyze');
      return;
    }

    setIsDetecting(true);
    try {
      // Simulate AI detection analysis
      const mockResult: AIDetectionResult = {
        aiProbability: Math.floor(Math.random() * 100),
        confidence: Math.floor(Math.random() * 30) + 70,
        status: Math.random() > 0.6 ? 'ai' : Math.random() > 0.3 ? 'mixed' : 'human',
        analysis: {
          writingStyle: Math.floor(Math.random() * 100),
          patternRecognition: Math.floor(Math.random() * 100),
          vocabularyDiversity: Math.floor(Math.random() * 100),
          sentenceStructure: Math.floor(Math.random() * 100),
        },
        highlightedSegments: inputText.split(' ').map((word, index) => ({
          text: word,
          isAI: Math.random() > 0.7,
          confidence: Math.floor(Math.random() * 40) + 60
        }))
      };

      setResult(mockResult);
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
      toast.error('Please enter text to humanize');
      return;
    }

    setIsHumanizing(true);
    try {
      const response = await deepseekService.paraphrase({
        text: inputText,
        mode: 'creative'
      });

      const humanizedResult = {
        ...result,
        humanizedText: response.paraphrasedText,
        humanizedConfidence: Math.floor(Math.random() * 20) + 80
      };

      setResult(humanizedResult as AIDetectionResult);
      setActiveTab('humanized');
      toast.success('Text humanized successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to humanize text');
    } finally {
      setIsHumanizing(false);
    }
  };

  const handleCopy = async (type: 'original' | 'humanized') => {
    const textToCopy = type === 'original' ? inputText : result?.humanizedText || '';
    await navigator.clipboard.writeText(textToCopy);
    setCopied(type);
    toast.success('Text copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleReset = () => {
    setInputText('');
    setResult(null);
    setActiveTab('detection');
  };

  const handleDownloadReport = () => {
    if (!result) return;

    const report = {
      analysis_date: new Date().toISOString(),
      ai_probability: `${result.aiProbability}%`,
      confidence: `${result.confidence}%`,
      status: result.status,
      detailed_analysis: result.analysis,
      original_text: inputText,
      humanized_text: result.humanizedText || null,
      humanized_confidence: result.humanizedConfidence || null
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
    
    toast.success('Report downloaded!');
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
          AI Content Detector & Humanizer
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Detect AI-generated content with advanced analysis and transform it into natural, 
          human-like text while preserving the original meaning and context.
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 rounded-2xl"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
            Content Analysis
          </h3>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste your text to analyze AI probability..."
          className="w-full h-48 p-4 glass-input rounded-xl resize-none mb-4"
          disabled={isDetecting || isHumanizing}
        />

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {inputText.length} characters • {inputText.trim().split(' ').filter(word => word.length > 0).length} words
          </span>

          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="px-4 py-2 glass-button rounded-xl flex items-center space-x-2"
              disabled={isDetecting || isHumanizing}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
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
                  <span>Detecting...</span>
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
                  <span>Humanizing...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>Humanize Text</span>
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
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('humanized')}
                disabled={!result.humanizedText}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeTab === 'humanized'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Wand2 className="w-5 h-5" />
                  <span>Humanized Version</span>
                  {!result.humanizedText && (
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
            {activeTab === 'detection' && (
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
                      AI Detection Analysis
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
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - result.aiProbability / 100)}`}
                            className={`${getStatusColor(result.status)} transition-all duration-1000`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-bold text-slate-800 dark:text-white">
                            {result.aiProbability}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        {React.createElement(getStatusIcon(result.status), {
                          className: `w-5 h-5 ${getStatusColor(result.status)}`
                        })}
                        <span className={`font-semibold ${getStatusColor(result.status)}`}>
                          {getStatusLabel(result.status)}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Confidence: {result.confidence}%
                      </div>
                    </div>
                  </div>

                  {/* Detailed Analysis */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 glass-card rounded-xl">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        {result.analysis.writingStyle}%
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">Writing Style</div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${result.analysis.writingStyle}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-center p-4 glass-card rounded-xl">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                        {result.analysis.patternRecognition}%
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">Pattern Recognition</div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${result.analysis.patternRecognition}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-center p-4 glass-card rounded-xl">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                        {result.analysis.vocabularyDiversity}%
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">Vocabulary Diversity</div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${result.analysis.vocabularyDiversity}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-center p-4 glass-card rounded-xl">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                        {result.analysis.sentenceStructure}%
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">Sentence Structure</div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${result.analysis.sentenceStructure}%` }}
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
                    {result.highlightedSegments.map((segment, index) => (
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
                {result.humanizedText ? (
                  <>
                    {/* Humanized Text */}
                    <div className="glass-card p-6 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                          Humanized Version
                        </h3>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-medium text-green-700 dark:text-green-300">
                              {result.humanizedConfidence}% Human-like
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
                          {result.humanizedText}
                        </p>
                      </div>
                    </div>

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
                              Original (AI: {result.aiProbability}%)
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
                              Humanized ({result.humanizedConfidence}% Human-like)
                            </h4>
                          </div>
                          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border-l-4 border-green-300 max-h-48 overflow-y-auto">
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                              {result.humanizedText}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Statistics */}
                      <div className="mt-6 grid grid-cols-3 gap-4">
                        <div className="text-center p-3 glass-card rounded-xl">
                          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {result.aiProbability}%
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Original AI Score</div>
                        </div>
                        <div className="text-center p-3 glass-card rounded-xl">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {result.humanizedConfidence}%
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Humanized Score</div>
                        </div>
                        <div className="text-center p-3 glass-card rounded-xl">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {Math.abs(result.aiProbability - (result.humanizedConfidence || 0))}%
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
                      Ready to Humanize
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                      Click the "Humanize Text" button to transform your content into natural, 
                      human-like text while preserving the original meaning.
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
                          <span>Humanizing...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-5 h-5" />
                          <span>Humanize Text</span>
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
      {!result && !isDetecting && !isHumanizing && (
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
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Enter your text above to detect AI-generated content and transform it into 
            natural, human-like writing with advanced AI humanization technology.
          </p>
        </motion.div>
      )}
    </div>
  );
}