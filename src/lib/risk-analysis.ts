/**
 * Land History & Explainable Risk Analysis Engine
 * LandGuard BD — Civic Tech for Land Due Diligence (Track P5)
 *
 * Deterministic, rule-based auditing of synthetic land parcel histories.
 * Explains what was found, records triggered, why review is needed, and next steps.
 * Does not invent risk scores. A mismatch is not proof of fraud.
 */

import { DemoLandParcel, LandHistoryEvent } from "@/data/demo-data";
import { toBengaliNumerals } from "./formatters";
import { normalizeUnit, normalizeText } from "./verification";

export type RiskAnalysisOutcome =
  | "NEEDS_REVIEW"              // পর্যালোচনা প্রয়োজন
  | "NO_FLAGGED_DISCREPANCIES" // উপলব্ধ ডেমো তথ্যে কোনো অসঙ্গতি পাওয়া যায়নি
  | "INSUFFICIENT_INFO";         // পর্যাপ্ত তথ্যের ঘাটতি

export type WarningRuleId =
  | "DUPLICATE_TRANSFER"
  | "OWNER_INCONSISTENCY"
  | "AREA_DISCREPANCY"
  | "LITIGATION_ENCUMBRANCE";

export interface ExplainableWarning {
  ruleId: WarningRuleId;
  ruleTitleBn: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "INFO";
  whatFoundBn: string;        // কী পাওয়া গেছে
  recordsTriggeredBn: string; // যে রেকর্ড বা তথ্যে চিহ্নিত হয়েছে
  whyReviewBn: string;        // কেন এটি পর্যালোচনা করা প্রয়োজন
  nextStepsBn: string;        // পরবর্তী যাচাইকরণ পদক্ষেপ
}

export interface ParcelRiskAnalysisResult {
  parcelId: string;
  outcome: RiskAnalysisOutcome;
  outcomeLabelBn: string;
  summaryBn: string;
  warnings: ExplainableWarning[];
  hasInsufficientInfo: boolean;
  insufficientInfoReasonBn?: string;
  historyEventsCount: number;
  evaluatedRulesCount: number;
  advisoryBn: string;
}

/**
 * Rule 1: Potential duplicate transfers
 * Flags repeated or conflicting transfer references involving the same synthetic parcel
 * when the available data supports the warning.
 */
export function checkDuplicateTransfers(parcel: DemoLandParcel): ExplainableWarning | null {
  const events = parcel.historyEvents || [];

  // Check 1: Explicit conflicting transfer flag in history events
  const conflictingEvent = events.find((e) => e.isConflictingTransfer);

  // Check 2: Check for duplicate deed numbers across distinct parties
  const deedMap = new Map<string, LandHistoryEvent[]>();
  events.forEach((e) => {
    if (e.deedNumber && e.eventType === "DEED_TRANSFER") {
      const existing = deedMap.get(e.deedNumber) || [];
      existing.push(e);
      deedMap.set(e.deedNumber, existing);
    }
  });

  let duplicateDeedFound: string | null = null;
  deedMap.forEach((eventList, deedNo) => {
    if (eventList.length > 1) {
      duplicateDeedFound = deedNo;
    }
  });

  // Check 3: RiskFlag indicating overlapping claim
  const overlappingFlag = parcel.riskFlags.find((f) => f.flagCode === "OVERLAPPING_CLAIM");

  if (conflictingEvent || duplicateDeedFound || overlappingFlag) {
    const triggeredText = conflictingEvent
      ? `দাগ নং ${toBengaliNumerals(parcel.dagNumber)} এ পরস্পরবিরোধী সাফ-কবলা দলিল '${conflictingEvent.deedNumber || "অনিবন্ধিত"}' (${conflictingEvent.dateBn})। হস্তান্তরকারী: ${conflictingEvent.fromPartyBn || "অজ্ঞাত"}, গ্রহীতা: ${conflictingEvent.toPartyBn}।`
      : duplicateDeedFound
      ? `একই দলিল নম্বর '${duplicateDeedFound}' একাধিক হস্তান্তর রেকর্ডে পুনরাবৃত্তি হয়েছে।`
      : `ঝুঁকি পতাকা: '${overlappingFlag?.title}' — একই দাগে একাধিক শরিক বা তৃতীয় পক্ষের দ্বৈত দাবি।`;

    return {
      ruleId: "DUPLICATE_TRANSFER",
      ruleTitleBn: "সম্ভাব্য দ্বৈত বা পরস্পরবিরোধী হস্তান্তর দাবি",
      severity: "HIGH",
      whatFoundBn: `একই দাগ নং ${toBengaliNumerals(parcel.dagNumber)} এর ওপর একাধিক পরস্পরবিরোধী হস্তান্তর বা দ্বৈত সাফ-কবলা দাবির রেকর্ড চিহ্নিত হয়েছে।`,
      recordsTriggeredBn: triggeredText,
      whyReviewBn: "একই জমির ওপর সমান্তরাল বা পুনরাবৃত্ত হস্তান্তর দাবি থাকলে স্বত্বে মারাত্মক ঝুঁকি তৈরি হয় এবং দীর্ঘস্থায়ী দেওয়ানি মোকদ্দমার সম্ভাবনা থাকে।",
      nextStepsBn: "সংশ্লিষ্ট সাব-রেজিস্ট্রি অফিসে মূল বালাম বহি (Volume Book) তল্লাশি (Search Slip) দিয়ে পূর্ববর্তী দলিলের ধারাবাহিকতা ও সত্যতা যাচাই করুন।",
    };
  }

  return null;
}

