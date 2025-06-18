import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  BookOpen, 
  Languages, 
  Settings, 
  History, 
  MessageCircle, 
  Shield, 
  Bot, 
  BookCheck, 
  FileText, 
  User, 
  LogOut, 
  Crown 
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from '../../hooks/useTranslation';
import UsageIndicator from './UsageIndicator';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { currentView, setCurrentView } = useAppStore();
  const { user, signOut } = useAuthStore();
  const { t, isRTL } = useTranslation();

  const menuItems = [
    { 
      icon: Home, 
      label: t('nav.paraphrase'), 
      key: 'paraphrase' as const,
      active: currentView === 'paraphrase' 
    },
    { 
      icon: BookOpen, 
      label: t('nav.summary'), 
      key: 'summary' as const,
      active: currentView === 'summary' 
    },
    { 
      icon: Languages, 
      label: t('nav.translation'), 
      key: 'translation' as const,
      active: currentView === 'translation' 
    },
    { 
      icon: BookCheck, 
      label: t('nav.grammar'), 
      key: 'grammar' as const,
      active: currentView === 'grammar' 
    },
    { 
      icon: FileText, 
      label: t('nav.transcription'), 
      key: 'transcription' as const,
      active: currentView === 'transcription' 
    },
    { 
      icon: Shield, 
      label: t('nav.plagiarism'), 
      key: 'plagiarism' as const,
      active: currentView === 'plagiarism' 
    },
    { 
      icon: Bot, 
      label: t('nav.contentDetector'), 
      key: 'content-detector' as const,
      active: currentView === 'content-detector' 
    },
    { 
      icon: MessageCircle, 
      label: t('nav.chat'), 
      key: 'chat' as const,
      active: currentView === 'chat' 
    },
    { 
      icon: History, 
      label: t('nav.history'), 
      key: 'history' as const, 
      active: currentView === 'history' 
    },
    { 
      icon: Settings, 
      label: t('nav.settings'), 
      key: 'settings' as const, 
      active: currentView === 'settings' 
    },
    { icon: Crown, label: t('nav.upgrade'), key: 'upgrade' as const, active: false, premium: true },
  ];

  const getActiveColors = (key: string) => {
    switch (key) {
      case 'summary':
        return 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 shadow-lg';
      case 'translation':
        return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400 shadow-lg';
      case 'grammar':
        return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-600 dark:text-green-400 shadow-lg';
      case 'transcription':
        return 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-600 dark:text-purple-400 shadow-lg';
      case 'plagiarism':
        return 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-600 dark:text-red-400 shadow-lg';
      case 'content-detector':
        return 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 dark:text-blue-400 shadow-lg';
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

  const handleMenuItemClick = (key: string) => {
    if (key === 'paraphrase' || key === 'summary' || key === 'translation' || key === 'grammar' || 
        key === 'transcription' || key === 'settings' || key === 'history' || key === 'chat' || 
        key === 'plagiarism' || key === 'content-detector') {
      setCurrentView(key as any);
      onClose();
    } else if (key === 'upgrade') {
      setCurrentView('settings');
      onClose();
      // Scroll to subscription section after navigation
      setTimeout(() => {
        const element = document.getElementById('subscription-manager');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleSignOut = () => {
    signOut();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: isRTL ? 300 : -300 }}
        animate={{ x: 0 }}
        exit={{ x: isRTL ? 300 : -300 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`fixed ${isRTL ? 'right-0' : 'left-0'} top-0 h-full w-4/5 max-w-xs glass-card z-50 overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
        aria-label="Mobile navigation menu"
        role="dialog"
        aria-modal="true"
        id="mobile-menu"
      >
        {/* User Info */}
        {user && (
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">
                  {user.email?.split('@')[0]}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Usage Indicator */}
        <div className="p-6 border-b border-white/10">
          <UsageIndicator />
        </div>

        {/* Menu Items */}
        <div className="p-6 space-y-2">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleMenuItemClick(item.key)}
              className={`w-full flex items-center ${isRTL ? 'flex-row-reverse' : ''} ${isRTL ? 'space-x-reverse' : ''} space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                item.active
                  ? getActiveColors(item.key)
                  : 'hover:bg-white/5 text-slate-600 dark:text-slate-300'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-left flex-1">{item.label}</span>
              {item.premium && (
                <span className="px-2 py-1 text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-black rounded-full font-bold flex-shrink-0">
                  PRO
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Sign Out Button */}
        {user && (
          <div className="p-6 border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-white/5"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{t('auth.signOut')}</span>
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}