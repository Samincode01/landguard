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

    // 3-step workflow
    workflowBadge: string;
    workflowTitle: string;
    workflowSubtitle: string;
    step1Num: string;
    step1Title: string;
    step1Desc: string;
    step2Num: string;
    step2Title: string;
    step2Desc: string;
    step3Num: string;
    step3Title: string;
    step3Desc: string;

    // 6 features
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
      hackathonTrack: "ল্যান্ডটেক ইনোভেশন হ্যাকাথন ২০২৬ • ট্র্যাক P5: কেনার আগেই যাচাই",
      heroTitleStart: "জমি কেনার আগে দলিল, খতিয়ান ও সম্ভাব্য ঝুঁকি",
      heroTitleHighlight: "প্রাক-যাচাই",
      heroSubtitle: "বায়া দলিলের পরম্পরা, খতিয়ানের হিস্যা, ১ নং খাস বাফার এবং দ্বৈত হস্তান্তরের অসঙ্গতি কম্পিউটার-ভিত্তিক তুলনার মাধ্যমে চিহ্নিত করার নাগরিক প্ল্যাটফর্ম।",
      startVerificationBtn: "যাচাই শুরু করুন",
      loginBtn: "লগইন",
      viewDemoRecordsBtn: "নমুনা ডেমো রেকর্ড দেখুন",
      checkChainOfTitle: "১২-২৫ বছরের বায়া দলিলের ধারাবাহিকতা",
      checkKhatianShare: "খতিয়ানের হিস্যা ও আয়তনের অমিল",
      checkKhasWarning: "১ নং খাস ও অর্পিত সম্পত্তি সংকেত",
      carouselPrev: "পূর্ববর্তী ছবি",
      carouselNext: "পরবর্তী ছবি",
      carouselSlide: "স্লাইড",
      slide1Title: "বাংলাদেশের কৃষিজমি ও নদীবিধৌত ভূখণ্ড",
      slide1Tag: "কৃষি ও প্রাকৃতিক মৌজা",
      slide2Title: "সিএস-এসএ-আরএস-বিএস মৌজা ক্যাডাস্ট্রাল মানচিত্র",
      slide2Tag: "মৌজা নকশা ও দাগ সীমানা",
      slide3Title: "ভূমি দলিল ও বায়া খতিয়ান প্রাক-যাচাই নিরীক্ষা",
      slide3Tag: "দলিল ও স্বত্ব রেকর্ড",
      heroDisclaimerNote: "ল্যান্ডগার্ড বিডি কোনো সরকারি স্বত্ব সনদ প্রদান করে না। এটি নাগরিক সচেতনতা ও প্রাথমিক ঝুঁকি শনাক্তকরণের জন্য প্রস্তুতকৃত।",
      workflowBadge: "সহজ ৩টি ধাপ",
      workflowTitle: "জমি ক্রয়ের আগে কীভাবে তথ্য যাচাই করবেন?",
      workflowSubtitle: "ভূমি অফিসে সশরীরে চূড়ান্ত অনুসন্ধানে যাওয়ার আগে ঘরে বসেই দলিলের মূল তথ্যাদি প্রাক-যাচাই করে নিন।",
      step1Num: "১",
      step1Title: "দলিল ও খতিয়ানের তথ্য প্রদান",
      step1Desc: "বিক্রেতার নাম, মৌজা, খতিয়ান নম্বর, জরিপের ধরন (CS, SA, RS, BS), দাগ নম্বর এবং প্রস্তাবিত জমির পরিমাণ দাখিল করুন।",
      step2Num: "২",
      step2Title: "স্বয়ংক্রিয় প্রাক-তুলনা ও ঝুঁকি নিরীক্ষা",
      step2Desc: "রেফারেন্স রেকর্ডের সাথে ক্ষেত্রভিত্তিক অমিল, পরিমাণের অসঙ্গতি বা একাধিক হস্তান্তরের সংকেত স্বয়ংক্রিয়ভাবে উদঘাটন করা হয়।",
      step3Num: "৩",
      step3Title: "অডিট রিপোর্ট ও চেকলিস্ট সংগ্রহ",
      step3Desc: "ইউনিক রেফারেন্স কোড ও সরকারি অফিসে সশরীরে অনুসন্ধানের প্রয়োজনীয় সতর্কতামূলক চেকলিস্টসহ PDF রিপোর্ট প্রিন্ট করুন।",
      featuresBadge: "মূল সুবিধাসমূহ",
      featuresTitle: "ভূমি সুরক্ষায় ল্যান্ডগার্ড বিডির প্রধান ফিচারসমূহ",
      featuresSubtitle: "নাগরিক সচেতনতা বাড়াতে এবং জমি ক্রয়ে সম্ভাব্য প্রতারণা এড়াতে তৈরি সমন্বিত টুলস।",
      feat1Title: "দলিল প্রাক-যাচাই ইঞ্জিন",
      feat1Desc: "মালিকের নাম, মৌজা, খতিয়ান ও দাগ নম্বরের নিখুঁত ক্ষেত্রভিত্তিক তুলনা। তথ্যের সামান্যতম অমিলও আলাদাভাবে হাইলাইট করা হয়।",
      feat2Title: "ব্যাখ্যামূলক ঝুঁকি বিশ্লেষণ",
      feat2Desc: "মনগড়া রিস্ক স্কোর নয়; ৪-স্তরীয় যৌক্তিক ব্যাখ্যা—কী অসঙ্গতি পাওয়া গেছে, কোন রেকর্ড থেকে সূত্রপাত এবং পরবর্তী করণীয় কী।",
      feat3Title: "ইন্টারেক্টিভ ক্যাডাস্ট্রাল মানচিত্র",
      feat3Desc: "বাংলাদেশের ভৌগোলিক স্থানাঙ্কে প্লট ও মৌজা নকশার কাল্পনিক সীমানা ভিজ্যুয়ালাইজেশন এবং এক ক্লিকেই ঝুঁকি ফলাফল পর্যবেক্ষণ।",
      feat4Title: "প্রিন্টযোগ্য অডিট রিপোর্ট ও PDF",
      feat4Desc: "ব্রাউজারের প্রিন্ট অপশন বা Save as PDF ব্যবহারের মাধ্যমে সম্পূর্ণ আইসোলেটেড, পেশাদার অডিট ডকুমেন্ট সংগ্রহ।",
      feat5Title: "ভূমিসাথী — এআই ভূমি সহকারী",
      feat5Desc: "খতিয়ান, দাগ, মৌজা, নামজারি, বায়া দলিল ও সরকারি পোর্টাল সংক্রান্ত সাধারণ জিজ্ঞাসার তাৎক্ষণিক তথ্যবহুল উত্তর পেতে ভূমিসাথীর সাথে কথোপকথন করুন।",
      feat6Title: "গোপনীয়তা ও ডেটা নিরাপত্তা",
      feat6Desc: "ব্যবহারকারীর দাখিলকৃত দলিল সার্ভারে স্থায়ীভাবে জমা হয় না। ইন-মেমোরি প্রসেসিংয়ের মাধ্যমে সর্বোচ্চ ডেটা সুরক্ষা নিশ্চিত।",
      calloutTitle: "কাল্পনিক ডেমো রেকর্ডের সাথে স্বচক্ষে যাচাই পরীক্ষা করুন",
      calloutDesc: "আমাদের পরীক্ষামূলক ড্যাশবোর্ডে সাভার, শ্রীপুর, রূপগঞ্জ, সীতাকুণ্ড, কেরানীগঞ্জ ও বরিশাল সদরের ৬টি সিন্থেটিক প্লটের পূর্ণাঙ্গ তথ্য রয়েছে।",
      enterDashboardBtn: "ড্যাশবোর্ডে প্রবেশ করুন",
      askAssistantBtn: "ভূমিসাথীকে প্রশ্ন করুন",
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
      subtitle: "মানচিত্রের যেকোনো মার্কার বা পলিগনে ক্লিক করে সংশ্লিষ্ট প্লটের প্রাথমিক ঝুঁকি ফলাফল পর্যালোচনা করুন",
      boundaryNote: "* কোনো জরিপ-নির্ভুল বা বাস্তব সরকারি মৌজা সীমানা নির্দেশ করে না।",
      loadingMap: "ইন্টারেক্টিভ মানচিত্র লোড হচ্ছে...",
      loadingSub: "বাংলাদেশ ভৌগোলিক স্থানাঙ্ক ও পলিগন রেন্ডার হচ্ছে",
      selectedParcel: "নির্বাচিত প্লট",
      noParcelSelected: "কোনো প্লট নির্বাচিত নেই",
      noParcelSelectedSub: "মানচিত্রের যেকোনো মার্কার বা পলিগনে ক্লিক করে জমির বিস্তারিত ও ঝুঁকি বিশ্লেষণ দেখুন।",
      viewInTable: "তালিকায় বিশদ দেখুন",
      verifyDeed: "দলিল যাচাই করুন",
      preAuditOutcome: "স্বয়ংক্রিয় প্রাক-নিরীক্ষা ফলাফল:",
      specsKhatianSurvey: "খতিয়ান ও জরিপ",
      specsArea: "জমির পরিমাণ",
      specsOwner: "নথিভুক্ত মালিক",
      syntheticCoordsNote: "* কৃত্রিম ডেমো স্থানাঙ্ক — কোনো বাস্তব সীমানা নির্দেশ করে না।",
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
      hackathonTrack: "LandTech Innovation Hackathon 2026 • Track P5: Check Before You Buy",
      heroTitleStart: "Pre-verify deeds, khatians, and potential risks",
      heroTitleHighlight: "before buying land",
      heroSubtitle: "A civic-tech platform for computer-assisted detection of chain-of-title gaps, khatian share mismatches, government khas land buffers, and duplicate transfer risks.",
      startVerificationBtn: "Start Verification",
      loginBtn: "Login",
      viewDemoRecordsBtn: "View Demo Records",
      checkChainOfTitle: "12–25 Year Chain of Title (Baya Deed) Continuity",
      checkKhatianShare: "Khatian Share & Acreage Mismatch Auditing",
      checkKhasWarning: "Khas Land No. 1 & Vested Property Warnings",
      carouselPrev: "Previous slide",
      carouselNext: "Next slide",
      carouselSlide: "Slide",
      slide1Title: "Agricultural Landscapes & Riverine Parcels of Bangladesh",
      slide1Tag: "Agricultural Mouza",
      slide2Title: "CS-SA-RS-BS Cadastral Survey & Mouza Maps",
      slide2Tag: "Cadastral Boundary Map",
      slide3Title: "Land Deed Due Diligence & Khatian Verification Audit",
      slide3Tag: "Title & Deed Record",
      heroDisclaimerNote: "LandGuard BD does not provide official legal title guarantees. It is an independent civic due-diligence audit tool.",
      workflowBadge: "3 Simple Steps",
      workflowTitle: "How to verify land information before purchase?",
      workflowSubtitle: "Conduct preliminary verification of key deed and khatian details from home before scheduling an in-person search at the sub-registry and land offices.",
      step1Num: "1",
      step1Title: "Provide Deed & Khatian Details",
      step1Desc: "Enter seller name, mouza, khatian number, survey type (CS, SA, RS, BS), dag (plot) number, and proposed land area.",
      step2Num: "2",
      step2Title: "Automated Comparison & Risk Audit",
      step2Desc: "Field-by-field discrepancies against reference records, acreage inconsistencies, or conflicting transfer indicators are automatically flagged.",
      step3Num: "3",
      step3Title: "Get Audit Report & Checklist",
      step3Desc: "Print a comprehensive PDF audit report complete with a unique reference code and an in-person due diligence checklist for land offices.",
      featuresBadge: "Core Capabilities",
      featuresTitle: "Key LandGuard BD Features for Land Security",
      featuresSubtitle: "Integrated tools designed to empower citizens and reduce land fraud risks during due diligence.",
      feat1Title: "Deed Pre-Verification Engine",
      feat1Desc: "Precise field-by-field comparison of owner name, mouza, khatian, and dag numbers. Minor spelling or number mismatches are highlighted.",
      feat2Title: "Explainable Risk Analysis",
      feat2Desc: "No black-box risk scores. A structured 4-tier explanation of what discrepancy was found, which record triggered it, and recommended next steps.",
      feat3Title: "Interactive Cadastral Map",
      feat3Desc: "Visualize synthetic plot and mouza boundaries in Bangladesh geographic coordinates with instant one-click risk outcome inspection.",
      feat4Title: "Printable PDF Audit Report",
      feat4Desc: "Generate an isolated, professional audit document ready for browser printing or saving as PDF for in-person record checks.",
      feat5Title: "Bhumi Sathi — AI Land Assistant",
      feat5Desc: "Instant, informative answers to common questions about khatians, dags, mouzas, namjari mutations, baya deeds, and government portals from Bhumi Sathi.",
      feat6Title: "Privacy & Data Security",
      feat6Desc: "User-submitted deed details are not permanently stored on the server. In-memory processing ensures maximum data protection.",
      calloutTitle: "Explore Live Verification with Synthetic Demo Records",
      calloutDesc: "Our demonstration dashboard contains 6 complete synthetic plots across Savar, Sreepur, Rupganj, Sitakunda, Keraniganj, and Barishal Sadar.",
      enterDashboardBtn: "Enter Dashboard",
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
      subtitle: "Click any marker or polygon on the map to review preliminary risk assessments for that parcel.",
      boundaryNote: "* Does not represent survey-accurate or official cadastral mouza boundaries.",
      loadingMap: "Loading interactive map...",
      loadingSub: "Rendering Bangladesh geographic coordinates and parcel polygons",
      selectedParcel: "Selected Parcel",
      noParcelSelected: "No Plot Selected",
      noParcelSelectedSub: "Click any marker or polygon on the map to inspect parcel details and risk analysis.",
      viewInTable: "View in Table",
      verifyDeed: "Verify Deed",
      preAuditOutcome: "Automated Pre-Audit Outcome:",
      specsKhatianSurvey: "Khatian & Survey",
      specsArea: "Land Area",
      specsOwner: "Recorded Owner",
      syntheticCoordsNote: "* Synthetic demo coordinates — do not indicate actual real-world physical boundaries.",
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
  },
};