/**
 * Rule 2: Owner-name inconsistencies
 * Flags conflicting owner names across relevant synthetic records when comparison is meaningful.
 */
export function checkOwnerInconsistencies(parcel: DemoLandParcel): ExplainableWarning | null {
  const events = parcel.historyEvents || [];
  const recordedOwner = parcel.ownership?.ownerName?.trim();

  // If no recorded owner or no history events, comparison is not meaningful
  if (!recordedOwner || events.length === 0) {
    return null;
  }

  // Check if title gap flag exists in riskFlags
  const chainGapFlag = parcel.riskFlags.find((f) => f.flagCode === "CHAIN_OF_TITLE_GAP");

  // Check chain continuity in events:
  // Does the recorded owner match the recipient of the last transfer event?
  const transferEvents = events.filter(
    (e) => e.eventType === "DEED_TRANSFER" || e.eventType === "INHERITANCE" || e.eventType === "MUTATION"
  );

  let hasDiscontinuity = false;
  let discontinuityDetail = "";

  if (transferEvents.length > 0) {
    const lastEvent = transferEvents[transferEvents.length - 1];
    const normLastRecipient = normalizeText(
      lastEvent.toPartyBn.replace(/\(কৃত্রিম ডেমো.*?\)/g, "").trim()
    );
    const normRecordedOwner = normalizeText(
      recordedOwner.replace(/\(কৃত্রিম ডেমো.*?\)/g, "").trim()
    );

    // If last transfer event explicitly claims a different recipient than recorded owner
    if (normLastRecipient && normRecordedOwner && !normLastRecipient.includes(normRecordedOwner) && !normRecordedOwner.includes(normLastRecipient)) {
      hasDiscontinuity = true;
      discontinuityDetail = `সর্বশেষ হস্তান্তর নথিতে গ্রহীতার নাম '${lastEvent.toPartyBn}', কিন্তু মূল রেকর্ডে বর্তমান মালিক হিসেবে '${recordedOwner}' উল্লেখিত।`;
    }
  }

  if (chainGapFlag || hasDiscontinuity) {
    const triggeredDetail = discontinuityDetail
      ? `বায়া দলিল ও হস্তান্তর রেকর্ড: ${discontinuityDetail}`
      : `চিহ্নিত বায়া দলিল রেকর্ড: মূল সিএস/এসএ থেকে বর্তমান বিক্রেতার সংযোগে মধ্যবর্তী বণ্টননামা বা হস্তান্তর দলিলের অনুপস্থিতি।`;

    return {
      ruleId: "OWNER_INCONSISTENCY",
      ruleTitleBn: "মালিকানার ধারাবাহিকতায় নাম ও বায়া দলিলের অসঙ্গতি",
      severity: "HIGH",
      whatFoundBn: "নথিভুক্ত বর্তমান মালিকের নামের সাথে পূর্ববর্তী হস্তান্তর বা জরিপ রেকর্ডের মধ্যবর্তী স্বত্ব অর্জনের সংযোগে অসঙ্গতি পাওয়া গেছে।",
      recordsTriggeredBn: triggeredDetail,
      whyReviewBn: "বিক্রেতার মালিকানা অর্জনের সুস্পষ্ট ধারাবাহিক বায়া দলিল (Chain of Title) না থাকলে হস্তান্তরকারীর আইনসম্মত বিক্রয় অধিকার বিতর্কিত হতে পারে।",
      nextStepsBn: "সাব-রেজিস্ট্রি অফিস থেকে মধ্যবর্তী সকল বায়া দলিলের সহি-মুহুরি নকল এবং স্থানীয় ইউনিয়ন/পৌর ভূমি অফিস হতে ওয়ারিশান সনদ পরীক্ষা করুন।",
    };
  }

  return null;
}

