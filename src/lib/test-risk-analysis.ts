import { SYNTHETIC_DEMO_PARCELS, DemoLandParcel } from "../data/demo-data";
import {
  analyzeParcelRisk,
  checkDuplicateTransfers,
  checkOwnerInconsistencies,
  checkAreaDiscrepancies,
  checkLitigationEncumbrance,
} from "./risk-analysis";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log("=== Running LandGuard BD Explainable Risk Analysis Tests ===");

const parcel1Clean = SYNTHETIC_DEMO_PARCELS.find((p) => p.id === "lp-demo-001")!;
const parcel2AreaDiscrepancy = SYNTHETIC_DEMO_PARCELS.find((p) => p.id === "lp-demo-002")!;
const parcel3Disputed = SYNTHETIC_DEMO_PARCELS.find((p) => p.id === "lp-demo-003")!;
const parcel4Clean = SYNTHETIC_DEMO_PARCELS.find((p) => p.id === "lp-demo-004")!;
const parcel5GovtKhas = SYNTHETIC_DEMO_PARCELS.find((p) => p.id === "lp-demo-005")!;
const parcel6Insufficient = SYNTHETIC_DEMO_PARCELS.find((p) => p.id === "lp-demo-006")!;

// TEST 1: Duplicate-transfer detection
{
  console.log("Test 1: Duplicate-transfer detection");
  const warning = checkDuplicateTransfers(parcel3Disputed);
  assert(warning !== null, "Expected duplicate transfer warning for parcel 3");
  assert(warning?.ruleId === "DUPLICATE_TRANSFER", "Expected ruleId DUPLICATE_TRANSFER");
  assert(warning?.severity === "HIGH", "Expected severity HIGH");
  assert(Boolean(warning?.whatFoundBn.includes("দ্বৈত")), "What-found should explain duplicate transfer");
  assert(Boolean(warning?.whyReviewBn.includes("স্বত্বে মারাত্মক ঝুঁকি")), "Why-review should explain title risk");
  assert(Boolean(warning?.nextStepsBn.includes("বালাম")), "Next-steps should advise volume book search");

  // Ensure clean parcel has no duplicate transfer warning
  const cleanWarning = checkDuplicateTransfers(parcel1Clean);
  assert(cleanWarning === null, "Clean parcel should have no duplicate transfer warning");
  console.log("✓ Test 1 Passed: Duplicate transfer detected with complete 4-part explanation");
}

// TEST 2: Owner-name inconsistency detection
{
  console.log("Test 2: Owner-name inconsistency detection");
  const warning = checkOwnerInconsistencies(parcel3Disputed);
  assert(warning !== null, "Expected owner inconsistency warning for parcel 3");
  assert(warning?.ruleId === "OWNER_INCONSISTENCY", "Expected ruleId OWNER_INCONSISTENCY");
  assert(Boolean(warning?.whatFoundBn.includes("অসঙ্গতি")), "What-found should mention inconsistency");
  assert(Boolean(warning?.recordsTriggeredBn.includes("বায়া দলিল")), "Records triggered should cite deed chain");
  assert(Boolean(warning?.nextStepsBn.includes("সহি-মুহুরি নকল")), "Next steps should advise certified copies");

  // Ensure clean parcel has no owner inconsistency warning
  const cleanWarning = checkOwnerInconsistencies(parcel1Clean);
  assert(cleanWarning === null, "Clean parcel should have no owner inconsistency warning");
  console.log("✓ Test 2 Passed: Owner name inconsistency detected with complete 4-part explanation");
}

// TEST 3: Area discrepancy detection
{
  console.log("Test 3: Area discrepancy detection");
  const warning = checkAreaDiscrepancies(parcel2AreaDiscrepancy);
  assert(warning !== null, "Expected area discrepancy warning for parcel 2");
  assert(warning?.ruleId === "AREA_DISCREPANCY", "Expected ruleId AREA_DISCREPANCY");
  assert(Boolean(warning?.whatFoundBn.includes("১২")), "Should mention 12 khatian area");
  assert(Boolean(warning?.whatFoundBn.includes("১১.২")), "Should mention 11.2 transferred area");
  assert(Boolean(warning?.whyReviewBn.includes("সীমানা বিরোধ")), "Why-review should explain boundary risk");
  assert(Boolean(warning?.nextStepsBn.includes("সহকারী কমিশনার")), "Next-steps should advise AC Land verification");

  // Incompatible unit test: should flag unit incompatibility rather than performing bad math
  const parcelIncompatibleUnit: DemoLandParcel = {
    ...parcel1Clean,
    recordedArea: 10,
    areaUnit: "শতক",
    ownership: {
      ...parcel1Clean.ownership,
      recordedArea: 10,
      areaUnit: "কাঠা", // Incompatible unit without conversion
    },
  };
  const unitWarning = checkAreaDiscrepancies(parcelIncompatibleUnit);
  assert(unitWarning !== null, "Expected warning for incompatible units");
  assert(Boolean(unitWarning?.whatFoundBn.includes("একক")), "Should mention unit incompatibility");

  // Clean parcel area test
  const cleanWarning = checkAreaDiscrepancies(parcel1Clean);
  assert(cleanWarning === null, "Matching area parcel should have no discrepancy warning");
  console.log("✓ Test 3 Passed: Area discrepancies and unit compatibility verified");
}

