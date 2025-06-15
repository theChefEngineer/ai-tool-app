export type Language = 'en' | 'ar' | 'fr' | 'es';

export interface TranslationKeys {
  // Navigation
  nav: {
    paraphrase: string;
    summary: string;
    translation: string;
    plagiarism: string;
    contentDetector: string;
    chat: string;
    history: string;
    settings: string;
    upgrade: string;
  };
  
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    copy: string;
    copied: string;
    reset: string;
    download: string;
    export: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    continue: string;
    confirm: string;
    yes: string;
    no: string;
    characters: string;
    words: string;
    operations: string;
    unlimited: string;
    free: string;
    premium: string;
    active: string;
    inactive: string;
  };

  // Authentication
  auth: {
    signIn: string;
    signUp: string;
    signOut: string;
    email: string;
    password: string;
    confirmPassword: string;
    forgotPassword: string;
    createAccount: string;
    welcomeBack: string;
    continueWithGoogle: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    signInToContinue: string;
    joinParaTextPro: string;
  };

  // Paraphrase
  paraphrase: {
    title: string;
    subtitle: string;
    originalText: string;
    paraphrasedText: string;
    chooseWritingStyle: string;
    paraphraseButton: string;
    processing: string;
    modes: {
      standard: string;
      formal: string;
      creative: string;
      shorten: string;
      expand: string;
    };
    modeDescriptions: {
      standard: string;
      formal: string;
      creative: string;
      shorten: string;
      expand: string;
    };
    improvements: string;
    readabilityScore: string;
    placeholder: string;
  };

  // Summary
  summary: {
    title: string;
    subtitle: string;
    originalText: string;
    summaryText: string;
    chooseSummaryStyle: string;
    summarizeButton: string;
    processing: string;
    modes: {
      comprehensive: string;
      executive: string;
      academic: string;
      bullet: string;
      quick: string;
    };
    modeDescriptions: {
      comprehensive: string;
      executive: string;
      academic: string;
      bullet: string;
      quick: string;
    };
    keyPoints: string;
    compressionRatio: string;
    placeholder: string;
  };

  // Translation
  translation: {
    title: string;
    subtitle: string;
    sourceText: string;
    translatedText: string;
    languageSelection: string;
    from: string;
    to: string;
    translateButton: string;
    processing: string;
    autoDetect: string;
    confidence: string;
    alternatives: string;
    placeholder: string;
  };

  // Content Detector
  contentDetector: {
    title: string;
    subtitle: string;
    contentAnalysis: string;
    humanizedVersion: string;
    analyzing: string;
    humanizing: string;
    humanizeButton: string;
    aiDetectionResults: string;
    humanizationSettings: string;
    creativityLevel: string;
    preserveMeaning: string;
    aiProbability: string;
    confidence: string;
    humanScore: string;
    improvements: string;
    keyChanges: string;
    placeholder: string;
    poweredBy: string;
  };

  // Chat
  chat: {
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    typing: string;
    you: string;
    assistant: string;
    clearChat: string;
    exportChat: string;
    messages: string;
  };

  // History
  history: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filters: string;
    allTypes: string;
    allStatus: string;
    sortBy: string;
    date: string;
    type: string;
    status: string;
    ascending: string;
    descending: string;
    noActivities: string;
    adjustFilters: string;
    startUsing: string;
    viewDetails: string;
    original: string;
    result: string;
    readability: string;
    compression: string;
    totalWords: string;
  };

  // Settings
  settings: {
    title: string;
    subtitle: string;
    profileInformation: string;
    subscription: string;
    appearance: string;
    additionalSettings: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    editProfile: string;
    saveChanges: string;
    saving: string;
    currentPlan: string;
    upgradeToPro: string;
    manageBilling: string;
    themePreference: string;
    lightMode: string;
    darkMode: string;
    chooseTheme: string;
    privacySecurity: string;
    dataManagement: string;
    changePassword: string;
    twoFactorAuth: string;
    exportAllData: string;
    clearAllData: string;
    comingSoon: string;
    permanent: string;
    language: string;
    selectLanguage: string;
  };

  // Subscription
  subscription: {
    freePlan: string;
    proPlan: string;
    currentPlan: string;
    subscribeNow: string;
    upgradeNow: string;
    processing: string;
    features: {
      unlimitedOperations: string;
      priorityProcessing: string;
      advancedModels: string;
      exportHistory: string;
      premiumSupport: string;
    };
    billing: {
      monthly: string;
      yearly: string;
      nextBilling: string;
      renewsOn: string;
      cancelAtPeriodEnd: string;
    };
  };

  // Usage
  usage: {
    dailyUsage: string;
    dailyLimit: string;
    dailyLimitReached: string;
    operationsRemaining: string;
    upgradeForUnlimited: string;
    resetsAtMidnight: string;
    premiumActive: string;
    minimumWords: string;
    recommendedWords: string;
  };

  // Errors and Messages
  messages: {
    error: {
      generic: string;
      network: string;
      authentication: string;
      unauthorized: string;
      notFound: string;
      serverError: string;
      validation: string;
      required: string;
      invalidEmail: string;
      passwordTooShort: string;
      passwordsDoNotMatch: string;
      dailyLimitReached: string;
      minimumWordsRequired: string;
    };
    success: {
      paraphrased: string;
      summarized: string;
      translated: string;
      copied: string;
      saved: string;
      deleted: string;
      exported: string;
      profileUpdated: string;
      passwordChanged: string;
      subscriptionUpdated: string;
      languageChanged: string;
    };
  };

  // Languages
  languages: {
    english: string;
    arabic: string;
    french: string;
    spanish: string;
    autoDetect: string;
  };
}

export type Translations = Record<Language, TranslationKeys>;