/**
 * Rule 3: Recorded-area discrepancies
 * Flags conflicting area values only when their units can be compared reliably.
 */
export function checkAreaDiscrepancies(parcel: DemoLandParcel): ExplainableWarning | null {
  const parcelArea = parcel.recordedArea;
  const parcelUnit = normalizeUnit(parcel.areaUnit);
  const ownershipArea = parcel.ownership?.recordedArea;
  const ownershipUnit = normalizeUnit(parcel.ownership?.areaUnit || parcel.areaUnit);

  // If ownership area is missing, cannot reliably compare
  if (ownershipArea === undefined || ownershipArea === null || isNaN(ownershipArea)) {
    return null;
  }

  // Compare ONLY when units can be compared reliably
  if (parcelUnit !== ownershipUnit || !parcelUnit) {
    return {
      ruleId: "AREA_DISCREPANCY",
      ruleTitleBn: "পরিমাপের একক অসামঞ্জস্যতা (ম্যানুয়াল নিরীক্ষা প্রয়োজন)",
      severity: "MEDIUM",
      whatFoundBn: `খতিয়ানের একক '${parcel.areaUnit}' এবং হস্তান্তর দলিলের একক '${parcel.ownership.areaUnit}' এর মধ্যে সরাসরি সমমান নিশ্চিত করা যায়নি।`,
      recordsTriggeredBn: `খতিয়ানের একক: '${parcel.areaUnit}' বনাম দলিলের একক: '${parcel.ownership.areaUnit || "অনুপস্থিত"}'।`,
      whyReviewBn: "ভিন্ন পরিমাপের একক ব্যবহারে প্রকৃত জমির হিস্যা ও হস্তান্তরিত অংশে ভুল ব্যাখ্যার সুযোগ থাকে।",
      nextStepsBn: "সংশ্লিষ্ট সার্ভেয়ার বা আমিনের সহায়তায় শতাংশ বা শতকে প্রমিত রূপান্তর করে মোট জমি মিলিয়ে দেখুন।",
    };
  }

  // When units are compatible, check numerical discrepancy
  const diff = Math.abs(parcelArea - ownershipArea);
  if (diff > 0.01) {
    const parcelAreaBn = toBengaliNumerals(parcelArea);
    const ownershipAreaBn = toBengaliNumerals(ownershipArea);
    const diffBn = toBengaliNumerals(diff.toFixed(2).replace(/\.?0+$/, ""));

    return {
      ruleId: "AREA_DISCREPANCY",
      ruleTitleBn: "খতিয়ান ও দলিলের পরিমাপে গরমিল",
      severity: "MEDIUM",
      whatFoundBn: `খতিয়ানে মোট রেকর্ডভুক্ত জমি ${parcelAreaBn} ${parcel.areaUnit}, কিন্তু হস্তান্তর নথিতে ${ownershipAreaBn} ${parcel.areaUnit} (${diffBn} ${parcel.areaUnit} পরিমাপের পার্থক্য বিদ্যমান)।`,
      recordsTriggeredBn: `খতিয়ান নং ${toBengaliNumerals(parcel.khatianNumber)} (${parcelAreaBn} ${parcel.areaUnit}) বনাম দলিল নং ${parcel.ownership.deedNumber || "হস্তান্তর নথি"} (${ownershipAreaBn} ${parcel.areaUnit})।`,
      whyReviewBn: "খতিয়ানের মোট হিস্যার অতিরিক্ত জমি বিক্রয় করা হলে পরবর্তীতে সীমানা বিরোধ, জালিয়াতির অভিযোগ বা নামজারি বাতিলের ঝুঁকি থাকে।",
      nextStepsBn: "সহকারী কমিশনার (ভূমি) অফিস থেকে সংশ্লিষ্ট খতিয়ানের মূল মাঠপর্চা ও সহ-শরিকদের অবশিষ্ট হিস্যা যাচাই করুন।",
    };
  }

  return null;
}

