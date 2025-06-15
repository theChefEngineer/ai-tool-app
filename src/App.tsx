import React, { useEffect } from 'react';
import Layout from './components/Layout/Layout';
import ParaphraseInterface from './components/Paraphrase/ParaphraseInterface';
import SummaryInterface from './components/Summary/SummaryInterface';
import TranslationInterface from './components/Translation/TranslationInterface';
import SettingsInterface from './components/Settings/SettingsInterface';
import HistoryInterface from './components/History/HistoryInterface';
import ChatInterface from './components/Chat/ChatInterface';
import { useAppStore } from './store/appStore';

function App() {
  const { theme, currentView } = useAppStore();

  useEffect(() => {
    // Initialize theme on app load
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

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
      case 'paraphrase':
      default:
        return <ParaphraseInterface />;
    }
  };

  return (
    <Layout>
      {renderCurrentView()}
    </Layout>
  );
}

export default App;