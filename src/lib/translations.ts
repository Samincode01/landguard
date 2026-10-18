export type Language = "bn" | "en";

export interface TranslationDictionary {
  // Navigation & Shared Header
  nav: {
    brandTitle: string;
    brandSubtitle: string;
    workflow: string;
    features: string;
    dashboard: string;
    viewDashboard: string;
    home: string;
    map: string;
    records: string;
    riskGuide: string;
    chat: string;
    login: string;
    signup: string;
    logout: string;
    loggingOut: string;
    profile: string;
    myAccount: string;
    citizenBadge: string;
    demoBadge: string;
    verifyDeedBtn: string;
    history: string;
    switchLangAria: string;
    menuOpen: string;
    menuClose: string;
  };

  // Disclaimer Banner
  disclaimer: {
    badge: string;
    shortNotice: string;
    learnMore: string;
    collapse: string;
    fullNotice: string;
  };

  // Landing Page
  landing: {
    hackathonTrack: string;
    brandHero: string;
    heroTitleStart: string;
    heroTitleHighlight: string;
    heroSubtitle: string;
    startVerificationBtn: string;
    loginBtn: string;
    viewDemoRecordsBtn: string;
    checkChainOfTitle: string;
    checkKhatianShare: string;
    checkKhasWarning: string;
    carouselPrev: string;
    carouselNext: string;
    carouselSlide: string;
    slide1Title: string;
    slide1Tag: string;
    slide2Title: string;
    slide2Tag: string;
    slide3Title: string;
    slide3Tag: string;
    heroDisclaimerNote: string;

    // Hero verification preview (illustrative UI)
    previewLabel: string;
    previewDocTitle: string;
    previewOwnerLabel: string;
    previewOwnerValue: string;
    previewMouzaLabel: string;
    previewMouzaValue: string;
    previewKhatianLabel: string;
    previewKhatianValue: string;
    previewMatch: string;
    previewCaution: string;
    previewFlagShare: string;
    previewFlagChain: string;
    previewSampleNote: string;

    // Benefits strip
    benefitsTitle: string;

    // 3-step workflow
    workflowBadge: string;
    workflowTitle: string;
    workflowSubtitle: string;
    stepLabel: string;
    step1Num: string;
    step1Title: string;
    step1Desc: string;
    step2Num: string;
    step2Title: string;
    step2Desc: string;
    step3Num: string;
    step3Title: string;
    step3Desc: string;

    // Features
    featuresBadge: string;
    featuresTitle: string;
    featuresSubtitle: string;
    feat1Title: string;
    feat1Desc: string;
    feat2Title: string;
    feat2Desc: string;
    feat3Title: string;
    feat3Desc: string;
    feat4Title: string;
    feat4Desc: string;
    feat5Title: string;
    feat5Desc: string;
    feat6Title: string;
    feat6Desc: string;

    // Callout
    calloutTitle: string;
    calloutDesc: string;
    enterDashboardBtn: string;
    askAssistantBtn: string;
  };

  // Dashboard Verification CTA
  cta: {
    initiativeBadge: string;
    heading: string;
    description: string;
    point1: string;
    point2: string;
    point3: string;
    verifyNewDeedBtn: string;
    viewDemoRecordsBtn: string;
  };

  // Summary KPI Cards
  summary: {
    totalParcels: string;
    parcelsUnit: string;
    totalParcelsSub: string;
    lowRisk: string;
    lowRiskUnit: string;
    lowRiskSub: string;
    mediumRisk: string;
    mediumRiskUnit: string;
    mediumRiskSub: string;
    highRisk: string;
    highRiskUnit: string;
    highRiskSub: string;
    riskFlags: string;
    riskFlagsUnit: string;
    riskFlagsSub: string;
  };

  // Map Section
  map: {
    title: string;
    demoBadge: string;
    subtitle: string;
    boundaryNote: string;
    loadingMap: string;
    loadingSub: string;
    selectedParcel: string;
    noParcelSelected: string;
    noParcelSelectedSub: string;
    viewInTable: string;
    verifyDeed: string;
    preAuditOutcome: string;
    specsKhatianSurvey: string;
    specsArea: string;
    specsOwner: string;
    syntheticCoordsNote: string;
    legendClean: string;
    legendReview: string;
    legendInsufficient: string;
    jumpLabel: string;
    showAll: string;
    fitToParcel: string;
    fitToResults: string;
    layerStreets: string;
    layerSatellite: string;
    approxPointLabel: string;
    popupApproxNote: string;
    noCoordinates: string;
    coordsLabel: string;
    parcelIdLabel: string;
    legendIllustrativeBoundary: string;
    legendAuthenticBoundary: string;
    illustrativeBoundaryDisclaimer: string;
  };

  // Timeline History & Explainable Risk Section
  history: {
    historyTitle: string;
    historyBadge: string;
    historyNotice: string;
    noHistory: string;
    noHistorySub: string;
    riskAnalysisTitle: string;
    warningsExplanation: string;
    whatFound: string;
    recordsTriggered: string;
    whyReview: string;
    nextSteps: string;
    transferor: string;
    transferee: string;
    conflictingClaim: string;
    litigationAlert: string;
    caseDetails: string;
    caseSubject: string;
    govtBuffer: string;
    itemCountSuffix: string;
  };

  // Parcel Table Section
  table: {
    title: string;
    subtitle: string;
    countUnit: string;
    searchPlaceholder: string;
    clearSearchTitle: string;
    filterAll: string;
    filterLow: string;
    filterMedium: string;
    filterHigh: string;
    colDistrictUpazila: string;
    colMouzaJl: string;
    colKhatianSurvey: string;
    colDag: string;
    colArea: string;
    colOwner: string;
    colRisk: string;
    colActions: string;
    noRecordsTitle: string;
    noRecordsSub: string;
    showAllBtn: string;
    viewDetails: string;
    hideDetails: string;
    viewOnMap: string;
    jlPrefix: string;
    flagsIdentified: string;
    statusMutationDone: string;
  };

  // About / Risk Guide Section
  about: {
    title: string;
    subtitle: string;
    risk1Title: string;
    risk1Desc: string;
    risk2Title: string;
    risk2Desc: string;
    risk3Title: string;
    risk3Desc: string;
  };

  // Verification Modal
  modal: {
    formTitle: string;
    resultsTitle: string;
    demoBadge: string;
    formSubtitle: string;
    resultsSubtitle: string;
    closeBtn: string;
    quickPresets: string;
    presetMatch: string;
    presetOwnerMismatch: string;
    presetDagMismatch: string;
    presetAreaMismatch: string;
    selectParcelPrompt: string;
    fieldOwner: string;
    fieldDistrict: string;
    fieldUpazila: string;
    fieldMouza: string;
    fieldKhatianNumber: string;
    fieldKhatianType: string;
    fieldDagNumber: string;
    fieldRecordedArea: string;
    fieldAreaUnit: string;
    verifyBtn: string;
    reverifyBtn: string;
    viewReportBtn: string;
    uploadDeedSection: string;
    uploadDeedTitle: string;
    uploadDeedDesc: string;
    uploadDropPrompt: string;
    uploadFormatsHint: string;
    uploadAnalyzing: string;
    uploadSuccessTitle: string;
    uploadSuccessDesc: string;
    uploadUnreadableWarning: string;
    uploadFailedTitle: string;
    uploadFailedDesc: string;
    geminiNotConfiguredNotice: string;
    extractedReviewNotice: string;
    clearUploadBtn: string;
    extractedTag: string;
    confidenceLabel: string;
    confHigh: string;
    confMed: string;
    confLow: string;
    confUnreadable: string;
  };

  // Footer
  footer: {
    demoBadge: string;
    disclaimer: string;
    copyright: string;
  };

