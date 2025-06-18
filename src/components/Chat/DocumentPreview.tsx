import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  X, 
  Clock, 
  BookOpen, 
  Wand2, 
  BookCheck, 
  Languages 
} from 'lucide-react';
import { DocumentProcessor } from '../../lib/documentProcessor';
import toast from 'react-hot-toast';

interface DocumentPreviewProps {
  document: {
    id: string;
    name: string;
    size: string;
    content: string;
    metadata: {
      wordCount: number;
      characterCount: number;
      language?: string;
      pageCount?: number;
    };
  };
  onClose: () => void;
  onProcess: (type: 'summarize' | 'paraphrase' | 'grammar' | 'translate') => void;
}

export default function DocumentPreview({ document, onClose, onProcess }: DocumentPreviewProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(document.content);
    setCopied(true);
    toast.success('Document content copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([document.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = document.name.replace(/\.\w+$/, '.txt');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Document downloaded successfully');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-card max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                {document.name}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                <span>{document.size}</span>
                <span>•</span>
                <span>{document.metadata.wordCount} words</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{DocumentProcessor.calculateReadingTime(document.metadata.wordCount)} min read</span>
                </div>
                {document.metadata.language && (
                  <>
                    <span>•</span>
                    <span>{document.metadata.language.toUpperCase()}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 glass-button rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Content */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <pre className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans">
              {document.content}
            </pre>
          </div>
        </div>

        {/* Processing Tools */}
        <div className="p-6 border-t border-white/10">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Process Document
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onProcess('summarize')}
              className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl text-emerald-700 dark:text-emerald-300 text-left"
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold">Summarize</span>
              </div>
              <p className="text-xs opacity-80">Create comprehensive summary</p>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onProcess('paraphrase')}
              className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/30 rounded-xl text-indigo-700 dark:text-indigo-300 text-left"
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600">
                  <Wand2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold">Paraphrase</span>
              </div>
              <p className="text-xs opacity-80">Rewrite while preserving meaning</p>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onProcess('grammar')}
              className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-xl text-green-700 dark:text-green-300 text-left"
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600">
                  <BookCheck className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold">Grammar Check</span>
              </div>
              <p className="text-xs opacity-80">Fix grammar and style issues</p>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onProcess('translate')}
              className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-xl text-blue-700 dark:text-blue-300 text-left"
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600">
                  <Languages className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold">Translate</span>
              </div>
              <p className="text-xs opacity-80">Translate to other languages</p>
            </motion.button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="px-4 py-2 glass-button rounded-xl flex items-center space-x-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Text</span>
                </>
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="px-4 py-2 glass-button rounded-xl flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}