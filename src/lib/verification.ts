/**
 * Land-Document Verification & Cadastral Comparison Engine
 * LandGuard BD — Civic Tech for Land Due Diligence
 *
 * Compares user-submitted document fields against selected reference synthetic parcels.
 * Pure comparison logic: no database writes, no AI hallucinations, no invented risk scores.
 */

import { DemoLandParcel, ParcelRiskLevel, SYNTHETIC_DEMO_PARCELS } from "@/data/demo-data";
import { toBengaliNumerals } from "./formatters";

export type FieldComparisonStatus = "MATCH" | "MISMATCH" | "MISSING";

export type OverallResultCategory =
  | "NO_DISCREPANCIES"
  | "DIFFERENCES_REQUIRE_REVIEW"
  | "INSUFFICIENT_INFO";

export interface FieldComparisonResult {
  fieldName: string;
  fieldLabelBn: string;
  referenceValue: string;
  submittedValue: string;
  status: FieldComparisonStatus;
  statusLabelBn: string;
  reasonBn?: string;
}

export interface VerificationSubmission {
  parcelId: string;
  ownerName: string;
  district: string;
  upazila: string;
  mouza: string;
  khatianNumber: string;
  khatianType: string;
  dagNumber: string;
  recordedArea: string; // string input from form (e.g. "7.5" or "৭.৫")
  areaUnit: string;
}

export interface VerificationResult {
  category: OverallResultCategory;
  categoryLabelBn: string;
  summaryBn: string;
  referenceParcel: DemoLandParcel;
  submitted: VerificationSubmission;
  fieldResults: FieldComparisonResult[];
  mismatchCount: number;
  matchCount: number;
  missingCount: number;
  discrepancyReasons: string[];
  advisoryBn: string;
}

const BN_TO_EN_DIGIT_MAP: Record<string, string> = {
  "০": "0",
  "১": "1",
  "২": "2",
  "৩": "3",
  "৪": "4",
  "৫": "5",
  "৬": "6",
  "৭": "7",
  "৮": "8",
  "৯": "9",
};

/**
 * Normalizes a string by converting Bengali digits to ASCII digits,
 * trimming leading/trailing whitespace, and collapsing internal whitespace.
 */
export function normalizeString(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[০-৯]/g, (ch) => BN_TO_EN_DIGIT_MAP[ch] ?? ch);
}

/**
 * Normalizes text for comparison without digit translation (case-folded and trimmed).
 */
