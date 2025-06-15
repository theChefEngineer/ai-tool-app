import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Trash2
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import toast from 'react-hot-toast';

export default function SettingsInterface() {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useAppStore();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || 'John Doe',
    email: user?.email || 'user@example.com',
  });

  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    toast.success('Profile updated successfully!');
  };

  const handleThemeChange = () => {
    toggleTheme();
    toast.success(`Switched to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  };

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

        <div className="flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 md:space-x-8">
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
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    className="w-full p-3 glass-input rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full p-3 glass-input rounded-xl"
                  />
                </div>
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold"
                  >
                    Save Changes
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditingProfile(false)}
                    className="px-6 py-2 glass-button rounded-xl"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                    {profileData.fullName}
                  </h3>
                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                    <Mail className="w-4 h-4" />
                    <span>{profileData.email}</span>
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

      {/* Subscription Information */}
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
                    Free Plan
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    20 operations per day
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Status</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 dark:text-green-400 font-medium">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Usage Today</span>
                  <span className="text-slate-800 dark:text-white font-medium">15 / 20</span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold flex items-center justify-center space-x-2"
            >
              <Crown className="w-5 h-5" />
              <span>Upgrade to Pro</span>
            </motion.button>
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
                    $9.99/month
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
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-3 glass-button rounded-xl text-left flex items-center justify-between"
              >
                <span className="text-slate-700 dark:text-slate-300">Change Password</span>
                <Edit3 className="w-4 h-4 text-slate-500" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-3 glass-button rounded-xl text-left flex items-center justify-between"
              >
                <span className="text-slate-700 dark:text-slate-300">Two-Factor Authentication</span>
                <Shield className="w-4 h-4 text-slate-500" />
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
                className="w-full p-3 glass-button rounded-xl text-left flex items-center justify-between"
              >
                <span className="text-slate-700 dark:text-slate-300">Export History</span>
                <Download className="w-4 h-4 text-slate-500" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-3 glass-button rounded-xl text-left flex items-center justify-between text-red-600 dark:text-red-400"
              >
                <span>Clear All Data</span>
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}