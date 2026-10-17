/**
 * Unit Tests for Document Extraction Service
 * Tests file validation, strict anti-hallucination sanitization, and fallback behavior.
 */

import {
  validateUploadFile,
  normalizeExtractionResult,
  extractDocumentFields,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
} from "./document-extractor";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log("=== Running LandGuard BD Document Extractor Unit Tests ===");

// TEST 1: File validation - Allowed MIME types
{
  console.log("Test 1: Allowed MIME types & size check");
  const smallBuffer = Buffer.from("fake-image-bytes");

  for (const mime of ALLOWED_MIME_TYPES) {
    const res = validateUploadFile(smallBuffer, mime);
    assert(res.isValid, `Expected ${mime} to be valid`);
  }

  // Invalid MIME
  const invalidMime = validateUploadFile(smallBuffer, "application/zip");
  assert(!invalidMime.isValid, "Expected zip to be rejected");
  assert(invalidMime.code === "INVALID_FILE_TYPE", "Expected INVALID_FILE_TYPE");

  // Empty buffer
  const emptyBuf = Buffer.alloc(0);
  const emptyRes = validateUploadFile(emptyBuf, "image/jpeg");
  assert(!emptyRes.isValid, "Expected empty buffer to be rejected");
  assert(emptyRes.code === "EMPTY_FILE", "Expected EMPTY_FILE");

  // Oversized buffer
  const hugeBuf = Buffer.alloc(MAX_FILE_SIZE_BYTES + 1024);
  const hugeRes = validateUploadFile(hugeBuf, "image/jpeg");
  assert(!hugeRes.isValid, "Expected oversized buffer to be rejected");
  assert(hugeRes.code === "FILE_TOO_LARGE", "Expected FILE_TOO_LARGE");

  console.log("✓ Test 1 Passed: File type and size limits strictly validated");
}

// TEST 2: Strict anti-hallucination sanitization
{
  console.log("Test 2: Strict anti-hallucination & null handling");

  const rawModelResponse = {
    ownerName: { value: "মোঃ রফিকুল ইসলাম", confidence: "HIGH" },
    district: { value: "Dhaka", confidence: "HIGH" },
    upazila: { value: "Savar", confidence: "HIGH" },
    mouza: { value: "Birulia", confidence: "MEDIUM" },
    khatianNumber: { value: "৩১২", confidence: "HIGH" },
    khatianType: { value: "বিএস জরিপ", confidence: "HIGH" },
    dagNumber: { value: "৮৪৫", confidence: "HIGH" },
    recordedArea: { value: "7.5", confidence: "HIGH" },
    areaUnit: { value: "শতাংশ", confidence: "HIGH" },
  };

  const normalized = normalizeExtractionResult(rawModelResponse);

  assert(normalized.ownerName.value === "মোঃ রফিকুল ইসলাম", "Owner name should match");
  assert(normalized.ownerName.confidence === "HIGH", "Confidence should be HIGH");
  assert(normalized.khatianType.value === "বিএস (BS)", "Khatian type should normalize to standard format");
  assert(normalized.areaUnit.value === "শতক", "Area unit should normalize to standard format");

  console.log("✓ Test 2 Passed: Accurate field normalization verified");
}

// TEST 3: Unreadable / missing fields never guessed
{
  console.log("Test 3: Missing/unreadable fields set to null & UNREADABLE");

  const incompleteModelResponse = {
    ownerName: { value: "Unknown", confidence: "LOW" },
    district: { value: "null", confidence: "LOW" },
    upazila: { value: null, confidence: "UNREADABLE" },
    mouza: { value: "N/A", confidence: "UNREADABLE" },
    khatianNumber: { value: "   ", confidence: "MEDIUM" },
    khatianType: { value: "অস্পষ্ট", confidence: "LOW" },
    dagNumber: { value: "৮৪৫", confidence: "HIGH" },
    recordedArea: { value: "পাওয়া যায়নি", confidence: "LOW" },
    areaUnit: { value: "None", confidence: "LOW" },
  };

  const normalized = normalizeExtractionResult(incompleteModelResponse);

  assert(normalized.ownerName.value === null, "Unknown owner should be null");
  assert(normalized.ownerName.confidence === "UNREADABLE", "Unknown owner confidence should be UNREADABLE");
  assert(normalized.district.value === null, "'null' string should be null");
  assert(normalized.district.confidence === "UNREADABLE", "'null' string confidence should be UNREADABLE");
  assert(normalized.upazila.value === null, "upazila should be null");
  assert(normalized.mouza.value === null, "'N/A' should be null");
  assert(normalized.khatianNumber.value === null, "Whitespace khatian should be null");
  assert(normalized.khatianType.value === null, "'অস্পষ্ট' should be null");
  assert(normalized.dagNumber.value === "৮৪৫", "Valid dag should be preserved");
  assert(normalized.dagNumber.confidence === "HIGH", "Valid dag confidence preserved");
  assert(normalized.recordedArea.value === null, "'পাওয়া যায়নি' should be null");
  assert(normalized.areaUnit.value === null, "'None' should be null");

  console.log("✓ Test 3 Passed: Zero guessing / hallucinations for missing fields");
}

// TEST 4: Missing GEMINI_API_KEY graceful handling
{
  console.log("Test 4: Missing GEMINI_API_KEY returns clear code and message");
  const originalKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;

  extractDocumentFields(Buffer.from("dummy"), "image/jpeg").then((res) => {
    assert(!res.success, "Should fail gracefully without key");
    assert(res.code === "GEMINI_NOT_CONFIGURED", "Code should be GEMINI_NOT_CONFIGURED");
    assert(Boolean(res.message?.includes("Gemini API key")), "Message should explain missing key");

    // Restore key if it was set
    if (originalKey) {
      process.env.GEMINI_API_KEY = originalKey;
    }

    console.log("✓ Test 4 Passed: Missing GEMINI_API_KEY handled gracefully without crash");
    console.log("=== ALL DOCUMENT EXTRACTOR UNIT TESTS PASSED! ===");
  });
}

