import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language, TranslationKeys } from '../lib/i18n';
import { translations } from '../locales';

interface LanguageState {
  currentLanguage: Language;
  isRTL: boolean;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  getNestedTranslation: (obj: any, path: string) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      currentLanguage: 'en',
      isRTL: false,

      setLanguage: (language: Language) => {
        const isRTL = language === 'ar';
        
        set({ 
          currentLanguage: language, 
          isRTL 
        });

        // Update document direction and language
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
        
        // Update body class for RTL styling
        if (isRTL) {
          document.body.classList.add('rtl');
        } else {
          document.body.classList.remove('rtl');
        }

        // Update font family for Arabic
        if (language === 'ar') {
          document.documentElement.style.setProperty('--font-family', '"Noto Sans Arabic", "Cairo", "Amiri", system-ui, sans-serif');
        } else {
          document.documentElement.style.setProperty('--font-family', '"Inter", system-ui, -apple-system, sans-serif');
        }
      },

      getNestedTranslation: (obj: any, path: string): string => {
        return path.split('.').reduce((current, key) => {
          return current && current[key] !== undefined ? current[key] : key;
        }, obj);
      },

      t: (key: string): string => {
        const { currentLanguage, getNestedTranslation } = get();
        const translation = translations[currentLanguage];
        
        if (!translation) {
          console.warn(`Translation not found for language: ${currentLanguage}`);
          return key;
        }

        const result = getNestedTranslation(translation, key);
        
        if (result === key || result === undefined) {
          // Fallback to English if translation not found
          const fallback = getNestedTranslation(translations.en, key);
          if (fallback !== key) {
            console.warn(`Translation missing for key "${key}" in language "${currentLanguage}", using English fallback`);
            return fallback;
          }
          console.warn(`Translation missing for key: ${key}`);
          return key;
        }

        return result;
      },
    }),
    {
      name: 'language-storage',
      partialize: (state) => ({
        currentLanguage: state.currentLanguage,
        isRTL: state.isRTL,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Apply language settings on app load
          document.documentElement.dir = state.isRTL ? 'rtl' : 'ltr';
          document.documentElement.lang = state.currentLanguage;
          
          if (state.isRTL) {
            document.body.classList.add('rtl');
          } else {
            document.body.classList.remove('rtl');
          }

          if (state.currentLanguage === 'ar') {
            document.documentElement.style.setProperty('--font-family', '"Noto Sans Arabic", "Cairo", "Amiri", system-ui, sans-serif');
          } else {
            document.documentElement.style.setProperty('--font-family', '"Inter", system-ui, -apple-system, sans-serif');
          }
        }
      },
    }
  )
);