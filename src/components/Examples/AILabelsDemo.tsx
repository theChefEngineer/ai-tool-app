import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AITechnologyLabel, 
  AICapabilityBadge, 
  AIProcessingIndicator,
  AITechnologyBanner,
  AIProcessingLabel,
  AIPerformanceMetrics
} from '../Labels';
import { FileText, Send, Loader2 } from 'lucide-react';

export default function AILabelsDemo() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<'analyzing' | 'processing' | 'generating' | 'optimizing' | 'finalizing'>('analyzing');
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleProcess = () => {
    setIsProcessing(true);
    setShowResults(false);
    setProgress(0);
    setProcessingStage('analyzing');
    
    // Simulate processing stages
    const simulateProcessing = () => {
      const stages: Array<'analyzing' | 'processing' | 'generating' | 'optimizing' | 'finalizing'> = [
        'analyzing', 'processing', 'generating', 'optimizing', 'finalizing'
      ];
      
      let currentStage = 0;
      let currentProgress = 0;
      
      const interval = setInterval(() => {
        currentProgress += 5;
        setProgress(currentProgress);
        
        if (currentProgress >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setShowResults(true);
          return;
        }
        
        if (currentProgress % 20 === 0 && currentStage < stages.length - 1) {
          currentStage++;
          setProcessingStage(stages[currentStage]);
        }
      }, 300);
    };
    
    simulateProcessing();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
          AI Technology Demo
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Experience our advanced AI technology for text analysis and summarization.
        </p>
      </motion.div>

      {/* Technology Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AITechnologyBanner type="analysis" />
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 rounded-2xl"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
            Text Analysis Input
          </h3>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <AITechnologyLabel type="analysis" />
          <AITechnologyLabel type="processing" />
          <AICapabilityBadge capability="Semantic Analysis" score={98} />
        </div>
        
        <textarea
          placeholder="Enter your text here for advanced AI analysis..."
          className="w-full h-32 p-4 glass-input rounded-xl resize-none mb-4"
          disabled={isProcessing}
        />
        
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleProcess}
            disabled={isProcessing}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold flex items-center space-x-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Analyze Text</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Processing Section */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 rounded-2xl"
          >
            <AIProcessingLabel 
              stage={processingStage} 
              progress={progress} 
              variant="banner" 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <AIPerformanceMetrics 
              metrics={{ 
                accuracy: 97.5, 
                speed: 95.2, 
                quality: 96.8, 
                efficiency: 98.3 
              }}
              variant="banner"
            />
            
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <AITechnologyLabel type="summarization" />
                <AICapabilityBadge capability="Context Awareness" score={96} />
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-4">
                <p className="text-slate-700 dark:text-slate-300">
                  This is a demonstration of how our AI technology labels can be integrated into your application's interface. The labels highlight our advanced capabilities in text analysis and summarization, emphasizing the cutting-edge nature of our technology without referencing specific models.
                </p>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <AIProcessingLabel stage="finalizing" showProgress={false} />
                </div>
                
                <div className="flex items-center space-x-2">
                  <AICapabilityBadge capability="High Precision" size="sm" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}