export type RiskSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ParcelRiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type ParcelStatus = "ACTIVE" | "MUTATION_PENDING" | "DISPUTED_CLAIM" | "MUTATED_VERIFIED" | "SUSPECTED_GOVT_BUFFER";

export interface DemoRiskFlag {
  id: string;
  flagCode: string;
  severity: RiskSeverity;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
}

export interface DemoOwnershipRecord {
  id: string;
  ownerName: string;
  ownerNameEn: string;
  deedNumber?: string;
  recordedArea?: number;
  areaUnit?: string;
  status: string;
  statusLabelBn: string;
  isSynthetic: boolean;
}

export type LandEventType =
  | "SURVEY_RECORD"    // জরিপ প্রকাশনা (CS/SA/RS/BS)
  | "DEED_TRANSFER"    // সাফ-কবলা হস্তান্তর
  | "INHERITANCE"      // ওয়ারিশ বণ্টননামা
  | "MUTATION"         // নামজারি ও জমাভাগ
  | "LITIGATION"       // দেওয়ানি মামলা
  | "MORTGAGE";        // প্রাতিষ্ঠানিক বন্ধক

export interface LandHistoryEvent {
  id: string;
  eventType: LandEventType;
  year: number;
  dateBn: string;             // যেমন: "১৯৮২ সন" বা "১৫ মে ২০১৭"
  titleBn: string;            // যেমন: "আরএস জরিপ চূড়ান্ত প্রকাশনা"
  fromPartyBn?: string;       // হস্তান্তরকারী / পূর্ববর্তী মালিক
  toPartyBn: string;          // গ্রহীতা / বর্তমান মালিক
  deedNumber?: string;        // দলিল নম্বর
  khatianNumber?: string;     // খতিয়ান নম্বর
  dagNumber?: string;         // দাগ নম্বর
  recordedArea?: number;      // জমির পরিমাণ
  areaUnit?: string;          // পরিমাপের একক (শতক)
  notesBn: string;            // সারসংক্ষেপ
  isConflictingTransfer?: boolean; // দ্বৈত বা পরস্পরবিরোধী হস্তান্তরের সংকেত
}

export interface SimulatedLitigationInfo {
  hasActiveCase: boolean;
  caseNumber?: string;        // যেমন: "দেওয়ানি মোকদ্দমা নং ৪৫/২০২২"
  courtNameBn?: string;       // যেমন: "যুগ্ম জেলা জজ ১ম আদালত, নারায়ণগঞ্জ"
  caseTypeBn?: string;        // যেমন: "দলিল বাতিল, স্বত্ব ঘোষণা ও স্থায়ী নিষেধাজ্ঞা"
  detailsBn?: string;         // বিস্তারিত বিবরণ
}

export interface SimulatedEncumbranceInfo {
  isEncumbered: boolean;
  institutionNameBn?: string; // যেমন: "সোনালী ব্যাংক পিএলসি, জিনজিরা শাখা"
  mortgageDeedNo?: string;    // যেমন: "DEED-MORT-2021-09"
  detailsBn?: string;
}

export interface DemoLandParcel {
  id: string;
  district: string;
  districtEn: string;
  upazila: string;
  upazilaEn: string;
  mouza: string;
  mouzaEn: string;
  jlNumber: string;
  khatianNumber: string;
  dagNumber: string;
  khatianType: string; // e.g. "BS", "RS", "SA", "CS"
  recordedArea: number;
  areaUnit: string;
  areaUnitEn: string;
  riskLevel: ParcelRiskLevel;
  riskScore: number; // 0 - 100
  status: ParcelStatus;
  statusLabelBn: string;
  statusLabelEn: string;
  ownership: DemoOwnershipRecord;
  riskFlags: DemoRiskFlag[];
  approxLocation?: {
    lat: number;
    lng: number;
  };
  notesBn: string;
  notesEn: string;
  historyEvents?: LandHistoryEvent[];
  litigationStatus?: SimulatedLitigationInfo;
  encumbranceStatus?: SimulatedEncumbranceInfo;
}