  // Authentication (Login & Signup)
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    loginBadge: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    loginButton: string;
    loggingInButton: string;
    demoLoginButton: string;
    demoLoginBadge: string;
    demoLoginNotice: string;
    demoLoginHelper: string;
    demoNotConfiguredTitle: string;
    demoNotConfiguredDesc: string;
    dontHaveAccount: string;
    signupLink: string;
    adminNotice: string;
    signupTitle: string;
    signupSubtitle: string;
    signupBadge: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    occupationLabel: string;
    occupationPlaceholder: string;
    confirmPasswordLabel: string;
    confirmPasswordPlaceholder: string;
    signupButton: string;
    signingUpButton: string;
    alreadyHaveAccount: string;
    loginLink: string;
    termsNotice: string;
    nameRequired: string;
    emailRequired: string;
    emailInvalid: string;
    phoneRequired: string;
    phoneInvalid: string;
    occupationRequired: string;
    passwordRequired: string;
    passwordMinLength: string;
    confirmPasswordRequired: string;
    passwordMismatch: string;
    genericLoginError: string;
    duplicateEmailError: string;
    networkError: string;
    loginSuccess: string;
    signupSuccess: string;
    showPassword: string;
    hidePassword: string;
    backToHome: string;
    trustBadgeTitle: string;
    trustPoint1: string;
    trustPoint2: string;
    trustPoint3: string;
  };

  // Verification History
  verificationHistory: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptySubtitle: string;
    startVerificationBtn: string;
    dateCol: string;
    parcelCol: string;
    plotCol: string;
    submittedOwnerCol: string;
    statusCol: string;
    actionCol: string;
    viewResultBtn: string;
    ocrBadge: string;
    discrepancyBadge: string;
    cleanBadge: string;
    insufficientBadge: string;
    backToDashboard: string;
    recordsCount: string;
    loading: string;
    modalTitle: string;
    modalClose: string;
    printReport: string;
  };

  // Responsive Sidebar & Navigation
  sidebar: {
    overview: string;
    verifyDocument: string;
    myHistory: string;
    exploreRecords: string;
    account: string;
    collapse: string;
    expand: string;
    menu: string;
    close: string;
    workspace: string;
    logout: string;
  };

  // Personal /dashboard overview
  personalDashboard: {
    welcomeBack: string;
    subtitle: string;
    heroTitle: string;
    heroDesc: string;
    startCheckBtn: string;
    quickActionsTitle: string;
    actionVerify: string;
    actionVerifyDesc: string;
    actionExplore: string;
    actionExploreDesc: string;
    actionHistory: string;
    actionHistoryDesc: string;
    actionChat: string;
    actionChatDesc: string;
    activityTitle: string;
    activityHint: string;
    totalLabel: string;
    cleanLabel: string;
    reviewLabel: string;
    partialLabel: string;
    recentTitle: string;
    recentSubtitle: string;
    viewAllHistory: string;
    emptyTitle: string;
    emptyDesc: string;
    emptyCta: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    unspecifiedOwner: string;
    dagLabel: string;
    khatianLabel: string;
    mismatchFields: string;
    matchFields: string;
    tipTitle: string;
    tip1: string;
    tip2: string;
    tip3: string;
    tip4: string;
    tipNote: string;
    navbarWorkspace: string;
  };

  // Explore Land Records
  explore: {
    title: string;
    subtitle: string;
    disclaimer: string;
    recordsCount: string;
    showingRecords: string;
    loadMore: string;
    allLoaded: string;
    loading: string;
    errorTitle: string;
    errorSubtitle: string;
    retry: string;
    emptyTitle: string;
    emptySubtitle: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  bn: {
    nav: {
      brandTitle: "ল্যান্ডগার্ড বিডি",
      brandSubtitle: "জমি ক্রয়ের আগে প্রাথমিক দলিল যাচাই",
      workflow: "কীভাবে কাজ করে",
      features: "সুবিধাসমূহ",
      dashboard: "যাচাই ড্যাশবোর্ড",
      viewDashboard: "ড্যাশবোর্ড দেখুন",
      home: "মূলপাতা",
      map: "মানচিত্র",
      records: "রেকর্ড তালিকা",
      riskGuide: "ঝুঁকি সহায়িকা",
      chat: "ভূমিসাথী (AI)",
      login: "লগইন",
      signup: "নিবন্ধন",
      logout: "লগআউট",
      loggingOut: "লগআউট হচ্ছে...",
      profile: "প্রোফাইল",
      myAccount: "আমার অ্যাকাউন্ট",
      citizenBadge: "যাচাইকারী নাগরিক",
      demoBadge: "ডেমো",
      verifyDeedBtn: "দলিল যাচাই",
      history: "যাচাইকরণ ইতিহাস",
      switchLangAria: "ভাষা পরিবর্তন করুন (Switch Language)",
      menuOpen: "মেনু খুলুন",
      menuClose: "মেনু বন্ধ করুন",
    },
    disclaimer: {
      badge: "কৃত্রিম ডেমো ডেটা:",
      shortNotice: "প্রদর্শিত সকল খতিয়ান ও দাগ নম্বর কাল্পনিক। জমি ক্রয়ের সিদ্ধান্তের আগে সংশ্লিষ্ট ভূমি অফিসে মূল রেকর্ড যাচাই করুন।",
      learnMore: "আরও জানুন",
      collapse: "সংক্ষেপ করুন",
      fullNotice: "ল্যান্ডগার্ড বিডি জমি ক্রেতাদের সচেতন করার উদ্দেশ্যে তৈরি একটি নাগরিক প্রযুক্তি প্রোটোটাইপ। এখানে দেখানো রেকর্ডগুলো সম্পূর্ণ কাল্পনিক — কোনো প্রকৃত ভূমি মালিক, জমি বা সরকারি রেকর্ডের সাথে এর কোনো সম্পর্ক নেই। এটি কোনো সরকারি সনদ বা আইনি পরামর্শ নয়।",
    },
    landing: {
      hackathonTrack: "ল্যান্ডটেক হ্যাকাথন ২০২৬ · ট্র্যাক P5",
      brandHero: "ল্যান্ডগার্ড বিডি",
      heroTitleStart: "জমি কেনার আগে",
      heroTitleHighlight: "দলিল যাচাই করুন",
      heroSubtitle: "খতিয়ান, বায়া দলিল ও ঝুঁকির লক্ষণ ঘরে বসে প্রাথমিকভাবে পরীক্ষা করুন—ভূমি অফিসে যাওয়ার আগে।",
      startVerificationBtn: "যাচাই শুরু করুন",
      loginBtn: "লগইন",
      viewDemoRecordsBtn: "কীভাবে কাজ করে",
      checkChainOfTitle: "বায়া দলিলের ধারাবাহিকতা",
      checkKhatianShare: "খতিয়ানের হিস্যা ও পরিমাণ",
      checkKhasWarning: "খাস জমি ও সতর্কতা সংকেত",
      carouselPrev: "পূর্ববর্তী",
      carouselNext: "পরবর্তী",
      carouselSlide: "স্লাইড",
      slide1Title: "বাংলাদেশের কৃষিজমি ও নদীবিধৌত ভূখণ্ড",
      slide1Tag: "কৃষি ও প্রাকৃতিক মৌজা",
      slide2Title: "সিএস-এসএ-আরএস-বিএস মৌজা ক্যাডাস্ট্রাল মানচিত্র",
      slide2Tag: "মৌজা নকশা ও দাগ সীমানা",
      slide3Title: "ভূমি দলিল ও বায়া খতিয়ান প্রাক-যাচাই নিরীক্ষা",
      slide3Tag: "দলিল ও স্বত্ব রেকর্ড",
      heroDisclaimerNote: "এটি সরকারি স্বত্ব সনদ নয়—প্রাথমিক সচেতনতার জন্য। চূড়ান্ত সিদ্ধান্তের আগে ভূমি অফিসে মূল রেকর্ড যাচাই করুন।",
      previewLabel: "নমুনা যাচাই ফলাফল",
      previewDocTitle: "দলিল প্রাক-যাচাই",
      previewOwnerLabel: "মালিক",
      previewOwnerValue: "করিম উদ্দিন",
      previewMouzaLabel: "মৌজা",
      previewMouzaValue: "সাভার",
      previewKhatianLabel: "খতিয়ান",
      previewKhatianValue: "১২৩৪ / আরএস",
      previewMatch: "মিল পাওয়া গেছে",
      previewCaution: "পর্যালোচনা প্রয়োজন",
      previewFlagShare: "হিস্যায় অমিল",
      previewFlagChain: "বায়া ধারা পরীক্ষিত",
      previewSampleNote: "উদাহরণমাত্র — প্রকৃত যাচাইয়ের জন্য অ্যাকাউন্ট খুলুন",
      benefitsTitle: "যাচাইয়ের আগে যা দেখা হয়",
      workflowBadge: "৩টি ধাপ",
      workflowTitle: "কীভাবে কাজ করে",
      workflowSubtitle: "তথ্য দিন, ফলাফল দেখুন, প্রয়োজনীয় পরবর্তী ধাপ জানুন।",
      stepLabel: "ধাপ",
      step1Num: "১",
      step1Title: "তথ্য দিন",
      step1Desc: "বিক্রেতার নাম, মৌজা, খতিয়ান, দাগ ও জমির পরিমাণ লিখুন।",
      step2Num: "২",
      step2Title: "তুলনা ও ঝুঁকি দেখুন",
      step2Desc: "রেকর্ডের অমিল, হিস্যার গরমিল বা দ্বৈত হস্তান্তরের সংকেত চিহ্নিত হয়।",
      step3Num: "৩",
      step3Title: "রিপোর্ট নিন",
      step3Desc: "PDF রিপোর্ট ও ভূমি অফিসে যাচাইয়ের সহজ চেকলিস্ট পান।",
      featuresBadge: "মূল সুবিধা",
      featuresTitle: "যা পাবেন",
      featuresSubtitle: "জমি কেনার আগে প্রয়োজনীয় পরীক্ষা এক জায়গায়।",
      feat1Title: "দলিল ও খতিয়ান মিলানো",
      feat1Desc: "মালিক, মৌজা, খতিয়ান ও দাগ নম্বর পাশাপাশি তুলনা।",
      feat2Title: "সহজ ঝুঁকি ব্যাখ্যা",
      feat2Desc: "কী পাওয়া গেছে, কেন গুরুত্বপূর্ণ, পরবর্তীতে কী করবেন—স্পষ্ট ভাষায়।",
      feat3Title: "মানচিত্রে প্লট দেখা",
      feat3Desc: "নমুনা প্লট মানচিত্রে দেখে ঝুঁকির ফলাফল এক নজরে বুঝুন।",
      feat4Title: "PDF রিপোর্ট",
      feat4Desc: "প্রিন্ট বা সেভ করে অফিসে নিয়ে যাওয়ার মতো রিপোর্ট তৈরি করুন।",
      feat5Title: "ভূমিসাথী সহকারী",
      feat5Desc: "খতিয়ান, নামজারি বা দলিল নিয়ে সাধারণ প্রশ্নের উত্তর পান।",
      feat6Title: "গোপনীয়তা",
      feat6Desc: "আপনার দাখিলকৃত দলিল সার্ভারে স্থায়ীভাবে সংরক্ষণ করা হয় না।",
      calloutTitle: "এখনই নমুনা রেকর্ড দিয়ে পরীক্ষা করুন",
      calloutDesc: "সাভার, শ্রীপুর, রূপগঞ্জসহ ৬টি নমুনা প্লট দিয়ে যাচাই প্রক্রিয়া দেখুন।",
      enterDashboardBtn: "যাচাই শুরু করুন",
      askAssistantBtn: "ভূমিসাথীকে জিজ্ঞাসা করুন",
    },
    cta: {
      initiativeBadge: "নাগরিক ভূমি প্রাক-যাচাই উদ্যোগ",
      heading: "জমি কিনতে যাচ্ছেন? আগে দলিল ও খতিয়ান যাচাই করুন।",
      description: "বায়া দলিলের ধারাবাহিকতা, হিস্যার অমিল এবং সরকারি খাস জমির ঝুঁকি প্রাথমিকভাবে পরীক্ষা করে নিরাপদ সিদ্ধান্ত নিন।",
      point1: "বায়া দলিলের পরম্পরা",
      point2: "খতিয়ানের হিস্যা ও পরিমাণ",
      point3: "১ নং খাস ও সরকারি বাফার",
      verifyNewDeedBtn: "নতুন দলিল যাচাই করুন",
      viewDemoRecordsBtn: "নমুনা রেকর্ড দেখুন",
    },
    summary: {
      totalParcels: "মোট ডেমো জমি",
      parcelsUnit: "টি প্লট",
      totalParcelsSub: "নমুনা ডেটাসেট",
      lowRisk: "ঝুঁকিহীন",
      lowRiskUnit: "টি",
      lowRiskSub: "স্বচ্ছ মালিকানা ধারা",
      mediumRisk: "সতর্কতা প্রয়োজন",
      mediumRiskUnit: "টি",
      mediumRiskSub: "পরিমাপে গরমিল পাওয়া গেছে",
      highRisk: "উচ্চ ঝুঁকি",
      highRiskUnit: "টি",
      highRiskSub: "দ্বৈত বিক্রয় বা মামলার ঝুঁকি",
      riskFlags: "মোট ঝুঁকি সংকেত",
      riskFlagsUnit: "টি",
      riskFlagsSub: "চিহ্নিত ক্ষেত্র",
    },
    map: {
      title: "নমুনা জমির ভৌগোলিক প্রাক-যাচাই মানচিত্র",
      demoBadge: "কাল্পনিক ডেমো",
      subtitle: "মার্কার বা ড্যাশড ডেমো সীমানায় ক্লিক করে নমুনা প্লটের প্রাথমিক ঝুঁকি ফলাফল দেখুন।",
      boundaryNote: "* OpenStreetMap-এ সরকারি খতিয়ান সীমানা নেই। ড্যাশড পলিগনগুলো দৃষ্টান্তমূলক ডেমো সীমানা মাত্র।",
      loadingMap: "ইন্টারেক্টিভ মানচিত্র লোড হচ্ছে...",
      loadingSub: "বাংলাদেশের নমুনা স্থানাঙ্ক, মার্কার ও ডেমো সীমানা প্রস্তুত হচ্ছে",
      selectedParcel: "নির্বাচিত প্লট",
      noParcelSelected: "কোনো প্লট নির্বাচিত নেই",
      noParcelSelectedSub: "মানচিত্রের যেকোনো মার্কার বা সীমানায় ক্লিক করে জমির বিস্তারিত দেখুন।",
      viewInTable: "তালিকায় বিশদ দেখুন",
      verifyDeed: "দলিল যাচাই করুন",
      preAuditOutcome: "স্বয়ংক্রিয় প্রাক-নিরীক্ষা ফলাফল:",
      specsKhatianSurvey: "খতিয়ান ও জরিপ",
      specsArea: "জমির পরিমাণ",
      specsOwner: "নথিভুক্ত মালিক",
      syntheticCoordsNote: "* কৃত্রিম ডেমো স্থানাঙ্ক ও দৃষ্টান্তমূলক সীমানা — জরিপভিত্তিক প্লট পরিমাপ নয়।",
      legendClean: "ঝুঁকিহীন",
      legendReview: "পর্যালোচনা প্রয়োজন",
      legendInsufficient: "তথ্য অপর্যাপ্ত",
      jumpLabel: "দ্রুত অবস্থান:",
      showAll: "সব দেখান",
      fitToParcel: "প্লটে ফিট করুন",
      fitToResults: "ফলাফলে ফিট করুন",
      layerStreets: "রাস্তা মানচিত্র",
      layerSatellite: "স্যাটেলাইট (Esri)",
      approxPointLabel: "আনুমানিক নমুনা অবস্থান",
      popupApproxNote: "এটি আনুমানিক নমুনা পয়েন্ট — সরকারি দাগ সীমানা নয়।",
      noCoordinates: "এই প্লটের মানচিত্র স্থানাঙ্ক নেই।",
      coordsLabel: "স্থানাঙ্ক",
      parcelIdLabel: "পার্সেল আইডি",
      legendIllustrativeBoundary: "দৃষ্টান্তমূলক ডেমো সীমানা",
      legendAuthenticBoundary: "প্রকৃত জ্যামিতি (যদি থাকে)",
      illustrativeBoundaryDisclaimer:
        "দৃষ্টান্তমূলক ডেমো সীমানা — সরকারি খতিয়ান/জরিপভিত্তিক দাগ সীমানা নয়।",
    },
    history: {
      historyTitle: "ধারাবাহিক হস্তান্তর ইতিহাস ও বায়া দলিলের পরম্পরা",
      historyBadge: "নমুনা ইতিহাস (কাল্পনিক ডেমো তথ্য)",
      historyNotice: "* এটি সচেতনতামূলক উদ্দেশ্যে প্রস্তুতকৃত কৃত্রিম ধারাবাহিক ইতিহাস — কোনো সরকারি বা আইনি সনদ নয়।",
      noHistory: "এই প্লটের জন্য কোনো ঐতিহাসিক হস্তান্তর রেকর্ড অন্তর্ভুক্ত নেই",
      noHistorySub: "পর্যাপ্ত বায়া দলিল ছাড়া কেবল বর্তমান খতিয়ানের ওপর ভিত্তি করে জমি ক্রয় করা অত্যন্ত ঝুঁকিপূর্ণ।",
      riskAnalysisTitle: "ব্যাখ্যামূলক ঝুঁকি ও অসঙ্গতি বিশ্লেষণ",
      warningsExplanation: "শনাক্তকৃত সতর্কবার্তা ও কারণের বিস্তারিত ব্যাখ্যা:",
      whatFound: "১. কী পাওয়া গেছে:",
      recordsTriggered: "২. যে সূত্রে চিহ্নিত:",
      whyReview: "৩. কেন পর্যালোচনা প্রয়োজন:",
      nextSteps: "৪. পরবর্তী করণীয়:",
      transferor: "হস্তান্তরকারী / পূর্ববর্তী:",
      transferee: "গ্রহীতা / বর্তমান:",
      conflictingClaim: "পরস্পরবিরোধী সমান্তরাল হস্তান্তর দাবি",
      litigationAlert: "সতর্ক সংকেত: বিচারাধীন আইনি মামলা বা সরকারি বাফার সংক্রান্ত তথ্য",
      caseDetails: "মামলার বিবরণ:",
      caseSubject: "বিষয়বস্তু:",
      govtBuffer: "সরকারি বাফার / দায়বদ্ধতা:",
      itemCountSuffix: "টি বিষয়",
    },
    table: {
      title: "নমুনা ভূমি রেকর্ড ও খতিয়ান তালিকা",
      subtitle: "দাগ ও খতিয়ানভিত্তিক প্রাথমিক অসঙ্গতি পর্যবেক্ষণ — যেকোনো সারিতে ক্লিক করুন বিশ্লেষণ দেখতে",
      countUnit: "টি",
      searchPlaceholder: "মৌজা, দাগ, খতিয়ান বা জেলা...",
      clearSearchTitle: "মুছুন",
      filterAll: "সকল",
      filterLow: "ঝুঁকিহীন",
      filterMedium: "সতর্কতা",
      filterHigh: "উচ্চ ঝুঁকি",
      colDistrictUpazila: "জেলা / উপজেলা",
      colMouzaJl: "মৌজা / জেএল",
      colKhatianSurvey: "খতিয়ান / জরিপ",
      colDag: "দাগ নং",
      colArea: "পরিমাণ",
      colOwner: "নথিভুক্ত মালিক",
      colRisk: "ঝুঁকি মূল্যায়ন",
      colActions: "",
      noRecordsTitle: "কোনো রেকর্ড পাওয়া যায়নি",
      noRecordsSub: "অনুসন্ধান পরিবর্তন করুন অথবা ফিল্টার সরিয়ে দিন।",
      showAllBtn: "সব রেকর্ড দেখুন",
      viewDetails: "বিশ্লেষণ ও বায়া দলিল",
      hideDetails: "সংক্ষেপ করুন",
      viewOnMap: "মানচিত্রে দেখুন",
      jlPrefix: "জেএল",
      flagsIdentified: "টি অসঙ্গতি চিহ্নিত",
      statusMutationDone: "সক্রিয় নামজারি সম্পন্ন",
    },
    about: {
      title: "বাংলাদেশে জমি ক্রয়ের সাধারণ ৩টি মৌলিক ঝুঁকি",
      subtitle: "প্রাক-যাচাইকরণের ক্ষেত্রে যে বিষয়গুলোতে ক্রেতাদের সতর্ক থাকা প্রয়োজন",
      risk1Title: "১. সরকারি খাস ও অর্পিত সম্পত্তি",
      risk1Desc: "১ নং খতিয়ানভুক্ত সরকারি খাস জমি বা খাল-নদীর তীরবর্তী জায়গা অনেক সময় ভুয়া পর্চা তৈরি করে বিক্রির চেষ্টা করা হয়। ১ নং খতিয়ানের জমি ব্যক্তিগতভাবে হস্তান্তরযোগ্য নয়।",
      risk2Title: "২. বায়া দলিলের ধারাবাহিকতায় ঘাটতি",
      risk2Desc: "সিএস, এসএ, আরএস থেকে বর্তমান বিএস/সিটি জরিপ পর্যন্ত হস্তান্তরের অবিচ্ছিন্ন বায়া দলিল ও উত্তরাধিকার বণ্টননামা না থাকলে ভবিষ্যৎ মালিকানা স্বত্ব ঝুঁকিপূর্ণ হতে পারে।",
      risk3Title: "৩. খতিয়ানের হিস্যা ও দলিলের পরিমাপে অমিল",
      risk3Desc: "খতিয়ানে মোট হিস্যার চেয়ে অতিরিক্ত জমির সাফ-কবলা দলিল সম্পাদন করলে ক্রেতা ভবিষ্যৎ জমাভাগ ও নামজারিতে বিরোধের সম্মুখীন হন।",
    },
    modal: {
      formTitle: "দলিল ও খতিয়ান প্রাক-যাচাই",
      resultsTitle: "যাচাইকরণ ফলাফল ও রেকর্ড তুলনা",
      demoBadge: "ডেমো প্রোটোটাইপ",
      formSubtitle: "নির্বাচিত রেফারেন্স রেকর্ডের বিপরীতে দলিলের তথ্য যাচাই করুন",
      resultsSubtitle: "দাখিলকৃত দলিলের তথ্যের সাথে রেফারেন্স রেকর্ডের তুলনামূলক বিশ্লেষণ",
      closeBtn: "বন্ধ করুন",
      quickPresets: "দ্রুত পরীক্ষা (প্রিসেট):",
      presetMatch: "সঠিক দলিল (মিল)",
      presetOwnerMismatch: "মালিকের নামে অমিল",
      presetDagMismatch: "ভুল দাগ নম্বর",
      presetAreaMismatch: "জমির পরিমাণে অমিল",
      selectParcelPrompt: "রেফারেন্স ডেমো জমি নির্বাচন করুন",
      fieldOwner: "বিক্রেতা / মালিকের নাম",
      fieldDistrict: "জেলা",
      fieldUpazila: "উপজেলা",
      fieldMouza: "মৌজা",
      fieldKhatianNumber: "খতিয়ান নম্বর",
      fieldKhatianType: "জরিপের ধরন",
      fieldDagNumber: "দাগ নম্বর",
      fieldRecordedArea: "জমির পরিমাণ",
      fieldAreaUnit: "একক",
      verifyBtn: "দলিল যাচাই শুরু করুন",
      reverifyBtn: "পুনরায় যাচাই করুন",
      viewReportBtn: "অডিট রিপোর্ট দেখুন ও প্রিন্ট করুন",
      uploadDeedSection: "এআই দলিল তথ্য উদ্ধার (ঐচ্ছিক)",
      uploadDeedTitle: "দলিল বা খতিয়ান আপলোড করে স্বয়ংক্রিয় পূরণ (Gemini AI)",
      uploadDeedDesc: "দলিলের স্পষ্ট ছবি বা PDF আপলোড করলে নিচের তথ্য স্বয়ংক্রিয়ভাবে উদ্ধার হবে। আপনি ফর্মের মানগুলো পর্যালোচনা ও সংশোধন করতে পারবেন।",
      uploadDropPrompt: "দলিলের ছবি বা PDF আপলোড করতে ক্লিক করুন বা ফাইল টেনে আনুন",
      uploadFormatsHint: "JPEG, PNG, WebP অথবা PDF (সর্বোচ্চ ৫ মেগাবাইট)",
      uploadAnalyzing: "Gemini AI দিয়ে দলিলের তথ্য পাঠোদ্ধার করা হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন",
      uploadSuccessTitle: "দলিলের তথ্য উদ্ধার সম্পন্ন হয়েছে!",
      uploadSuccessDesc: "উদ্ধারকৃত তথ্য নিচে ফর্মটিতে বসানো হয়েছে। যাচাই করার পূর্বে অনুগ্রহ করে প্রতিটি মান পর্যালোচনা ও প্রয়োজনমতো সংশোধন করুন।",
      uploadUnreadableWarning: "কিছু তথ্য স্পষ্ট না থাকায় উদ্ধার করা যায়নি। অনুগ্রহ করে সেগুলো নিজে পূরণ করুন।",
      uploadFailedTitle: "তথ্য উদ্ধার ব্যর্থ হয়েছে",
      uploadFailedDesc: "দলিল থেকে তথ্য স্বয়ংক্রিয়ভাবে পড়া যায়নি। অনুগ্রহ করে পরিষ্কার ফাইল আপলোড করুন অথবা নিচে নিজে তথ্য লিখে যাচাই করুন।",
      geminiNotConfiguredNotice: "সার্ভারে Gemini API কী কনফিগার করা নেই। তবে ম্যানুয়াল যাচাইকরণ সম্পূর্ণ কার্যকর রয়েছে; নিচে সরাসরি তথ্য পূরণ করুন।",
      extractedReviewNotice: "যাচাইকরণ ইঞ্জিনে প্রেরণের পূর্বে সকল তথ্য সাবধানে পর্যালোচনা ও সংশোধন করুন।",
      clearUploadBtn: "ফাইল মুছুন / নতুন ফাইল",
      extractedTag: "Gemini AI উদ্ধারকৃত",
      confidenceLabel: "নির্ভুলতা স্তর:",
      confHigh: "উচ্চ (High)",
      confMed: "মাঝারি (Medium)",
      confLow: "স্বল্প (Low)",
      confUnreadable: "অপাঠ্য (Unreadable)",
    },
    footer: {
      demoBadge: "পরীক্ষামূলক সংস্করণ",
      disclaimer: "কৃত্রিম তথ্যের ভিত্তিতে তৈরি সচেতনতামূলক প্ল্যাটফর্ম • এটি কোনো সরকারি বা আইনি সনদ নয়।",
      copyright: "© 2026 LandGuard BD (ল্যান্ডগার্ড বিডি) — Civic Tech for Land Due Diligence in Bangladesh.",
    },
    auth: {
      loginTitle: "অ্যাকাউন্টে লগইন করুন",
      loginSubtitle: "জমি ও খতিয়ান প্রাক-যাচাই প্ল্যাটফর্মে আপনাকে স্বাগতম। আপনার তথ্য দিয়ে প্রবেশ করুন।",
      loginBadge: "সুরক্ষিত নাগরিক প্রবেশদ্বার",
      emailLabel: "ইমেইল ঠিকানা",
      emailPlaceholder: "যেমন: citizen@example.com",
      passwordLabel: "পাসওয়ার্ড",
      passwordPlaceholder: "আপনার গোপন পাসওয়ার্ড দিন",
      loginButton: "লগইন করুন",
      loggingInButton: "যাচাই করা হচ্ছে...",
      demoLoginButton: "ডেমো লগইন ক্রেডেনশিয়াল",
      demoLoginBadge: "বিচারকদের জন্য",
      demoLoginNotice: "ডেমো তথ্য ইনপুট বক্সে বসানো হয়েছে। লগইন সম্পন্ন করতে 'লগইন করুন' বাটনে ক্লিক করুন।",
      demoLoginHelper: "পরীক্ষার সুবিধার্থে পূর্ব-নির্ধারিত ক্রেডেনশিয়াল স্বয়ংক্রিয়ভাবে ইনপুটে যুক্ত করুন।",
      demoNotConfiguredTitle: "ডেমো অ্যাকাউন্ট কনফিগার করা নেই",
      demoNotConfiguredDesc: "বর্তমানে কোনো পূর্ব-নির্ধারিত ডেমো অ্যাকাউন্ট সক্রিয় নেই। অনুগ্রহ করে 'নতুন অ্যাকাউন্ট খুলুন' অপশনে গিয়ে নতুন অ্যাকাউন্ট তৈরি করুন।",
      dontHaveAccount: "অ্যাকাউন্ট নেই?",
      signupLink: "নতুন অ্যাকাউন্ট খুলুন",
      adminNotice: "প্রশাসনিক ও সাধারণ ব্যবহারকারী একই ফর্মের মাধ্যমে নিরাপদে লগইন করতে পারবেন।",
      signupTitle: "নতুন অ্যাকাউন্ট তৈরি করুন",
      signupSubtitle: "ল্যান্ডগার্ড বিডিতে নিবন্ধন করে জমি ও দলিলের প্রাক-যাচাই শুরু করুন।",
      signupBadge: "নাগরিক নিবন্ধন",
      nameLabel: "পূর্ণ নাম",
      namePlaceholder: "যেমন: কাজী রফিকুল ইসলাম",
      phoneLabel: "মোবাইল নম্বর",
      phonePlaceholder: "যেমন: ০১৭১২-৩৪৫৬৭৮",
      occupationLabel: "পেশা বা ভূমিকা",
      occupationPlaceholder: "যেমন: ভূমি ক্রেতা, আইনজীবী, সার্ভেয়ার, নাগরিক",
      confirmPasswordLabel: "পাসওয়ার্ড নিশ্চিত করুন",
      confirmPasswordPlaceholder: "পাসওয়ার্ডটি পুনরায় লিখুন",
      signupButton: "অ্যাকাউন্ট তৈরি করুন",
      signingUpButton: "নিবন্ধন করা হচ্ছে...",
      alreadyHaveAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে?",
      loginLink: "লগইন করুন",
      termsNotice: "নিবন্ধন করার মাধ্যমে আপনি ল্যান্ডগার্ড বিডির প্রাথমিক সচেতনতামূলক শর্তাবলি মেনে নিচ্ছেন।",
      nameRequired: "পূর্ণ নাম প্রদান করা আবশ্যক।",
      emailRequired: "ইমেইল ঠিকানা প্রদান করা আবশ্যক।",
      emailInvalid: "সঠিক ফরম্যাটের ইমেইল ঠিকানা প্রদান করুন।",
      phoneRequired: "মোবাইল নম্বর প্রদান করা আবশ্যক।",
      phoneInvalid: "সঠিক মোবাইল নম্বর প্রদান করুন (যেমন: 017XXXXXXXX)।",
      occupationRequired: "পেশা বা ভূমিকা উল্লেখ করুন।",
      passwordRequired: "পাসওয়ার্ড প্রদান করা আবশ্যক।",
      passwordMinLength: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।",
      confirmPasswordRequired: "পাসওয়ার্ড নিশ্চিতকরণ আবশ্যক।",
      passwordMismatch: "উভয় পাসওয়ার্ড হুবহু একই হতে হবে।",
      genericLoginError: "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়। অনুগ্রহ করে পুনরায় চেষ্টা করুন।",
      duplicateEmailError: "এই ইমেইল ঠিকানা দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট নিবন্ধিত রয়েছে।",
      networkError: "সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি। অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন।",
      loginSuccess: "লগইন সফল হয়েছে! ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...",
      signupSuccess: "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...",
      showPassword: "পাসওয়ার্ড দেখুন",
      hidePassword: "পাসওয়ার্ড লুকান",
      backToHome: "মূল পাতায় ফিরে যান",
      trustBadgeTitle: "কেন ল্যান্ডগার্ড বিডি?",
      trustPoint1: "স্বত্ব হস্তান্তরের ধারাবাহিকতা ও নামজারি অসামঞ্জস্যতা বিশ্লেষণ",
      trustPoint2: "১ নং খাস খতিয়ান ও সরকারি বাফার এলাকা শনাক্তকরণ সংকেত",
      trustPoint3: "আর্গন-২আইডি ভিত্তিক সুরক্ষিত এনক্রিপশন ও গোপনীয়তা রক্ষা",
    },
    verificationHistory: {
      title: "যাচাইকরণ ইতিহাস",
      subtitle: "আপনার অ্যাকাউন্টে সংরক্ষিত পূর্ববর্তী দলিল প্রাক-যাচাই ও ক্যাডাস্ট্রাল তুলনার ফলাফল।",
      emptyTitle: "এখনও কোনো যাচাইকরণ রেকর্ড সংরক্ষিত নেই",
      emptySubtitle: "নতুন কোনো জমির দলিল বা খতিয়ান যাচাই সম্পন্ন করলে ফলাফল স্বয়ংক্রিয়ভাবে এখানে তালিকাভুক্ত হবে।",
      startVerificationBtn: "নতুন দলিল যাচাই করুন",
      dateCol: "তারিখ ও সময়",
      parcelCol: "মৌজা ও খতিয়ান",
      plotCol: "দাগ নম্বর",
      submittedOwnerCol: "দাখিলকৃত নাম",
      statusCol: "যাচাই ফলাফল",
      actionCol: "পদক্ষেপ",
      viewResultBtn: "ফলাফল দেখুন",
      ocrBadge: "দলিল OCR",
      discrepancyBadge: "অসঙ্গতি রয়েছে",
      cleanBadge: "সঠিক ও মিল রয়েছে",
      insufficientBadge: "অপর্যাপ্ত তথ্য",
      backToDashboard: "ড্যাশবোর্ডে ফিরুন",
      recordsCount: "টি যাচাইকরণ রেকর্ড সংরক্ষিত রয়েছে",
      loading: "যাচাইকরণ ইতিহাস লোড হচ্ছে...",
      modalTitle: "সংরক্ষিত যাচাইকরণ ফলাফল ও অডিট বিবরণ",
      modalClose: "বন্ধ করুন",
      printReport: "রিপোর্ট প্রিন্ট / PDF",
    },
    sidebar: {
      overview: "সারসংক্ষেপ",
      verifyDocument: "দলিল যাচাই করুন",
      myHistory: "যাচাই ইতিহাস",
      exploreRecords: "নমুনা রেকর্ড",
      account: "আমার অ্যাকাউন্ট",
      collapse: "সাইডবার ছোট করুন",
      expand: "সাইডবার প্রসারিত করুন",
      menu: "নেভিগেশন মেনু",
      close: "মেনু বন্ধ করুন",
      workspace: "ব্যক্তিগত যাচাই ওয়ার্কস্পেস",
      logout: "লগআউট",
    },
    personalDashboard: {
      welcomeBack: "স্বাগতম,",
      subtitle: "এখানে দলিল যাচাই করুন, আগের ফলাফল দেখুন, বা নমুনা রেকর্ড ঘুরে দেখুন।",
      heroTitle: "জমির দলিল যাচাই করুন",
      heroDesc: "খতিয়ান, দাগ ও মালিকের তথ্য দিয়ে প্রাথমিক তুলনা শুরু করুন—ভূমি অফিসে যাওয়ার আগে।",
      startCheckBtn: "যাচাই শুরু করুন",
      quickActionsTitle: "দ্রুত কাজ",
      actionVerify: "দলিল যাচাই",
      actionVerifyDesc: "নতুন যাচাই শুরু করুন",
      actionExplore: "নমুনা রেকর্ড",
      actionExploreDesc: "মানচিত্র ও নমুনা প্লট দেখুন",
      actionHistory: "যাচাই ইতিহাস",
      actionHistoryDesc: "আগের সব ফলাফল",
      actionChat: "ভূমিসাথী",
      actionChatDesc: "প্রশ্ন করুন ও সাহায্য নিন",
      activityTitle: "আপনার যাচাই সারাংশ",
      activityHint: "কেবল আপনার সংরক্ষিত ফলাফল",
      totalLabel: "মোট",
      cleanLabel: "মিল আছে",
      reviewLabel: "পর্যালোচনা",
      partialLabel: "অসম্পূর্ণ",
      recentTitle: "সাম্প্রতিক যাচাই",
      recentSubtitle: "আপনার অ্যাকাউন্টে সংরক্ষিত ফলাফল",
      viewAllHistory: "সব ইতিহাস",
      emptyTitle: "এখনও কোনো যাচাই নেই",
      emptyDesc: "প্রথম যাচাই শুরু করলে ফলাফল এখানে দেখা যাবে।",
      emptyCta: "প্রথম যাচাই শুরু করুন",
      step1Title: "তথ্য দিন",
      step1Desc: "মৌজা, দাগ, খতিয়ান লিখুন বা দলিলের ছবি দিন।",
      step2Title: "তুলনা দেখুন",
      step2Desc: "মিল, অমিল ও সতর্কতা স্পষ্টভাবে দেখাবে।",
      step3Title: "ফলাফল রাখুন",
      step3Desc: "রিপোর্ট আপনার ইতিহাসে সংরক্ষিত থাকবে।",
      unspecifiedOwner: "মালিকের নাম নেই",
      dagLabel: "দাগ",
      khatianLabel: "খতিয়ান",
      mismatchFields: "টি অমিল",
      matchFields: "টি মিল",
      tipTitle: "মনে রাখবেন",
      tip1: "খতিয়ানের ধারাবাহিকতা (সিএস–বিএস) পরীক্ষা করুন।",
      tip2: "নামজারি ও হাল সনের খাজনা দেখুন।",
      tip3: "খাস বা অর্পিত সম্পত্তি কিনা নিশ্চিত হোন।",
      tip4: "সরেজমিনে সীমানা ও দখল যাচাই করুন।",
      tipNote: "ল্যান্ডগার্ড বিডি সরকারি স্বত্ব সনদ নয়—প্রাথমিক সচেতনতার জন্য।",
      navbarWorkspace: "আপনার যাচাই ওয়ার্কস্পেস",
    },
    explore: {
      title: "ভূমি রেকর্ড অনুসন্ধান",
      subtitle: "ক্যাডাস্ট্রাল মানচিত্র ও কৃত্রিম নমুনা ভূমি রেকর্ডের ঝুঁকি বিশ্লেষণ",
      disclaimer: "ল্যান্ডগার্ড বিডি-র ঝুঁকি বিশ্লেষণ অন্বেষণের জন্য কৃত্রিম উদাহরণমূলক রেকর্ড। এগুলো সরকারের দাপ্তরিক ভূমি রেকর্ড নয়।",
      recordsCount: "টি নমুনা রেকর্ড পাওয়া গেছে",
      showingRecords: "প্রদর্শিত হচ্ছে",
      loadMore: "আরও রেকর্ড দেখুন",
      allLoaded: "সবগুলো রেকর্ড প্রদর্শিত হয়েছে",
      loading: "ডাটাবেজ থেকে ভূমি রেকর্ড লোড হচ্ছে...",
      errorTitle: "রেকর্ড লোড করা যায়নি",
      errorSubtitle: "ডাটাবেজের সাথে যোগাযোগ করতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।",
      retry: "পুনরায় চেষ্টা করুন",
      emptyTitle: "কোনো রেকর্ড পাওয়া যায়নি",
      emptySubtitle: "আপনার অনুসন্ধানের সাথে মিল রেখে কোনো ভূমি রেকর্ড পাওয়া যায়নি।",
    },
  },

  en: {
    nav: {
      brandTitle: "LandGuard BD",
      brandSubtitle: "Land Due Diligence & Deed Pre-Verification",
      workflow: "How It Works",
      features: "Features",
      dashboard: "Verification Dashboard",
      viewDashboard: "View Dashboard",
      home: "Home",
      map: "Map",
      records: "Records",
      riskGuide: "Risk Guide",
      chat: "Bhumi Sathi (AI)",
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      loggingOut: "Logging out...",
      profile: "Profile",
      myAccount: "My Account",
      citizenBadge: "Verified Citizen",
      demoBadge: "Demo",
      verifyDeedBtn: "Verify Deed",
      history: "Verification History",
      switchLangAria: "Switch Language (ভাষা পরিবর্তন)",
      menuOpen: "Open Menu",
      menuClose: "Close Menu",
    },
    disclaimer: {
      badge: "Synthetic Demo Data:",
      shortNotice: "All displayed khatian and dag numbers are fictional. Always verify original records at the competent local land office before finalizing any land transaction.",
      learnMore: "Learn More",
      collapse: "Collapse",
      fullNotice: "LandGuard BD is a civic technology prototype created to build consumer awareness for prospective land buyers. All records shown are synthetic demonstration data and do not represent actual property owners, real land parcels, or official government databases. This tool does not provide official government certification or legal advice.",
    },
    landing: {
      hackathonTrack: "LandTech Hackathon 2026 · Track P5",
      brandHero: "LandGuard BD",
      heroTitleStart: "Check land documents",
      heroTitleHighlight: "before you buy",
      heroSubtitle: "Review khatian details, deed history, and warning signs from home—before you visit the land office.",
      startVerificationBtn: "Start a land check",
      loginBtn: "Log in",
      viewDemoRecordsBtn: "See how it works",
      checkChainOfTitle: "Deed history continuity",
      checkKhatianShare: "Share & land area match",
      checkKhasWarning: "Khas land warnings",
      carouselPrev: "Previous",
      carouselNext: "Next",
      carouselSlide: "Slide",
      slide1Title: "Agricultural Landscapes & Riverine Parcels of Bangladesh",
      slide1Tag: "Agricultural Mouza",
      slide2Title: "CS-SA-RS-BS Cadastral Survey & Mouza Maps",
      slide2Tag: "Cadastral Boundary Map",
      slide3Title: "Land Deed Due Diligence & Khatian Verification Audit",
      slide3Tag: "Title & Deed Record",
      heroDisclaimerNote: "Not an official title certificate—for early awareness only. Always verify original records at the land office before deciding.",
      previewLabel: "Sample verification result",
      previewDocTitle: "Document pre-check",
      previewOwnerLabel: "Owner",
      previewOwnerValue: "Karim Uddin",
      previewMouzaLabel: "Mouza",
      previewMouzaValue: "Savar",
      previewKhatianLabel: "Khatian",
      previewKhatianValue: "1234 / RS",
      previewMatch: "Matches found",
      previewCaution: "Needs review",
      previewFlagShare: "Share mismatch",
      previewFlagChain: "Deed chain checked",
      previewSampleNote: "Example only — create an account to run a real check",
      benefitsTitle: "What gets checked",
      workflowBadge: "3 steps",
      workflowTitle: "How it works",
      workflowSubtitle: "Enter details, see results, know what to do next.",
      stepLabel: "Step",
      step1Num: "1",
      step1Title: "Enter the details",
      step1Desc: "Add seller name, mouza, khatian, dag, and land area.",
      step2Num: "2",
      step2Title: "Compare & spot risks",
      step2Desc: "Mismatches, share gaps, or duplicate-sale signals are flagged.",
      step3Num: "3",
      step3Title: "Get your report",
      step3Desc: "Download a PDF report and a simple land-office checklist.",
      featuresBadge: "What you get",
      featuresTitle: "Built for clear decisions",
      featuresSubtitle: "The checks you need before buying land—in one place.",
      feat1Title: "Match deed & khatian",
      feat1Desc: "Compare owner, mouza, khatian, and dag side by side.",
      feat2Title: "Plain-language risks",
      feat2Desc: "See what was found, why it matters, and what to do next.",
      feat3Title: "Map view",
      feat3Desc: "Browse sample plots on a map and open risk results in one click.",
      feat4Title: "PDF report",
      feat4Desc: "Print or save a report you can take to the land office.",
      feat5Title: "Bhumi Sathi help",
      feat5Desc: "Ask common questions about khatian, namjari, and deeds.",
      feat6Title: "Privacy first",
      feat6Desc: "Submitted deed details are not permanently stored on the server.",
      calloutTitle: "Try it with sample land records",
      calloutDesc: "Explore six demo plots across Savar, Sreepur, Rupganj, and more.",
      enterDashboardBtn: "Start a land check",
      askAssistantBtn: "Ask Bhumi Sathi",
    },
    cta: {
      initiativeBadge: "Civic Land Pre-Verification Initiative",
      heading: "Buying land? Pre-verify deed and khatian records first.",
      description: "Review chain of title (Baya deed) continuity, khatian share discrepancies, and government khas land buffer risks to make confident decisions.",
      point1: "Chain of Title (Baya Deed)",
      point2: "Khatian Share & Acreage",
      point3: "Khas Land No. 1 & Buffers",
      verifyNewDeedBtn: "Verify New Deed",
      viewDemoRecordsBtn: "View Demo Records",
    },
    summary: {
      totalParcels: "Total Demo Parcels",
      parcelsUnit: "Plots",
      totalParcelsSub: "Sample Dataset",
      lowRisk: "Low Risk",
      lowRiskUnit: "Plots",
      lowRiskSub: "Clear Chain of Title",
      mediumRisk: "Caution Needed",
      mediumRiskUnit: "Plots",
      mediumRiskSub: "Area Discrepancies Found",
      highRisk: "High Risk",
      highRiskUnit: "Plots",
      highRiskSub: "Duplicate Sale / Litigation Risk",
      riskFlags: "Total Risk Flags",
      riskFlagsUnit: "Flags",
      riskFlagsSub: "Identified Indicators",
    },
    map: {
      title: "Geographic Parcel Pre-Verification Map",
      demoBadge: "Synthetic Demo",
      subtitle: "Click a marker or dashed demo boundary to review a sample plot’s preliminary risk result.",
      boundaryNote: "* OpenStreetMap does not contain official cadastral boundaries. Dashed polygons are illustrative demo boundaries only.",
      loadingMap: "Loading interactive map...",
      loadingSub: "Preparing Bangladesh sample coordinates, markers, and demo boundaries",
      selectedParcel: "Selected Parcel",
      noParcelSelected: "No Plot Selected",
      noParcelSelectedSub: "Click any marker or boundary on the map to inspect parcel details.",
      viewInTable: "View in Table",
      verifyDeed: "Verify Deed",
      preAuditOutcome: "Automated Pre-Audit Outcome:",
      specsKhatianSurvey: "Khatian & Survey",
      specsArea: "Land Area",
      specsOwner: "Recorded Owner",
      syntheticCoordsNote: "* Synthetic demo coordinates and illustrative boundaries — not surveyed plot measurements.",
      legendClean: "Low risk",
      legendReview: "Needs review",
      legendInsufficient: "Insufficient info",
      jumpLabel: "Jump to:",
      showAll: "Show all",
      fitToParcel: "Fit to parcel",
      fitToResults: "Fit to results",
      layerStreets: "Street map",
      layerSatellite: "Satellite (Esri)",
      approxPointLabel: "Approximate sample location",
      popupApproxNote: "Approximate sample point — not an official dag boundary.",
      noCoordinates: "This plot has no map coordinates.",
      coordsLabel: "Coordinates",
      parcelIdLabel: "Parcel ID",
      legendIllustrativeBoundary: "Illustrative demo boundary",
      legendAuthenticBoundary: "Supplied geometry (if any)",
      illustrativeBoundaryDisclaimer:
        "Illustrative demo boundary — not an official cadastral parcel boundary.",
    },
    history: {
      historyTitle: "Chain of Title & Transfer History Timeline",
      historyBadge: "Demo History (Synthetic Data)",
      historyNotice: "* Synthetic chain of title prepared for educational pre-verification — not an official legal certification.",
      noHistory: "No historical transfer records included for this parcel",
      noHistorySub: "Purchasing land solely on current khatian without examining continuous chain of title is highly risky.",
      riskAnalysisTitle: "Explainable Risk & Discrepancy Analysis",
      warningsExplanation: "Identified Warnings & Detailed Explanations:",
      whatFound: "1. Discrepancy Found:",
      recordsTriggered: "2. Basis / Trigger:",
      whyReview: "3. Why Review is Required:",
      nextSteps: "4. Recommended Next Steps:",
      transferor: "Transferor / Prior Owner:",
      transferee: "Transferee / Current Owner:",
      conflictingClaim: "Conflicting Parallel Transfer Claim",
      litigationAlert: "Alert: Pending Litigation or Buffer Notice",
      caseDetails: "Case Details:",
      caseSubject: "Subject:",
      govtBuffer: "Govt Buffer / Encumbrance:",
      itemCountSuffix: "items flagged",
    },
    table: {
      title: "Sample Land Records & Khatian Table",
      subtitle: "Field-level discrepancy audit by Dag & Khatian — Click any row to view analysis",
      countUnit: "Records",
      searchPlaceholder: "Search mouza, dag, khatian, district...",
      clearSearchTitle: "Clear",
      filterAll: "All",
      filterLow: "Low Risk",
      filterMedium: "Caution",
      filterHigh: "High Risk",
      colDistrictUpazila: "District / Upazila",
      colMouzaJl: "Mouza / JL",
      colKhatianSurvey: "Khatian / Survey",
      colDag: "Dag (Plot) No.",
      colArea: "Area",
      colOwner: "Recorded Owner",
      colRisk: "Risk Assessment",
      colActions: "",
      noRecordsTitle: "No records found",
      noRecordsSub: "Try modifying your search or clearing the risk filter.",
      showAllBtn: "Show All Records",
      viewDetails: "Audit & History",
      hideDetails: "Collapse",
      viewOnMap: "View on Map",
      jlPrefix: "JL",
      flagsIdentified: "discrepancies flagged",
      statusMutationDone: "Active Mutation (Namjari) Completed",
    },
    about: {
      title: "3 Common Fundamental Land Risks in Bangladesh",
      subtitle: "Key due-diligence factors buyers should verify before purchase",
      risk1Title: "1. Government Khas & Vested Property",
      risk1Desc: "Government khas land (recorded under Khatian No. 1) or riverbanks are sometimes falsely marketed with counterfeit porchas. Khatian No. 1 land is legally non-transferable privately.",
      risk2Title: "2. Gaps in Chain of Title (Baya Deeds)",
      risk2Desc: "Without an unbroken chain of title (Baya deeds) and inheritance partition deeds from CS, SA, RS to current BS/City surveys, future ownership rights may face severe legal vulnerability.",
      risk3Title: "3. Khatian Share & Deed Acreage Mismatches",
      risk3Desc: "Executing deeds for land exceeding the seller's lawful recorded khatian share leads to disputes, boundary conflicts, and rejection during mutation (Namjari).",
    },
    modal: {
      formTitle: "Deed & Khatian Pre-Verification",
      resultsTitle: "Verification Results & Record Comparison",
      demoBadge: "Demo Prototype",
      formSubtitle: "Verify deed information against the selected reference record",
      resultsSubtitle: "Field-by-field comparative analysis of submitted deed vs reference record",
      closeBtn: "Close",
      quickPresets: "Quick Test Presets:",
      presetMatch: "Exact Match",
      presetOwnerMismatch: "Owner Name Mismatch",
      presetDagMismatch: "Wrong Dag Number",
      presetAreaMismatch: "Area Discrepancy",
      selectParcelPrompt: "Select reference demo parcel",
      fieldOwner: "Seller / Owner Name",
      fieldDistrict: "District",
      fieldUpazila: "Upazila",
      fieldMouza: "Mouza",
      fieldKhatianNumber: "Khatian Number",
      fieldKhatianType: "Survey Type",
      fieldDagNumber: "Dag (Plot) Number",
      fieldRecordedArea: "Land Area",
      fieldAreaUnit: "Unit",
      verifyBtn: "Start Deed Verification",
      reverifyBtn: "Re-verify",
      viewReportBtn: "View & Print Audit Report",
      uploadDeedSection: "AI Document Extraction (Optional)",
      uploadDeedTitle: "Auto-fill from Deed or Khatian (Gemini AI)",
      uploadDeedDesc: "Upload a photo or PDF of your deed to auto-populate the fields below. You can review and correct all values before running verification.",
      uploadDropPrompt: "Click to upload deed or drag and drop",
      uploadFormatsHint: "JPEG, PNG, WebP or PDF (Max 5MB)",
      uploadAnalyzing: "Extracting document details with Gemini AI... Please wait",
      uploadSuccessTitle: "Document Information Extracted!",
      uploadSuccessDesc: "Extracted values have been populated below. Please review and correct each field before verifying.",
      uploadUnreadableWarning: "Some fields could not be read clearly. Please fill them in manually.",
      uploadFailedTitle: "Document Extraction Failed",
      uploadFailedDesc: "Could not extract legible data from this document. Please upload a clearer file or fill in details manually.",
      geminiNotConfiguredNotice: "Gemini API key is not configured on the server. Manual verification is fully available below.",
      extractedReviewNotice: "Please carefully review and correct all fields before running verification.",
      clearUploadBtn: "Clear / Re-upload",
      extractedTag: "Gemini AI Extracted",
      confidenceLabel: "Confidence:",
      confHigh: "High",
      confMed: "Medium",
      confLow: "Low",
      confUnreadable: "Unreadable",
    },
    footer: {
      demoBadge: "Demo Prototype",
      disclaimer: "Civic awareness platform built with synthetic data • Not an official government or legal certification.",
      copyright: "© 2026 LandGuard BD — Civic Tech for Land Due Diligence in Bangladesh.",
    },
    auth: {
      loginTitle: "Sign in to your account",
      loginSubtitle: "Welcome back to LandGuard BD land due diligence portal. Enter your details to continue.",
      loginBadge: "Secure Civic Gateway",
      emailLabel: "Email Address",
      emailPlaceholder: "e.g. citizen@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      loginButton: "Sign In",
      loggingInButton: "Verifying credentials...",
      demoLoginButton: "Demo Login Credentials",
      demoLoginBadge: "For Hackathon Judges",
      demoLoginNotice: "Demo credentials filled in form. Click 'Sign In' to submit.",
      demoLoginHelper: "Click to populate trial credentials for hackathon evaluation.",
      demoNotConfiguredTitle: "Demo Account Not Pre-configured",
      demoNotConfiguredDesc: "No default trial account is currently pre-configured. Please click 'Create Account' to register a test account in seconds.",
      dontHaveAccount: "Don't have an account?",
      signupLink: "Create an account",
      adminNotice: "Administrators and citizens sign in through this unified secure portal.",
      signupTitle: "Create your account",
      signupSubtitle: "Join LandGuard BD to verify deed records and inspect chain-of-title alerts.",
      signupBadge: "Citizen Registration",
      nameLabel: "Full Name",
      namePlaceholder: "e.g. Kazi Rafiqul Islam",
      phoneLabel: "Phone Number",
      phonePlaceholder: "e.g. 01712-345678",
      occupationLabel: "Occupation / Role",
      occupationPlaceholder: "e.g. Land Buyer, Advocate, Surveyor, Citizen",
      confirmPasswordLabel: "Confirm Password",
      confirmPasswordPlaceholder: "Re-enter your password",
      signupButton: "Create Account",
      signingUpButton: "Registering account...",
      alreadyHaveAccount: "Already have an account?",
      loginLink: "Sign In",
      termsNotice: "By registering, you acknowledge LandGuard BD as an informational civic awareness tool.",
      nameRequired: "Full name is required.",
      emailRequired: "Email address is required.",
      emailInvalid: "Please enter a valid email address.",
      phoneRequired: "Phone number is required.",
      phoneInvalid: "Please enter a valid phone number (e.g. 017XXXXXXXX).",
      occupationRequired: "Occupation or role is required.",
      passwordRequired: "Password is required.",
      passwordMinLength: "Password must be at least 8 characters.",
      confirmPasswordRequired: "Please confirm your password.",
      passwordMismatch: "Passwords do not match.",
      genericLoginError: "Invalid email or password. Please try again.",
      duplicateEmailError: "An account with this email address already exists.",
      networkError: "Could not reach the server. Please check your network connection.",
      loginSuccess: "Signed in successfully! Redirecting to dashboard...",
      signupSuccess: "Account created successfully! Redirecting to dashboard...",
      showPassword: "Show password",
      hidePassword: "Hide password",
      backToHome: "Back to Home",
      trustBadgeTitle: "Why LandGuard BD?",
      trustPoint1: "Automated chain-of-title and mutation discrepancy alerts",
      trustPoint2: "Khas ledger and protected buffer zone anomaly warnings",
      trustPoint3: "Argon2id encryption and secure HTTP-only session isolation",
    },
    verificationHistory: {
      title: "Verification History",
      subtitle: "Saved historical deed pre-verifications and cadastral audit records associated with your account.",
      emptyTitle: "No verification history found",
      emptySubtitle: "When you run a deed or khatian verification, your detailed audit results will be preserved here for tracking.",
      startVerificationBtn: "Verify Land Record",
      dateCol: "Date & Time",
      parcelCol: "Mouza & Khatian",
      plotCol: "Plot (Dag)",
      submittedOwnerCol: "Submitted Name",
      statusCol: "Audit Outcome",
      actionCol: "Action",
      viewResultBtn: "View Result",
      ocrBadge: "Doc OCR",
      discrepancyBadge: "Discrepancy Found",
      cleanBadge: "Verified Match",
      insufficientBadge: "Insufficient Info",
      backToDashboard: "Back to Dashboard",
      recordsCount: "verification records saved",
      loading: "Loading verification history...",
      modalTitle: "Saved Verification Result & Audit Details",
      modalClose: "Close",
      printReport: "Print Report / PDF",
    },
    sidebar: {
      overview: "Overview",
      verifyDocument: "Verify document",
      myHistory: "Verification history",
      exploreRecords: "Sample records",
      account: "My Account",
      collapse: "Collapse sidebar",
      expand: "Expand sidebar",
      menu: "Navigation Menu",
      close: "Close menu",
      workspace: "Personal Verification Workspace",
      logout: "Log out",
    },
    personalDashboard: {
      welcomeBack: "Welcome,",
      subtitle: "Check a land document, review past results, or browse sample records.",
      heroTitle: "Check a land document",
      heroDesc: "Compare khatian, dag, and owner details before you visit the land office.",
      startCheckBtn: "Start a land check",
      quickActionsTitle: "Quick actions",
      actionVerify: "Verify document",
      actionVerifyDesc: "Start a new check",
      actionExplore: "Sample records",
      actionExploreDesc: "Map and demo plots",
      actionHistory: "History",
      actionHistoryDesc: "All past results",
      actionChat: "Bhumi Sathi",
      actionChatDesc: "Ask for help",
      activityTitle: "Your checks at a glance",
      activityHint: "Saved results only",
      totalLabel: "Total",
      cleanLabel: "Matched",
      reviewLabel: "Needs review",
      partialLabel: "Incomplete",
      recentTitle: "Recent checks",
      recentSubtitle: "Results saved to your account",
      viewAllHistory: "View all",
      emptyTitle: "No checks yet",
      emptyDesc: "When you finish your first verification, results will show up here.",
      emptyCta: "Start your first check",
      step1Title: "Enter details",
      step1Desc: "Add mouza, dag, khatian—or upload a document photo.",
      step2Title: "See the comparison",
      step2Desc: "Matches, mismatches, and warnings are shown clearly.",
      step3Title: "Keep the result",
      step3Desc: "Your report stays in history for later review.",
      unspecifiedOwner: "Owner not specified",
      dagLabel: "Dag",
      khatianLabel: "Khatian",
      mismatchFields: "mismatches",
      matchFields: "matches",
      tipTitle: "Before you buy",
      tip1: "Check khatian continuity (CS–BS).",
      tip2: "Review mutation and recent tax receipts.",
      tip3: "Confirm it is not khas or vested property.",
      tip4: "Verify boundaries and possession on site.",
      tipNote: "LandGuard BD is not an official title certificate—for early awareness only.",
      navbarWorkspace: "Your verification workspace",
    },
    explore: {
      title: "Explore Land Records",
      subtitle: "Cadastral map visualizer & risk analysis across synthetic land parcels",
      disclaimer: "Illustrative records for exploring LandGuard BD's risk analysis. These are not official land records.",
      recordsCount: "sample records available",
      showingRecords: "Showing",
      loadMore: "Load more records",
      allLoaded: "All records loaded",
      loading: "Loading land parcels from database...",
      errorTitle: "Unable to load land records",
      errorSubtitle: "There was a problem communicating with the database. Please try again.",
      retry: "Retry",
      emptyTitle: "No records found",
      emptySubtitle: "No land records matched your search or filter criteria.",
    },
  },
};
