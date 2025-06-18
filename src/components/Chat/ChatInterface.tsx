import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Copy, 
  Check, 
  RotateCcw, 
  Sparkles,
  Loader2,
  Trash2,
  Download,
  FileText,
  Upload,
  Link,
  Globe,
  Search,
  ExternalLink,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  FileIcon,
  Paperclip
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  attachments?: Attachment[];
  webContent?: WebContent;
}

interface Attachment {
  id: string;
  type: 'document' | 'image';
  name: string;
  size: string;
  content?: string;
  metadata?: any;
}

interface WebContent {
  type: 'search' | 'browse';
  query?: string;
  url?: string;
  title?: string;
  results?: any[];
  content?: string;
  metadata?: any;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [isProcessingWeb, setIsProcessingWeb] = useState(false);
  const [webUrl, setWebUrl] = useState('');
  const [webSearchQuery, setWebSearchQuery] = useState('');
  const [showWebInput, setShowWebInput] = useState(false);
  const [showWebSearch, setShowWebSearch] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t, isRTL } = useTranslation();

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: '1',
        content: t('chat.welcomeMessage'),
        role: 'assistant',
        timestamp: new Date(),
      }
    ]);
  }, [t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if ((!inputMessage.trim() && !webUrl && !webSearchQuery) || isTyping) return;

    let userMessage: Message;

    // Handle web browsing
    if (webUrl) {
      setIsProcessingWeb(true);
      try {
        // Simulate web browsing
        const result = {
          url: webUrl,
          title: `Content from ${webUrl}`,
          content: `This is simulated content from ${webUrl}. In a real implementation, this would contain the actual content from the webpage.`,
          metadata: {
            wordCount: 100,
            readingTime: 1,
            language: 'en'
          }
        };
        
        userMessage = {
          id: crypto.randomUUID(),
          content: `Please analyze this web page: ${webUrl}`,
          role: 'user',
          timestamp: new Date(),
          webContent: {
            type: 'browse',
            url: result.url,
            title: result.title,
            content: result.content,
            metadata: result.metadata
          }
        };
        
        setWebUrl('');
        setShowWebInput(false);
      } catch (error: any) {
        toast.error(error.message || 'Failed to browse URL');
        setIsProcessingWeb(false);
        return;
      }
    } 
    // Handle web search
    else if (webSearchQuery) {
      setIsProcessingWeb(true);
      try {
        // Simulate web search
        const results = [
          {
            title: `Search result 1 for "${webSearchQuery}"`,
            url: "https://example.com/result1",
            snippet: `This is a snippet about ${webSearchQuery} from the first search result.`
          },
          {
            title: `Search result 2 for "${webSearchQuery}"`,
            url: "https://example.com/result2",
            snippet: `Another snippet about ${webSearchQuery} from the second search result.`
          }
        ];
        
        userMessage = {
          id: crypto.randomUUID(),
          content: `Search the web for: ${webSearchQuery}`,
          role: 'user',
          timestamp: new Date(),
          webContent: {
            type: 'search',
            query: webSearchQuery,
            results: results
          }
        };
        
        setWebSearchQuery('');
        setShowWebSearch(false);
      } catch (error: any) {
        toast.error(error.message || 'Failed to search web');
        setIsProcessingWeb(false);
        return;
      }
    }
    // Handle regular text message
    else {
      userMessage = {
        id: crypto.randomUUID(),
        content: inputMessage.trim(),
        role: 'user',
        timestamp: new Date(),
      };
      
      setInputMessage('');
    }

    setIsProcessingWeb(false);
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiResponse: Message = {
        id: crypto.randomUUID(),
        content: `This is a simulated response from Gemini 2.5 Flash Lite. In a real implementation, this would be an actual response from the Gemini API based on your message: "${userMessage.content}"`,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = async (content: string, messageId: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    toast.success(t('messages.success.copied'));
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        content: t('chat.welcomeMessage'),
        role: 'assistant',
        timestamp: new Date(),
      }
    ]);
    toast.success(t('chat.chatCleared'));
  };

  const handleExportChat = () => {
    const chatData = {
      messages: messages,
      exportDate: new Date().toISOString(),
      totalMessages: messages.length,
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(t('messages.success.exported'));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // File handling functions
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Simulate file processing
    setIsProcessingFile(true);
    setProcessingStep('Analyzing document...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a new message with the document attachment
      const newMessage: Message = {
        id: crypto.randomUUID(),
        content: `I've uploaded a document: ${file.name}. Please analyze this document.`,
        role: 'user',
        timestamp: new Date(),
        attachments: [
          {
            id: crypto.randomUUID(),
            type: 'document',
            name: file.name,
            size: formatFileSize(file.size),
            content: `This is simulated content from the file ${file.name}. In a real implementation, this would contain the actual content extracted from the document.`,
            metadata: {
              wordCount: 500,
              characterCount: 3000,
              language: 'en'
            }
          }
        ]
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Automatically trigger AI response
      setTimeout(() => {
        setIsTyping(true);
        
        // Simulate AI response
        setTimeout(() => {
          const assistantMessage: Message = {
            id: crypto.randomUUID(),
            content: `I've analyzed the document "${file.name}". This appears to be a document with approximately 500 words. Would you like me to summarize it, extract key information, or answer specific questions about its content?`,
            role: 'assistant',
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, assistantMessage]);
          setIsTyping(false);
        }, 2000);
      }, 1000);
      
      toast.success('Document uploaded successfully!');
    } catch (error: any) {
      console.error('Document processing error:', error);
      toast.error(error.message || 'Failed to process document');
    } finally {
      setIsProcessingFile(false);
      setProcessingStep('');
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleBrowseWeb = async () => {
    if (!webUrl.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }
    
    handleSendMessage();
  };

  const handleWebSearch = async () => {
    if (!webSearchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }
    
    handleSendMessage();
  };

  const renderAttachment = (attachment: Attachment) => {
    if (attachment.type === 'document') {
      return (
        <div className="mt-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800/30">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📄</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-indigo-800 dark:text-indigo-200 truncate">{attachment.name}</p>
              <div className="flex items-center space-x-4 text-xs text-indigo-600 dark:text-indigo-400">
                <span>{attachment.size}</span>
                {attachment.metadata && (
                  <>
                    <span>•</span>
                    <span>{attachment.metadata.wordCount} words</span>
                    <span>•</span>
                    <span>{Math.ceil(attachment.metadata.wordCount / 200)} min read</span>
                  </>
                )}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (attachment.content) {
                  navigator.clipboard.writeText(attachment.content);
                  toast.success('Document content copied to clipboard');
                }
              }}
              className="p-1.5 glass-button rounded-lg"
            >
              <Copy className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderWebContent = (webContent: WebContent) => {
    if (webContent.type === 'browse' && webContent.url && webContent.title) {
      return (
        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/30">
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <div className="flex items-center space-x-1 overflow-hidden">
              <span className="font-medium text-blue-800 dark:text-blue-200 truncate">{webContent.title}</span>
              <a 
                href={webContent.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-shrink-0"
              >
                <ExternalLink className="w-3 h-3 text-blue-500" />
              </a>
            </div>
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 truncate mb-2">
            {webContent.url}
          </div>
          {webContent.metadata && (
            <div className="flex items-center space-x-3 text-xs text-blue-600 dark:text-blue-400 mb-1">
              <span>{webContent.metadata.wordCount} words</span>
              <span>•</span>
              <span>{webContent.metadata.readingTime} min read</span>
              {webContent.metadata.language && (
                <>
                  <span>•</span>
                  <span>{webContent.metadata.language.toUpperCase()}</span>
                </>
              )}
            </div>
          )}
        </div>
      );
    } else if (webContent.type === 'search' && webContent.query && webContent.results) {
      return (
        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/30">
          <div className="flex items-center space-x-2 mb-3">
            <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-blue-800 dark:text-blue-200">
              Search results for: "{webContent.query}"
            </span>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {webContent.results.map((result, index) => (
              <div key={index} className="text-sm">
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                >
                  {result.title}
                  <ExternalLink className="w-3 h-3 ml-1 inline-block" />
                </a>
                <div className="text-xs text-blue-500 dark:text-blue-300 truncate">{result.url}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{result.snippet}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col ${isRTL ? 'rtl' : ''}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4 mobile-friendly-heading">
          {t('chat.title')}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mobile-friendly-text">
          {t('chat.subtitle')}
        </p>
      </motion.div>

      {/* Chat Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 rounded-2xl mb-6 mobile-friendly-card"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mobile-friendly-text">
              {messages.length - 1} {t('chat.messages')}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportChat}
              className="px-3 py-2 glass-button rounded-xl flex items-center space-x-2 text-sm mobile-friendly-button"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">{t('chat.exportChat')}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearChat}
              className="px-3 py-2 glass-button rounded-xl flex items-center space-x-2 text-sm text-red-600 dark:text-red-400 mobile-friendly-button"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden md:inline">{t('chat.clearChat')}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Messages Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-1 glass-card rounded-2xl p-4 md:p-6 overflow-hidden flex flex-col mobile-friendly-card"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                  {/* Message Header */}
                  <div className={`flex items-center space-x-2 mb-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-center space-x-2 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`p-2 rounded-full ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600' 
                          : 'bg-gradient-to-r from-purple-500 to-pink-600'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mobile-friendly-text">
                        {message.role === 'user' ? t('chat.you') : t('chat.assistant')}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 mobile-friendly-text">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className={`relative group ${message.role === 'user' ? 'ml-8' : 'mr-8'}`}>
                    <div className={`p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                        : 'bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                    }`}>
                      <p className="leading-relaxed whitespace-pre-wrap mobile-friendly-text" dir="auto">{message.content}</p>
                    </div>

                    {/* Attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2">
                        {message.attachments.map(attachment => renderAttachment(attachment))}
                      </div>
                    )}

                    {/* Web Content */}
                    {message.webContent && renderWebContent(message.webContent)}

                    {/* Copy Button */}
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCopyMessage(message.content, message.id)}
                      className={`absolute top-2 ${
                        message.role === 'user' ? 'left-2' : 'right-2'
                      } p-1.5 glass-button rounded-lg opacity-0 group-hover:opacity-100 transition-opacity`}
                    >
                      {copiedMessageId === message.id ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start"
              >
                <div className="max-w-[80%]">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-600">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mobile-friendly-text">
                      {t('chat.assistant')}
                    </span>
                  </div>
                  <div className="mr-8">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-purple-600 dark:text-purple-400" />
                        <span className="text-slate-600 dark:text-slate-400 mobile-friendly-text">{t('chat.typing')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* File Processing Indicator */}
          <AnimatePresence>
            {isProcessingFile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-center"
              >
                <div className="p-4 glass-card rounded-xl max-w-md">
                  <div className="flex items-center space-x-3 mb-2">
                    <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                    <span className="font-medium text-slate-700 dark:text-slate-300 mobile-friendly-text">
                      {processingStep || 'Processing document...'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-600"
                      initial={{ width: "0%" }}
                      animate={{ 
                        width: ["0%", "50%", "70%", "90%", "95%"],
                      }}
                      transition={{ 
                        duration: 3, 
                        ease: "easeInOut",
                        times: [0, 0.2, 0.4, 0.6, 0.8],
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Drag Overlay */}
          <AnimatePresence>
            {isDragOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-indigo-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10"
              >
                <div className="text-center p-6 glass-card rounded-xl">
                  <Upload className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2 mobile-friendly-heading">
                    Drop your document here
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mobile-friendly-text">
                    Supported formats: PDF, DOC, DOCX, TXT
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Web URL Input */}
        <AnimatePresence>
          {showWebInput && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 mobile-friendly-text">
                    Enter URL to browse
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="url"
                      value={webUrl}
                      onChange={(e) => setWebUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full pl-10 pr-4 py-3 glass-input rounded-xl mobile-friendly-text"
                      disabled={isProcessingWeb}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowWebInput(false)}
                    className="p-3 glass-button rounded-xl"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBrowseWeb}
                    disabled={!webUrl.trim() || isProcessingWeb}
                    className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl disabled:opacity-50"
                  >
                    {isProcessingWeb ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Globe className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Web Search Input */}
        <AnimatePresence>
          {showWebSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 mobile-friendly-text">
                    Search the web
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={webSearchQuery}
                      onChange={(e) => setWebSearchQuery(e.target.value)}
                      placeholder="Enter your search query"
                      className="w-full pl-10 pr-4 py-3 glass-input rounded-xl mobile-friendly-text"
                      disabled={isProcessingWeb}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowWebSearch(false)}
                    className="p-3 glass-button rounded-xl"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleWebSearch}
                    disabled={!webSearchQuery.trim() || isProcessingWeb}
                    className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl disabled:opacity-50"
                  >
                    {isProcessingWeb ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('chat.placeholder')}
                className="w-full p-4 glass-input rounded-xl resize-none min-h-[60px] max-h-32 mobile-friendly-text"
                disabled={isTyping || isProcessingFile || isProcessingWeb}
                rows={1}
                dir="auto"
              />
            </div>
            
            <div className="flex space-x-2">
              {/* File Upload Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                disabled={isTyping || isProcessingFile || isProcessingWeb}
                className="p-4 glass-button rounded-xl flex items-center justify-center disabled:opacity-50"
                title="Upload document"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                />
                <Paperclip className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </motion.button>

              {/* Web Browse Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowWebInput(!showWebInput);
                  if (showWebSearch) setShowWebSearch(false);
                }}
                disabled={isTyping || isProcessingFile || isProcessingWeb}
                className={`p-4 rounded-xl flex items-center justify-center disabled:opacity-50 ${
                  showWebInput 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white' 
                    : 'glass-button'
                }`}
                title="Browse web"
              >
                <Globe className="w-5 h-5" />
              </motion.button>

              {/* Web Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowWebSearch(!showWebSearch);
                  if (showWebInput) setShowWebInput(false);
                }}
                disabled={isTyping || isProcessingFile || isProcessingWeb}
                className={`p-4 rounded-xl flex items-center justify-center disabled:opacity-50 ${
                  showWebSearch 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white' 
                    : 'glass-button'
                }`}
                title="Search web"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Send Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                disabled={(!inputMessage.trim() && !webUrl && !webSearchQuery) || isTyping || isProcessingFile || isProcessingWeb}
                className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isTyping || isProcessingFile || isProcessingWeb ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3 text-sm text-slate-500 dark:text-slate-400 mobile-friendly-text">
            <span>{inputMessage.length} {t('common.characters')}</span>
            <span>{t('chat.pressEnterToSend')}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}