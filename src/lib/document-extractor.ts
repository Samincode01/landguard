/**
 * Document Extraction Service using Gemini Multimodal Vision API
 * LandGuard BD — Civic Tech for Land Due Diligence (Track P5)
 *
 * Extracts structured cadastral fields from uploaded land document images or PDFs
 * without storing or persisting any user documents or PII.
 *
 * Key Guarantees:
 * 1. Zero database writes / zero document persistence.
 * 2. Strict anti-hallucination: returns null + UNREADABLE when fields are obscured or missing.
 * 3. File type & size validation with timeout safeguard (15s).
 * 4. Graceful handling of unconfigured GEMINI_API_KEY.
 */

import { GoogleGenAI } from "@google/genai";

export type ExtractionConfidence = "HIGH" | "MEDIUM" | "LOW" | "UNREADABLE";

export interface ExtractedField {
  value: string | null;
  confidence: ExtractionConfidence;
}

export interface DocumentExtractionResult {
  ownerName: ExtractedField;
  district: ExtractedField;
  upazila: ExtractedField;
  mouza: ExtractedField;
  khatianNumber: ExtractedField;
  khatianType: ExtractedField;
  dagNumber: ExtractedField;
  recordedArea: ExtractedField;
  areaUnit: ExtractedField;
  notes?: string | null;
}

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const EXTRACTION_TIMEOUT_MS = 18000; // 18 seconds

export interface ExtractionServiceResponse {
  success: boolean;
  data?: DocumentExtractionResult;
  error?: string;
  code?:
    | "GEMINI_NOT_CONFIGURED"
    | "INVALID_FILE_TYPE"
    | "FILE_TOO_LARGE"
    | "TIMEOUT"
    | "EMPTY_FILE"
    | "API_KEY_INVALID"
    | "MODEL_UNAVAILABLE"
    | "QUOTA_EXCEEDED"
    | "EXTRACTION_FAILED";
  message?: string;
  messageBn?: string;
}

const EXTRACTION_SYSTEM_PROMPT = `
You are an expert cadastral and land-deed information extraction system specialized in Bangladeshi land records (খতিয়ান, পর্চা, কবলা দলিল, হেবা দলিল, বন্টননামা, দাখিলা).
Analyze the provided document image or PDF and extract these 9 specific cadastral fields into JSON:

Fields to extract:
1. ownerName: Seller or current recorded owner's full name (মালিক / বিক্রেতার নাম).
2. district: District name in Bangladesh (জেলা, e.g. Dhaka, Gazipur, Chattogram).
3. upazila: Upazila or Thana (উপজেলা / থানা, e.g. Savar, Kaliakair).
4. mouza: Mouza name (মৌজা, e.g. Birulia, বিরুলিয়া).
5. khatianNumber: Khatian number (খতিয়ান নং, e.g. 312 or ৩১২).
6. khatianType: Land survey type (জরিপের ধরন). Standardize to one of: "বিএস (BS)", "আরএস (RS)", "এসএ (SA)", "সিএস (CS)", "সিটি জরিপ (City Survey)", or readable variation.
7. dagNumber: Dag or plot number (দাগ নং / কিস্তা নং, e.g. 845 or ৮৪৫).
8. recordedArea: Land area number only (জমির পরিমাণ, e.g. "7.5", "৭.৫", "10", "০.০৮").
9. areaUnit: Land measurement unit (জমির পরিমাপের একক). Standardize to one of: "শতক", "কাঠা", "বিঘা", "একর".

CRITICAL ANTI-HALLUCINATION RULES:
1. Extract ONLY information explicitly visible and legible in the document.
2. NEVER guess, invent, extrapolate, or hallucinate missing values.
3. If a field is illegible, torn, cropped, blank, or not present, you MUST set its "value" to null and "confidence" to "UNREADABLE".
4. For readable fields, set "confidence" to:
   - "HIGH" if clearly printed and unambiguous
   - "MEDIUM" if handwritten, slightly faded, or partially ambiguous
   - "LOW" if barely legible
5. If "value" is null, "confidence" MUST be "UNREADABLE".
6. Output strictly valid JSON matching this schema:
{
  "ownerName": { "value": string | null, "confidence": "HIGH" | "MEDIUM" | "LOW" | "UNREADABLE" },
  "district": { "value": string | null, "confidence": "HIGH" | "MEDIUM" | "LOW" | "UNREADABLE" },
  "upazila": { "value": string | null, "confidence": "HIGH" | "MEDIUM" | "LOW" | "UNREADABLE" },
  "mouza": { "value": string | null, "confidence": "HIGH" | "MEDIUM" | "LOW" | "UNREADABLE" },
  "khatianNumber": { "value": string | null, "confidence": "HIGH" | "MEDIUM" | "LOW" | "UNREADABLE" },
  "khatianType": { "value": string | null, "confidence": "HIGH" | "MEDIUM" | "LOW" | "UNREADABLE" },
  "dagNumber": { "value": string | null, "confidence": "HIGH" | "MEDIUM" | "LOW" | "UNREADABLE" },
  "recordedArea": { "value": string | null, "confidence": "HIGH" | "MEDIUM" | "LOW" | "UNREADABLE" },
  "areaUnit": { "value": string | null, "confidence": "HIGH" | "MEDIUM" | "LOW" | "UNREADABLE" },
  "notes": string | null
}
`.trim();

