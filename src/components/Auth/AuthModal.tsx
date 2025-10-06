import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

interface AuthModalProps {
  onClose?: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const { t, isRTL } = useTranslation();
  const { signIn, signUp } = useAuthStore();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!email.trim()) {
      newErrors.email = t('messages.error.required');
    }

    if (!password) {
      newErrors.password = t('messages.error.required');
    }

    if (!isLogin) {
      if (!confirmPassword) {
        newErrors.confirmPassword = t('messages.error.required');
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = t('messages.error.passwordsDoNotMatch');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success(t('auth.welcomeBack'));
        if (onClose) onClose();
      } else {
        await signUp(email, password);
        toast.success('Account created successfully!');
        if (onClose) onClose();
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthLabel = (strength: number) => {
    switch (strength) {
      case 0:
      case 1: return { label: 'Very Weak', color: 'bg-red-500' };
      case 2: return { label: 'Weak', color: 'bg-orange-500' };
      case 3: return { label: 'Fair', color: 'bg-yellow-500' };
      case 4: return { label: 'Good', color: 'bg-blue-500' };
      case 5: return { label: 'Strong', color: 'bg-green-500' };
      default: return { label: 'Very Weak', color: 'bg-red-500' };
    }
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthInfo = getPasswordStrengthLabel(passwordStrength);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`glass-card max-w-md w-full p-8 rounded-2xl ${isRTL ? 'rtl' : ''}`}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            {isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            {isLogin 
              ? t('auth.signInToContinue')
              : t('auth.joinParaTextPro')
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400`} />
            <input
              type="email"
              placeholder={t('auth.email')}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              className={`
                w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 glass-input rounded-xl
                ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
              `}
              required
            />
            {errors.email && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-1 mt-1 text-red-500 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{errors.email}</span>
              </motion.div>
            )}
          </div>

          <div className="relative">
            <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400`} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={t('auth.password')}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              className={`
                w-full ${isRTL ? 'pr-12 pl-12' : 'pl-12 pr-12'} py-3 glass-input rounded-xl
                ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
              `}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300`}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            
            {!isLogin && password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Password Strength</span>
                  <span className={`font-medium ${
                    passwordStrength >= 4 ? 'text-green-600' : 
                    passwordStrength >= 3 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {strengthInfo.label}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${strengthInfo.color}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
              </motion.div>
            )}
            
            {errors.password && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-1 mt-1 text-red-500 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{errors.password}</span>
              </motion.div>
            )}
          </div>

          <AnimatePresence>
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative"
              >
                <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400`} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={t('auth.confirmPassword')}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                  className={`
                    w-full ${isRTL ? 'pr-12 pl-12' : 'pl-12 pr-12'} py-3 glass-input rounded-xl
                    ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
                  `}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300`}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                
                {confirmPassword && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center space-x-1 mt-1 text-sm"
                  >
                    {password === confirmPassword ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-red-500">Passwords don't match</span>
                      </>
                    )}
                  </motion.div>
                )}
                
                {errors.confirmPassword && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-1 mt-1 text-red-500 text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.confirmPassword}</span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                <span>{t('common.loading')}</span>
              </div>
            ) : (
              isLogin ? t('auth.signIn') : t('auth.createAccount')
            )}
          </motion.button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
              setPassword('');
              setConfirmPassword('');
            }}
            className="text-indigo-600 dark:text-indigo-400 hover:underline transition-colors"
          >
            {isLogin 
              ? t('auth.dontHaveAccount')
              : t('auth.alreadyHaveAccount')
            }
          </button>
        </div>

        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/30">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs text-blue-700 dark:text-blue-300">
              Your data is encrypted and secure. We never store your passwords in plain text.
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
