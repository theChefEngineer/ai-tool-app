import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';
import type { Language } from '../../lib/i18n';
import toast from 'react-hot-toast';

const languages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ar' as Language, name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'fr' as Language, name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es' as Language, name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
];

export default function LanguageSelector() {
  const { currentLanguage, setLanguage, t } = useLanguageStore();

  const handleLanguageChange = (language: Language) => {
    setLanguage(language);
    toast.success(t('messages.success.languageChanged'));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6 rounded-2xl"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Globe className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t('settings.language')}
        </h2>
      </div>

      <div className="space-y-4">
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {t('settings.selectLanguage')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {languages.map((language) => (
            <motion.button
              key={language.code}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLanguageChange(language.code)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                currentLanguage === language.code
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{language.flag}</span>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white">
                      {language.nativeName}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {language.name}
                    </p>
                  </div>
                </div>
                
                {currentLanguage === language.code && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </div>

              {language.code === 'ar' && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                    <span>RTL Support</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Language Features */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
            Language Features
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Complete interface translation</li>
            <li>• Right-to-left (RTL) support for Arabic</li>
            <li>• Localized date and number formatting</li>
            <li>• Cultural adaptation for content</li>
            <li>• Automatic font optimization</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}