/**
 * Rule 4: Simulated litigation or encumbrance
 * Shows a warning ONLY when the synthetic data explicitly contains the relevant indicator.
 */
export function checkLitigationEncumbrance(parcel: DemoLandParcel): ExplainableWarning | null {
  const hasActiveLitigation = Boolean(parcel.litigationStatus?.hasActiveCase);
  const hasActiveEncumbrance = Boolean(parcel.encumbranceStatus?.isEncumbered);
  const litigationEvent = parcel.historyEvents?.find((e) => e.eventType === "LITIGATION");
  const mortgageEvent = parcel.historyEvents?.find((e) => e.eventType === "MORTGAGE");

  // Also check if parcel is suspected khas buffer
  const isKhasBuffer = parcel.status === "SUSPECTED_GOVT_BUFFER" || parcel.khatianNumber === "০১";

  if (hasActiveLitigation || hasActiveEncumbrance || litigationEvent || mortgageEvent || isKhasBuffer) {
    let triggeredDetails = "";
    if (parcel.litigationStatus?.caseNumber) {
      triggeredDetails += `${parcel.litigationStatus.caseNumber} (${parcel.litigationStatus.courtNameBn || "আদালত"})`;
    } else if (litigationEvent) {
      triggeredDetails += `${litigationEvent.titleBn} (${litigationEvent.dateBn})`;
    }

    if (parcel.encumbranceStatus?.isEncumbered) {
      triggeredDetails += `${triggeredDetails ? " | " : ""}${parcel.encumbranceStatus.institutionNameBn || "সরকারি বাফার"} (${parcel.encumbranceStatus.detailsBn || "সংরক্ষিত"})`;
    }

    if (isKhasBuffer) {
      triggeredDetails += `${triggeredDetails ? " | " : ""}১ নং খাস খতিয়ান সংলগ্ন বাফার জোন।`;
    }

    return {
      ruleId: "LITIGATION_ENCUMBRANCE",
      ruleTitleBn: "দেওয়ানি মামলা, নিষেধাজ্ঞা বা সরকারি বাফার সংশ্লিষ্টতা",
      severity: "CRITICAL",
      whatFoundBn: isKhasBuffer
        ? "১ নং সরকারি খাস খতিয়ানভুক্ত বা সরকারি খাস বাফার সংশ্লিষ্ট সম্পত্তি শনাক্ত হয়েছে, যা ব্যক্তিগতভাবে হস্তান্তরযোগ্য নয়।"
        : "এই জমির দাগ বা স্বত্ব নিয়ে চলমান দেওয়ানি মোকদ্দমা, স্থিতাবস্থার আদেশ (Injunction) বা প্রাতিষ্ঠানিক দায়বদ্ধতার সুস্পষ্ট রেকর্ড রয়েছে।",
      recordsTriggeredBn: triggeredDetails || "আদালতি মোকদ্দমা বা সরকারি খাস রেকর্ড ডাটাবেজ।",
      whyReviewBn: "মামলাভুক্ত বা সরকারি খাস জমি ক্রয় করলে আর্থিক বিনিয়োগ বাজেয়াপ্ত হওয়ার পাশাপাশি আইনি উচ্ছেদ ও ফৌজদারি জটিলতার ঝুঁকি থাকে।",
      nextStepsBn: "সংশ্লিষ্ট দেওয়ানি আদালত ও জেলা প্রশাসকের কার্যালয়ের রাজস্ব শাখা হতে জমিটির সর্বশেষ মামলা ও স্বত্ব সংক্রান্ত অনাপত্তি (Non-Encumbrance) অনুসন্ধান করুন।",
    };
  }

  return null;
}

/**
 * Main Explainable Risk Analysis Engine
 * Evaluates all 4 rules and returns structured, explainable findings.
 */