// TEST 4: Explicit simulated litigation or encumbrance
{
  console.log("Test 4: Explicit simulated litigation or encumbrance");
  // Parcel 3 has active civil suit
  const litWarning3 = checkLitigationEncumbrance(parcel3Disputed);
  assert(litWarning3 !== null, "Expected litigation warning for parcel 3");
  assert(litWarning3?.ruleId === "LITIGATION_ENCUMBRANCE", "Expected ruleId LITIGATION_ENCUMBRANCE");
  assert(litWarning3?.severity === "CRITICAL", "Expected severity CRITICAL");
  assert(Boolean(litWarning3?.recordsTriggeredBn.includes("৪৫/২০২২")), "Should cite suit number");

  // Parcel 5 has writ petition + 1 no. khas buffer
  const litWarning5 = checkLitigationEncumbrance(parcel5GovtKhas);
  assert(litWarning5 !== null, "Expected litigation/khas warning for parcel 5");
  assert(Boolean(litWarning5?.recordsTriggeredBn.includes("রিট পিটিশন") || litWarning5?.recordsTriggeredBn.includes("খাস")), "Should cite writ petition or khas notice");

  // Clean parcel 1 and 4 have no litigation
  const cleanLit1 = checkLitigationEncumbrance(parcel1Clean);
  const cleanLit4 = checkLitigationEncumbrance(parcel4Clean);
  assert(cleanLit1 === null, "Clean parcel 1 should have no litigation warning");
  assert(cleanLit4 === null, "Clean parcel 4 should have no litigation warning");
  console.log("✓ Test 4 Passed: Litigation and encumbrance only trigger on explicit indicators");
}

// TEST 5: Insufficient-information behavior
{
  console.log("Test 5: Insufficient-information behavior");
  const analysis6 = analyzeParcelRisk(parcel6Insufficient);
  assert(analysis6.outcome === "INSUFFICIENT_INFO", `Expected INSUFFICIENT_INFO, got ${analysis6.outcome}`);
  assert(analysis6.outcomeLabelBn === "পর্যাপ্ত তথ্যের ঘাটতি", "Expected Bengali label পর্যাপ্ত তথ্যের ঘাটতি");
  assert(analysis6.hasInsufficientInfo === true, "hasInsufficientInfo flag should be true");
  assert(analysis6.warnings.length === 0, "Should NOT invent warnings merely because info is missing");
  assert(Boolean(analysis6.insufficientInfoReasonBn?.includes("ঘাটতি") || analysis6.insufficientInfoReasonBn?.includes("অন্তর্ভুক্ত")), "Should explain lack of history");
  console.log("✓ Test 5 Passed: Insufficient information handled cleanly without inventing warnings");
}

// TEST 6: Clean synthetic parcel with no flagged discrepancies
{
  console.log("Test 6: Clean synthetic parcel with no flagged discrepancies");
  const analysis1 = analyzeParcelRisk(parcel1Clean);
  assert(analysis1.outcome === "NO_FLAGGED_DISCREPANCIES", `Expected NO_FLAGGED_DISCREPANCIES, got ${analysis1.outcome}`);
  assert(analysis1.outcomeLabelBn === "উপলব্ধ ডেমো তথ্যে কোনো অসঙ্গতি পাওয়া যায়নি", "Expected Bengali label for no discrepancies");
  assert(analysis1.warnings.length === 0, "Warnings list should be empty");
  assert(analysis1.historyEventsCount === 3, "History events should be present and intact");
  assert(Boolean(analysis1.advisoryBn.includes("আইনি গ্যারান্টি")), "Advisory should remind user that this is demo tech");

  const analysis4 = analyzeParcelRisk(parcel4Clean);
  assert(analysis4.outcome === "NO_FLAGGED_DISCREPANCIES", `Expected parcel 4 NO_FLAGGED_DISCREPANCIES, got ${analysis4.outcome}`);
  assert(analysis4.warnings.length === 0, "Parcel 4 warnings should be empty");
  console.log("✓ Test 6 Passed: Clean parcels verified with NO_FLAGGED_DISCREPANCIES");
}

console.log("=== ALL 6 EXPLAINABLE RISK ANALYSIS TESTS PASSED! ===");
