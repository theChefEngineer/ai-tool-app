import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Globe } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface LanguageSelectorProps {
  sourceLanguage: string;
  targetLanguage: string;
  onSourceChange: (language: string) => void;
  onTargetChange: (language: string) => void;
  onSwap: () => void;
}

const languages = [
  { code: 'auto', name: 'Auto-detect', flag: '🌐' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'da', name: 'Danish', flag: '🇩🇰' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
];

export default function LanguageSelector({
  sourceLanguage,
  targetLanguage,
  onSourceChange,
  onTargetChange,
  onSwap,
}: LanguageSelectorProps) {
  const { t } = useTranslation();

  const getLanguageName = (code: string) => {
    const lang = languages.find(l => l.code === code);
    return lang ? `${lang.flag} ${lang.name}` : code;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-6 rounded-2xl"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
          {t('translation.languageSelection')}
        </h3>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Source Language */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {t('translation.from')}
          </label>
          <select
            value={sourceLanguage}
            onChange={(e) => onSourceChange(e.target.value)}
            className="w-full p-3 glass-input rounded-xl appearance-none cursor-pointer"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex items-end pb-3">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSwap}
            disabled={sourceLanguage === 'auto'}
            className="p-3 glass-button rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            title="Swap languages"
          >
            <ArrowRightLeft className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </motion.button>
        </div>

        {/* Target Language */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {t('translation.to')}
          </label>
          <select
            value={targetLanguage}
            onChange={(e) => onTargetChange(e.target.value)}
            className="w-full p-3 glass-input rounded-xl appearance-none cursor-pointer"
          >
            {languages.filter(lang => lang.code !== 'auto').map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Language Info */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <div className="flex items-center justify-between text-sm">
          <span className="text-blue-700 dark:text-blue-300">
            Translating: {getLanguageName(sourceLanguage)} → {getLanguageName(targetLanguage)}
          </span>
          {sourceLanguage === 'auto' && (
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {t('translation.autoDetect')} enabled
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}