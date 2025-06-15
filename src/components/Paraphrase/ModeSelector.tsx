import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Briefcase, Palette, Scissors, Expand } from 'lucide-react';
import { useAppStore, type ParaphraseMode } from '../../store/appStore';
import { useTranslation } from '../../hooks/useTranslation';

const modes = [
  {
    key: 'standard' as ParaphraseMode,
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    key: 'formal' as ParaphraseMode,
    icon: Briefcase,
    color: 'from-gray-600 to-gray-800',
  },
  {
    key: 'creative' as ParaphraseMode,
    icon: Palette,
    color: 'from-purple-500 to-pink-500',
  },
  {
    key: 'shorten' as ParaphraseMode,
    icon: Scissors,
    color: 'from-orange-500 to-red-500',
  },
  {
    key: 'expand' as ParaphraseMode,
    icon: Expand,
    color: 'from-green-500 to-teal-500',
  },
];

export default function ModeSelector() {
  const { currentMode, setMode } = useAppStore();
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-6 rounded-2xl"
    >
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
        {t('paraphrase.chooseWritingStyle')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {modes.map((mode, index) => (
          <motion.button
            key={mode.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMode(mode.key)}
            className={`p-4 rounded-xl transition-all duration-200 text-left ${
              currentMode === mode.key
                ? 'ring-2 ring-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30'
                : 'glass-button hover:bg-white/10'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${mode.color} flex items-center justify-center mb-3`}>
              <mode.icon className="w-5 h-5 text-white" />
            </div>
            
            <h4 className="font-semibold text-slate-800 dark:text-white mb-1">
              {t(`paraphrase.modes.${mode.key}`)}
            </h4>
            
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t(`paraphrase.modeDescriptions.${mode.key}`)}
            </p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}