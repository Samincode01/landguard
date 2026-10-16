import { SYNTHETIC_DEMO_PARCELS } from "../data/demo-data";
import { compareLandDocument, VerificationSubmission } from "./verification";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log("=== Running LandGuard BD Verification Engine Tests ===");

const parcel1 = SYNTHETIC_DEMO_PARCELS[0]; // lp-demo-001 (Savar, Birulia, dag 845, khatian 312, area 7.5)

// Helper to create base submission that matches parcel1
function createBaseSubmission(): VerificationSubmission {
  return {
    parcelId: parcel1.id,
    ownerName: parcel1.ownership.ownerName,
    district: parcel1.district,
    upazila: parcel1.upazila,
    mouza: parcel1.mouza,
    khatianNumber: parcel1.khatianNumber,
    khatianType: parcel1.khatianType,
    dagNumber: parcel1.dagNumber,
    recordedArea: String(parcel1.recordedArea),
    areaUnit: parcel1.areaUnit,
  };
}

// TEST 1: Matching fields
{
  console.log("Test 1: Matching fields");
  const sub = createBaseSubmission();
  const res = compareLandDocument(sub, parcel1);
  assert(res.category === "NO_DISCREPANCIES", `Expected NO_DISCREPANCIES, got ${res.category}`);
  assert(res.mismatchCount === 0, `Expected 0 mismatches, got ${res.mismatchCount}`);
  assert(res.missingCount === 0, `Expected 0 missing, got ${res.missingCount}`);
  assert(res.matchCount === 8, `Expected 8 matches, got ${res.matchCount}`);
  console.log("✓ Test 1 Passed: Perfect match detected correctly");
}

// TEST 2: Changed owner
{
  console.log("Test 2: Changed owner");
  const sub = createBaseSubmission();
  sub.ownerName = "আবুল কাশেম (ভিন্ন ব্যক্তি)";
  const res = compareLandDocument(sub, parcel1);
  assert(res.category === "DIFFERENCES_REQUIRE_REVIEW", `Expected DIFFERENCES_REQUIRE_REVIEW, got ${res.category}`);
  assert(res.mismatchCount === 1, `Expected 1 mismatch, got ${res.mismatchCount}`);
  const ownerResult = res.fieldResults.find((f) => f.fieldName === "ownerName");
  assert(ownerResult?.status === "MISMATCH", `Expected ownerName MISMATCH`);
  console.log("✓ Test 2 Passed: Owner mismatch flagged correctly");
}

// TEST 3: Changed dag number
{
  console.log("Test 3: Changed dag number");
  const sub = createBaseSubmission();
  sub.dagNumber = "৯৯৯";
  const res = compareLandDocument(sub, parcel1);
  assert(res.category === "DIFFERENCES_REQUIRE_REVIEW", `Expected DIFFERENCES_REQUIRE_REVIEW, got ${res.category}`);
  const dagResult = res.fieldResults.find((f) => f.fieldName === "dagNumber");
  assert(dagResult?.status === "MISMATCH", `Expected dagNumber MISMATCH`);
  console.log("✓ Test 3 Passed: Dag number mismatch flagged correctly");
}

// TEST 4: Changed khatian number
{
  console.log("Test 4: Changed khatian number");
  const sub = createBaseSubmission();
  sub.khatianNumber = "৫০০";
  const res = compareLandDocument(sub, parcel1);
  assert(res.category === "DIFFERENCES_REQUIRE_REVIEW", `Expected DIFFERENCES_REQUIRE_REVIEW, got ${res.category}`);
  const khatianResult = res.fieldResults.find((f) => f.fieldName === "khatianNumber");
  assert(khatianResult?.status === "MISMATCH", `Expected khatianNumber MISMATCH`);
  console.log("✓ Test 4 Passed: Khatian number mismatch flagged correctly");
}

// TEST 5: Changed land area
{
  console.log("Test 5: Changed land area");
  const sub = createBaseSubmission();
  sub.recordedArea = "10.0"; // Reference is 7.5
  const res = compareLandDocument(sub, parcel1);
  assert(res.category === "DIFFERENCES_REQUIRE_REVIEW", `Expected DIFFERENCES_REQUIRE_REVIEW, got ${res.category}`);
  const areaResult = res.fieldResults.find((f) => f.fieldName === "recordedArea");
  assert(areaResult?.status === "MISMATCH", `Expected recordedArea MISMATCH`);
  assert(Boolean(areaResult?.reasonBn?.includes("পার্থক্য")), `Reason should mention difference`);
  console.log("✓ Test 5 Passed: Land area mismatch flagged correctly");
}

// TEST 6: Missing required fields
{
  console.log("Test 6: Missing required fields");
  const sub = createBaseSubmission();
  sub.khatianNumber = "";
  sub.dagNumber = "   ";
  const res = compareLandDocument(sub, parcel1);
  assert(res.category === "INSUFFICIENT_INFO", `Expected INSUFFICIENT_INFO, got ${res.category}`);
  assert(res.missingCount === 2, `Expected 2 missing fields, got ${res.missingCount}`);
  const khatianResult = res.fieldResults.find((f) => f.fieldName === "khatianNumber");
  const dagResult = res.fieldResults.find((f) => f.fieldName === "dagNumber");
  assert(khatianResult?.status === "MISSING", `Expected khatianNumber MISSING`);
  assert(dagResult?.status === "MISSING", `Expected dagNumber MISSING`);
  console.log("✓ Test 6 Passed: Missing fields flagged as INSUFFICIENT_INFO");
}

// TEST 7: Whitespace and numeric formatting differences
{
  console.log("Test 7: Whitespace and numeric formatting differences");
  const sub = createBaseSubmission();
  // Dag in reference is "৮৪৫", submitted with English digits "845" and whitespace "  845  "
  sub.dagNumber = "   845   ";
  // Khatian in reference is "৩১২", submitted with English digits "312" and surrounding tabs/spaces
  sub.khatianNumber = " 312 ";
  // Area in reference is 7.5, submitted as Bengali numeral with extra spaces " ৭.৫০ "
  sub.recordedArea = " ৭.৫০ ";
  // Owner name with surrounding whitespace
  sub.ownerName = `  ${parcel1.ownership.ownerName}  `;

  const res = compareLandDocument(sub, parcel1);
  assert(res.category === "NO_DISCREPANCIES", `Expected NO_DISCREPANCIES for formatted inputs, got ${res.category}`);
  assert(res.mismatchCount === 0, `Expected 0 mismatches, got ${res.mismatchCount}`);
  assert(res.matchCount === 8, `Expected all 8 fields to match, got ${res.matchCount}`);
  console.log("✓ Test 7 Passed: Whitespace and Bengali/ASCII numeral normalization verified");
}

console.log("=== ALL 7 VERIFICATION ENGINE TESTS PASSED SUCCESSFULLY! ===");