/**
 * Strips markdown code blocks if present
 */
function cleanJsonResponse(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}

/**
 * Normalizes survey type to standard LandGuard options
 */
function normalizeSurveyType(raw: string | null): string | null {
  if (!raw) return null;
  const lower = raw.toLowerCase().trim();
  if (lower.includes("city") || lower.includes("সিটি")) return "সিটি জরিপ (City Survey)";
  if (lower.includes("bs") || lower.includes("বিএস") || lower.includes("বাংলাদেশ")) return "বিএস (BS)";
  if (lower.includes("rs") || lower.includes("আরএস") || lower.includes("রিভিশনাল")) return "আরএস (RS)";
  if (lower.includes("sa") || lower.includes("এসএ") || lower.includes("স্টেট")) return "এসএ (SA)";
  if (lower.includes("cs") || lower.includes("সিএস") || lower.includes("ক্যাডার")) return "সিএস (CS)";
  return raw.trim();
}

/**
 * Normalizes land area unit to standard LandGuard options
 */
function normalizeAreaUnit(raw: string | null): string | null {
  if (!raw) return null;
  const lower = raw.toLowerCase().trim();
  if (lower.includes("শতক") || lower.includes("decimal") || lower.includes("শতাংশ") || lower.includes("ডেসিমল")) return "শতক";
  if (lower.includes("কাঠা") || lower.includes("katha") || lower.includes("কাটা")) return "কাঠা";
  if (lower.includes("বিঘা") || lower.includes("bigha")) return "বিঘা";
  if (lower.includes("একর") || lower.includes("acre")) return "একর";
  return raw.trim();
}

/**
 * Sanitizes and normalizes an individual extracted field
 */
