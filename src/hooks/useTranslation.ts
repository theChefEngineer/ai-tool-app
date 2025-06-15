import { useLanguageStore } from '../store/languageStore';

export const useTranslation = () => {
  const { t, currentLanguage, isRTL } = useLanguageStore();
  
  return {
    t,
    currentLanguage,
    isRTL,
  };
};