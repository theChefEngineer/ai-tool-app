import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, User, LogOut, Sparkles, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { useTranslation } from '../../hooks/useTranslation';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarVisible: boolean;
}

export default function Header({ toggleSidebar, sidebarVisible }: HeaderProps) {
  const { user, signOut } = useAuthStore();
  const { theme, toggleTheme } = useAppStore();
  const { t, isRTL } = useTranslation();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-card border-b border-white/10 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Sidebar Toggle Button */}
          {user && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSidebar}
              className="p-2 glass-button rounded-xl"
              aria-label={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
              aria-expanded={sidebarVisible}
              aria-controls="sidebar"
            >
              {sidebarVisible ? (
                <X className="w-6 h-6 text-slate-600 dark:text-slate-300" />
              ) : (
                <Menu className="w-6 h-6 text-slate-600 dark:text-slate-300" />
              )}
            </motion.button>
          )}

          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                ParaText Pro
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI-Powered Writing Assistant
              </p>
            </div>
          </motion.div>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl glass-button"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </motion.button>

            {user && (
              <>
                <div className="hidden md:flex items-center space-x-2 px-3 py-2 glass-card rounded-xl">
                  <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  <span className="text-sm text-slate-700 dark:text-slate-200">
                    {user.email?.split('@')[0]}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={signOut}
                  className="hidden md:flex p-2 rounded-xl glass-button text-red-500 hover:text-red-400"
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}