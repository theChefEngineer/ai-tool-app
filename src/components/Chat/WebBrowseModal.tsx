import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Search, 
  X, 
  Loader2, 
  ExternalLink, 
  Copy, 
  Check, 
  Clock, 
  Download 
} from 'lucide-react';
import { WebBrowser, type WebBrowsingResult } from '../../lib/webBrowser';
import toast from 'react-hot-toast';

interface WebBrowseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBrowse: (result: WebBrowsingResult) => void;
}

export default function WebBrowseModal({ isOpen, onClose, onBrowse }: WebBrowseModalProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WebBrowsingResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBrowse = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const browseResult = await WebBrowser.browseUrl(url);
      setResult(browseResult);
    } catch (error: any) {
      setError(error.message || 'Failed to browse URL');
      toast.error(error.message || 'Failed to browse URL');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    
    await navigator.clipboard.writeText(result.content);
    setCopied(true);
    toast.success('Content copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    
    const blob = new Blob([result.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Content downloaded successfully');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleBrowse();
  };

  const handleUseContent = () => {
    if (!result) return;
    onBrowse(result);
    onClose();
  };

  if (!isOpen) return null;

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
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              Web Browser
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 glass-button rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* URL Input */}
        <div className="p-6 border-b border-white/10">
          <form onSubmit={handleSubmit}>
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-4 py-3 glass-input rounded-xl"
                  disabled={isLoading}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading || !url.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-semibold flex items-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Browse</span>
                  </>
                )}
              </motion.button>
            </div>
            {error && (
              <div className="mt-2 flex items-center space-x-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </form>
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
              <p className="text-slate-600 dark:text-slate-400">Loading web content...</p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">
                    {result.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
                    <a 
                      href={result.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 hover:underline"
                    >
                      <span className="truncate max-w-md">{result.url}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{result.metadata.readingTime} min read</span>
                  </div>
                  <span>{result.metadata.wordCount} words</span>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {result.content}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Globe className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Enter a URL to browse
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md">
                Browse any website and use its content in your conversation with the AI assistant.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {result && (
          <div className="p-6 border-t border-white/10 flex justify-end space-x-3">
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
                  <span>Copy</span>
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
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUseContent}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-semibold flex items-center space-x-2"
            >
              <Globe className="w-4 h-4" />
              <span>Use in Chat</span>
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}