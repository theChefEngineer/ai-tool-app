import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { Toaster } from 'react-hot-toast';
import Header from './Header';
import Sidebar from './Sidebar';
import AuthModal from '../Auth/AuthModal';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { initialize, user } = useAuthStore();
  const theme = useAppStore(state => state.theme);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 transition-all duration-500">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] pointer-events-none" />
      
      <Header />
      
      <div className="flex">
        {user && <Sidebar />}
        
        <main className={`flex-1 transition-all duration-300 ${user ? 'ml-64' : ''}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {!user && <AuthModal />}
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: 'glass-card',
          style: {
            background: theme === 'dark' 
              ? 'rgba(15, 23, 42, 0.9)' 
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
          },
        }}
      />
    </div>
  );
}