import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Zap, Target, BookOpen, List } from 'lucide-react';
import { useAppStore, type SummaryMode } from '../../store/appStore';
import { useTranslation } from '../../hooks/useTranslation';

const modes = [
  {
    key: 'comprehensive' as SummaryMode,
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    key: 'executive' as SummaryMode,
    icon: Target,
    color: 'from-gray-600 to-gray-800',
  },
  {
    key: 'academic' as SummaryMode,
    icon: BookOpen,
    color: 'from-purple-500 to-indigo-500',
  },
  {
    key: 'bullet' as SummaryMode,
    icon: List,
    color: 'from-orange-500 to-red-500',
  },
  {
    key: 'quick' as SummaryMode,
    icon: Zap,
    color: 'from-green-500 to-teal-500',
  },
];

export default function SummaryModeSelector() {
  const { currentSummaryMode, setSummaryMode } = useAppStore();
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-6 rounded-2xl"
    >
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
        {t('summary.chooseSummaryStyle')}
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
            onClick={() => setSummaryMode(mode.key)}
            className={`p-4 rounded-xl transition-all duration-200 text-left ${
              currentSummaryMode === mode.key
                ? 'ring-2 ring-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30'
                : 'glass-button hover:bg-white/10'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${mode.color} flex items-center justify-center mb-3`}>
              <mode.icon className="w-5 h-5 text-white" />
            </div>
            
            <h4 className="font-semibold text-slate-800 dark:text-white mb-1">
              {t(`summary.modes.${mode.key}`)}
            </h4>
            
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t(`summary.modeDescriptions.${mode.key}`)}
            </p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}