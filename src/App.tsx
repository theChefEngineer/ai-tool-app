import React, { useEffect, useState } from 'react';
import Layout from './components/Layout/Layout';
import LandingPage from './components/Landing/LandingPage';
import ParaphraseInterface from './components/Paraphrase/ParaphraseInterface';
import SummaryInterface from './components/Summary/SummaryInterface';
import TranslationInterface from './components/Translation/TranslationInterface';
import GrammarInterface from './components/Grammar/GrammarInterface';
import TranscriptionInterface from './components/Transcription/TranscriptionInterface';
import OCRInterface from './components/OCR/OCRInterface';
import SettingsInterface from './components/Settings/SettingsInterface';
import HistoryInterface from './components/History/HistoryInterface';
import ChatInterface from './components/Chat/ChatInterface';
import PlagiarismInterface from './components/PlagiarismChecker/PlagiarismInterface';
import ContentDetectorInterface from './components/ContentDetector/ContentDetectorInterface';
import SuccessPage from './components/Success/SuccessPage';
import AuthCallback from './components/Auth/AuthCallback';
import AuthModal from './components/Auth/AuthModal';
import { useAppStore } from './store/appStore';
import { useLanguageStore } from './store/languageStore';
import { useAuthStore } from './store/authStore';

function App() {
  const { theme, currentView } = useAppStore();
  const { currentLanguage, isRTL } = useLanguageStore();
  const { user, initialize } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initialize().then(() => setIsInitialized(true));
  }, [initialize]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;

    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }

    if (currentLanguage === 'ar') {
      document.documentElement.style.setProperty('--font-family', '"Noto Sans Arabic", "Cairo", "Amiri", system-ui, sans-serif');
    } else {
      document.documentElement.style.setProperty('--font-family', '"Inter", system-ui, -apple-system, sans-serif');
    }
  }, [currentLanguage, isRTL]);

  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');

  if (sessionId) {
    return <SuccessPage />;
  }

  const hasAuthCode = urlParams.get('code') || window.location.hash.includes('access_token');
  if (window.location.pathname === '/auth/callback' || hasAuthCode) {
    return <AuthCallback />;
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LandingPage onGetStarted={() => setShowAuthModal(true)} />
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'summary':
        return <SummaryInterface />;
      case 'translation':
        return <TranslationInterface />;
      case 'grammar':
        return <GrammarInterface />;
      case 'transcription':
        return <TranscriptionInterface />;
      case 'ocr':
        return <OCRInterface />;
      case 'settings':
        return <SettingsInterface />;
      case 'history':
        return <HistoryInterface />;
      case 'chat':
        return <ChatInterface />;
      case 'plagiarism':
        return <PlagiarismInterface />;
      case 'content-detector':
        return <ContentDetectorInterface />;
      case 'paraphrase':
      default:
        return <ParaphraseInterface />;
    }
  };

  return (
    <div className={`app ${isRTL ? 'rtl' : 'ltr'}`}>
      <Layout>
        {renderCurrentView()}
      </Layout>
    </div>
  );
}

export default App;