function sanitizeField(rawField: unknown, normalizer?: (val: string | null) => string | null): ExtractedField {
  if (!rawField || typeof rawField !== "object") {
    return { value: null, confidence: "UNREADABLE" };
  }

  const fieldObj = rawField as { value?: unknown; confidence?: unknown };
  let valueStr: string | null = null;

  if (typeof fieldObj.value === "string") {
    const trimmed = fieldObj.value.trim();
    const lower = trimmed.toLowerCase();
    // Filter out common LLM null placeholders
    if (
      trimmed === "" ||
      lower === "null" ||
      lower === "none" ||
      lower === "n/a" ||
      lower === "unknown" ||
      lower === "unreadable" ||
      lower === "অপ্রযোজ্য" ||
      lower === "অস্পষ্ট" ||
      lower === "পাওয়া যায়নি"
    ) {
      valueStr = null;
    } else {
      valueStr = normalizer ? normalizer(trimmed) : trimmed;
    }
  } else if (typeof fieldObj.value === "number") {
    valueStr = String(fieldObj.value);
    if (normalizer) valueStr = normalizer(valueStr);
  }

  let confidence: ExtractionConfidence = "UNREADABLE";
  const validConfidences: ExtractionConfidence[] = ["HIGH", "MEDIUM", "LOW", "UNREADABLE"];

  if (valueStr !== null) {
    if (
      typeof fieldObj.confidence === "string" &&
      validConfidences.includes(fieldObj.confidence.toUpperCase() as ExtractionConfidence)
    ) {
      confidence = fieldObj.confidence.toUpperCase() as ExtractionConfidence;
      if (confidence === "UNREADABLE") {
        confidence = "MEDIUM";
      }
    } else {
      confidence = "HIGH";
    }
  }

  return {
    value: valueStr,
    confidence,
  };
}

/**
 * Normalizes full JSON response into DocumentExtractionResult
 */
export function normalizeExtractionResult(parsed: unknown): DocumentExtractionResult {
  const root = (parsed && typeof parsed === "object" ? parsed : {}) as Record<string, unknown>;

  return {
    ownerName: sanitizeField(root.ownerName),
    district: sanitizeField(root.district),
    upazila: sanitizeField(root.upazila),
    mouza: sanitizeField(root.mouza),
    khatianNumber: sanitizeField(root.khatianNumber),
    khatianType: sanitizeField(root.khatianType, normalizeSurveyType),
    dagNumber: sanitizeField(root.dagNumber),
    recordedArea: sanitizeField(root.recordedArea),
    areaUnit: sanitizeField(root.areaUnit, normalizeAreaUnit),
    notes: typeof root.notes === "string" ? root.notes.trim() : null,
  };
}

/**
 * Validates file buffer, MIME type, and size
 */
export function validateUploadFile(
  buffer: Buffer | ArrayBuffer,
  mimeType: string
): { isValid: boolean; error?: string; code?: "INVALID_FILE_TYPE" | "FILE_TOO_LARGE" | "EMPTY_FILE" } {
  const byteLength = buffer instanceof Buffer ? buffer.length : buffer.byteLength;

  if (byteLength === 0) {
    return {
      isValid: false,
      error: "ফাইলটি খালি বা কোনো ডেটা নেই। (File is empty)",
      code: "EMPTY_FILE",
    };
  }

  if (byteLength > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: "ফাইলের আকার ৫ মেগাবাইটের বেশি হতে পারবে না। (File exceeds 5MB limit)",
      code: "FILE_TOO_LARGE",
    };
  }

  const normalizedMime = mimeType.toLowerCase().trim();
  const isAllowed = ALLOWED_MIME_TYPES.some((allowed) => allowed === normalizedMime);

  if (!isAllowed) {
    return {
      isValid: false,
      error: "শুধুমাত্র JPEG, PNG, WebP ছবি অথবা PDF ফাইল সমর্থিত। (Only JPEG, PNG, WebP or PDF files are supported)",
      code: "INVALID_FILE_TYPE",
    };
  }

  return { isValid: true };
}

/**
 * Core extraction function using Gemini Vision SDK
 */
