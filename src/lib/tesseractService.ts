import { createWorker, createScheduler, RecognizeResult } from 'tesseract.js';

export interface OCRProgress {
  status: string;
  progress: number;
}

export interface OCRResult {
  text: string;
  confidence: number;
  words: any[];
  lines: any[];
  paragraphs: any[];
  blocks: any[];
  symbols: any[];
  hocr: string;
  tsv: string;
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
}

export class TesseractService {
  private static instance: TesseractService;
  private worker: any = null;
  private scheduler: any = null;
  private isInitialized = false;
  private languages = ['eng']; // Default language

  private constructor() {}

  public static getInstance(): TesseractService {
    if (!TesseractService.instance) {
      TesseractService.instance = new TesseractService();
    }
    return TesseractService.instance;
  }

  /**
   * Initialize the Tesseract worker with specified languages
   * @param languages Array of language codes to load (e.g., ['eng', 'fra', 'deu'])
   * @param progressCallback Optional callback for initialization progress
   */
  public async initialize(
    languages: string[] = ['eng'],
    progressCallback?: (progress: OCRProgress) => void
  ): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      this.languages = languages;
      
      // Create a worker for each language
      this.scheduler = createScheduler();
      
      for (const lang of languages) {
        const worker = await createWorker({
          logger: progress => {
            if (progressCallback) {
              progressCallback({
                status: progress.status,
                progress: progress.progress
              });
            }
          }
        });
        
        await worker.loadLanguage(lang);
        await worker.initialize(lang);
        this.scheduler.addWorker(worker);
      }
      
      // Keep a reference to one worker for single-language operations
      this.worker = await createWorker({
        logger: progress => {
          if (progressCallback) {
            progressCallback({
              status: progress.status,
              progress: progress.progress
            });
          }
        }
      });
      
      await this.worker.loadLanguage(languages[0]);
      await this.worker.initialize(languages[0]);
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Tesseract:', error);
      throw new Error('Failed to initialize OCR engine');
    }
  }

  /**
   * Recognize text from an image
   * @param imageSource Image source (URL, File, Blob, or ImageData)
   * @param options Recognition options
   * @param progressCallback Optional callback for recognition progress
   */
  public async recognizeText(
    imageSource: string | File | Blob | ImageData,
    options: {
      language?: string;
      rectangle?: { left: number; top: number; width: number; height: number };
    } = {},
    progressCallback?: (progress: OCRProgress) => void
  ): Promise<OCRResult> {
    // Initialize if not already done
    if (!this.isInitialized) {
      await this.initialize(this.languages, progressCallback);
    }

    try {
      // Set language if specified
      if (options.language && this.worker) {
        await this.worker.loadLanguage(options.language);
        await this.worker.initialize(options.language);
      }

      // Recognize text
      const result = await this.worker.recognize(imageSource, {
        rectangle: options.rectangle
      });

      return {
        text: result.data.text,
        confidence: result.data.confidence,
        words: result.data.words,
        lines: result.data.lines,
        paragraphs: result.data.paragraphs,
        blocks: result.data.blocks,
        symbols: result.data.symbols,
        hocr: result.data.hocr,
        tsv: result.data.tsv,
        bbox: result.data.bbox
      };
    } catch (error) {
      console.error('Text recognition failed:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  /**
   * Recognize text from multiple images in parallel
   * @param imageSources Array of image sources
   * @param options Recognition options
   * @param progressCallback Optional callback for recognition progress
   */
  public async recognizeMultiple(
    imageSources: (string | File | Blob | ImageData)[],
    options: {
      language?: string;
    } = {},
    progressCallback?: (progress: OCRProgress) => void
  ): Promise<OCRResult[]> {
    // Initialize if not already done
    if (!this.isInitialized || !this.scheduler) {
      await this.initialize(this.languages, progressCallback);
    }

    try {
      // Process all images in parallel using the scheduler
      const results = await Promise.all(
        imageSources.map(async (imageSource) => {
          const result = await this.scheduler.addJob('recognize', imageSource);
          return {
            text: result.data.text,
            confidence: result.data.confidence,
            words: result.data.words,
            lines: result.data.lines,
            paragraphs: result.data.paragraphs,
            blocks: result.data.blocks,
            symbols: result.data.symbols,
            hocr: result.data.hocr,
            tsv: result.data.tsv,
            bbox: result.data.bbox
          };
        })
      );

      return results;
    } catch (error) {
      console.error('Multiple text recognition failed:', error);
      throw new Error('Failed to extract text from images');
    }
  }

  /**
   * Detect the language of text in an image
   * @param imageSource Image source
   * @param progressCallback Optional callback for detection progress
   */
  public async detectLanguage(
    imageSource: string | File | Blob | ImageData,
    progressCallback?: (progress: OCRProgress) => void
  ): Promise<string> {
    // Initialize if not already done
    if (!this.isInitialized) {
      await this.initialize(['eng', 'osd'], progressCallback);
    }

    try {
      // Use OSD (orientation and script detection)
      const result = await this.worker.detect(imageSource);
      return result.data.script;
    } catch (error) {
      console.error('Language detection failed:', error);
      throw new Error('Failed to detect language in image');
    }
  }

  /**
   * Terminate all workers and free resources
   */
  public async terminate(): Promise<void> {
    try {
      if (this.worker) {
        await this.worker.terminate();
        this.worker = null;
      }
      
      if (this.scheduler) {
        await this.scheduler.terminate();
        this.scheduler = null;
      }
      
      this.isInitialized = false;
    } catch (error) {
      console.error('Failed to terminate Tesseract workers:', error);
    }
  }
}

// Export a singleton instance
export const tesseractService = TesseractService.getInstance();