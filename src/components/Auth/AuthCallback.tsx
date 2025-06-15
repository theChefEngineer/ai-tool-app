import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export default function AuthCallback() {
  const { t } = useTranslation();

  useEffect(() => {
    // Immediately redirect to the main app
    // The main app's authentication system will handle the session from the URL hash
    window.location.href = '/';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-md w-full p-8 rounded-2xl text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </motion.div>

        <h2 className="text-2xl font-bold mb-4 text-indigo-600">
          Authenticating...
        </h2>

        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Please wait while we complete your authentication...
        </p>

        <div className="flex items-center justify-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
          <span>Redirecting to the application...</span>
        </div>
      </motion.div>
    </div>
  );
}