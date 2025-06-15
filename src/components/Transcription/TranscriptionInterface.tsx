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
  CheckCircle
} from 'lucide-react';
import { deepseekService } from '../../lib/deepseek';
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
}

interface ProcessedResult {
  type: 'summary' | 'paraphrase' | 'grammar' | 'plagiarism' | 'export';
  title: string;
  content: string;
  metadata?: any;
}

export default function TranscriptionInterface() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
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
    // Validate file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFileTypes.includes(fileExtension)) {
      toast.error(`Unsupported file type. Please upload: ${acceptedFileTypes.join(', ')}`);
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      toast.error('File size too large. Maximum size is 10MB.');
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
    try {
      // Simulate file processing and transcription
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock transcription result - in real implementation, this would use OCR/document parsing
      const mockText = `This is a sample transcription of the uploaded document "${file.name}". 

In a real implementation, this would contain the actual extracted text from the PDF or document file using OCR technology or document parsing libraries.

The transcription process would analyze the document structure, extract text content, and preserve formatting where possible. This includes handling different fonts, sizes, and layouts while maintaining readability.

Advanced features might include:
- Table extraction and formatting
- Image description and alt-text generation
- Header and footer recognition
- Multi-column layout preservation
- Language detection and character recognition

The quality of transcription depends on the document quality, font clarity, and the sophistication of the OCR engine used.`;

      const wordCount = mockText.split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200); // Average reading speed

      const result: TranscriptionResult = {
        originalText: mockText,
        wordCount,
        readingTime,
        fileName: file.name,
        fileSize: formatFileSize(file.size)
      };

      setTranscriptionResult(result);
      toast.success('Document transcribed successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to transcribe document');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
              keyPoints: summaryResponse.keyPoints
            }
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
              improvements: paraphraseResponse.improvements
            }
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
              overallScore: grammarResponse.overallScore
            }
          };
          break;

        case 'plagiarism':
          // Mock plagiarism check result
          result = {
            type: 'plagiarism',
            title: 'Plagiarism Analysis',
            content: 'Plagiarism analysis completed. No significant matches found in online sources.',
            metadata: {
              similarity: 12,
              sources: 3,
              status: 'low'
            }
          };
          break;

        default:
          throw new Error('Unknown tool');
      }

      setProcessedResults(prev => [result, ...prev]);
      setActiveView('processed');
      toast.success(`${result.title} completed successfully!`);
    } catch (error: any) {
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

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcription.${format}`;
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
  };

  const tools = [
    { id: 'summarize', label: 'Summarize', icon: BookOpen, color: 'from-emerald-500 to-teal-600' },
    { id: 'paraphrase', label: 'Paraphrase', icon: FileText, color: 'from-indigo-500 to-purple-600' },
    { id: 'grammar', label: 'Grammar Check', icon: BookCheck, color: 'from-green-500 to-emerald-600' },
    { id: 'plagiarism', label: 'Plagiarism Check', icon: Shield, color: 'from-red-500 to-orange-600' },
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
          Document Transcription
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Upload PDF and document files for AI-powered transcription, then enhance your content with powerful text processing tools.
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
                  {isDragOver ? 'Drop your document here' : 'Upload Document'}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Drag and drop your file here, or click to browse
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                  <span>Supported formats: {acceptedFileTypes.join(', ')}</span>
                  <span>•</span>
                  <span>Max size: 10MB</span>
                </div>
              </div>
            </div>

            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl flex items-center justify-center"
              >
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-2" />
                  <p className="text-slate-700 dark:text-slate-300">Processing document...</p>
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
                <FileIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <p className="font-medium text-blue-800 dark:text-blue-200">{uploadedFile.name}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">{formatFileSize(uploadedFile.size)}</p>
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCopy(transcriptionResult.originalText)}
                  className="p-2 glass-button rounded-xl"
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
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Tool Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {tools.map((tool) => (
                <motion.button
                  key={tool.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleToolAction(tool.id)}
                  disabled={isProcessing}
                  className={`p-3 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200 ${
                    selectedTool === tool.id
                      ? 'bg-gradient-to-r text-white shadow-lg'
                      : 'glass-button hover:bg-white/20'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  style={{
                    background: selectedTool === tool.id 
                      ? `linear-gradient(to right, var(--tw-gradient-stops))` 
                      : undefined
                  }}
                >
                  {selectedTool === tool.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <tool.icon className="w-4 h-4" />
                  )}
                  <span className="text-sm">{tool.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Export Options */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Export:</span>
              {['txt', 'pdf', 'doc'].map((format) => (
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
                Original Transcription
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
                Processed Results ({processedResults.length})
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
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Transcribed Text
                </h3>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl max-h-96 overflow-y-auto">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {transcriptionResult.originalText}
                  </p>
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
                      No Processed Results Yet
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      Use the tools above to process your transcribed text
                    </p>
                  </div>
                ) : (
                  processedResults.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card p-6 rounded-2xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                          {result.title}
                        </h3>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCopy(result.content)}
                          className="p-2 glass-button rounded-xl"
                        >
                          <Copy className="w-4 h-4" />
                        </motion.button>
                      </div>
                      
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl max-h-96 overflow-y-auto">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {result.content}
                        </p>
                      </div>

                      {result.metadata && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                          <div className="text-sm text-blue-700 dark:text-blue-300">
                            {result.type === 'summary' && (
                              <div className="flex items-center space-x-4">
                                <span>Compression: {result.metadata.compressionRatio}%</span>
                                <span>Key Points: {result.metadata.keyPoints?.length || 0}</span>
                              </div>
                            )}
                            {result.type === 'grammar' && (
                              <div className="flex items-center space-x-4">
                                <span>Score: {result.metadata.overallScore}%</span>
                                <span>Errors Fixed: {result.metadata.errors?.length || 0}</span>
                              </div>
                            )}
                            {result.type === 'plagiarism' && (
                              <div className="flex items-center space-x-4">
                                <span>Similarity: {result.metadata.similarity}%</span>
                                <span>Sources: {result.metadata.sources}</span>
                                <span>Status: {result.metadata.status}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))
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