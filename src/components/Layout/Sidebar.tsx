import React from 'react';
import { motion } from 'framer-motion';
import { Home, History, Settings, BookOpen, Zap, Languages, MessageCircle } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export default function Sidebar() {
  const { currentView, setCurrentView } = useAppStore();

  const menuItems = [
    { 
      icon: Home, 
      label: 'Paraphrase', 
      key: 'paraphrase' as const,
      active: currentView === 'paraphrase' 
    },
    { 
      icon: BookOpen, 
      label: 'Summary', 
      key: 'summary' as const,
      active: currentView === 'summary' 
    },
    { 
      icon: Languages, 
      label: 'Translation', 
      key: 'translation' as const,
      active: currentView === 'translation' 
    },
    { 
      icon: MessageCircle, 
      label: 'AI Chat', 
      key: 'chat' as const,
      active: currentView === 'chat' 
    },
    { 
      icon: History, 
      label: 'History', 
      key: 'history' as const, 
      active: currentView === 'history' 
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      key: 'settings' as const, 
      active: currentView === 'settings' 
    },
    { icon: Zap, label: 'Upgrade', key: 'upgrade' as const, active: false, premium: true },
  ];

  const getActiveColors = (key: string) => {
    switch (key) {
      case 'summary':
        return 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 shadow-lg';
      case 'translation':
        return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400 shadow-lg';
      case 'chat':
        return 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400 shadow-lg';
      case 'settings':
        return 'bg-gradient-to-r from-slate-500/20 to-gray-500/20 text-slate-600 dark:text-slate-400 shadow-lg';
      case 'history':
        return 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-600 dark:text-orange-400 shadow-lg';
      default:
        return 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-600 dark:text-indigo-400 shadow-lg';
    }
  };

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 glass-card border-r border-white/10 z-40"
    >
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (item.key === 'paraphrase' || item.key === 'summary' || item.key === 'translation' || item.key === 'settings' || item.key === 'history' || item.key === 'chat') {
                  setCurrentView(item.key);
                }
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                item.active
                  ? getActiveColors(item.key)
                  : 'hover:bg-white/5 text-slate-600 dark:text-slate-300'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.premium && (
                <span className="ml-auto px-2 py-1 text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-black rounded-full font-bold">
                  PRO
                </span>
              )}
            </motion.button>
          ))}
        </nav>

        <div className="mt-8 p-4 glass-card rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Usage Today
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full w-3/4"></div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            15 of 20 free operations used
          </p>
        </div>
      </div>
    </motion.aside>
  );
}