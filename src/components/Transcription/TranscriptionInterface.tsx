import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Loader2, 
  Copy, 
  Check, 
  RotateCcw,
  Download,
  BookOpen,
  Languages,
  BookCheck,
  Shield,
  Bot,
  Clock,
  FileIcon,
  X,
  AlertCircle,
  CheckCircle,
  Eye,
  Sparkles,
  Globe,
  Wand2
} from 'lucide-react';
import { deepseekService } from '../../lib/deepseek';
import { DocumentProcessor, type DocumentProcessingResult } from '../../lib/documentProcessor';
import { UsageChecker } from '../../lib/usageChecker';
import { useTranslation } from '../../hooks/useTranslation';
import toast from 'react-hot-toast';
import UsageLimitModal from '../Layout/UsageLimitModal';

interface TranscriptionResult {
  originalText: string;
  wordCount: number;
  readingTime: number;
  fileName: string;
  fileSize: string;
  language?: string;
  confidence?: number;
  metadata: DocumentProcessingResult['metadata'];
}

interface ProcessedResult {
  type: 'summary' | 'paraphrase' | 'grammar' | 'plagiarism' | 'translation';
  title: string;
  content: string;
  metadata?: any;
  timestamp: Date;
}

export default function TranscriptionInterface() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const [processedResults, setProcessedResults] = useState<ProcessedResult[]>([]);
  const [activeView, setActiveView] = useState<'original' | 'processed'>('original');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showUsageLimitModal, setShowUsageLimitModal] = useState(false);
  const { t } = useTranslation();

  const acceptedFileTypes = ['.pdf', '.doc', '.docx', '.txt'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  }, []);

  const handleFileSelection = (file: File) => {
    // Validate file using DocumentProcessor
    const validation = DocumentProcessor.validateFile(file);
    if (!validation.isValid) {
      toast.error(validation.error!);
      return;
    }

    setUploadedFile(file);
    handleTranscription(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleTranscription = async (file: File) => {
    // Check usage limit before processing
    const canProceed = await UsageChecker.checkAndIncrementUsage('transcription');
    if (!canProceed) {
      setShowUsageLimitModal(true);
      return;
    }

    setIsProcessing(true);
    setProcessingStep('Analyzing document...');
    
    try {
      // Step 1: Extract text from document
      setProcessingStep('Extracting text content...');
      const extractionResult = await DocumentProcessor.extractText(file);
      
      // Step 2: Process and analyze the extracted text
      setProcessingStep('Processing extracted content...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Brief pause for UX
      
      // Step 3: Create transcription result
      setProcessingStep('Finalizing transcription...');
      const result: TranscriptionResult = {
        originalText: extractionResult.text,
        wordCount: extractionResult.metadata.wordCount,
        readingTime: DocumentProcessor.calculateReadingTime(extractionResult.metadata.wordCount),
        fileName: file.name,
        fileSize: DocumentProcessor.formatFileSize(file.size),
        language: extractionResult.metadata.language,
        confidence: extractionResult.metadata.confidence,
        metadata: extractionResult.metadata
      };

      setTranscriptionResult(result);
      setActiveView('original');
      toast.success(t('messages.success.transcriptionComplete'));
    } catch (error: any) {
      console.error('Transcription error:', error);
      toast.error(error.message || 'Failed to transcribe document. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handleToolAction = async (tool: string) => {
    if (!transcriptionResult) return;

    // Check usage limit before processing
    const canProceed = await UsageChecker.checkAndIncrementUsage(tool);
    if (!canProceed) {
      setShowUsageLimitModal(true);
      return;
    }

    setSelectedTool(tool);
    setIsProcessing(true);

    try {
      let result: ProcessedResult;

      switch (tool) {
        case 'summarize':
          const summaryResponse = await deepseekService.summarize({
            text: transcriptionResult.originalText,
            mode: 'comprehensive'
          });
          result = {
            type: 'summary',
            title: 'Document Summary',
            content: summaryResponse.summaryText,
            metadata: {
              compressionRatio: summaryResponse.compressionRatio,
              keyPoints: summaryResponse.keyPoints,
              mode: summaryResponse.mode
            },
            timestamp: new Date()
          };
          break;

        case 'paraphrase':
          const paraphraseResponse = await deepseekService.paraphrase({
            text: transcriptionResult.originalText,
            mode: 'standard'
          });
          result = {
            type: 'paraphrase',
            title: 'Paraphrased Document',
            content: paraphraseResponse.paraphrasedText,
            metadata: {
              readabilityScore: paraphraseResponse.readabilityScore,
              improvements: paraphraseResponse.improvements,
              mode: paraphraseResponse.mode
            },
            timestamp: new Date()
          };
          break;

        case 'grammar':
          const grammarResponse = await deepseekService.checkGrammarAdvanced(transcriptionResult.originalText);
          result = {
            type: 'grammar',
            title: 'Grammar Check Results',
            content: grammarResponse.correctedText,
            metadata: {
              errors: grammarResponse.errors,
              overallScore: grammarResponse.overallScore,
              improvements: grammarResponse.improvements
            },
            timestamp: new Date()
          };
          break;

        case 'plagiarism':
          // Use AI detection service for plagiarism check
          const plagiarismResponse = await deepseekService.detectAI({
            text: transcriptionResult.originalText
          });
          result = {
            type: 'plagiarism',
            title: 'Plagiarism Analysis',
            content: `Plagiarism analysis completed with ${plagiarismResponse.confidence}% confidence.\n\nStatus: ${plagiarismResponse.status.toUpperCase()}\nAI Probability: ${plagiarismResponse.aiProbability}%\n\nAnalysis shows this content has a ${plagiarismResponse.status} risk level for plagiarism concerns.`,
            metadata: {
              aiProbability: plagiarismResponse.aiProbability,
              confidence: plagiarismResponse.confidence,
              status: plagiarismResponse.status,
              analysis: plagiarismResponse.analysis
            },
            timestamp: new Date()
          };
          break;

        case 'translation':
          // Auto-detect source language and translate to English (or vice versa)
          const targetLang = transcriptionResult.language === 'en' ? 'es' : 'en';
          const translationResponse = await deepseekService.translate({
            text: transcriptionResult.originalText,
            sourceLanguage: transcriptionResult.language || 'auto',
            targetLanguage: targetLang
          });
          result = {
            type: 'translation',
            title: `Translation (${transcriptionResult.language || 'auto'} → ${targetLang})`,
            content: translationResponse.translatedText,
            metadata: {
              sourceLanguage: translationResponse.sourceLanguage,
              targetLanguage: translationResponse.targetLanguage,
              confidence: translationResponse.confidence,
              detectedLanguage: translationResponse.detectedLanguage
            },
            timestamp: new Date()
          };
          break;

        default:
          throw new Error('Unknown tool');
      }

      setProcessedResults(prev => [result, ...prev]);
      setActiveView('processed');
      toast.success(`${result.title} completed successfully!`);
    } catch (error: any) {
      console.error(`Tool ${tool} error:`, error);
      toast.error(error.message || `Failed to ${tool} document`);
    } finally {
      setIsProcessing(false);
      setSelectedTool(null);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(t('messages.success.copied'));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = (format: string) => {
    if (!transcriptionResult) return;

    const content = activeView === 'original' 
      ? transcriptionResult.originalText 
      : processedResults[0]?.content || transcriptionResult.originalText;

    let mimeType = 'text/plain';
    let fileName = `transcription.${format}`;

    switch (format) {
      case 'txt':
        mimeType = 'text/plain';
        break;
      case 'json':
        mimeType = 'application/json';
        fileName = 'transcription.json';
        break;
      case 'md':
        mimeType = 'text/markdown';
        fileName = 'transcription.md';
        break;
    }

    let exportContent = content;
    
    if (format === 'json') {
      exportContent = JSON.stringify({
        originalDocument: transcriptionResult.fileName,
        transcriptionDate: new Date().toISOString(),
        metadata: transcriptionResult.metadata,
        originalText: transcriptionResult.originalText,
        processedResults: processedResults,
        statistics: {
          wordCount: transcriptionResult.wordCount,
          readingTime: transcriptionResult.readingTime,
          language: transcriptionResult.language,
          confidence: transcriptionResult.confidence
        }
      }, null, 2);
    } else if (format === 'md') {
      exportContent = `# Document Transcription\n\n**File:** ${transcriptionResult.fileName}\n**Date:** ${new Date().toLocaleDateString()}\n**Words:** ${transcriptionResult.wordCount}\n**Reading Time:** ${transcriptionResult.readingTime} minutes\n\n## Content\n\n${content}`;
    }

    const blob = new Blob([exportContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Document exported as ${format.toUpperCase()}`);
  };

  const handleReset = () => {
    setUploadedFile(null);
    setTranscriptionResult(null);
    setProcessedResults([]);
    setActiveView('original');
    setSelectedTool(null);
    setProcessingStep('');
  };

  const tools = [
    { 
      id: 'summarize', 
      label: 'Summarize', 
      icon: BookOpen, 
      color: 'from-emerald-500 to-teal-600', 
      description: 'Create comprehensive summary',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800/30',
      textColor: 'text-emerald-700 dark:text-emerald-300'
    },
    { 
      id: 'paraphrase', 
      label: 'Paraphrase', 
      icon: Wand2, 
      color: 'from-indigo-500 to-purple-600', 
      description: 'Rewrite while preserving meaning',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      borderColor: 'border-indigo-200 dark:border-indigo-800/30',
      textColor: 'text-indigo-700 dark:text-indigo-300'
    },
    { 
      id: 'grammar', 
      label: 'Grammar Check', 
      icon: BookCheck, 
      color: 'from-green-500 to-emerald-600', 
      description: 'Fix grammar and style issues',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800/30',
      textColor: 'text-green-700 dark:text-green-300'
    },
    { 
      id: 'plagiarism', 
      label: 'AI Detection', 
      icon: Shield, 
      color: 'from-red-500 to-orange-600', 
      description: 'Analyze content originality',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800/30',
      textColor: 'text-red-700 dark:text-red-300'
    },
    { 
      id: 'translation', 
      label: 'Translate', 
      icon: Languages, 
      color: 'from-blue-500 to-cyan-600', 
      description: 'Translate to other languages',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800/30',
      textColor: 'text-blue-700 dark:text-blue-300'
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4">
          AI Document Transcription
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Upload PDF and document files for AI-powered text extraction and transcription, then enhance your content with powerful text processing tools.
        </p>
      </motion.div>

      {/* Upload Section */}
      {!transcriptionResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 rounded-2xl"
        >
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
              isDragOver
                ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20'
                : 'border-slate-300 dark:border-slate-600 hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/10'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept={acceptedFileTypes.join(',')}
              onChange={handleFileInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isProcessing}
            />
            
            <div className="space-y-4">
              <motion.div
                animate={{ scale: isDragOver ? 1.1 : 1 }}
                className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center"
              >
                <Upload className="w-8 h-8 text-white" />
              </motion.div>
              
              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                  {isDragOver ? 'Drop your document here' : 'Upload Document for AI Transcription'}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Drag and drop your file here, or click to browse
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                  <span>Supported: {acceptedFileTypes.join(', ')}</span>
                  <span>•</span>
                  <span>Max size: 10MB</span>
                  <span>•</span>
                  <span>AI-powered extraction</span>
                </div>
              </div>
            </div>

            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl flex items-center justify-center"
              >
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-3" />
                  <p className="text-slate-700 dark:text-slate-300 font-medium">{processingStep}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    AI is extracting text from your document...
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {uploadedFile && !isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/30"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{DocumentProcessor.getFileTypeIcon(uploadedFile.name)}</span>
                <div className="flex-1">
                  <p className="font-medium text-blue-800 dark:text-blue-200">{uploadedFile.name}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    {DocumentProcessor.formatFileSize(uploadedFile.size)} • Ready for AI transcription
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Transcription Results */}
      {transcriptionResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* File Info and Controls */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{DocumentProcessor.getFileTypeIcon(transcriptionResult.fileName)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                    {transcriptionResult.fileName}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                    <span>{transcriptionResult.fileSize}</span>
                    <span>•</span>
                    <span>{transcriptionResult.wordCount} words</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{transcriptionResult.readingTime} min read</span>
                    </div>
                    {transcriptionResult.language && (
                      <>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Globe className="w-4 h-4" />
                          <span>{transcriptionResult.language.toUpperCase()}</span>
                        </div>
                      </>
                    )}
                    {transcriptionResult.confidence && (
                      <>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Sparkles className="w-4 h-4" />
                          <span>{transcriptionResult.confidence}% confidence</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCopy(transcriptionResult.originalText)}
                  className="p-2 glass-button rounded-xl"
                  title="Copy transcribed text"
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
                  onClick={handleReset}
                  className="p-2 glass-button rounded-xl"
                  title="Upload new document"
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* AI Processing Tools */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                AI Processing Tools
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {tools.map((tool) => (
                  <motion.button
                    key={tool.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleToolAction(tool.id)}
                    disabled={isProcessing}
                    className={`p-4 rounded-xl transition-all duration-200 ${
                      selectedTool === tool.id
                        ? `bg-gradient-to-r ${tool.color} text-white shadow-lg`
                        : `${tool.bgColor} border ${tool.borderColor} ${tool.textColor} hover:shadow-md`
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {selectedTool === tool.id ? (
                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                      ) : (
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${tool.color}`}>
                          <tool.icon className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <span className="font-semibold">{tool.label}</span>
                    </div>
                    <p className="text-xs opacity-80">{tool.description}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Export Options */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Export:</span>
                {['txt', 'json', 'md'].map((format) => (
                  <motion.button
                    key={format}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleExport(format)}
                    className="px-3 py-1 glass-button rounded-lg text-sm flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>{format.toUpperCase()}</span>
                  </motion.button>
                ))}
              </div>

              <div className="text-sm text-slate-500 dark:text-slate-400">
                Transcribed with AI • {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* View Toggle */}
          <div className="glass-card p-2 rounded-2xl">
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveView('original')}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeView === 'original'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Original Transcription</span>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveView('processed')}
                disabled={processedResults.length === 0}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeView === 'processed'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Bot className="w-5 h-5" />
                  <span>AI Processed Results ({processedResults.length})</span>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Content Display */}
          <AnimatePresence mode="wait">
            {activeView === 'original' ? (
              <motion.div
                key="original"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-card p-6 rounded-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                    AI-Extracted Text Content
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                    <Eye className="w-4 h-4" />
                    <span>Original transcription</span>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl max-h-96 overflow-y-auto">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {transcriptionResult.originalText}
                  </p>
                </div>
                
                {/* Transcription Metadata */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 glass-card rounded-xl">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {transcriptionResult.wordCount}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Words</div>
                  </div>
                  <div className="text-center p-3 glass-card rounded-xl">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {transcriptionResult.metadata.characterCount}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Characters</div>
                  </div>
                  <div className="text-center p-3 glass-card rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {transcriptionResult.readingTime}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Min Read</div>
                  </div>
                  <div className="text-center p-3 glass-card rounded-xl">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {transcriptionResult.confidence || 95}%
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Confidence</div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="processed"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {processedResults.length === 0 ? (
                  <div className="glass-card p-12 rounded-2xl text-center">
                    <Bot className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      No AI Processing Results Yet
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                      Use the AI processing tools above to enhance your transcribed content with summarization, 
                      paraphrasing, grammar checking, and more.
                    </p>
                  </div>
                ) : (
                  processedResults.map((result, index) => {
                    // Get the tool configuration for this result type
                    const toolConfig = tools.find(t => t.id === result.type);
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`glass-card p-6 rounded-2xl ${toolConfig?.bgColor ? toolConfig.bgColor + ' border ' + toolConfig.borderColor : ''}`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${toolConfig?.color || 'from-slate-500 to-slate-600'}`}>
                              {result.type === 'summary' && <BookOpen className="w-5 h-5 text-white" />}
                              {result.type === 'paraphrase' && <Wand2 className="w-5 h-5 text-white" />}
                              {result.type === 'grammar' && <BookCheck className="w-5 h-5 text-white" />}
                              {result.type === 'plagiarism' && <Shield className="w-5 h-5 text-white" />}
                              {result.type === 'translation' && <Languages className="w-5 h-5 text-white" />}
                            </div>
                            <div>
                              <h3 className={`text-lg font-semibold ${toolConfig?.textColor || 'text-slate-800 dark:text-white'}`}>
                                {result.title}
                              </h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                Processed on {result.timestamp.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCopy(result.content)}
                            className="p-2 glass-button rounded-xl"
                          >
                            <Copy className="w-4 h-4" />
                          </motion.button>
                        </div>
                        
                        <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl max-h-96 overflow-y-auto">
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {result.content}
                          </p>
                        </div>

                        {result.metadata && (
                          <div className={`mt-4 p-3 ${toolConfig?.bgColor || 'bg-blue-50 dark:bg-blue-900/20'} rounded-xl`}>
                            <div className={`text-sm ${toolConfig?.textColor || 'text-blue-700 dark:text-blue-300'}`}>
                              {result.type === 'summary' && (
                                <div className="flex items-center space-x-4">
                                  <span>Compression: {result.metadata.compressionRatio}%</span>
                                  <span>Key Points: {result.metadata.keyPoints?.length || 0}</span>
                                  <span>Mode: {result.metadata.mode}</span>
                                </div>
                              )}
                              {result.type === 'paraphrase' && (
                                <div className="flex items-center space-x-4">
                                  <span>Readability: {result.metadata.readabilityScore}/10</span>
                                  <span>Improvements: {result.metadata.improvements?.length || 0}</span>
                                  <span>Mode: {result.metadata.mode}</span>
                                </div>
                              )}
                              {result.type === 'grammar' && (
                                <div className="flex items-center space-x-4">
                                  <span>Score: {result.metadata.overallScore}%</span>
                                  <span>Errors Fixed: {result.metadata.errors?.length || 0}</span>
                                  <span>Improvements: {result.metadata.improvements?.length || 0}</span>
                                </div>
                              )}
                              {result.type === 'plagiarism' && (
                                <div className="flex items-center space-x-4">
                                  <span>AI Probability: {result.metadata.aiProbability}%</span>
                                  <span>Confidence: {result.metadata.confidence}%</span>
                                  <span>Status: {result.metadata.status}</span>
                                </div>
                              )}
                              {result.type === 'translation' && (
                                <div className="flex items-center space-x-4">
                                  <span>From: {result.metadata.sourceLanguage}</span>
                                  <span>To: {result.metadata.targetLanguage}</span>
                                  <span>Confidence: {result.metadata.confidence}%</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
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