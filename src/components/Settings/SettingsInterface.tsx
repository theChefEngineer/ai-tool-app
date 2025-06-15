import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Edit3, 
  Crown, 
  Calendar, 
  CreditCard, 
  Palette, 
  Sun, 
  Moon,
  Check,
  Settings as SettingsIcon,
  Shield,
  Bell,
  Globe,
  Download,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Save,
  X,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { DatabaseService, type UserProfile } from '../../lib/database';
import { StripeService, type SubscriptionData } from '../../lib/stripe';
import { stripeProducts } from '../../stripe-config';
import SubscriptionManager from '../Subscription/SubscriptionManager';
import toast from 'react-hot-toast';

export default function SettingsInterface() {
  const { user } = useAuthStore();
  const { theme, toggleTheme, clearAllHistory } = useAppStore();
  
  // Profile state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [profileErrors, setProfileErrors] = useState<{[key: string]: string}>({});

  // Subscription state
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);

  // Password change state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState<{[key: string]: string}>({});
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Load user profile and subscription on component mount
  useEffect(() => {
    loadUserProfile();
    loadSubscription();
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    setIsLoadingProfile(true);
    try {
      const profile = await DatabaseService.getUserProfile(user.id);
      if (profile) {
        setUserProfile(profile);
        setProfileData({
          firstName: profile.first_name,
          lastName: profile.last_name,
          email: profile.email,
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const loadSubscription = async () => {
    setIsLoadingSubscription(true);
    try {
      const data = await StripeService.getUserSubscription();
      setSubscription(data);
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setIsLoadingSubscription(false);
    }
  };

  // Profile validation
  const validateProfile = () => {
    const errors: {[key: string]: string} = {};
    
    if (!profileData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!profileData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!profileData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Password validation
  const validatePassword = () => {
    const errors: {[key: string]: string} = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      errors.newPassword = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile() || !user) return;

    setIsSavingProfile(true);
    try {
      const updatedProfile = await DatabaseService.updateUserProfile(user.id, {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: profileData.email,
      } as Partial<UserProfile>);

      if (updatedProfile) {
        setUserProfile(updatedProfile);
        setIsEditingProfile(false);
        toast.success('Profile updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancelProfileEdit = () => {
    if (userProfile) {
      setProfileData({
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
        email: userProfile.email,
      });
    }
    setProfileErrors({});
    setIsEditingProfile(false);
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setIsUpdatingPassword(true);
    try {
      // Simulate password change API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsChangingPassword(false);
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error('Failed to change password. Please try again.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleCancelPasswordChange = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordErrors({});
    setIsChangingPassword(false);
  };

  const handleThemeChange = () => {
    toggleTheme();
    toast.success(`Switched to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  };

  const handleExportData = async () => {
    if (!user) return;

    try {
      const exportData = await DatabaseService.exportAllHistory(user.id);
      if (exportData) {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `paratext-pro-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success('Data exported successfully!');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  const handleClearAllData = async () => {
    if (!user) return;

    if (window.confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      try {
        await clearAllHistory();
        toast.success('All data cleared successfully!');
      } catch (error) {
        console.error('Error clearing data:', error);
        toast.error('Failed to clear data');
      }
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

  const getCurrentPlan = () => {
    if (!subscription || subscription.subscription_status !== 'active' || !subscription.price_id) {
      return { name: 'Free Plan', description: '20 operations per day' };
    }

    const product = stripeProducts.find(p => p.priceId === subscription.price_id);
    return product ? { name: product.name, description: product.description } : { name: 'Unknown Plan', description: 'Active subscription' };
  };

  if (isLoadingProfile) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400" />
          <span className="text-lg text-slate-600 dark:text-slate-300">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-600 to-slate-800 dark:from-slate-300 dark:to-slate-100 bg-clip-text text-transparent mb-4">
          Settings
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Manage your account, preferences, and subscription settings
        </p>
      </motion.div>

      {/* User Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8 rounded-2xl"
      >
        <div className="flex items-center space-x-2 mb-6">
          <User className="w-6 h-6 text-slate-600 dark:text-slate-300" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Profile Information
          </h2>
        </div>

        <div className="flex flex-col md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700"
              >
                <Edit3 className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </motion.button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1 space-y-4">
            {isEditingProfile ? (
              <div className="space-y-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    className={`w-full p-3 glass-input rounded-xl ${profileErrors.firstName ? 'border-red-500' : ''}`}
                    placeholder="Enter your first name"
                    disabled={isSavingProfile}
                  />
                  {profileErrors.firstName && (
                    <p className="mt-1 text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{profileErrors.firstName}</span>
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    className={`w-full p-3 glass-input rounded-xl ${profileErrors.lastName ? 'border-red-500' : ''}`}
                    placeholder="Enter your last name"
                    disabled={isSavingProfile}
                  />
                  {profileErrors.lastName && (
                    <p className="mt-1 text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{profileErrors.lastName}</span>
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className={`w-full p-3 glass-input rounded-xl ${profileErrors.email ? 'border-red-500' : ''}`}
                    placeholder="Enter your email address"
                    disabled={isSavingProfile}
                  />
                  {profileErrors.email && (
                    <p className="mt-1 text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{profileErrors.email}</span>
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isSavingProfile ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancelProfileEdit}
                    disabled={isSavingProfile}
                    className="px-6 py-2 glass-button rounded-xl flex items-center space-x-2 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                    {userProfile?.full_name || 'No name set'}
                  </h3>
                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 mt-1">
                    <Mail className="w-4 h-4" />
                    <span>{userProfile?.email || 'No email set'}</span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                    <span>First Name: {userProfile?.first_name || 'Not set'}</span>
                    <span>Last Name: {userProfile?.last_name || 'Not set'}</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditingProfile(true)}
                  className="px-6 py-2 glass-button rounded-xl flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Subscription Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8 rounded-2xl"
      >
        <div className="flex items-center space-x-2 mb-6">
          <Crown className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Subscription
          </h2>
        </div>

        {isLoadingSubscription ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Current Plan */}
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800/30">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                      {getCurrentPlan().name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {getCurrentPlan().description}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Status</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        subscription?.subscription_status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className={`font-medium capitalize ${
                        subscription?.subscription_status === 'active' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {subscription?.subscription_status === 'active' ? 'Active' : 'Free'}
                      </span>
                    </div>
                  </div>
                  {subscription?.subscription_status !== 'active' && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Usage Today</span>
                      <span className="text-slate-800 dark:text-white font-medium">15 / 20</span>
                    </div>
                  )}
                  {subscription?.current_period_end && subscription.subscription_status === 'active' && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Next Billing</span>
                      <span className="text-slate-800 dark:text-white font-medium">
                        {StripeService.formatDate(subscription.current_period_end)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {subscription?.subscription_status !== 'active' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Scroll to subscription manager
                    const element = document.getElementById('subscription-manager');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold flex items-center justify-center space-x-2"
                >
                  <Crown className="w-5 h-5" />
                  <span>Upgrade to Pro</span>
                </motion.button>
              )}
            </div>

            {/* Pro Plan Preview */}
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800/30">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                      Pro Plan
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      €5.00/month
                    </p>
                  </div>
                </div>
                
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-slate-700 dark:text-slate-300">Unlimited operations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-slate-700 dark:text-slate-300">Priority processing</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-slate-700 dark:text-slate-300">Advanced AI models</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-slate-700 dark:text-slate-300">Export history</span>
                  </li>
                </ul>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-6 py-2 glass-button rounded-xl flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Manage Billing</span>
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Appearance Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-8 rounded-2xl"
      >
        <div className="flex items-center space-x-2 mb-6">
          <Palette className="w-6 h-6 text-slate-600 dark:text-slate-300" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Appearance
          </h2>
        </div>

        <div className="space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">
                Theme Preference
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Choose between light and dark mode
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleThemeChange}
              className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600' 
                  : 'bg-gradient-to-r from-yellow-400 to-orange-500'
              }`}
            >
              <motion.div
                animate={{ x: theme === 'dark' ? 32 : 4 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center"
              >
                {theme === 'dark' ? (
                  <Moon className="w-3 h-3 text-indigo-600" />
                ) : (
                  <Sun className="w-3 h-3 text-orange-600" />
                )}
              </motion.div>
            </motion.button>
          </div>

          {/* Theme Preview */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              theme === 'light' 
                ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50' 
                : 'border-slate-300 bg-white'
            }`}>
              <div className="flex items-center space-x-2 mb-3">
                <Sun className="w-5 h-5 text-orange-500" />
                <span className="font-medium text-slate-800">Light Mode</span>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-slate-200 rounded"></div>
                <div className="h-2 bg-slate-100 rounded w-3/4"></div>
                <div className="h-2 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>

            <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              theme === 'dark' 
                ? 'border-indigo-400 bg-gradient-to-br from-slate-800 to-slate-900' 
                : 'border-slate-300 bg-slate-800'
            }`}>
              <div className="flex items-center space-x-2 mb-3">
                <Moon className="w-5 h-5 text-indigo-400" />
                <span className="font-medium text-white">Dark Mode</span>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-slate-600 rounded"></div>
                <div className="h-2 bg-slate-700 rounded w-3/4"></div>
                <div className="h-2 bg-slate-600 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Additional Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-8 rounded-2xl"
      >
        <div className="flex items-center space-x-2 mb-6">
          <SettingsIcon className="w-6 h-6 text-slate-600 dark:text-slate-300" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Additional Settings
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Privacy & Security */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Privacy & Security</span>
            </h3>
            <div className="space-y-3">
              {/* Change Password Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsChangingPassword(true)}
                className="w-full p-3 glass-button rounded-xl text-left flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-700 dark:text-slate-300">Change Password</span>
                </div>
                <Edit3 className="w-4 h-4 text-slate-500" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-3 glass-button rounded-xl text-left flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-700 dark:text-slate-300">Two-Factor Authentication</span>
                </div>
                <span className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">
                  Coming Soon
                </span>
              </motion.button>
            </div>
          </div>

          {/* Data Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Data Management</span>
            </h3>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportData}
                className="w-full p-3 glass-button rounded-xl text-left flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-700 dark:text-slate-300">Export All Data</span>
                </div>
                <span className="text-xs text-slate-500">JSON</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClearAllData}
                className="w-full p-3 glass-button rounded-xl text-left flex items-center justify-between text-red-600 dark:text-red-400"
              >
                <div className="flex items-center space-x-2">
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All Data</span>
                </div>
                <span className="text-xs">Permanent</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Subscription Manager */}
      <motion.div
        id="subscription-manager"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <SubscriptionManager />
      </motion.div>

      {/* Password Change Modal */}
      <AnimatePresence>
        {isChangingPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => !isUpdatingPassword && handleCancelPasswordChange()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card max-w-md w-full p-8 rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-2 mb-6">
                <Lock className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                  Change Password
                </h2>
              </div>

              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Current Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className={`w-full p-3 pr-12 glass-input rounded-xl ${passwordErrors.currentPassword ? 'border-red-500' : ''}`}
                      placeholder="Enter your current password"
                      disabled={isUpdatingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{passwordErrors.currentPassword}</span>
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className={`w-full p-3 pr-12 glass-input rounded-xl ${passwordErrors.newPassword ? 'border-red-500' : ''}`}
                      placeholder="Enter your new password"
                      disabled={isUpdatingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {passwordData.newPassword && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-600 dark:text-slate-400">Password Strength</span>
                        <span className={`font-medium ${
                          getPasswordStrength(passwordData.newPassword) >= 4 ? 'text-green-600' : 
                          getPasswordStrength(passwordData.newPassword) >= 3 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {getPasswordStrengthLabel(getPasswordStrength(passwordData.newPassword)).label}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            getPasswordStrengthLabel(getPasswordStrength(passwordData.newPassword)).color
                          }`}
                          style={{ width: `${(getPasswordStrength(passwordData.newPassword) / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{passwordErrors.newPassword}</span>
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className={`w-full p-3 pr-12 glass-input rounded-xl ${passwordErrors.confirmPassword ? 'border-red-500' : ''}`}
                      placeholder="Confirm your new password"
                      disabled={isUpdatingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{passwordErrors.confirmPassword}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Password Requirements */}
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Password Requirements:
                </h4>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <li className="flex items-center space-x-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${passwordData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                    <span>At least 8 characters long</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(passwordData.newPassword) ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                    <span>Contains lowercase letter</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(passwordData.newPassword) ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                    <span>Contains uppercase letter</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${/\d/.test(passwordData.newPassword) ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                    <span>Contains number</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelPasswordChange}
                  disabled={isUpdatingPassword}
                  className="px-6 py-3 glass-button rounded-xl flex items-center space-x-2 disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleChangePassword}
                  disabled={isUpdatingPassword}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingPassword ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Lock className="w-4 h-4" />
                      </motion.div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Change Password</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}