import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useTranslation } from '../../hooks/useTranslation';

export default function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if we have auth data in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        const code = urlParams.get('code') || hashParams.get('code');
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const error = urlParams.get('error') || hashParams.get('error');
        const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');

        console.log('Auth callback data:', { code, accessToken, error, errorDescription });

        if (error) {
          console.error('OAuth error:', error, errorDescription);
          setStatus('error');
          setMessage(errorDescription || error || 'Authentication failed');
          
          setTimeout(() => {
            window.location.href = '/';
          }, 3000);
          return;
        }

        if (code || accessToken) {
          setMessage('Processing authentication...');
          
          // Let Supabase handle the OAuth callback
          const { data, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('Session error:', sessionError);
            
            // Try to exchange the code for a session if we have one
            if (code) {
              try {
                const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
                
                if (exchangeError) {
                  throw exchangeError;
                }
                
                if (exchangeData.session) {
                  setStatus('success');
                  setMessage('Successfully authenticated! Redirecting...');
                  
                  setTimeout(() => {
                    window.location.href = '/';
                  }, 1500);
                  return;
                }
              } catch (exchangeError) {
                console.error('Code exchange error:', exchangeError);
                throw sessionError;
              }
            }
            
            throw sessionError;
          }

          if (data.session) {
            setStatus('success');
            setMessage('Successfully authenticated! Redirecting...');
            
            setTimeout(() => {
              window.location.href = '/';
            }, 1500);
          } else {
            // Wait a bit for the session to be established
            setTimeout(async () => {
              const { data: retryData } = await supabase.auth.getSession();
              if (retryData.session) {
                setStatus('success');
                setMessage('Successfully authenticated! Redirecting...');
                
                setTimeout(() => {
                  window.location.href = '/';
                }, 1500);
              } else {
                setStatus('error');
                setMessage('Authentication session could not be established. Please try again.');
                
                setTimeout(() => {
                  window.location.href = '/';
                }, 3000);
              }
            }, 2000);
          }
        } else {
          setStatus('error');
          setMessage('No authentication data found. Please try signing in again.');
          
          setTimeout(() => {
            window.location.href = '/';
          }, 3000);
        }
      } catch (error: any) {
        console.error('Unexpected error during auth callback:', error);
        setStatus('error');
        setMessage(error.message || 'An unexpected error occurred. Please try again.');
        
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }
    };

    handleAuthCallback();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-indigo-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
    }
  };

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
          {getStatusIcon()}
        </motion.div>

        <h2 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
          {status === 'loading' && 'Authenticating...'}
          {status === 'success' && 'Welcome!'}
          {status === 'error' && 'Authentication Failed'}
        </h2>

        <p className="text-slate-600 dark:text-slate-300 mb-6">
          {message}
        </p>

        {status === 'error' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold"
          >
            Return to Sign In
          </motion.button>
        )}

        {status === 'loading' && (
          <div className="flex items-center justify-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
            <span>Please wait while we complete your authentication...</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}