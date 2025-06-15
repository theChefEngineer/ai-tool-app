import React, { useEffect } from 'react';
import Layout from './components/Layout/Layout';
import ParaphraseInterface from './components/Paraphrase/ParaphraseInterface';
import SummaryInterface from './components/Summary/SummaryInterface';
import TranslationInterface from './components/Translation/TranslationInterface';
import SettingsInterface from './components/Settings/SettingsInterface';
import HistoryInterface from './components/History/HistoryInterface';
import ChatInterface from './components/Chat/ChatInterface';
import PlagiarismInterface from './components/PlagiarismChecker/PlagiarismInterface';
import ContentDetectorInterface from './components/ContentDetector/ContentDetectorInterface';
import SuccessPage from './components/Success/SuccessPage';
import { useAppStore } from './store/appStore';
import { useLanguageStore } from './store/languageStore';

function App() {
  const { theme, currentView } = useAppStore();
  const { currentLanguage, isRTL } = useLanguageStore();

  useEffect(() => {
    // Initialize theme on app load
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  useEffect(() => {
    // Apply language and RTL settings
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
    
    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }

    // Apply language-specific fonts
    if (currentLanguage === 'ar') {
      document.documentElement.style.setProperty('--font-family', '"Noto Sans Arabic", "Cairo", "Amiri", system-ui, sans-serif');
    } else {
      document.documentElement.style.setProperty('--font-family', '"Inter", system-ui, -apple-system, sans-serif');
    }
  }, [currentLanguage, isRTL]);

  // Check if we're on the success page
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');
  
  if (sessionId) {
    return <SuccessPage />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'summary':
        return <SummaryInterface />;
      case 'translation':
        return <TranslationInterface />;
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