export function analyzeParcelRisk(parcel: DemoLandParcel): ParcelRiskAnalysisResult {
  const warnings: ExplainableWarning[] = [];
  let evaluatedRulesCount = 0;

  // 1. Duplicate Transfers
  evaluatedRulesCount++;
  const dupWarning = checkDuplicateTransfers(parcel);
  if (dupWarning) warnings.push(dupWarning);

  // 2. Owner Inconsistency
  evaluatedRulesCount++;
  const ownerWarning = checkOwnerInconsistencies(parcel);
  if (ownerWarning) warnings.push(ownerWarning);

  // 3. Area Discrepancy
  evaluatedRulesCount++;
  const areaWarning = checkAreaDiscrepancies(parcel);
  if (areaWarning) warnings.push(areaWarning);

  // 4. Litigation & Encumbrance
  evaluatedRulesCount++;
  const litWarning = checkLitigationEncumbrance(parcel);
  if (litWarning) warnings.push(litWarning);

  const events = parcel.historyEvents || [];
  const hasInsufficientInfo = events.length === 0 || (events.length === 1 && !parcel.ownership?.deedNumber);

  let outcome: RiskAnalysisOutcome;
  let outcomeLabelBn: string;
  let summaryBn: string;
  let insufficientInfoReasonBn: string | undefined;

  if (warnings.length > 0) {
    outcome = "NEEDS_REVIEW";
    outcomeLabelBn = "পর্যালোচনা প্রয়োজন";
    summaryBn = `উপলব্ধ ডেমো তথ্যের নিরীক্ষায় ${toBengaliNumerals(warnings.length)}টি ক্ষেত্রে গুরুত্বপূর্ণ অসঙ্গতি বা ঝুঁকি সংকেত শনাক্ত হয়েছে। মূল দলিল সম্পাদনার পূর্বে এগুলোর স্পষ্ট সমাধান আবশ্যক।`;
  } else if (hasInsufficientInfo) {
    outcome = "INSUFFICIENT_INFO";
    outcomeLabelBn = "পর্যাপ্ত তথ্যের ঘাটতি";
    insufficientInfoReasonBn = "উপলব্ধ কৃত্রিম ডেটাসেটে এই প্লটের ধারাবাহিক হস্তান্তর ইতিহাস বা বায়া দলিলের পর্যাপ্ত তথ্য এখনো অন্তর্ভুক্ত করা হয়নি।";
    summaryBn = "পর্যাপ্ত ঐতিহাসিক বায়া দলিল ও হস্তান্তরের তথ্য না থাকায় সম্পূর্ণ স্বত্ব নিরীক্ষা সম্পন্ন করা সম্ভব হয়নি।";
  } else {
    outcome = "NO_FLAGGED_DISCREPANCIES";
    outcomeLabelBn = "উপলব্ধ ডেমো তথ্যে কোনো অসঙ্গতি পাওয়া যায়নি";
    summaryBn = "উপলব্ধ ডেমো ডেটার বিশ্লেষণে দ্বৈত হস্তান্তর, নামের অসঙ্গতি, পরিমাপের অমিল বা সক্রিয় মামলার কোনো সংকেত পাওয়া যায়নি।";
  }

  const advisoryBn =
    "সতর্কতা: এটি সম্পূর্ণ কৃত্রিম ডেমো ডেটার ওপর ভিত্তি করে একটি স্বয়ংক্রিয় ব্যাখ্যামূলক বিশ্লেষণ। কোনো অসঙ্গতি অপরাধের নিশ্চিত প্রমাণ নয়, এবং অসঙ্গতি না থাকাও চূড়ান্ত মালিকানার আইনি গ্যারান্টি দেয় না। জমি ক্রয়ের চূড়ান্ত সিদ্ধান্তের আগে মূল বালাম, খতিয়ান ও সরেজমিন দখল আইনজীবীর মাধ্যমে যাচাই করুন।";

  return {
    parcelId: parcel.id,
    outcome,
    outcomeLabelBn,
    summaryBn,
    warnings,
    hasInsufficientInfo,
    insufficientInfoReasonBn,
    historyEventsCount: events.length,
    evaluatedRulesCount,
    advisoryBn,
  };
}
