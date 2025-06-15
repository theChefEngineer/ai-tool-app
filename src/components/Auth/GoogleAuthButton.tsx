import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Chrome, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from '../../hooks/useTranslation';
import toast from 'react-hot-toast';

interface GoogleAuthButtonProps {
  variant?: 'signin' | 'signup';
  className?: string;
}

export default function GoogleAuthButton({ variant = 'signin', className = '' }: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const { signInWithGoogle } = useAuthStore();
  const { t, isRTL } = useTranslation();

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast.success(variant === 'signin' ? t('auth.welcomeBack') : t('messages.success.profileUpdated'));
    } catch (error: any) {
      console.error('Google authentication error:', error);
      
      // Handle specific Google OAuth errors
      if (error.message.includes('provider is not enabled') || error.message.includes('validation_failed')) {
        setIsDisabled(true);
        toast.error('Google Sign-In is currently being configured. Please use email/password for now.');
      } else if (error.message.includes('popup')) {
        toast.error('Please allow popups and try again.');
      } else if (error.message.includes('cancelled')) {
        toast.error('Sign-in was cancelled.');
      } else {
        toast.error(error.message || t('messages.error.authentication'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const buttonText = variant === 'signin' 
    ? t('auth.continueWithGoogle')
    : t('auth.continueWithGoogle');

  if (isDisabled) {
    return (
      <div className="w-full p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/30 rounded-xl">
        <div className="flex items-center space-x-2 text-orange-700 dark:text-orange-300">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">Google Sign-In is being configured. Please use email/password.</span>
        </div>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleGoogleAuth}
      disabled={isLoading}
      className={`
        w-full flex items-center justify-center space-x-3 p-4 
        glass-button rounded-xl font-semibold transition-all duration-200
        hover:bg-white/20 dark:hover:bg-slate-600/40
        disabled:opacity-50 disabled:cursor-not-allowed
        border border-white/20 dark:border-slate-600/30
        ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}
        ${className}
      `}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="w-5 h-5 animate-spin text-slate-600 dark:text-slate-300" />
          <span className="text-slate-700 dark:text-slate-200">Connecting...</span>
        </div>
      ) : (
        <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
          {/* Google Logo SVG */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className="flex-shrink-0"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-slate-700 dark:text-slate-200">
            {buttonText}
          </span>
        </div>
      )}
    </motion.button>
  );
}