export async function extractDocumentFields(
  fileBuffer: Buffer,
  mimeType: AllowedMimeType
): Promise<ExtractionServiceResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    return {
      success: false,
      code: "GEMINI_NOT_CONFIGURED",
      error: "GEMINI_NOT_CONFIGURED",
      message: "Gemini API key is not configured on the server. Please fill in details manually.",
      messageBn: "সার্ভারে Gemini API কী কনফিগার করা নেই। অনুগ্রহ করে ফর্মটি নিজে পূরণ করে যাচাই করুন।",
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
    const modelName = process.env.GEMINI_MODEL || "gemini-3.5-flash";

    const base64Data = fileBuffer.toString("base64");

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Gemini document extraction timed out after ${EXTRACTION_TIMEOUT_MS}ms`)),
        EXTRACTION_TIMEOUT_MS
      )
    );

    const apiPromise = ai.models.generateContent({
      model: modelName,
      contents: [
        {
          inlineData: {
            mimeType,
            data: base64Data,
          },
        },
        {
          text: EXTRACTION_SYSTEM_PROMPT,
        },
      ],
      config: {
        responseMimeType: "application/json",
        temperature: 0.1, // Highly deterministic extraction
      },
    });

    const response = await Promise.race([apiPromise, timeoutPromise]);
    const responseText = response.text?.trim();

    if (!responseText) {
      throw new Error("Received empty response from Gemini API");
    }

    const cleanedJson = cleanJsonResponse(responseText);
    const parsed = JSON.parse(cleanedJson);
    const result = normalizeExtractionResult(parsed);

    return {
      success: true,
      data: result,
    };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    const lower = errorMsg.toLowerCase();

    let code: ExtractionServiceResponse["code"] = "EXTRACTION_FAILED";
    let messageEn = "Could not extract legible data from this document. Please upload a clearer file or fill in details manually.";
    let messageBn = "দলিল থেকে তথ্য পাঠোদ্ধার করা সম্ভব হয়নি। অনুগ্রহ করে পরিষ্কার ছবি আপলোড করুন অথবা নিচে তথ্য নিজে পূরণ করুন।";

    if (lower.includes("timed out")) {
      code = "TIMEOUT";
      messageEn = "Document analysis timed out. Please try uploading a smaller file or enter details manually.";
      messageBn = "দলিল বিশ্লেষণে সময়সীমা অতিক্রম করেছে। অনুগ্রহ করে ছোট ফাইল আপলোড করুন অথবা নিজে তথ্য পূরণ করুন।";
    } else if (
      lower.includes("api_key_invalid") ||
      lower.includes("api key not valid") ||
      lower.includes("unregistered callers") ||
      lower.includes("permission_denied")
    ) {
      code = "API_KEY_INVALID";
      messageEn = "The configured Gemini API key is invalid or lacks necessary permissions. Please verify GEMINI_API_KEY in .env.";
      messageBn = "কনফিগার করা Gemini API কী সঠিক নয়। অনুগ্রহ করে .env ফাইলে GEMINI_API_KEY যাচাই করুন।";
    } else if (
      lower.includes("quota") ||
      lower.includes("resource_exhausted") ||
      lower.includes("rate_limit") ||
      lower.includes("429")
    ) {
      code = "QUOTA_EXCEEDED";
      messageEn = "Gemini API rate limit or quota exceeded. Please wait a moment or enter details manually.";
      messageBn = "Gemini API ব্যবহারের কোটা সাময়িকভাবে শেষ হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন অথবা নিজে পূরণ করুন।";
    } else if (
      lower.includes("not found") ||
      lower.includes("not_found") ||
      lower.includes("is not supported") ||
      lower.includes("is no longer available")
    ) {
      code = "MODEL_UNAVAILABLE";
      messageEn = "Configured Gemini AI model is currently unavailable. Please verify GEMINI_MODEL in .env.";
      messageBn = "অনুরোধকৃত Gemini এআই মডেলটি অনুপলব্ধ। অনুগ্রহ করে GEMINI_MODEL কনফিগারেশন যাচাই করুন।";
    }

    // Safe error log without printing document contents, base64 payloads, or secrets
    console.warn(`[Document Extractor] Extraction failed [Code: ${code}]. Reason: ${messageEn}`);

    return {
      success: false,
      code,
      error: code,
      message: messageEn,
      messageBn,
    };
  }
}
