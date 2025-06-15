import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Copy, Check, RotateCcw, Wand2 } from 'lucide-react';
import { useAppStore, type ParaphraseMode } from '../../store/appStore';
import { deepseekService } from '../../lib/deepseek';
import toast from 'react-hot-toast';
import ModeSelector from './ModeSelector';
import TextComparison from './TextComparison';

export default function ParaphraseInterface() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  
  const { currentMode, isProcessing, setProcessing, addToHistory } = useAppStore();

  const handleParaphrase = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text to paraphrase');
      return;
    }

    setProcessing(true);
    try {
      const response = await deepseekService.paraphrase({
        text: inputText,
        mode: currentMode,
      });
      
      setResult(response);
      addToHistory(response);
      toast.success('Text paraphrased successfully!');
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
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setInputText('');
    setResult(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
          AI-Powered Paraphrasing
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Transform your text with advanced AI. Choose from multiple writing styles and get instant, 
          high-quality paraphrasing with detailed improvements.
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
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                Original Text
              </h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {inputText.length} characters
              </span>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your text here to get started with AI-powered paraphrasing..."
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
                  <span>Reset</span>
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleParaphrase}
                disabled={isProcessing || !inputText.trim()}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    <span>Paraphrase</span>
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
                  Paraphrased Text
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                      Score: {result.readabilityScore}/10
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
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                  {result.paraphrasedText}
                </p>
              </div>

              {result.improvements && result.improvements.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Key Improvements:
                  </h4>
                  <ul className="space-y-1">
                    {result.improvements.map((improvement: string, index: number) => (
                      <li key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
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
                <Wand2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">
                  Your paraphrased text will appear here
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
    </div>
  );
}