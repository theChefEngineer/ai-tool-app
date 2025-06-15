import { create } from 'zustand';
import { DatabaseService } from '../lib/database';
import { useAuthStore } from './authStore';

export type Theme = 'light' | 'dark';

export type ParaphraseMode = 'standard' | 'formal' | 'creative' | 'shorten' | 'expand';

export type SummaryMode = 'comprehensive' | 'executive' | 'academic' | 'bullet' | 'quick';

export interface ParaphraseHistory {
  id: string;
  originalText: string;
  paraphrasedText: string;
  mode: ParaphraseMode;
  timestamp: Date;
  readabilityScore: number;
  improvements: string[];
}

export interface SummaryHistory {
  id: string;
  originalText: string;
  summaryText: string;
  mode: SummaryMode;
  timestamp: Date;
  compressionRatio: number;
  keyPoints: string[];
}

export interface TranslationHistory {
  id: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: Date;
  confidence?: number;
  detectedLanguage?: string;
}

interface AppState {
  theme: Theme;
  currentMode: ParaphraseMode;
  currentSummaryMode: SummaryMode;
  history: ParaphraseHistory[];
  summaryHistory: SummaryHistory[];
  translationHistory: TranslationHistory[];
  isProcessing: boolean;
  isLoadingHistory: boolean;
  currentView: 'paraphrase' | 'summary' | 'translation' | 'grammar' | 'transcription' | 'settings' | 'history' | 'chat' | 'plagiarism' | 'content-detector';
  toggleTheme: () => void;
  setMode: (mode: ParaphraseMode) => void;
  setSummaryMode: (mode: SummaryMode) => void;
  setCurrentView: (view: 'paraphrase' | 'summary' | 'translation' | 'grammar' | 'transcription' | 'settings' | 'history' | 'chat' | 'plagiarism' | 'content-detector') => void;
  addToHistory: (item: Omit<ParaphraseHistory, 'id' | 'timestamp'>) => Promise<void>;
  addToSummaryHistory: (item: Omit<SummaryHistory, 'id' | 'timestamp'>) => Promise<void>;
  addToTranslationHistory: (item: Omit<TranslationHistory, 'id' | 'timestamp'>) => Promise<void>;
  loadHistory: () => Promise<void>;
  clearHistory: () => Promise<void>;
  clearSummaryHistory: () => Promise<void>;
  clearTranslationHistory: () => Promise<void>;
  clearAllHistory: () => Promise<void>;
  setProcessing: (processing: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  theme: 'dark',
  currentMode: 'standard',
  currentSummaryMode: 'comprehensive',
  history: [],
  summaryHistory: [],
  translationHistory: [],
  isProcessing: false,
  isLoadingHistory: false,
  currentView: 'paraphrase',

  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    set({ theme: newTheme });
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  },

  setMode: (mode: ParaphraseMode) => set({ currentMode: mode }),

  setSummaryMode: (mode: SummaryMode) => set({ currentSummaryMode: mode }),

  setCurrentView: (view: 'paraphrase' | 'summary' | 'translation' | 'grammar' | 'transcription' | 'settings' | 'history' | 'chat' | 'plagiarism' | 'content-detector') => set({ currentView: view }),

  addToHistory: async (item) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      const dbItem = await DatabaseService.addParaphraseHistory(user.id, {
        original_text: item.originalText,
        paraphrased_text: item.paraphrasedText,
        mode: item.mode,
        readability_score: item.readabilityScore,
        improvements: item.improvements,
      });