export interface DashboardSummary {
  totalParcels: number;
  lowRiskCount: number;
  mediumRiskCount: number;
  highRiskCount: number;
  totalRiskFlags: number;
  activeVerifications: number;
}

export const SYNTHETIC_DEMO_PARCELS: DemoLandParcel[] = [
  {
    id: "lp-demo-001",
    district: "ঢাকা",
    districtEn: "Dhaka",
    upazila: "সাভার",
    upazilaEn: "Savar",
    mouza: "বিরুলিয়া",
    mouzaEn: "Birulia",
    jlNumber: "৫৪",
    khatianNumber: "৩১২",
    dagNumber: "৮৪৫",
    khatianType: "বিএস (BS)",
    recordedArea: 7.5,
    areaUnit: "শতক",
    areaUnitEn: "Decimal",
    riskLevel: "LOW",
    riskScore: 12,
    status: "ACTIVE",
    statusLabelBn: "নিয়মিত ও ত্রুটিমুক্ত",
    statusLabelEn: "Verified / Regular",
    ownership: {
      id: "own-001",
      ownerName: "রফিকুল ইসলাম (কৃত্রিম ডেমো)",
      ownerNameEn: "Rafiqul Islam (Synthetic Demo)",
      deedNumber: "DEED-2020-9872",
      recordedArea: 7.5,
      areaUnit: "শতক",
      status: "ACTIVE",
      statusLabelBn: "সক্রিয় নামজারি সম্পন্ন",
      isSynthetic: true,
    },
    riskFlags: [],
    approxLocation: { lat: 23.868, lng: 90.315 },
    notesBn: "সর্বশেষ বিএস খতিয়ান ও বায়া দলিলের মালিকানা ধারার মধ্যে কোনো অসঙ্গতি নেই।",
    notesEn: "Chain of title consistent with latest BS survey ledger.",
    historyEvents: [
      {
        id: "h-001-1",
        eventType: "SURVEY_RECORD",
        year: 1982,
        dateBn: "১৯৮২ সন",
        titleBn: "আরএস জরিপ চূড়ান্ত রেকর্ড প্রকাশনা",
        fromPartyBn: "ভূমি রেকর্ড ও জরিপ অধিদপ্তর",
        toPartyBn: "আব্দুল করিম (মূল প্রজা/মালিক)",
        khatianNumber: "১২০",
        dagNumber: "৮৪৫",
        recordedArea: 7.5,
        areaUnit: "শতক",
        notesBn: "আরএস খতিয়ানে আব্দুল করিমের নামে ৭.৫০ শতক জমি একক নামে চূড়ান্ত রেকর্ডভুক্ত হয়।",
      },
      {
        id: "h-001-2",
        eventType: "INHERITANCE",
        year: 2005,
        dateBn: "১০ জুন ২০০৫",
        titleBn: "পারিবারিক ওয়ারিশান বণ্টননামা দলিল",
        fromPartyBn: "মরহুম আব্দুল করিমের ওয়ারিশগণ",
        toPartyBn: "রফিকুল ইসলাম (কৃত্রিম ডেমো)",
        deedNumber: "PART-2005-450",
        dagNumber: "৮৪৫",
        recordedArea: 7.5,
        areaUnit: "শতক",
        notesBn: "আব্দুল করিমের মৃত্যুর পর নিবন্ধিত বণ্টননামা দলিল মূলে রফিকুল ইসলাম একক হিস্যা প্রাপ্ত হন।",
      },
      {
        id: "h-001-3",
        eventType: "MUTATION",
        year: 2020,
        dateBn: "১৪ সেপ্টেম্বর ২০২০",
        titleBn: "বিএস নামজারি জমাভাগ ও দাখিলা সৃজন",
        fromPartyBn: "রফিকুল ইসলাম (কৃত্রিম ডেমো)",
        toPartyBn: "রফিকুল ইসলাম (কৃত্রিম ডেমো)",
        deedNumber: "DEED-2020-9872",
        khatianNumber: "৩১২",
        dagNumber: "৮৪৫",
        recordedArea: 7.5,
        areaUnit: "শতক",
        notesBn: "সহকারী কমিশনার (ভূমি) সাভার কর্তৃক নামজারি মিসকেস নিষ্পত্তিপূর্বক নতুন নামজারি খতিয়ান ৩১২ অনুমোদিত।",
      },
    ],
    litigationStatus: {
      hasActiveCase: false,
    },
    encumbranceStatus: {
      isEncumbered: false,
    },
  },
  {
    id: "lp-demo-002",
    district: "গাজীপুর",
    districtEn: "Gazipur",
    upazila: "শ্রীপুর",
    upazilaEn: "Sreepur",
    mouza: "মাওনা",
    mouzaEn: "Mawna",
    jlNumber: "৮৮",
    khatianNumber: "১২০",
    dagNumber: "১০৪",
    khatianType: "আরএস (RS)",
    recordedArea: 12.0,
    areaUnit: "শতক",
    areaUnitEn: "Decimal",
    riskLevel: "MEDIUM",
    riskScore: 54,
    status: "MUTATION_PENDING",
    statusLabelBn: "পরিমাপে গরমিল / নামজারি অনিষ্পন্ন",
    statusLabelEn: "Area Discrepancy / Mutation Pending",
    ownership: {
      id: "own-002",
      ownerName: "সেলিনা পারভীন (কৃত্রিম ডেমো)",
      ownerNameEn: "Selina Parveen (Synthetic Demo)",
      deedNumber: "DEED-2017-4510",
      recordedArea: 11.2,
      areaUnit: "শতক",
      status: "MUTATION_PENDING",
      statusLabelBn: "নামজারি প্রক্রিয়া চলমান",
      isSynthetic: true,
    },
    riskFlags: [
      {
        id: "rf-001",
        flagCode: "AREA_MISMATCH_SUSPECTED",
        severity: "MEDIUM",
        title: "জমির পরিমাপে পার্থক্য",
        titleEn: "Area Discrepancy Detected",
        description:
          "খতিয়ানে ১২.০০ শতক উল্লেখ থাকলেও হস্তান্তরিত দলিলে ১১.২০ শতক দেখা যাচ্ছে। ০.৮০ শতকের সম্ভাব্য অসঙ্গতি বিদ্যমান।",
        descriptionEn:
          "Khatian records 12.00 decimals while transferred deed shows 11.20 decimals. Potential 0.80 decimal mismatch.",
      },
    ],
    approxLocation: { lat: 24.185, lng: 90.412 },
    notesBn: "ভূমি জরিপের খতিয়ান ও বিক্রয় দলিলের মধ্যকার ০.৮০ শতক পার্থক্যের পুনঃনিরীক্ষণ আবশ্যক।",
    notesEn: "Requires cross-checking of deed acreage against RS khatian ledger.",
    historyEvents: [
      {
        id: "h-002-1",
        eventType: "SURVEY_RECORD",
        year: 1990,
        dateBn: "১৯৯০ সন",
        titleBn: "আরএস জরিপ স্বত্ব রেকর্ড",
        fromPartyBn: "জরিপ অধিদপ্তর",
        toPartyBn: "সেলিনা পারভীন ও শরিকগণ",
        khatianNumber: "১২০",
        dagNumber: "১০৪",
        recordedArea: 12.0,
        areaUnit: "শতক",
        notesBn: "আরএস খতিয়ানে দাগ নং ১০৪ এ মোট ১২.০০ শতক জমি যৌথ খতিয়ানে অন্তর্ভুক্ত হয়।",
      },
      {
        id: "h-002-2",
        eventType: "DEED_TRANSFER",
        year: 2017,
        dateBn: "০৩ নভেম্বর ২০১৭",
        titleBn: "সাফ-কবলা বিক্রয় দলিল হস্তান্তর",
        fromPartyBn: "আমজাদ হোসেন (সহ-শরিক)",
        toPartyBn: "সেলিনা পারভীন (কৃত্রিম ডেমো)",
        deedNumber: "DEED-2017-4510",
        khatianNumber: "১২০",
        dagNumber: "১০৪",
        recordedArea: 11.2,
        areaUnit: "শতক",
        notesBn: "হস্তান্তরিত সাফ-কবলা দলিলে ১১.২০ শতক জমি উল্লেখ করা হয়েছে, যা মূল খতিয়ানের ১২.০০ শতক থেকে ০.৮০ শতক কম।",
      },
    ],
    litigationStatus: {
      hasActiveCase: false,
    },
    encumbranceStatus: {
      isEncumbered: false,
    },
  },
  {
    id: "lp-demo-003",
    district: "নারায়ণগঞ্জ",
    districtEn: "Narayanganj",
    upazila: "রূপগঞ্জ",
    upazilaEn: "Rupganj",
    mouza: "কাঞ্চন",
    mouzaEn: "Kanchan",
    jlNumber: "২৯",
    khatianNumber: "৮৮",
    dagNumber: "৫১২",
    khatianType: "এসএ (SA)",
    recordedArea: 20.25,
    areaUnit: "শতক",
    areaUnitEn: "Decimal",
    riskLevel: "HIGH",
    riskScore: 88,
    status: "DISPUTED_CLAIM",
    statusLabelBn: "মালিকানার ধারাবাহিকতায় জটিলতা",
    statusLabelEn: "Title Chain Gap / Multiple Claimants",
    ownership: {
      id: "own-003",
      ownerName: "কামাল হোসেন ও ওয়ারিশগণ (কৃত্রিম ডেমো)",
      ownerNameEn: "Kamal Hossain & Heirs (Synthetic Demo)",
      deedNumber: "DEED-2014-3201",
      recordedArea: 20.25,
      areaUnit: "শতক",
      status: "DISPUTED",
      statusLabelBn: "উত্তরাধিকার প্রশ্নে আপত্তি",
      isSynthetic: true,
    },
    riskFlags: [
      {
        id: "rf-002",
        flagCode: "CHAIN_OF_TITLE_GAP",
        severity: "CRITICAL",
        title: "বায়া দলিলের ধারাবাহিকতায় বিচ্ছিন্নতা",
        titleEn: "Broken Chain of Title",
        description:
          "মূল সিএস রেকর্ড থেকে বর্তমান এসএ বিক্রেতার সংযোগে এক প্রজন্মের মধ্যবর্তী বণ্টননামা বা ওয়ারিশ সনদ অনুপস্থিত।",
        descriptionEn:
          "Missing intermediate partition deed or inheritance record linking original CS owner to current seller.",
      },
      {
        id: "rf-003",
        flagCode: "OVERLAPPING_CLAIM",
        severity: "HIGH",
        title: "একই দাগে পরস্পরবিরোধী দলিল দাবি",
        titleEn: "Conflicting Plot Claim",
        description:
          "একই দাগ ও খতিয়ানের বিপরীতে পার্শ্ববর্তী শরিক কর্তৃক পূর্ববর্তী হস্তান্তরের দ্বৈত দাবির তথ্য পাওয়া গেছে।",
        descriptionEn:
          "Conflicting transfer claims found from co-sharers over the same cadastral plot boundary.",
      },
    ],
    approxLocation: { lat: 23.837, lng: 90.548 },
    notesBn: "উচ্চ ঝুঁকি: সাব-রেজিস্ট্রি অফিসে মূল বায়া দলিলের ধারাবাহিকতা যাচাই ছাড়া ক্রয় চুক্তি না করার পরামর্শ।",
    notesEn: "High Risk: Missing chain-of-title documents require thorough manual legal review.",
    historyEvents: [
      {
        id: "h-003-1",
        eventType: "SURVEY_RECORD",
        year: 1962,
        dateBn: "১৯৬২ সন",
        titleBn: "এসএ জরিপ খতিয়ান রেকর্ড",
        fromPartyBn: "ভূমি রেকর্ড বিভাগ",
        toPartyBn: "রহমত উল্লাহ (মূল স্বত্বাধিকারী)",
        khatianNumber: "৮৮",
        dagNumber: "৫১২",
        recordedArea: 20.25,
        areaUnit: "শতক",
        notesBn: "এসএ খতিয়ানে মূল মালিক হিসেবে রহমত উল্লাহর নামে ২০.২৫ শতক জমি রেকর্ডভুক্ত হয়।",
      },
      {
        id: "h-003-2",
        eventType: "DEED_TRANSFER",
        year: 2014,
        dateBn: "২২ জানুয়ারি ২০১৪",
        titleBn: "বিতর্কিত সাফ-কবলা বিক্রয় দলিল",
        fromPartyBn: "রহমত উল্লাহ (কথিত বিক্রেতা)",
        toPartyBn: "কামাল হোসেন ও ওয়ারিশগণ (কৃত্রিম ডেমো)",
        deedNumber: "DEED-2014-3201",
        dagNumber: "৫১২",
        recordedArea: 20.25,
        areaUnit: "শতক",
        notesBn: "মূল বিক্রেতার নামীয় বায়া দলিলের ধারাবাহিক সংযোগ ব্যতিরেকে দলিল সম্পাদিত বলে অভিযোগ রয়েছে।",
      },
      {
        id: "h-003-3",
        eventType: "DEED_TRANSFER",
        year: 2018,
        dateBn: "০৫ মে ২০১৮",
        titleBn: "সমান্তরাল দ্বৈত সাফ-কবলা হস্তান্তর দাবি",
        fromPartyBn: "বশির আহমেদ (সহ-শরিক দাবিদার)",
        toPartyBn: "আলতাফ মাহমুদ (তৃতীয় পক্ষ ক্রেতা)",
        deedNumber: "DEED-2018-8819",
        dagNumber: "৫১২",
        recordedArea: 20.25,
        areaUnit: "শতক",
        isConflictingTransfer: true,
        notesBn: "একই দাগ নং ৫১২ এর সম্পূর্ণ ২০.২৫ শতক জমির ওপর অপর শরিক কর্তৃক দ্বিতীয় সমান্তরাল সাফ-কবলা দলিল সম্পাদন।",
      },
      {
        id: "h-003-4",
        eventType: "LITIGATION",
        year: 2022,
        dateBn: "১৮ আগস্ট ২০২২",
        titleBn: "আদালতে দেওয়ানি স্বত্ব মামলা ও নিষেধাজ্ঞা",
        fromPartyBn: "আলতাফ মাহমুদ (বাদী)",
        toPartyBn: "কামাল হোসেন ও অন্যান্য (বিবাদী)",
        deedNumber: "SUIT-2022-45",
        dagNumber: "৫১২",
        notesBn: "যুগ্ম জেলা জজ ১ম আদালত রূপগঞ্জে জমি নিয়ে স্বত্ব ঘোষণা ও স্থিতাবস্থা (Status Quo) বজায় রাখার অন্তর্বর্তীকালীন আদেশ জারি।",
      },
    ],
    litigationStatus: {
      hasActiveCase: true,
      caseNumber: "দেওয়ানি মোকদ্দমা নং ৪৫/২০২২",
      courtNameBn: "যুগ্ম জেলা জজ ১ম আদালত, নারায়ণগঞ্জ",
      caseTypeBn: "দলিল বাতিল, স্বত্ব ঘোষণা ও চিরস্থায়ী নিষেধাজ্ঞা",
      detailsBn: "একই দাগ নং ৫১২ তে পরস্পরবিরোধী দলিল DEED-2014-3201 ও DEED-2018-8819 নিয়ে বিচারাধীন মামলা এবং সীমানায় স্থিতাবস্থার আদেশ রয়েছে।",
    },
    encumbranceStatus: {
      isEncumbered: false,
    },
  },
  {
    id: "lp-demo-004",
    district: "চট্টগ্রাম",
    districtEn: "Chattogram",
    upazila: "সীতাকুণ্ড",
    upazilaEn: "Sitakunda",
    mouza: "কুমিরা",
    mouzaEn: "Kumira",
    jlNumber: "১৫",
    khatianNumber: "৪৫০",
    dagNumber: "২২৩",
    khatianType: "বিএস (BS)",
    recordedArea: 5.0,
    areaUnit: "শতক",
    areaUnitEn: "Decimal",
    riskLevel: "LOW",
    riskScore: 8,
    status: "MUTATED_VERIFIED",
    statusLabelBn: "খারিজ ও দাখিলা হালনাগাদ",
    statusLabelEn: "Mutated & Dakhila Updated",
    ownership: {
      id: "own-004",
      ownerName: "তানিয়া সুলতানা (কৃত্রিম ডেমো)",
      ownerNameEn: "Tania Sultana (Synthetic Demo)",
      deedNumber: "DEED-2021-7764",
      recordedArea: 5.0,
      areaUnit: "শতক",
      status: "ACTIVE",
      statusLabelBn: "হালনাগাদ এলডি ট্যাক্স দাখিলাভুক্ত",
      isSynthetic: true,
    },
    riskFlags: [],
    approxLocation: { lat: 22.525, lng: 91.715 },
    notesBn: "সর্বশেষ অর্থবছর পর্যন্ত জমির খাজনা (ভূমি উন্নয়ন কর) পরিশোধিত এবং কোনো বিরোধের রেকর্ড নেই।",
    notesEn: "Updated land development tax paid with clean mutation ledger.",
    historyEvents: [
      {
        id: "h-004-1",
        eventType: "SURVEY_RECORD",
        year: 1998,
        dateBn: "১৯৯৮ সন",
        titleBn: "বিএস জরিপ চূড়ান্ত প্রকাশনা",
        fromPartyBn: "চট্টগ্রাম জরিপ ক্যাম্প",
        toPartyBn: "মুস্তাফিজুর রহমান (মূল মালিক)",
        khatianNumber: "৩৫০",
        dagNumber: "২২৩",
        recordedArea: 5.0,
        areaUnit: "শতক",
        notesBn: "বিএস জরিপে মুস্তাফিজুর রহমানের নামে ৫.০০ শতক জমি একক দাগে সুশৃঙ্খলভাবে রেকর্ডভুক্ত হয়।",
      },
      {
        id: "h-004-2",
        eventType: "DEED_TRANSFER",
        year: 2021,
        dateBn: "১২ মার্চ ২০২১",
        titleBn: "নিবন্ধিত সাফ-কবলা হস্তান্তর দলিল",
        fromPartyBn: "মুস্তাফিজুর রহমান",
        toPartyBn: "তানিয়া সুলতানা (কৃত্রিম ডেমো)",
        deedNumber: "DEED-2021-7764",
        dagNumber: "২২৩",
        recordedArea: 5.0,
        areaUnit: "শতক",
        notesBn: "সীতাকুণ্ড সাব-রেজিস্ট্রি অফিসে বৈধ সাফ-কবলা দলিল মূলে ৫.০০ শতক জমি হস্তান্তর সম্পন্ন।",
      },
      {
        id: "h-004-3",
        eventType: "MUTATION",
        year: 2022,
        dateBn: "০৮ জানুয়ারি ২০২২",
        titleBn: "নামজারি জমাভাগ ও দাখিলা হালনাগাদ",
        fromPartyBn: "তানিয়া সুলতানা (কৃত্রিম ডেমো)",
        toPartyBn: "তানিয়া সুলতানা (কৃত্রিম ডেমো)",
        khatianNumber: "৪৫০",
        dagNumber: "২২৩",
        recordedArea: 5.0,
        areaUnit: "শতক",
        notesBn: "তানিয়া সুলতানার নামে নামজারি খতিয়ান ৪৫০ সৃজিত এবং হালনাগাদ এলডি ট্যাক্স দাখিলা অন্তর্ভুক্ত।",
      },
    ],
    litigationStatus: {
      hasActiveCase: false,
    },
    encumbranceStatus: {
      isEncumbered: false,
    },
  },
  {
    id: "lp-demo-005",
    district: "ঢাকা",
    districtEn: "Dhaka",
    upazila: "কেরানীগঞ্জ",
    upazilaEn: "Keraniganj",
    mouza: "জিনজিরা",
    mouzaEn: "Jinjira",
    jlNumber: "০৭",
    khatianNumber: "০১",
    dagNumber: "১২",
    khatianType: "আরএস (RS)",
    recordedArea: 16.5,
    areaUnit: "শতক",
    areaUnitEn: "Decimal",
    riskLevel: "HIGH",
    riskScore: 95,
    status: "SUSPECTED_GOVT_BUFFER",
    statusLabelBn: "সরকারি খাস খতিয়ান সংলগ্ন / খাল বাফারে ঝুঁকি",
    statusLabelEn: "Government Khas / Canal Buffer Risk",
    ownership: {
      id: "own-005",
      ownerName: "আনোয়ার সাদাত (কৃত্রিম ডেমো ব্যক্তি)",
      ownerNameEn: "Anwar Sadat (Synthetic Demo Person)",
      deedNumber: "DEED-2023-1120",
      recordedArea: 16.5,
      areaUnit: "শতক",
      status: "SUSPECTED_GOVT_BUFFER",
      statusLabelBn: "ব্যক্তি মালিকানা বিতর্কিত",
      isSynthetic: true,
    },
    riskFlags: [
      {
        id: "rf-004",
        flagCode: "GOVT_KHAS_PROXIMITY",
        severity: "CRITICAL",
        title: "১ নং খাস খতিয়ান সংকেত",
        titleEn: "Potential Govt Khas Land Flag",
        description:
          "খতিয়ান নম্বর '০১' ঐতিহাসিকভাবে সরকারি ১ নং খাস খতিয়ান নির্দেশ করে। ব্যক্তি মালিকানা হস্তান্তর অত্যন্ত ঝুঁকিপূর্ণ।",
        descriptionEn:
          "Khatian '01' is historically reserved for Bangladesh Government Khas properties.",
      },
    ],
    approxLocation: { lat: 23.702, lng: 90.385 },
    notesBn: "চরম সতর্কতা: ১ নং খাস খতিয়ানের জমি ব্যক্তিগতভাবে বিক্রয়যোগ্য নয়। উপজেলা ভূমি অফিসে অনুসন্ধান আবশ্যক।",
    notesEn: "Critical Caution: Khas land cannot be privately transferred.",
    historyEvents: [
      {
        id: "h-005-1",
        eventType: "SURVEY_RECORD",
        year: 1970,
        dateBn: "১৯৭০ সন",
        titleBn: "সরকারি ১ নং খাস খতিয়ান গেজেট",
        fromPartyBn: "ভূমি মন্ত্রণালয়",
        toPartyBn: "গণপ্রজাতন্ত্রী বাংলাদেশ সরকার",
        khatianNumber: "০১",
        dagNumber: "১২",
        recordedArea: 16.5,
        areaUnit: "শতক",
        notesBn: "বুড়িগঙ্গার তীরবর্তী জলাধার ও সরকারি বাফার এলাকা হিসেবে ১ নং খাস খতিয়ানভুক্ত সম্পত্তি।",
      },
      {
        id: "h-005-2",
        eventType: "DEED_TRANSFER",
        year: 2023,
        dateBn: "০১ ফেব্রুয়ারি ২০২৩",
        titleBn: "বিতর্কিত ব্যক্তিগত সাফ-কবলা হস্তান্তর চেষ্টা",
        fromPartyBn: "কাদের মোল্লা (কথিত দখলদার)",
        toPartyBn: "আনোয়ার সাদাত (কৃত্রিম ডেমো ব্যক্তি)",
        deedNumber: "DEED-2023-1120",
        dagNumber: "১২",
        recordedArea: 16.5,
        areaUnit: "শতক",
        notesBn: "১ নং খাস খতিয়ানের জমি ব্যক্তি নামে অবৈজ্ঞানিকভাবে হস্তান্তরের বেসরকারি দলিল প্রস্তুত।",
      },
      {
        id: "h-005-3",
        eventType: "LITIGATION",
        year: 2024,
        dateBn: "১০ মার্চ ২০২৪",
        titleBn: "সরকারি উচ্ছেদ আদেশ ও রিট পিটিশন নোটিশ",
        fromPartyBn: "জেলা প্রশাসন, ঢাকা",
        toPartyBn: "অবৈধ দখলদারগণ",
        deedNumber: "GOVT-NOTICE-2024",
        dagNumber: "১২",
        notesBn: "সরকারি সম্পত্তি পুনরুদ্ধার অধ্যাদেশ অনুযায়ী নদী তীরবর্তী জমিতে উচ্ছেদ কার্যক্রম ও উচ্চ আদালতের রিট বিচারাধীন।",
      },
    ],
    litigationStatus: {
      hasActiveCase: true,
      caseNumber: "রিট পিটিশন নং ৮৮১/২০২৪",
      courtNameBn: "মাননীয় হাইকোর্ট বিভাগ, বাংলাদেশ সুপ্রিম কোর্ট",
      caseTypeBn: "সরকারি খাস জমি অবমুক্তকরণ দাবি ও উচ্ছেদ স্থগিতাদেশ",
      detailsBn: "১ নং খাস খতিয়ানের সরকারি সম্পত্তি ব্যক্তিগত বিক্রির চেষ্টার বিপরীতে সরকারি উচ্ছেদ ও আদালতের স্থগিতাদেশ বিদ্যমান।",
    },
    encumbranceStatus: {
      isEncumbered: true,
      institutionNameBn: "ভূমি সংস্কার বোর্ড ও ঢাকা জেলা প্রশাসন",
      detailsBn: "সরকারি ১ নং খাস খতিয়ান ও নদী তীরবর্তী সংরক্ষিত বাফার জোন হিসেবে তালিকাভুক্ত।",
    },
  },
  {
    id: "lp-demo-006",
    district: "বরিশাল",
    districtEn: "Barishal",
    upazila: "বরিশাল সদর",
    upazilaEn: "Barishal Sadar",
    mouza: "কূপা",
    mouzaEn: "Kupa",
    jlNumber: "১২",
    khatianNumber: "১০১",
    dagNumber: "৭২",
    khatianType: "বিএস (BS)",
    recordedArea: 8.0,
    areaUnit: "শতক",
    areaUnitEn: "Decimal",
    riskLevel: "LOW",
    riskScore: 25,
    status: "ACTIVE",
    statusLabelBn: "সীমিত তথ্য উপলব্ধ",
    statusLabelEn: "Limited Data Available",
    ownership: {
      id: "own-006",
      ownerName: "মোকাররম হোসেন (কৃত্রিম ডেমো)",
      ownerNameEn: "Mokarram Hossain (Synthetic Demo)",
      deedNumber: undefined,
      recordedArea: 8.0,
      areaUnit: "শতক",
      status: "ACTIVE",
      statusLabelBn: "নামজারি খতিয়ান দাখিল বাকি",
      isSynthetic: true,
    },
    riskFlags: [],
    approxLocation: { lat: 22.701, lng: 90.353 },
    notesBn: "নমুনা রেকর্ডে পূর্ববর্তী হস্তান্তর ইতিহাস বা বায়া দলিলের পর্যাপ্ত তথ্য এখনো সংযোজিত হয়নি।",
    notesEn: "Historical deed records and chain-of-title events not yet indexed for this demo parcel.",
    historyEvents: [], // Empty history to demonstrate INSUFFICIENT_INFO
    litigationStatus: {
      hasActiveCase: false,
    },
    encumbranceStatus: {
      isEncumbered: false,
    },
  },
];

export const DEMO_SUMMARY_STATS: DashboardSummary = {
  totalParcels: SYNTHETIC_DEMO_PARCELS.length,
  lowRiskCount: SYNTHETIC_DEMO_PARCELS.filter((p) => p.riskLevel === "LOW").length,
  mediumRiskCount: SYNTHETIC_DEMO_PARCELS.filter((p) => p.riskLevel === "MEDIUM").length,
  highRiskCount: SYNTHETIC_DEMO_PARCELS.filter((p) => p.riskLevel === "HIGH").length,
  totalRiskFlags: SYNTHETIC_DEMO_PARCELS.reduce((acc, p) => acc + p.riskFlags.length, 0),
  activeVerifications: 14, // Illustrative metric for hackathon demo presentation
};
