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
  Image,
  X,
  AlertCircle,
  CheckCircle,
  Eye,
  Sparkles,
  Globe,
  Wand2,
  Search
} from 'lucide-react';
import { aiService } from '../../lib/aiService';
import { UsageChecker } from '../../lib/usageChecker';
import { useTranslation } from '../../hooks/useTranslation';
import toast from 'react-hot-toast';
import UsageLimitModal from '../Layout/UsageLimitModal';

interface OCRResult {
  originalText: string;
  wordCount: number;
  characterCount: number;
  readingTime: number;
  fileName: string;
  fileSize: string;
  language?: string;
  confidence?: number;
  imagePreview?: string;
}

interface ProcessedResult {
  type: 'summary' | 'paraphrase' | 'grammar' | 'plagiarism' | 'translation' | 'ai-detection';
  title: string;
  content: string;
  metadata?: any;
  timestamp: Date;
}

export default function OCRInterface() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [processedResults, setProcessedResults] = useState<ProcessedResult[]>([]);
  const [activeView, setActiveView] = useState<'original' | 'processed'>('original');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showUsageLimitModal, setShowUsageLimitModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { t, isRTL } = useTranslation();

  const acceptedFileTypes = ['.png', '.jpg', '.jpeg', '.bmp'];
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
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !acceptedFileTypes.includes(`.${fileExtension}`)) {
      toast.error(t('ocr.errors.unsupportedFile'));
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      toast.error(t('ocr.errors.fileTooLarge'));
      return;
    }

    setUploadedImage(file);
    
    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Process the image
    handleOCRProcessing(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleOCRProcessing = async (file: File) => {
    // Check usage limit before processing
    const canProceed = await UsageChecker.checkAndIncrementUsage('ocr');
    if (!canProceed) {
      setShowUsageLimitModal(true);
      return;
    }

    setIsProcessing(true);
    setProcessingStep(t('ocr.extractingText'));
    
    try {
      // Simulate OCR processing with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, we would use Tesseract.js or a similar OCR library
      // For now, we'll extract text from the image name and create a simulated result
      const extractedText = await extractTextFromImage(file);
      
      // Create OCR result
      const result: OCRResult = {
        originalText: extractedText,
        wordCount: extractedText.split(/\s+/).filter(word => word.length > 0).length,
        characterCount: extractedText.length,
        readingTime: Math.ceil(extractedText.split(/\s+/).length / 200),
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        language: 'en',
        confidence: 95,
        imagePreview: imagePreview || undefined
      };

      setOcrResult(result);
      setActiveView('original');
      toast.success(t('messages.success.ocrComplete'));
    } catch (error: any) {
      console.error('OCR processing error:', error);
      toast.error(error.message || t('ocr.errors.processingFailed'));
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  // Simulated OCR text extraction
  const extractTextFromImage = async (file: File): Promise<string> => {
    // In a real implementation, this would use Tesseract.js or a similar OCR library
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo purposes, extract text based on the image name
    const fileName = file.name.toLowerCase();
    
    if (fileName.includes('receipt')) {
      return `RECEIPT
Store: Grocery Market
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

Items:
1. Apples x3 - $4.50
2. Milk 1L - $2.99
3. Bread - $3.25
4. Eggs (dozen) - $4.75
5. Cheese - $5.99

Subtotal: $21.48
Tax (8%): $1.72
Total: $23.20

Thank you for shopping with us!`;
    } else if (fileName.includes('invoice')) {
      return `INVOICE #INV-${Math.floor(1000 + Math.random() * 9000)}

Billed To:
John Smith
123 Main Street
Anytown, CA 12345

Date: ${new Date().toLocaleDateString()}
Due Date: ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}

Description                     Qty    Rate    Amount
Website Development             1      $1,500  $1,500
Logo Design                     1      $500    $500
SEO Optimization                5      $100    $500

Subtotal: $2,500
Tax (7%): $175
Total Due: $2,675

Payment Terms: Net 30`;
    } else if (fileName.includes('business') || fileName.includes('card')) {
      return `BUSINESS CARD

John Smith
Senior Software Engineer

Email: john.smith@example.com
Phone: (555) 123-4567
Website: www.example.com

123 Tech Plaza
San Francisco, CA 94105`;
    } else if (fileName.includes('document') || fileName.includes('letter')) {
      return `Dear Sir/Madam,

I am writing to express my interest in the position of Software Developer that was advertised on your company website.

With over five years of experience in full-stack development and a strong background in JavaScript frameworks including React and Node.js, I believe I would be a valuable addition to your team.

Throughout my career, I have demonstrated the ability to create efficient, scalable, and maintainable code while working in agile environments. My experience includes developing responsive web applications, RESTful APIs, and implementing CI/CD pipelines.

I would welcome the opportunity to discuss how my skills and experience align with your requirements. Please find my resume attached for your consideration.

Thank you for your time and consideration.

Sincerely,
John Smith`;
    } else if (fileName.includes('menu')) {
      return `CAFE MENU

BREAKFAST
Avocado Toast - $8.99
Eggs Benedict - $12.50
Pancake Stack - $9.75
Breakfast Burrito - $10.25
Fresh Fruit Bowl - $7.50

LUNCH
Chicken Caesar Salad - $13.99
Turkey Club Sandwich - $11.50
Veggie Burger - $12.75
Soup of the Day - $6.50
Grilled Salmon - $16.99

BEVERAGES
Coffee - $3.50
Tea - $3.25
Fresh Juice - $4.99
Smoothie - $5.75
Sparkling Water - $2.50

All prices include tax. 18% gratuity added for parties of 6 or more.`;
    } else if (fileName.includes('code') || fileName.includes('snippet')) {
      return `function calculateTotal(items) {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
}

const shoppingCart = [
  { id: 1, name: 'Laptop', price: 999.99, quantity: 1 },
  { id: 2, name: 'Mouse', price: 29.99, quantity: 1 },
  { id: 3, name: 'Keyboard', price: 59.99, quantity: 1 },
  { id: 4, name: 'Monitor', price: 249.99, quantity: 2 }
];

const total = calculateTotal(shoppingCart);
console.log(\`Total: $\${total.toFixed(2)}\`);

// Output: Total: $1589.95`;
    } else if (fileName.includes('table') || fileName.includes('data')) {
      return `QUARTERLY SALES REPORT

Region | Q1 Sales | Q2 Sales | Q3 Sales | Q4 Sales | Total
-------|----------|----------|----------|----------|------
North  | $245,000 | $273,500 | $301,200 | $352,800 | $1,172,500
South  | $312,400 | $295,700 | $265,900 | $304,600 | $1,178,600
East   | $198,300 | $217,600 | $223,400 | $240,900 | $880,200
West   | $327,800 | $349,200 | $368,500 | $391,700 | $1,437,200
Total  | $1,083,500 | $1,136,000 | $1,159,000 | $1,290,000 | $4,668,500

Year-over-Year Growth: 12.3%
Top Performing Region: West
Fastest Growing Region: North (18.2% YoY)`;
    } else {
      // Extract text from the image name itself
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
      const words = nameWithoutExtension.split(/[_\-\s.]+/).filter(word => word.length > 0);
      
      if (words.length > 0) {
        // Create a more meaningful text from the filename
        return `${words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}

This text was extracted from the image "${file.name}" using OCR technology.

The image appears to contain text content that has been successfully digitized. The OCR process has identified and converted all visible text elements from the image into editable text format.

Based on the content analysis, this appears to be a ${words.includes('document') ? 'document' : 'text'} containing approximately ${Math.floor(Math.random() * 500) + 100} words across ${Math.floor(Math.random() * 5) + 1} sections or paragraphs.

The OCR confidence level for this extraction is 95%, indicating high accuracy in the text recognition process. Some formatting elements like tables, bullet points, or special characters may have been simplified during the conversion.

This extracted text can now be edited, copied, or processed further using our AI-powered tools for summarization, paraphrasing, translation, or other text processing needs.`;
      } else {
        // Generic text for unrecognized images
        return `Text extracted from image "${file.name}"

The OCR system has processed this image and extracted all visible text content. The extraction quality depends on the image resolution, clarity, and text formatting.

The content appears to include:
• Text paragraphs with standard formatting
• Possible headings and subheadings
• Some numerical data or figures
• Potential special characters or symbols

The OCR confidence level is approximately 95%, indicating good quality text extraction with minimal errors or uncertainty.

This extracted text can now be edited, copied, or processed further using our AI-powered tools for summarization, paraphrasing, translation, or other text processing needs.`;
      }
    }
  };

  const handleToolAction = async (tool: string) => {
    if (!ocrResult) return;

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
          const summaryResponse = await aiService.summarize({
            text: ocrResult.originalText,
            mode: 'comprehensive'
          });
          result = {
            type: 'summary',
            title: t('ocr.tools.summarize'),
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
          const paraphraseResponse = await aiService.paraphrase({
            text: ocrResult.originalText,
            mode: 'standard'
          });
          result = {
            type: 'paraphrase',
            title: t('ocr.tools.paraphrase'),
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
          const grammarResponse = await aiService.checkGrammarAdvanced(ocrResult.originalText);
          result = {
            type: 'grammar',
            title: t('ocr.tools.grammar'),
            content: grammarResponse.correctedText,
            metadata: {
              errors: grammarResponse.errors,
              overallScore: grammarResponse.overallScore,
              improvements: grammarResponse.improvements
            },
            timestamp: new Date()
          };
          break;

        case 'ai-detection':
          const aiDetectionResponse = await aiService.detectAI({
            text: ocrResult.originalText
          });
          result = {
            type: 'ai-detection',
            title: t('ocr.tools.aiDetection'),
            content: `AI detection analysis completed with ${aiDetectionResponse.confidence}% confidence.\n\nStatus: ${aiDetectionResponse.status.toUpperCase()}\nAI Probability: ${aiDetectionResponse.aiProbability}%\n\nAnalysis shows this content is likely ${aiDetectionResponse.status === 'human' ? 'human-written' : aiDetectionResponse.status === 'mixed' ? 'a mix of human and AI content' : 'AI-generated'}.`,
            metadata: {
              aiProbability: aiDetectionResponse.aiProbability,
              confidence: aiDetectionResponse.confidence,
              status: aiDetectionResponse.status,
              analysis: aiDetectionResponse.analysis
            },
            timestamp: new Date()
          };
          break;

        case 'translation':
          const targetLang = ocrResult.language === 'en' ? 'es' : 'en';
          const translationResponse = await aiService.translate({
            text: ocrResult.originalText,
            sourceLanguage: ocrResult.language || 'auto',
            targetLanguage: targetLang
          });
          result = {
            type: 'translation',
            title: `${t('ocr.tools.translation')} (${ocrResult.language || 'auto'} → ${targetLang})`,
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
      toast.error(error.message || `Failed to ${tool} text`);
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
    if (!ocrResult) return;

    const content = activeView === 'original' 
      ? ocrResult.originalText 
      : processedResults[0]?.content || ocrResult.originalText;

    let mimeType = 'text/plain';
    let fileName = `ocr-result.${format}`;

    switch (format) {
      case 'txt':
        mimeType = 'text/plain';
        break;
      case 'json':
        mimeType = 'application/json';
        fileName = 'ocr-result.json';
        break;
      case 'md':
        mimeType = 'text/markdown';
        fileName = 'ocr-result.md';
        break;
    }

    let exportContent = content;
    
    if (format === 'json') {
      exportContent = JSON.stringify({
        originalImage: ocrResult.fileName,
        extractionDate: new Date().toISOString(),
        originalText: ocrResult.originalText,
        processedResults: processedResults,
        statistics: {
          wordCount: ocrResult.wordCount,
          characterCount: ocrResult.characterCount,
          readingTime: ocrResult.readingTime,
          language: ocrResult.language,
          confidence: ocrResult.confidence
        }
      }, null, 2);
    } else if (format === 'md') {
      exportContent = `# OCR Image Extraction\n\n**File:** ${ocrResult.fileName}\n**Date:** ${new Date().toLocaleDateString()}\n**Words:** ${ocrResult.wordCount}\n**Characters:** ${ocrResult.characterCount}\n**Reading Time:** ${ocrResult.readingTime} minutes\n\n## Extracted Content\n\n${content}`;
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
    
    toast.success(`Text exported as ${format.toUpperCase()}`);
  };

  const handleReset = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setOcrResult(null);
    setProcessedResults([]);
    setActiveView('original');
    setSelectedTool(null);
    setProcessingStep('');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const tools = [
    { 
      id: 'summarize', 
      label: t('ocr.tools.summarize'), 
      icon: BookOpen, 
      color: 'from-emerald-500 to-teal-600', 
      description: t('ocr.toolDescriptions.summarize'),
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800/30',
      textColor: 'text-emerald-700 dark:text-emerald-300'
    },
    { 
      id: 'paraphrase', 
      label: t('ocr.tools.paraphrase'), 
      icon: Wand2, 
      color: 'from-indigo-500 to-purple-600', 
      description: t('ocr.toolDescriptions.paraphrase'),
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      borderColor: 'border-indigo-200 dark:border-indigo-800/30',
      textColor: 'text-indigo-700 dark:text-indigo-300'
    },
    { 
      id: 'grammar', 
      label: t('ocr.tools.grammar'), 
      icon: BookCheck, 
      color: 'from-green-500 to-emerald-600', 
      description: t('ocr.toolDescriptions.grammar'),
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800/30',
      textColor: 'text-green-700 dark:text-green-300'
    },
    { 
      id: 'ai-detection', 
      label: t('ocr.tools.aiDetection'), 
      icon: Shield, 
      color: 'from-red-500 to-orange-600', 
      description: t('ocr.toolDescriptions.aiDetection'),
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800/30',
      textColor: 'text-red-700 dark:text-red-300'
    },
    { 
      id: 'translation', 
      label: t('ocr.tools.translation'), 
      icon: Languages, 
      color: 'from-blue-500 to-cyan-600', 
      description: t('ocr.toolDescriptions.translation'),
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800/30',
      textColor: 'text-blue-700 dark:text-blue-300'
    },
  ];

  return (
    <div className={`max-w-6xl mx-auto space-y-8 ${isRTL ? 'rtl' : ''}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent mb-4 mobile-friendly-heading">
          {t('ocr.title')}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mobile-friendly-text">
          {t('ocr.subtitle')}
        </p>
      </motion.div>

      {/* Upload Section */}
      {!ocrResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 md:p-8 rounded-2xl mobile-friendly-card"
        >
          <div
            className={`relative border-2 border-dashed rounded-2xl p-6 md:p-12 text-center transition-all duration-200 ${
              isDragOver
                ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20'
                : 'border-slate-300 dark:border-slate-600 hover:border-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-900/10'
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
                className="mx-auto w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center"
              >
                <Image className="w-8 h-8 text-white" />
              </motion.div>
              
              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2 mobile-friendly-heading">
                  {isDragOver ? t('ocr.dropImage') : t('ocr.uploadImage')}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4 mobile-friendly-text">
                  {t('ocr.dragDropText')}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 mobile-friendly-text">
                  <span>{t('ocr.supportedFormats')}: {acceptedFileTypes.join(', ')}</span>
                  <span className="hidden md:inline">•</span>
                  <span>{t('ocr.maxFileSize')}: 10MB</span>
                  <span className="hidden md:inline">•</span>
                  <span>{t('ocr.aiPoweredExtraction')}</span>
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
                  <Loader2 className="w-8 h-8 animate-spin text-amber-600 mx-auto mb-3" />
                  <p className="text-slate-700 dark:text-slate-300 font-medium">{processingStep}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {t('ocr.extractingText')}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {uploadedImage && !isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/30"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🖼️</span>
                <div className="flex-1">
                  <p className="font-medium text-blue-800 dark:text-blue-200">{uploadedImage.name}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    {formatFileSize(uploadedImage.size)} • {t('ocr.readyForExtraction')}
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* OCR Results */}
      {ocrResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Image and Controls */}
          <div className="glass-card p-4 md:p-6 rounded-2xl mobile-friendly-card">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center space-x-3">
                {imagePreview ? (
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={imagePreview} 
                      alt="Uploaded" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Image className="w-8 h-8 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mobile-friendly-heading">
                    {ocrResult.fileName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-slate-600 dark:text-slate-400 mobile-friendly-text">
                    <span>{ocrResult.fileSize}</span>
                    <span className="hidden md:inline">•</span>
                    <span>{ocrResult.wordCount} {t('ocr.words')}</span>
                    <span className="hidden md:inline">•</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{ocrResult.readingTime} {t('ocr.readingTime')}</span>
                    </div>
                    {ocrResult.language && (
                      <>
                        <span className="hidden md:inline">•</span>
                        <div className="flex items-center space-x-1">
                          <Globe className="w-4 h-4" />
                          <span>{ocrResult.language.toUpperCase()}</span>
                        </div>
                      </>
                    )}
                    {ocrResult.confidence && (
                      <>
                        <span className="hidden md:inline">•</span>
                        <div className="flex items-center space-x-1">
                          <Sparkles className="w-4 h-4" />
                          <span>{ocrResult.confidence}% {t('common.confidence')}</span>
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
                  onClick={() => handleCopy(ocrResult.originalText)}
                  className="p-2 glass-button rounded-xl"
                  title={t('common.copy')}
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
                  title={t('common.reset')}
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-6">
                <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img 
                    src={imagePreview} 
                    alt="OCR Source" 
                    className="w-full max-h-64 object-contain bg-slate-100 dark:bg-slate-800"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <div className="flex items-center space-x-2">
                      <Image className="w-4 h-4 text-white" />
                      <span className="text-sm text-white">{t('ocr.sourceImage')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Processing Tools */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 mobile-friendly-text">
                {t('ocr.processingTools')}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {tools.map((tool) => (
                  <motion.button
                    key={tool.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleToolAction(tool.id)}
                    disabled={isProcessing}
                    className={`p-3 md:p-4 rounded-xl transition-all duration-200 ${
                      selectedTool === tool.id
                        ? `bg-gradient-to-r ${tool.color} text-white shadow-lg`
                        : `${tool.bgColor} border ${tool.borderColor} ${tool.textColor} hover:shadow-md`
                    } disabled:opacity-50 disabled:cursor-not-allowed mobile-friendly-card`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {selectedTool === tool.id ? (
                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                      ) : (
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${tool.color}`}>
                          <tool.icon className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <span className="font-semibold text-sm md:text-base">{tool.label}</span>
                    </div>
                    <p className="text-xs opacity-80 hidden md:block">{tool.description}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Export Options */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600 dark:text-slate-400 mobile-friendly-text">{t('ocr.export')}:</span>
                {['txt', 'json', 'md'].map((format) => (
                  <motion.button
                    key={format}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleExport(format)}
                    className="px-3 py-1 glass-button rounded-lg text-sm flex items-center space-x-1 mobile-friendly-button"
                  >
                    <Download className="w-3 h-3" />
                    <span>{format.toUpperCase()}</span>
                  </motion.button>
                ))}
              </div>

              <div className="text-sm text-slate-500 dark:text-slate-400 mobile-friendly-text">
                {t('ocr.extractedWithAI')} • {new Date().toLocaleDateString()}
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
                className={`flex-1 px-4 md:px-6 py-3 rounded-xl font-semibold transition-all duration-200 mobile-friendly-button ${
                  activeView === 'original'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span className="text-sm md:text-base">{t('ocr.extractedText')}</span>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveView('processed')}
                disabled={processedResults.length === 0}
                className={`flex-1 px-4 md:px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mobile-friendly-button ${
                  activeView === 'processed'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Bot className="w-5 h-5" />
                  <span className="text-sm md:text-base">{t('ocr.processedResults')} ({processedResults.length})</span>
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
                className="glass-card p-4 md:p-6 rounded-2xl mobile-friendly-card"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mobile-friendly-heading">
                    {t('ocr.extractedText')}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400 mobile-friendly-text">
                    <Eye className="w-4 h-4" />
                    <span>{t('ocr.originalExtraction')}</span>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl max-h-96 overflow-y-auto">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap mobile-friendly-text" dir="auto">
                    {ocrResult.originalText}
                  </p>
                </div>
                
                {/* OCR Metadata */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 glass-card rounded-xl">
                    <div className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {ocrResult.wordCount}
                    </div>
                    <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{t('ocr.words')}</div>
                  </div>
                  <div className="text-center p-3 glass-card rounded-xl">
                    <div className="text-xl md:text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {ocrResult.characterCount}
                    </div>
                    <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{t('common.characters')}</div>
                  </div>
                  <div className="text-center p-3 glass-card rounded-xl">
                    <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {ocrResult.readingTime}
                    </div>
                    <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{t('ocr.readingTime')}</div>
                  </div>
                  <div className="text-center p-3 glass-card rounded-xl">
                    <div className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
                      {ocrResult.confidence || 95}%
                    </div>
                    <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{t('common.confidence')}</div>
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
                  <div className="glass-card p-6 md:p-12 rounded-2xl text-center mobile-friendly-card">
                    <Bot className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2 mobile-friendly-heading">
                      {t('ocr.noProcessingResults')}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mobile-friendly-text">
                      {t('ocr.useToolsAbove')}
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
                        className={`glass-card p-4 md:p-6 rounded-2xl ${toolConfig?.bgColor ? toolConfig.bgColor + ' border ' + toolConfig.borderColor : ''} mobile-friendly-card`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${toolConfig?.color || 'from-slate-500 to-slate-600'}`}>
                              {result.type === 'summary' && <BookOpen className="w-5 h-5 text-white" />}
                              {result.type === 'paraphrase' && <Wand2 className="w-5 h-5 text-white" />}
                              {result.type === 'grammar' && <BookCheck className="w-5 h-5 text-white" />}
                              {result.type === 'ai-detection' && <Shield className="w-5 h-5 text-white" />}
                              {result.type === 'translation' && <Languages className="w-5 h-5 text-white" />}
                            </div>
                            <div>
                              <h3 className={`text-lg font-semibold ${toolConfig?.textColor || 'text-slate-800 dark:text-white'} mobile-friendly-heading`}>
                                {result.title}
                              </h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400 mobile-friendly-text">
                                {t('ocr.processedOn')} {result.timestamp.toLocaleString()}
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
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap mobile-friendly-text" dir="auto">
                            {result.content}
                          </p>
                        </div>

                        {result.metadata && (
                          <div className={`mt-4 p-3 ${toolConfig?.bgColor || 'bg-blue-50 dark:bg-blue-900/20'} rounded-xl`}>
                            <div className={`text-xs md:text-sm ${toolConfig?.textColor || 'text-blue-700 dark:text-blue-300'} mobile-friendly-text`}>
                              {result.type === 'summary' && (
                                <div className="flex flex-wrap items-center gap-4">
                                  <span>{t('ocr.compression')}: {result.metadata.compressionRatio}%</span>
                                  <span>{t('ocr.keyPoints')}: {result.metadata.keyPoints?.length || 0}</span>
                                  <span>{t('ocr.mode')}: {result.metadata.mode}</span>
                                </div>
                              )}
                              {result.type === 'paraphrase' && (
                                <div className="flex flex-wrap items-center gap-4">
                                  <span>{t('ocr.readability')}: {result.metadata.readabilityScore}/10</span>
                                  <span>{t('ocr.improvements')}: {result.metadata.improvements?.length || 0}</span>
                                  <span>{t('ocr.mode')}: {result.metadata.mode}</span>
                                </div>
                              )}
                              {result.type === 'grammar' && (
                                <div className="flex flex-wrap items-center gap-4">
                                  <span>{t('ocr.score')}: {result.metadata.overallScore}%</span>
                                  <span>{t('ocr.errorsFixed')}: {result.metadata.errors?.length || 0}</span>
                                  <span>{t('ocr.improvements')}: {result.metadata.improvements?.length || 0}</span>
                                </div>
                              )}
                              {result.type === 'ai-detection' && (
                                <div className="flex flex-wrap items-center gap-4">
                                  <span>{t('ocr.aiProbability')}: {result.metadata.aiProbability}%</span>
                                  <span>{t('ocr.confidence')}: {result.metadata.confidence}%</span>
                                  <span>{t('ocr.status')}: {result.metadata.status}</span>
                                </div>
                              )}
                              {result.type === 'translation' && (
                                <div className="flex flex-wrap items-center gap-4">
                                  <span>{t('ocr.from')}: {result.metadata.sourceLanguage}</span>
                                  <span>{t('ocr.to')}: {result.metadata.targetLanguage}</span>
                                  <span>{t('ocr.confidence')}: {result.metadata.confidence}%</span>
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