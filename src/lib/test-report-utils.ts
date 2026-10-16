import {
  generateReportReference,
  formatReportDateTime,
  getBuyerDueDiligenceChecklist,
} from "./report-utils";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log("=== Running LandGuard BD Report Utilities Tests ===");

// TEST 1: Unique & deterministic report reference formats
{
  console.log("Test 1: Report reference generation");
  const refRandom = generateReportReference();
  assert(
    /^LGBD-REP-2026-\d{4}$/.test(refRandom),
    `Expected format LGBD-REP-2026-XXXX, got ${refRandom}`
  );

  const refSeedA = generateReportReference("seed-123");
  const refSeedB = generateReportReference("seed-123");
  assert(
    refSeedA === refSeedB,
    `Expected deterministic output for identical seed, got ${refSeedA} !== ${refSeedB}`
  );
  assert(
    /^LGBD-REP-2026-\d{4}$/.test(refSeedA),
    `Expected format LGBD-REP-2026-XXXX, got ${refSeedA}`
  );
  console.log("✓ Test 1 Passed: Report reference format and determinism verified");
}

// TEST 2: Localized Bengali date-time formatting
{
  console.log("Test 2: Bengali date-time formatting");
  // Oct 17, 2026 02:30 AM
  const dateAm = new Date(2026, 9, 17, 2, 30);
  const formattedAm = formatReportDateTime(dateAm);
  assert(formattedAm.includes("১৭"), `Expected day '১৭', got ${formattedAm}`);
  assert(formattedAm.includes("অক্টোবর"), `Expected month 'অক্টোবর', got ${formattedAm}`);
  assert(formattedAm.includes("২০২৬"), `Expected year '২০২৬', got ${formattedAm}`);
  assert(formattedAm.includes("পূর্বাহ্ন"), `Expected AM period 'পূর্বাহ্ন', got ${formattedAm}`);

  // Oct 17, 2026 15:45 PM
  const datePm = new Date(2026, 9, 17, 15, 45);
  const formattedPm = formatReportDateTime(datePm);
  assert(formattedPm.includes("অপরাহ্ন"), `Expected PM period 'অপরাহ্ন', got ${formattedPm}`);
  assert(formattedPm.includes("০৩:৪৫"), `Expected time '০৩:৪৫', got ${formattedPm}`);
  console.log("✓ Test 2 Passed: Bengali date-time formatting verified for AM and PM");
}

// TEST 3: Buyer due diligence checklist items
{
  console.log("Test 3: Buyer due diligence checklist");
  const checklist = getBuyerDueDiligenceChecklist();
  assert(checklist.length >= 5, `Expected at least 5 checklist items, got ${checklist.length}`);
  
  const requiredCategories = [
    "খতিয়ান ও নামজারি যাচাই",
    "বালাম বহি তল্লাশি",
    "নির্দায় সনদপত্র (NEC)",
    "সরেজমিন সীমানা ও দখল",
    "আদালতি মোকদ্দমা ও খাস জমি",
  ];
  for (const cat of requiredCategories) {
    const found = checklist.find((item) => item.categoryBn === cat);
    assert(!!found, `Missing required due diligence category: ${cat}`);
    assert(found!.officialSourceBn.length > 0, `Missing official source for ${cat}`);
    assert(found!.actionBn.length > 0, `Missing action for ${cat}`);
  }
  console.log("✓ Test 3 Passed: Due diligence checklist items and official authorities verified");
}

console.log("=== ALL REPORT UTILITY TESTS PASSED! ===");
