import { create } from 'zustand';

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
  currentView: 'paraphrase' | 'summary' | 'translation' | 'settings' | 'history' | 'chat';
  toggleTheme: () => void;
  setMode: (mode: ParaphraseMode) => void;
  setSummaryMode: (mode: SummaryMode) => void;
  setCurrentView: (view: 'paraphrase' | 'summary' | 'translation' | 'settings' | 'history' | 'chat') => void;
  addToHistory: (item: Omit<ParaphraseHistory, 'id' | 'timestamp'>) => void;
  addToSummaryHistory: (item: Omit<SummaryHistory, 'id' | 'timestamp'>) => void;
  addToTranslationHistory: (item: Omit<TranslationHistory, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  clearSummaryHistory: () => void;
  clearTranslationHistory: () => void;
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
  currentView: 'paraphrase',

  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    set({ theme: newTheme });
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  },

  setMode: (mode: ParaphraseMode) => set({ currentMode: mode }),

  setSummaryMode: (mode: SummaryMode) => set({ currentSummaryMode: mode }),

  setCurrentView: (view: 'paraphrase' | 'summary' | 'translation' | 'settings' | 'history' | 'chat') => set({ currentView: view }),

  addToHistory: (item) => {
    const historyItem: ParaphraseHistory = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    set(state => ({
      history: [historyItem, ...state.history.slice(0, 49)] // Keep last 50 items
    }));
  },

  addToSummaryHistory: (item) => {
    const historyItem: SummaryHistory = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    set(state => ({
      summaryHistory: [historyItem, ...state.summaryHistory.slice(0, 49)] // Keep last 50 items
    }));
  },

  addToTranslationHistory: (item) => {
    const historyItem: TranslationHistory = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    set(state => ({
      translationHistory: [historyItem, ...state.translationHistory.slice(0, 49)] // Keep last 50 items
    }));
  },

  clearHistory: () => set({ history: [] }),

  clearSummaryHistory: () => set({ summaryHistory: [] }),

  clearTranslationHistory: () => set({ translationHistory: [] }),

  setProcessing: (processing: boolean) => set({ isProcessing: processing }),
}));