      if (dbItem) {
        const historyItem: ParaphraseHistory = {
          id: dbItem.id,
          originalText: dbItem.original_text,
          paraphrasedText: dbItem.paraphrased_text,
          mode: dbItem.mode as ParaphraseMode,
          timestamp: new Date(dbItem.created_at),
          readabilityScore: dbItem.readability_score,
          improvements: dbItem.improvements,
        };

        set(state => ({
          history: [historyItem, ...state.history.slice(0, 49)]
        }));
      }
    } catch (error) {
      console.error('Error adding to history:', error);
      // Fallback to local storage
      const historyItem: ParaphraseHistory = {
        ...item,
        id: crypto.randomUUID(),
        timestamp: new Date(),
      };
      set(state => ({
        history: [historyItem, ...state.history.slice(0, 49)]
      }));
    }
  },

  addToSummaryHistory: async (item) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      const dbItem = await DatabaseService.addSummaryHistory(user.id, {
        original_text: item.originalText,
        summary_text: item.summaryText,
        mode: item.mode,
        compression_ratio: item.compressionRatio,
        key_points: item.keyPoints,
      });

      if (dbItem) {
        const historyItem: SummaryHistory = {
          id: dbItem.id,
          originalText: dbItem.original_text,
          summaryText: dbItem.summary_text,
          mode: dbItem.mode as SummaryMode,
          timestamp: new Date(dbItem.created_at),
          compressionRatio: dbItem.compression_ratio,
          keyPoints: dbItem.key_points,
        };

        set(state => ({
          summaryHistory: [historyItem, ...state.summaryHistory.slice(0, 49)]
        }));
      }
    } catch (error) {
      console.error('Error adding to summary history:', error);
      // Fallback to local storage
      const historyItem: SummaryHistory = {
        ...item,
        id: crypto.randomUUID(),
        timestamp: new Date(),
      };
      set(state => ({
        summaryHistory: [historyItem, ...state.summaryHistory.slice(0, 49)]
      }));
    }
  },

  addToTranslationHistory: async (item) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      const dbItem = await DatabaseService.addTranslationHistory(user.id, {
        original_text: item.originalText,
        translated_text: item.translatedText,
        source_language: item.sourceLanguage,
        target_language: item.targetLanguage,
        detected_language: item.detectedLanguage,
        confidence: item.confidence,
      });

      if (dbItem) {
        const historyItem: TranslationHistory = {
          id: dbItem.id,
          originalText: dbItem.original_text,
          translatedText: dbItem.translated_text,
          sourceLanguage: dbItem.source_language,
          targetLanguage: dbItem.target_language,
          timestamp: new Date(dbItem.created_at),
          confidence: dbItem.confidence,
          detectedLanguage: dbItem.detected_language,
        };

        set(state => ({
          translationHistory: [historyItem, ...state.translationHistory.slice(0, 49)]
        }));
      }
    } catch (error) {
      console.error('Error adding to translation history:', error);
      // Fallback to local storage
      const historyItem: TranslationHistory = {
        ...item,
        id: crypto.randomUUID(),
        timestamp: new Date(),
      };
      set(state => ({
        translationHistory: [historyItem, ...state.translationHistory.slice(0, 49)]
      }));
    }
  },

  loadHistory: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ isLoadingHistory: true });

    try {
      const [paraphraseHistory, summaryHistory, translationHistory] = await Promise.all([
        DatabaseService.getParaphraseHistory(user.id),
        DatabaseService.getSummaryHistory(user.id),
        DatabaseService.getTranslationHistory(user.id),
      ]);

      const formattedParaphraseHistory: ParaphraseHistory[] = paraphraseHistory.map(item => ({
        id: item.id,
        originalText: item.original_text,
        paraphrasedText: item.paraphrased_text,
        mode: item.mode as ParaphraseMode,
        timestamp: new Date(item.created_at),
        readabilityScore: item.readability_score,
        improvements: item.improvements,
      }));

      const formattedSummaryHistory: SummaryHistory[] = summaryHistory.map(item => ({
        id: item.id,
        originalText: item.original_text,
        summaryText: item.summary_text,
        mode: item.mode as SummaryMode,
        timestamp: new Date(item.created_at),
        compressionRatio: item.compression_ratio,
        keyPoints: item.key_points,
      }));

      const formattedTranslationHistory: TranslationHistory[] = translationHistory.map(item => ({
        id: item.id,
        originalText: item.original_text,
        translatedText: item.translated_text,
        sourceLanguage: item.source_language,
        targetLanguage: item.target_language,
        timestamp: new Date(item.created_at),
        confidence: item.confidence,
        detectedLanguage: item.detected_language,
      }));

      set({
        history: formattedParaphraseHistory,
        summaryHistory: formattedSummaryHistory,
        translationHistory: formattedTranslationHistory,
      });
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      set({ isLoadingHistory: false });
    }
  },

  clearHistory: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      await DatabaseService.clearParaphraseHistory(user.id);
      set({ history: [] });
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  },

  clearSummaryHistory: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      await DatabaseService.clearSummaryHistory(user.id);
      set({ summaryHistory: [] });
    } catch (error) {
      console.error('Error clearing summary history:', error);
    }
  },

  clearTranslationHistory: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      await DatabaseService.clearTranslationHistory(user.id);
      set({ translationHistory: [] });
    } catch (error) {
      console.error('Error clearing translation history:', error);
    }
  },

  clearAllHistory: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      await DatabaseService.clearAllHistory(user.id);
      set({ 
        history: [],
        summaryHistory: [],
        translationHistory: []
      });
    } catch (error) {
      console.error('Error clearing all history:', error);
    }
  },

  setProcessing: (processing: boolean) => set({ isProcessing: processing }),
}));