export function normalizeText(value: string | null | undefined): string {
  if (!value) return "";
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * Normalizes numeric input (supporting English & Bengali digits, trailing zeros).
 * Returns NaN if not a valid number.
 */
export function parseNormalizedNumber(value: string | null | undefined): number {
  if (!value) return NaN;
  const normalized = normalizeString(value);
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? NaN : parsed;
}

/**
 * Normalizes area unit representation.
 */
export function normalizeUnit(unit: string | null | undefined): string {
  if (!unit) return "";
  const u = unit.trim().toLowerCase();
  if (u === "শতক" || u === "decimal" || u === "ডেসিমেল" || u === "শতাংশ") {
    return "শতক";
  }
  if (u === "কাঠা" || u === "katha" || u === "কাটা") {
    return "কাঠা";
  }
  if (u === "বিঘা" || u === "bigha") {
    return "বিঘা";
  }
  if (u === "একর" || u === "acre") {
    return "একর";
  }
  return u;
}

/**
 * Compares submitted document fields against reference synthetic land parcel.
 */
export function compareLandDocument(
  submitted: VerificationSubmission,
  reference: DemoLandParcel
): VerificationResult {
  const fieldResults: FieldComparisonResult[] = [];
  const discrepancyReasons: string[] = [];

  // 1. Owner Name
  const normSubOwner = normalizeText(submitted.ownerName);
  const normRefOwner = normalizeText(reference.ownership.ownerName);
  // Also check without the "(কৃত্রিম ডেমো)" synthetic tag if user entered clean name
  const normRefOwnerClean = normalizeText(
    reference.ownership.ownerName.replace(/\(কৃত্রিম ডেমো.*?\)/g, "").trim()
  );

  if (!normSubOwner) {
    fieldResults.push({
      fieldName: "ownerName",
      fieldLabelBn: "মালিকের নাম",
      referenceValue: reference.ownership.ownerName,
      submittedValue: "—",
      status: "MISSING",
      statusLabelBn: "তথ্য নেই",
      reasonBn: "দলিলে মালিকের নাম উল্লেখ করা হয়নি।",
    });
  } else if (normSubOwner === normRefOwner || normSubOwner === normRefOwnerClean) {
    fieldResults.push({
      fieldName: "ownerName",
      fieldLabelBn: "মালিকের নাম",
      referenceValue: reference.ownership.ownerName,
      submittedValue: submitted.ownerName.trim(),
      status: "MATCH",
      statusLabelBn: "মিল রয়েছে",
    });
  } else {
    const reason = `রেকর্ডে নথিভুক্ত মালিক '${reference.ownership.ownerName}', কিন্তু দাখিলকৃত তথ্য '${submitted.ownerName.trim()}'।`;
    fieldResults.push({
      fieldName: "ownerName",
      fieldLabelBn: "মালিকের নাম",
      referenceValue: reference.ownership.ownerName,
      submittedValue: submitted.ownerName.trim(),
      status: "MISMATCH",
      statusLabelBn: "অমিল পাওয়া গেছে",
      reasonBn: reason,
    });
    discrepancyReasons.push(reason);
  }

  // 2. District
  const normSubDist = normalizeText(submitted.district);
  const normRefDist = normalizeText(reference.district);
  const normRefDistEn = normalizeText(reference.districtEn);

  if (!normSubDist) {
    fieldResults.push({
      fieldName: "district",
      fieldLabelBn: "জেলা",
      referenceValue: reference.district,
      submittedValue: "—",
      status: "MISSING",
      statusLabelBn: "তথ্য নেই",
      reasonBn: "জেলার নাম দেওয়া হয়নি।",
    });
  } else if (normSubDist === normRefDist || normSubDist === normRefDistEn) {
    fieldResults.push({
      fieldName: "district",
      fieldLabelBn: "জেলা",
      referenceValue: reference.district,
      submittedValue: submitted.district.trim(),
      status: "MATCH",
      statusLabelBn: "মিল রয়েছে",
    });
  } else {
    const reason = `রেকর্ডে জেলা '${reference.district}', কিন্তু দলিলে '${submitted.district.trim()}'।`;
    fieldResults.push({
      fieldName: "district",
      fieldLabelBn: "জেলা",
      referenceValue: reference.district,
      submittedValue: submitted.district.trim(),
      status: "MISMATCH",
      statusLabelBn: "অমিল পাওয়া গেছে",
      reasonBn: reason,
    });
    discrepancyReasons.push(reason);
  }

  // 3. Upazila
  const normSubUpz = normalizeText(submitted.upazila);
  const normRefUpz = normalizeText(reference.upazila);
  const normRefUpzEn = normalizeText(reference.upazilaEn);

  if (!normSubUpz) {
    fieldResults.push({
      fieldName: "upazila",
      fieldLabelBn: "উপজেলা / থানা",
      referenceValue: reference.upazila,
      submittedValue: "—",
      status: "MISSING",
      statusLabelBn: "তথ্য নেই",
      reasonBn: "উপজেলার নাম দেওয়া হয়নি।",
    });
  } else if (normSubUpz === normRefUpz || normSubUpz === normRefUpzEn) {
    fieldResults.push({
      fieldName: "upazila",
      fieldLabelBn: "উপজেলা / থানা",
      referenceValue: reference.upazila,
      submittedValue: submitted.upazila.trim(),
      status: "MATCH",
      statusLabelBn: "মিল রয়েছে",
    });
  } else {
    const reason = `রেকর্ডে উপজেলা '${reference.upazila}', কিন্তু দলিলে '${submitted.upazila.trim()}'।`;
    fieldResults.push({
      fieldName: "upazila",
      fieldLabelBn: "উপজেলা / থানা",
      referenceValue: reference.upazila,
      submittedValue: submitted.upazila.trim(),
      status: "MISMATCH",
      statusLabelBn: "অমিল পাওয়া গেছে",
      reasonBn: reason,
    });
    discrepancyReasons.push(reason);
  }

  // 4. Mouza
  const normSubMouza = normalizeText(submitted.mouza);
  const normRefMouza = normalizeText(reference.mouza);
  const normRefMouzaEn = normalizeText(reference.mouzaEn);

  if (!normSubMouza) {
    fieldResults.push({
      fieldName: "mouza",
      fieldLabelBn: "মৌজা",
      referenceValue: reference.mouza,
      submittedValue: "—",
      status: "MISSING",
      statusLabelBn: "তথ্য নেই",
      reasonBn: "মৌজার নাম দেওয়া হয়নি।",
    });
  } else if (normSubMouza === normRefMouza || normSubMouza === normRefMouzaEn) {
    fieldResults.push({
      fieldName: "mouza",
      fieldLabelBn: "মৌজা",
      referenceValue: reference.mouza,
      submittedValue: submitted.mouza.trim(),
      status: "MATCH",
      statusLabelBn: "মিল রয়েছে",
    });
  } else {
    const reason = `রেকর্ডে মৌজা '${reference.mouza}', কিন্তু দলিলে '${submitted.mouza.trim()}'।`;
    fieldResults.push({
      fieldName: "mouza",
      fieldLabelBn: "মৌজা",
      referenceValue: reference.mouza,
      submittedValue: submitted.mouza.trim(),
      status: "MISMATCH",
      statusLabelBn: "অমিল পাওয়া গেছে",
      reasonBn: reason,
    });
    discrepancyReasons.push(reason);
  }

  // 5. Khatian Number
  const normSubKhatian = normalizeString(submitted.khatianNumber);
  const normRefKhatian = normalizeString(reference.khatianNumber);

  if (!normSubKhatian) {
    fieldResults.push({
      fieldName: "khatianNumber",
      fieldLabelBn: "খতিয়ান নম্বর",
      referenceValue: reference.khatianNumber,
      submittedValue: "—",
      status: "MISSING",
      statusLabelBn: "তথ্য নেই",
      reasonBn: "খতিয়ান নম্বর দেওয়া হয়নি।",
    });
  } else if (normSubKhatian === normRefKhatian) {
    fieldResults.push({
      fieldName: "khatianNumber",
      fieldLabelBn: "খতিয়ান নম্বর",
      referenceValue: reference.khatianNumber,
      submittedValue: submitted.khatianNumber.trim(),
      status: "MATCH",
      statusLabelBn: "মিল রয়েছে",
    });
  } else {
    const reason = `রেকর্ডে খতিয়ান নং '${reference.khatianNumber}', কিন্তু দাখিলকৃত খতিয়ান নং '${submitted.khatianNumber.trim()}'।`;
    fieldResults.push({
      fieldName: "khatianNumber",
      fieldLabelBn: "খতিয়ান নম্বর",
      referenceValue: reference.khatianNumber,
      submittedValue: submitted.khatianNumber.trim(),
      status: "MISMATCH",
      statusLabelBn: "অমিল পাওয়া গেছে",
      reasonBn: reason,
    });
    discrepancyReasons.push(reason);
  }

  // 6. Survey Type (khatianType)
  const normSubKhatianType = normalizeText(submitted.khatianType);
  const normRefKhatianType = normalizeText(reference.khatianType);

  if (!normSubKhatianType) {
    fieldResults.push({
      fieldName: "khatianType",
      fieldLabelBn: "জরিপের ধরন",
      referenceValue: reference.khatianType,
      submittedValue: "—",
      status: "MISSING",
      statusLabelBn: "তথ্য নেই",
      reasonBn: "জরিপের ধরন (বিএস/আরএস/এসএ/সিএস) নির্বাচন করা হয়নি।",
    });
  } else if (
    normSubKhatianType === normRefKhatianType ||
    (normSubKhatianType.includes("bs") && normRefKhatianType.includes("bs")) ||
    (normSubKhatianType.includes("rs") && normRefKhatianType.includes("rs")) ||
    (normSubKhatianType.includes("sa") && normRefKhatianType.includes("sa")) ||
    (normSubKhatianType.includes("cs") && normRefKhatianType.includes("cs")) ||
    (normSubKhatianType.includes("সিটি") && normRefKhatianType.includes("city"))
  ) {
    fieldResults.push({
      fieldName: "khatianType",
      fieldLabelBn: "জরিপের ধরন",
      referenceValue: reference.khatianType,
      submittedValue: submitted.khatianType.trim(),
      status: "MATCH",
      statusLabelBn: "মিল রয়েছে",
    });
  } else {
    const reason = `রেকর্ডে জরিপ ধরন '${reference.khatianType}', কিন্তু দাখিলকৃত দলিলে '${submitted.khatianType.trim()}'।`;
    fieldResults.push({
      fieldName: "khatianType",
      fieldLabelBn: "জরিপের ধরন",
      referenceValue: reference.khatianType,
      submittedValue: submitted.khatianType.trim(),
      status: "MISMATCH",
      statusLabelBn: "অমিল পাওয়া গেছে",
      reasonBn: reason,
    });
    discrepancyReasons.push(reason);
  }

  // 7. Dag / Plot Number
  const normSubDag = normalizeString(submitted.dagNumber);
  const normRefDag = normalizeString(reference.dagNumber);

  if (!normSubDag) {
    fieldResults.push({
      fieldName: "dagNumber",
      fieldLabelBn: "দাগ নম্বর",
      referenceValue: reference.dagNumber,
      submittedValue: "—",
      status: "MISSING",
      statusLabelBn: "তথ্য নেই",
      reasonBn: "দাগ নম্বর দেওয়া হয়নি।",
    });
  } else if (normSubDag === normRefDag) {
    fieldResults.push({
      fieldName: "dagNumber",
      fieldLabelBn: "দাগ নম্বর",
      referenceValue: reference.dagNumber,
      submittedValue: submitted.dagNumber.trim(),
      status: "MATCH",
      statusLabelBn: "মিল রয়েছে",
    });
  } else {
    const reason = `রেকর্ডে দাগ নং '${reference.dagNumber}', কিন্তু দাখিলকৃত দাগ নং '${submitted.dagNumber.trim()}'।`;
    fieldResults.push({
      fieldName: "dagNumber",
      fieldLabelBn: "দাগ নম্বর",
      referenceValue: reference.dagNumber,
      submittedValue: submitted.dagNumber.trim(),
      status: "MISMATCH",
      statusLabelBn: "অমিল পাওয়া গেছে",
      reasonBn: reason,
    });
    discrepancyReasons.push(reason);
  }

  // 8. Land Area & Unit
  const subAreaNum = parseNormalizedNumber(submitted.recordedArea);
  const refAreaNum = reference.recordedArea;
  const subUnitNorm = normalizeUnit(submitted.areaUnit);
  const refUnitNorm = normalizeUnit(reference.areaUnit);

  const displayRefArea = `${toBengaliNumerals(reference.recordedArea)} ${reference.areaUnit}`;
  const displaySubArea = submitted.recordedArea
    ? `${submitted.recordedArea.trim()} ${submitted.areaUnit || ""}`.trim()
    : "—";

  if (isNaN(subAreaNum) || !submitted.recordedArea) {
    fieldResults.push({
      fieldName: "recordedArea",
      fieldLabelBn: "জমির পরিমাণ",
      referenceValue: displayRefArea,
      submittedValue: displaySubArea,
      status: "MISSING",
      statusLabelBn: "তথ্য নেই",
      reasonBn: "জমির পরিমাণের জন্য সঠিক সংখ্যা প্রদান করা হয়নি।",
    });
  } else if (subUnitNorm !== refUnitNorm) {
    const reason = `পরিমাপের একক অমিল বা অসামঞ্জস্যপূর্ণ: রেকর্ডে '${reference.areaUnit}', কিন্তু দলিলে '${submitted.areaUnit}' (ম্যানুয়াল রূপান্তর ও পর্যালোচনা প্রয়োজন)।`;
    fieldResults.push({
      fieldName: "recordedArea",
      fieldLabelBn: "জমির পরিমাণ",
      referenceValue: displayRefArea,
      submittedValue: displaySubArea,
      status: "MISMATCH",
      statusLabelBn: "অমিল পাওয়া গেছে",
      reasonBn: reason,
    });
    discrepancyReasons.push(reason);
  } else {
    const diff = Math.abs(subAreaNum - refAreaNum);
    if (diff < 0.001) {
      fieldResults.push({
        fieldName: "recordedArea",
        fieldLabelBn: "জমির পরিমাণ",
        referenceValue: displayRefArea,
        submittedValue: displaySubArea,
        status: "MATCH",
        statusLabelBn: "মিল রয়েছে",
      });
    } else {
      const diffFormatted = toBengaliNumerals(diff.toFixed(2).replace(/\.?0+$/, ""));
      const reason = `রেকর্ডে মোট জমি ${displayRefArea}, কিন্তু দলিলে হস্তান্তরিত জমি ${displaySubArea} (${diffFormatted} ${reference.areaUnit} পরিমাপের পার্থক্য বিদ্যমান)।`;
      fieldResults.push({
        fieldName: "recordedArea",
        fieldLabelBn: "জমির পরিমাণ",
        referenceValue: displayRefArea,
        submittedValue: displaySubArea,
        status: "MISMATCH",
        statusLabelBn: "অমিল পাওয়া গেছে",
        reasonBn: reason,
      });
      discrepancyReasons.push(reason);
    }
  }

  // Aggregate counts
  let matchCount = 0;
  let mismatchCount = 0;
  let missingCount = 0;

  for (const r of fieldResults) {
    if (r.status === "MATCH") matchCount++;
    else if (r.status === "MISMATCH") mismatchCount++;
    else if (r.status === "MISSING") missingCount++;
  }

  // Category determination
  let category: OverallResultCategory;
  let categoryLabelBn: string;
  let summaryBn: string;

  if (mismatchCount > 0) {
    category = "DIFFERENCES_REQUIRE_REVIEW";
    categoryLabelBn = "পার্থক্যগুলো পুনঃনিরীক্ষণ প্রয়োজন";
    summaryBn = `দাখিলকৃত দলিলের তথ্যের সাথে রেফারেন্স রেকর্ডের ${toBengaliNumerals(mismatchCount)}টি ক্ষেত্রে স্পষ্ট পার্থক্য শনাক্ত হয়েছে। দলিল সম্পাদনা বা বায়না করার পূর্বে এই অসঙ্গতিগুলো খতিয়ে দেখা আবশ্যক।`;
  } else if (missingCount > 0) {
    category = "INSUFFICIENT_INFO";
    categoryLabelBn = "তুলনার জন্য তথ্য অপর্যাপ্ত";
    summaryBn = `দাখিলকৃত ফর্মে ${toBengaliNumerals(missingCount)}টি আবশ্যিক তথ্যের ঘাটতি থাকায় সম্পূর্ণ তুলনা সম্পন্ন করা যায়নি। নির্ভুল প্রাথমিক পর্যবেক্ষণের জন্য সকল তথ্য সঠিকভাবে পূরণ করুন।`;
  } else {
    category = "NO_DISCREPANCIES";
    categoryLabelBn = "চিহ্নিত ক্ষেত্রগুলোতে কোনো অমিল পাওয়া যায়নি";
    summaryBn = `যাচাইকৃত সকল ${toBengaliNumerals(matchCount)}টি প্রধান তথ্যের সাথে নির্বাচিত রেফারেন্স রেকর্ডের হুবহু সামঞ্জস্য পাওয়া গেছে।`;
  }

  const advisoryBn =
    "পরামর্শ: এটি শুধুমাত্র কৃত্রিম ডেমো ডেটার ওপর ভিত্তি করে একটি প্রাথমিক তুলনামূলক ফলাফল। কোনো অমিলই প্রতারণার নিশ্চিত প্রমাণ নয়, তেমনি তথ্যের মিলও স্বত্বের আইনি নিশ্চয়তা প্রদান করে না। জমি ক্রয়ের যেকোনো সিদ্ধান্ত নেওয়ার আগে অবশ্যই সংশ্লিষ্ট উপজেলা ভূমি অফিস (এসি ল্যান্ড), সাব-রেজিস্ট্রি অফিস এবং অভিজ্ঞ আইনজীবীর মাধ্যমে মূল নথিপত্র সরেজমিনে যাচাই করুন।";

  return {
    category,
    categoryLabelBn,
    summaryBn,
    referenceParcel: reference,
    submitted,
    fieldResults,
    mismatchCount,
    matchCount,
    missingCount,
    discrepancyReasons,
    advisoryBn,
  };
}

export interface SavedVerificationRecord {
  id: string;
  createdAt?: string | Date;
  status?: string;
  riskLevel?: string;
  riskScore?: number | null;
  documentFilename?: string | null;
  notes?: string | null;
  submitted?: Partial<VerificationSubmission> | Record<string, string> | null;
  verification?: {
    category?: OverallResultCategory | string;
    categoryLabelBn?: string;
    summaryBn?: string;
    advisoryBn?: string;
    matchCount?: number;
    mismatchCount?: number;
    missingCount?: number;
    discrepancyReasons?: string[];
    fieldResults?: FieldComparisonResult[];
  } | null;
  extractedOcr?: Record<string, { value: string | null; confidence: string }> | null;
  riskSummary?: Record<string, unknown> | null;
}

/**
 * Transforms a saved verification database record into a complete, strongly-typed VerificationResult.
 * Handles both newly created records and older records with missing fields, synthesized fallbacks,
 * or custom parcel identifiers.
 */
export function transformSavedRecordToVerificationResult(
  record: SavedVerificationRecord
): VerificationResult {
  const rawSub = record.submitted || {};
  const submitted: VerificationSubmission = {
    parcelId: String(rawSub.parcelId || ""),
    ownerName: String(rawSub.ownerName || ""),
    district: String(rawSub.district || ""),
    upazila: String(rawSub.upazila || ""),
    mouza: String(rawSub.mouza || ""),
    khatianNumber: String(rawSub.khatianNumber || ""),
    khatianType: String(rawSub.khatianType || "বিএস (BS)"),
    dagNumber: String(rawSub.dagNumber || ""),
    recordedArea: String(rawSub.recordedArea || ""),
    areaUnit: String(rawSub.areaUnit || "শতক"),
  };

  const rawVer = record.verification;

  // 1. Resolve or reconstruct reference parcel
  let matchedParcel: DemoLandParcel | undefined;
  if (submitted.parcelId) {
    matchedParcel = SYNTHETIC_DEMO_PARCELS.find((p) => p.id === submitted.parcelId);
  }
  if (!matchedParcel && submitted.dagNumber && submitted.mouza) {
    matchedParcel = SYNTHETIC_DEMO_PARCELS.find(
      (p) => p.dagNumber === submitted.dagNumber && p.mouza === submitted.mouza
    );
  }
  if (!matchedParcel && submitted.khatianNumber) {
    matchedParcel = SYNTHETIC_DEMO_PARCELS.find(
      (p) => p.khatianNumber === submitted.khatianNumber
    );
  }
  if (!matchedParcel && submitted.ownerName) {
    matchedParcel = SYNTHETIC_DEMO_PARCELS.find(
      (p) =>
        normalizeText(p.ownership?.ownerName) === normalizeText(submitted.ownerName) ||
        normalizeText(p.ownership?.ownerName).includes(normalizeText(submitted.ownerName))
    );
  }

  // Extract reference field values from stored fieldResults if available
  const storedFields = rawVer?.fieldResults || [];
  const refOwner = storedFields.find((f) => f.fieldName === "ownerName")?.referenceValue;
  const refArea = storedFields.find((f) => f.fieldName === "recordedArea")?.referenceValue;
  const refDag = storedFields.find((f) => f.fieldName === "dagNumber")?.referenceValue;
  const refKhatian = storedFields.find((f) => f.fieldName === "khatianNumber")?.referenceValue;
  const refMouza = storedFields.find((f) => f.fieldName === "mouza")?.referenceValue;
  const refDistrict = storedFields.find((f) => f.fieldName === "district")?.referenceValue;
  const refUpazila = storedFields.find((f) => f.fieldName === "upazila")?.referenceValue;
  const refKhatianType = storedFields.find((f) => f.fieldName === "khatianType")?.referenceValue;

  const referenceParcel: DemoLandParcel = matchedParcel
    ? {
        ...matchedParcel,
        historyEvents: matchedParcel.historyEvents || [],
        litigationStatus: matchedParcel.litigationStatus || { hasActiveCase: false },
        encumbranceStatus: matchedParcel.encumbranceStatus || { isEncumbered: false },
        riskFlags: matchedParcel.riskFlags || [],
        ownership: {
          id: matchedParcel.ownership?.id || `own-${matchedParcel.id}`,
          ownerName: matchedParcel.ownership?.ownerName || "নমুনা স্বত্বাধিকারী (কৃত্রিম ডেমো)",
          ownerNameEn: matchedParcel.ownership?.ownerNameEn || "Sample Owner (Synthetic Demo)",
          deedNumber: matchedParcel.ownership?.deedNumber,
          recordedArea: matchedParcel.ownership?.recordedArea ?? matchedParcel.recordedArea,
          areaUnit: matchedParcel.ownership?.areaUnit || matchedParcel.areaUnit || "শতক",
          status: matchedParcel.ownership?.status || "ACTIVE",
          statusLabelBn: matchedParcel.ownership?.statusLabelBn || "সক্রিয় স্বত্ব",
          isSynthetic: true,
        },
      }
    : {
        id: submitted.parcelId || `saved-${record.id}`,
        district: refDistrict || submitted.district || "ঢাকা",
        districtEn: "Dhaka",
        upazila: refUpazila || submitted.upazila || "সাভার",
        upazilaEn: "Savar",
        mouza: refMouza || submitted.mouza || "নমুনা মৌজা",
        mouzaEn: "Sample Mouza",
        jlNumber: "১",
        khatianNumber: refKhatian || submitted.khatianNumber || "১",
        dagNumber: refDag || submitted.dagNumber || "১",
        khatianType: refKhatianType || submitted.khatianType || "বিএস (BS)",
        recordedArea: parseNormalizedNumber(refArea || submitted.recordedArea) || 10,
        areaUnit: submitted.areaUnit || "শতক",
        areaUnitEn: "Decimal",
        riskLevel: (record.riskLevel?.toUpperCase() as ParcelRiskLevel) || "LOW",
        riskScore: typeof record.riskScore === "number" ? record.riskScore : 15,
        status: "ACTIVE",
        statusLabelBn: "নিয়মিত রেকর্ড",
        statusLabelEn: "Regular Record",
        ownership: {
          id: `own-${record.id}`,
          ownerName: refOwner || submitted.ownerName || "নমুনা স্বত্বাধিকারী (কৃত্রিম ডেমো)",
          ownerNameEn: "Sample Owner (Synthetic Demo)",
          recordedArea: parseNormalizedNumber(refArea || submitted.recordedArea) || 10,
          areaUnit: submitted.areaUnit || "শতক",
          status: "ACTIVE",
          statusLabelBn: "সক্রিয় স্বত্ব",
          isSynthetic: true,
        },
        riskFlags: [],
        notesBn: record.notes || rawVer?.summaryBn || "",
        notesEn: "",
        historyEvents: [],
        litigationStatus: { hasActiveCase: false },
        encumbranceStatus: { isEncumbered: false },
      };

  // Ensure submitted fields have fallback values from reference parcel if missing
  if (!submitted.district) submitted.district = referenceParcel.district;
  if (!submitted.upazila) submitted.upazila = referenceParcel.upazila;
  if (!submitted.mouza) submitted.mouza = referenceParcel.mouza;
  if (!submitted.dagNumber) submitted.dagNumber = referenceParcel.dagNumber;
  if (!submitted.khatianNumber) submitted.khatianNumber = referenceParcel.khatianNumber;
  if (!submitted.recordedArea) submitted.recordedArea = String(referenceParcel.recordedArea);

  // 2. Field results
  let fieldResults: FieldComparisonResult[];
  if (storedFields.length > 0) {
    fieldResults = storedFields;
  } else {
    // Regenerate field comparisons if legacy record lacked them
    const freshComparison = compareLandDocument(submitted, referenceParcel);
    fieldResults = freshComparison.fieldResults;
  }

  // 3. Category & Counts
  let category: OverallResultCategory;
  if (
    rawVer?.category === "NO_DISCREPANCIES" ||
    rawVer?.category === "DIFFERENCES_REQUIRE_REVIEW" ||
    rawVer?.category === "INSUFFICIENT_INFO"
  ) {
    category = rawVer.category;
  } else {
    const risk = record.riskLevel?.toUpperCase();
    if (risk === "LOW") category = "NO_DISCREPANCIES";
    else if (risk === "HIGH") category = "DIFFERENCES_REQUIRE_REVIEW";
    else category = "INSUFFICIENT_INFO";
  }

  const matchCount =
    typeof rawVer?.matchCount === "number" && rawVer.matchCount >= 0
      ? rawVer.matchCount
      : fieldResults.filter((f) => f.status === "MATCH").length;

  const mismatchCount =
    typeof rawVer?.mismatchCount === "number" && rawVer.mismatchCount >= 0
      ? rawVer.mismatchCount
      : fieldResults.filter((f) => f.status === "MISMATCH").length;

  const missingCount =
    typeof rawVer?.missingCount === "number" && rawVer.missingCount >= 0
      ? rawVer.missingCount
      : fieldResults.filter((f) => f.status === "MISSING").length;

  const categoryLabelBn =
    rawVer?.categoryLabelBn ||
    (category === "NO_DISCREPANCIES"
      ? "চিহ্নিত ক্ষেত্রগুলোতে কোনো অমিল পাওয়া যায়নি"
      : category === "DIFFERENCES_REQUIRE_REVIEW"
      ? "পার্থক্যগুলো পুনঃনিরীক্ষণ প্রয়োজন"
      : "তুলনার জন্য তথ্য অপর্যাপ্ত");

  const summaryBn =
    rawVer?.summaryBn ||
    record.notes ||
    (category === "NO_DISCREPANCIES"
      ? `যাচাইকৃত সকল ${toBengaliNumerals(matchCount)}টি প্রধান তথ্যের সাথে নির্বাচিত রেফারেন্স রেকর্ডের হুবহু সামঞ্জস্য পাওয়া গেছে।`
      : `দাখিলকৃত দলিলের তথ্যের সাথে রেফারেন্স রেকর্ডের ${toBengaliNumerals(mismatchCount)}টি ক্ষেত্রে স্পষ্ট পার্থক্য শনাক্ত হয়েছে।`);

  const advisoryBn =
    rawVer?.advisoryBn ||
    "পরামর্শ: এটি শুধুমাত্র কৃত্রিম ডেমো ডেটার ওপর ভিত্তি করে একটি প্রাথমিক তুলনামূলক ফলাফল। কোনো অমিলই প্রতারণার নিশ্চিত প্রমাণ নয়, তেমনি তথ্যের মিলও স্বত্বের আইনি নিশ্চয়তা প্রদান করে না। জমি ক্রয়ের যেকোনো সিদ্ধান্ত নেওয়ার আগে অবশ্যই সংশ্লিষ্ট উপজেলা ভূমি অফিস (এসি ল্যান্ড), সাব-রেজিস্ট্রি অফিস এবং অভিজ্ঞ আইনজীবীর মাধ্যমে মূল নথিপত্র সরেজমিনে যাচাই করুন।";

  const discrepancyReasons = Array.isArray(rawVer?.discrepancyReasons) && rawVer.discrepancyReasons.length > 0
    ? rawVer.discrepancyReasons
    : fieldResults
        .filter((f) => f.status === "MISMATCH")
        .map((f) => `${f.fieldLabelBn}: দাখিলকৃত "${f.submittedValue}" কিন্তু রেফারেন্স রেকর্ডে "${f.referenceValue}"`);

  return {
    category,
    categoryLabelBn,
    summaryBn,
    referenceParcel,
    submitted,
    fieldResults,
    mismatchCount,
    matchCount,
    missingCount,
    discrepancyReasons,
    advisoryBn,
  };
}

