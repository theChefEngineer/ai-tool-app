import type { TranslationKeys } from '../lib/i18n';

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
    grammar: string;
    transcription: string;
    ocr: string;
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
    search: string;
    refresh: string;
    filters: string;
    status: string;
    confidence: string;
    processing: string;
    analyzing: string;
    connecting: string;
    updating: string;
    saving: string;
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
    authenticating: string;
    authenticationFailed: string;
    authenticationSuccess: string;
    authenticationProcessing: string;
    authenticationComplete: string;
    authenticationError: string;
    returnToSignIn: string;
    googleSignInConfig: string;
    googleOAuthConfiguring: string;
    setupRequired: string;
    passwordStrength: string;
    passwordStrengthVeryWeak: string;
    passwordStrengthWeak: string;
    passwordStrengthFair: string;
    passwordStrengthGood: string;
    passwordStrengthStrong: string;
    passwordsMatch: string;
    passwordsDoNotMatch: string;
    dataEncrypted: string;
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
    emptyState: string;
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
    emptyState: string;
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
    emptyState: string;
    translating: string;
    swapLanguages: string;
    comparisonTitle: string;
    original: string;
    translated: string;
    sourceWords: string;
    translatedWords: string;
    wordDifference: string;
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
    emptyState: string;
    creativityLow: string;
    creativityMedium: string;
    creativityHigh: string;
    contentAnalysisHighlighting: string;
    potentialPlagiarism: string;
    originalContent: string;
    beforeAfterComparison: string;
    originalAiScore: string;
    humanizedScore: string;
    improvement: string;
    readyToHumanize: string;
    humanizeDescription: string;
    detectAI: string;
    humanWritten: string;
    mixedContent: string;
    aiGenerated: string;
    unknown: string;
    aiGeneratedContent: string;
    humanLikeContent: string;
    original: string;
    humanized: string;
    reason: string;
    human: string;
    humanLike: string;
    emptyStateDescription: string;
  };

  // Plagiarism
  plagiarism: {
    title: string;
    subtitle: string;
    emptyState: string;
    textAnalysis: string;
    analyze: string;
    analyzing: string;
    plagiarismAnalysisResults: string;
    sourcesFound: string;
    totalWords: string;
    uniqueWords: string;
    originality: string;
    matchedSources: string;
    writingStyle: string;
    patternRecognition: string;
    vocabularyDiversity: string;
    sentenceStructure: string;
    potentialMatch: string;
    humanLike: string;
    recommendationsImprovement: string;
    placeholder: string;
    match: string;
    matchedText: string;
    contentAnalysisHighlighting: string;
    emptyStateDescription: string;
  };

  // Grammar
  grammar: {
    title: string;
    subtitle: string;
    originalText: string;
    correctedText: string;
    checkGrammarButton: string;
    processing: string;
    placeholder: string;
    emptyState: string;
    corrections: string;
    suggestions: string;
    acceptAll: string;
    rejectAll: string;
    accept: string;
    reject: string;
    noErrors: string;
    errorsFound: string;
    grammarErrors: string;
    spellingErrors: string;
    styleImprovements: string;
    applyChanges: string;
    revertChanges: string;
    grammarAnalysisResults: string;
    grammarScore: string;
    grammar: string;
    spelling: string;
    style: string;
    original: string;
    corrected: string;
    improvementsMade: string;
    grammarFixes: string;
    spellingCorrections: string;
    styleImprovements2: string;
    accepted: string;
    rejected: string;
    passwordRequirements: string;
    atLeast8Characters: string;
    containsLowercase: string;
    containsUppercase: string;
    containsNumber: string;
  };

  // Transcription
  transcription: {
    title: string;
    subtitle: string;
    uploadDocument: string;
    dragDropText: string;
    browseFiles: string;
    supportedFormats: string;
    maxFileSize: string;
    processing: string;
    transcriptionComplete: string;
    originalTranscription: string;
    processedResults: string;
    wordCount: string;
    readingTime: string;
    fileName: string;
    fileSize: string;
    tools: {
      summarize: string;
      paraphrase: string;
      grammar: string;
      plagiarism: string;
      translation: string;
      export: string;
    };
    exportFormats: {
      txt: string;
      pdf: string;
      doc: string;
    };
    errors: {
      unsupportedFile: string;
      fileTooLarge: string;
      uploadFailed: string;
      processingFailed: string;
    };
    emptyState: string;
    noResults: string;
    dropDocument: string;
    uploadForTranscription: string;
    aiExtractedContent: string;
    aiProcessedResults: string;
    noProcessingResults: string;
    useToolsAbove: string;
    aiProcessingTools: string;
    exportOptions: string;
    transcribedWithAi: string;
    aiPoweredExtraction: string;
    readyForTranscription: string;
    clickHumanize: string;
    processedOn: string;
  };

  // OCR
  ocr: {
    title: string;
    subtitle: string;
    uploadImage: string;
    dragDropText: string;
    browseFiles: string;
    supportedFormats: string;
    maxFileSize: string;
    processing: string;
    extractingText: string;
    extractionComplete: string;
    extractedText: string;
    processedResults: string;
    words: string;
    readingTime: string;
    fileName: string;
    fileSize: string;
    tools: {
      summarize: string;
      paraphrase: string;
      grammar: string;
      aiDetection: string;
      translation: string;
    };
    toolDescriptions: {
      summarize: string;
      paraphrase: string;
      grammar: string;
      aiDetection: string;
      translation: string;
    };
    errors: {
      unsupportedFile: string;
      fileTooLarge: string;
      uploadFailed: string;
      processingFailed: string;
      lowQualityImage: string;
    };
    emptyState: string;
    noResults: string;
    dropImage: string;
    readyForExtraction: string;
    extractedWithAI: string;
    aiPoweredExtraction: string;
    processingTools: string;
    export: string;
    sourceImage: string;
    originalExtraction: string;
    noProcessingResults: string;
    useToolsAbove: string;
    compression: string;
    keyPoints: string;
    mode: string;
    readability: string;
    improvements: string;
    score: string;
    errorsFixed: string;
    aiProbability: string;
    confidence: string;
    status: string;
    from: string;
    to: string;
    processedOn: string;
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
    welcomeMessage: string;
    justNow: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
    chatCleared: string;
    pressEnterToSend: string;
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
    loadingHistory: string;
    activities: string;
    refresh: string;
    activityExported: string;
    noActivitiesFound: string;
    tryAdjustingFilters: string;
    startUsingApp: string;
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
    languageFeatures: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    updating: string;
    setupRequired2: string;
  };

  // Subscription
  subscription: {
    freePlan: string;
    proPlan: string;
    currentPlan: string;
    subscribeNow: string;
    upgradeNow: string;
    processing: string;
    chooseYourPlan: string;
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
    mostPopular: string;
    renewsOn: string;
    activeSubscription: string;
    cancelCurrentPlan: string;
    switchPlan: string;
    securePayment: string;
    paymentMethods: string;
    currentSubscription: string;
    billingPeriod: string;
    paymentMethod: string;
    planDetailsNotAvailable: string;
    subscriptionWillCancel: string;
    whatsIncluded: string;
    coreFeatures: string;
    premiumBenefits: string;
    unlimitedParaphrasing: string;
    advancedSummarization: string;
    multiLanguageTranslation: string;
    aiContentDetection: string;
    textHumanization: string;
    grammarSpellChecking: string;
    priorityProcessingSpeed: string;
    completeActivityHistory: string;
    exportDownloadCapabilities: string;
    advancedAnalyticsInsights: string;
    premiumCustomerSupport: string;
    earlyAccessFeatures: string;
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
    unlimitedOperations: string;
    operationsUsed: string;
    dailyLimitReachedTitle: string;
    reachedDailyLimit: string;
    usageResetsAtMidnight: string;
    premiumBenefitsTitle: string;
    unlimitedDailyOperations: string;
    priorityProcessingSpeed: string;
    advancedAiModels: string;
    exportCapabilities: string;
    premiumSupport: string;
    upgradeToPremiun: string;
    continueWithFreePlan: string;
    freeOperationsReset: string;
  };

  // Success
  success: {
    paymentSuccessful: string;
    welcomeToParaTextPro: string;
    processingSubscription: string;
    youNowHaveAccess: string;
    unlimitedParaphrasing: string;
    advancedAiSummarization: string;
    multiLanguageTranslation: string;
    aiContentDetection: string;
    textHumanization: string;
    priorityProcessing: string;
    exportCapabilities: string;
    premiumSupport: string;
    startUsingProFeatures: string;
    goToDashboard: string;
    needHelp: string;
    supportEmail: string;
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
      grammarChecked: string;
      correctionsApplied: string;
      transcriptionComplete: string;
      analyzed: string;
      humanized: string;
      ocrComplete: string;
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