import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Search, Languages, Copy, Check, RotateCcw, Zap } from 'lucide-react';
import { deepseekService } from '../../lib/deepseek';
import toast from 'react-hot-toast';

interface DetectionResult {
  detectedLanguage: string;
  confidence: number;
  translatedText?: string;
  isEnglish: boolean;
}

export default function LanguageDetectionInterface() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const languageNames: { [key: string]: string } = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'ja': 'Japanese',
    'ko': 'Korean',
    'zh': 'Chinese',
    'ar': 'Arabic',
    'hi': 'Hindi',
    'th': 'Thai',
    'vi': 'Vietnamese',
    'nl': 'Dutch',
    'sv': 'Swedish',
    'da': 'Danish',
    'no': 'Norwegian',
    'fi': 'Finnish',
    'auto': 'Auto-detected'
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text to analyze');
      return;
    }

    setIsProcessing(true);
    try {
      // First, detect the language by attempting translation with auto-detect
      const translationResponse = await deepseekService.translate({
        text: inputText,
        sourceLanguage: 'auto',
        targetLanguage: 'en',
      });

      const detectedLang = translationResponse.detectedLanguage || 'unknown';
      const isEnglish = detectedLang.toLowerCase() === 'en' || detectedLang.toLowerCase() === 'english';

      const detectionResult: DetectionResult = {
        detectedLanguage: detectedLang,
        confidence: translationResponse.confidence || 95,
        isEnglish: isEnglish,
        translatedText: isEnglish ? undefined : translationResponse.translatedText,
      };

      setResult(detectionResult);
      toast.success('Language analysis completed!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to analyze text');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setInputText('');
    setResult(null);
  };

  const getLanguageName = (code: string) => {
    return languageNames[code.toLowerCase()] || code;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
          Language Detection & Translation
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Automatically detect the source language and get instant English translation if needed
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
            Text Analysis
          </h3>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter any text in any language for automatic detection and translation..."
          className="w-full h-32 p-4 glass-input rounded-xl resize-none mb-4"
          disabled={isProcessing}
        />

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {inputText.length} characters
          </span>

          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="px-4 py-2 glass-button rounded-xl flex items-center space-x-2"
              disabled={isProcessing}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAnalyze}
              disabled={isProcessing || !inputText.trim()}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Zap className="w-5 h-5 animate-pulse" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Globe className="w-5 h-5" />
                  <span>Analyze</span>
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
          {/* Language Detection Result */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                Language Detection
              </h3>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                  Source Language: {getLanguageName(result.detectedLanguage)}
                </span>
                <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-800/30 rounded-full">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    {result.confidence}% confidence
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${result.confidence}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Translation Result */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center space-x-2 mb-4">
              <Languages className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                Translation
              </h3>
            </div>

            {result.isEnglish ? (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">
                    Translation: No translation needed - Text is already in English
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    English Translation:
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCopy(result.translatedText || '')}
                    className="p-2 glass-button rounded-xl"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>
                
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                    {result.translatedText}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Comparison */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              Text Comparison
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Original */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">🌐</span>
                  <h4 className="font-medium text-slate-700 dark:text-slate-300">
                    Original ({getLanguageName(result.detectedLanguage)})
                  </h4>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-l-4 border-blue-300">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {inputText}
                  </p>
                </div>
              </div>

              {/* Translation */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">🇺🇸</span>
                  <h4 className="font-medium text-slate-700 dark:text-slate-300">
                    English
                  </h4>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-l-4 border-green-300">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {result.isEnglish ? inputText : result.translatedText}
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="text-center p-3 glass-card rounded-xl">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {inputText.split(/\s+/).length}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Original Words</div>
              </div>
              <div className="text-center p-3 glass-card rounded-xl">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {result.confidence}%
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Detection Confidence</div>
              </div>
              <div className="text-center p-3 glass-card rounded-xl">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {result.isEnglish ? 'N/A' : (result.translatedText?.split(/\s+/).length || 0)}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Translated Words</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!result && !isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-12 rounded-2xl text-center"
        >
          <Globe className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Ready for Language Analysis
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Enter any text in any language above, and I'll automatically detect the source language 
            and provide an English translation if needed.
          </p>
        </motion.div>
      )}
    </div>
  );
}