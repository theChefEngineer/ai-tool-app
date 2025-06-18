import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  X, 
  Loader2, 
  ExternalLink, 
  Globe, 
  ArrowRight 
} from 'lucide-react';
import { WebBrowser, type WebSearchResult } from '../../lib/webBrowser';
import toast from 'react-hot-toast';

interface WebSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (results: WebSearchResult[], query: string) => void;
}

export default function WebSearchModal({ isOpen, onClose, onSearch }: WebSearchModalProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<WebSearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const searchResults = await WebBrowser.searchWeb(query, 5);
      setResults(searchResults);
    } catch (error: any) {
      setError(error.message || 'Failed to search web');
      toast.error(error.message || 'Failed to search web');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseResults = () => {
    if (results.length === 0) return;
    onSearch(results, query);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
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
              <Search className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              Web Search
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 glass-button rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6 border-b border-white/10">
          <form onSubmit={handleSubmit}>
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your search query"
                  className="w-full pl-10 pr-4 py-3 glass-input rounded-xl"
                  disabled={isLoading}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading || !query.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-semibold flex items-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Search</span>
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

        {/* Results Area */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
              <p className="text-slate-600 dark:text-slate-400">Searching the web...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-6">
              {results.map((result, index) => (
                <div 
                  key={index}
                  className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                  >
                    {result.title}
                    <ExternalLink className="w-3 h-3 ml-1 inline-block" />
                  </a>
                  <div className="text-xs text-blue-500 dark:text-blue-300 truncate mt-1 mb-2">
                    {result.url}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {result.snippet}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Search the web
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md">
                Enter a search query to find information from across the web and use it in your conversation.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {results.length > 0 && (
          <div className="p-6 border-t border-white/10 flex justify-end space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUseResults}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-semibold flex items-center space-x-2"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Use Results in Chat</span>
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}