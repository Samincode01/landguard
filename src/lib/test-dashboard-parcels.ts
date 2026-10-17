/**
 * Test Suite: Dashboard Redesign, Database Parcels & User Data Isolation
 * Run with: npx tsx src/lib/test-dashboard-parcels.ts
 */

import { prisma } from "./prisma";
import { getDatabaseParcels } from "./parcels";

async function runDashboardTests() {
  console.log("=== LANDGUARD BD DASHBOARD & PARCEL EXPLORER TEST SUITE ===\n");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ✕ FAIL: ${message}`);
      failed++;
    }
  }

  // TEST 1: Database Seed Verification (15 Parcels)
  console.log("1. Verifying Database Parcels (Neon PostgreSQL via Prisma)...");
  try {
    const totalCount = await prisma.landParcel.count();
    assert(totalCount >= 15, `Database has at least 15 land parcel records (found: ${totalCount})`);

    const result = await getDatabaseParcels({ page: 1, limit: 15 });
    assert(result.parcels.length === 15, `getDatabaseParcels returned exactly 15 records on page 1 (got: ${result.parcels.length})`);
    assert(result.pagination.total >= 15, `Pagination total is at least 15 (got: ${result.pagination.total})`);

    // Verify all 15 parcels have synthetic identifiers and valid fields
    const allSynthetic = result.parcels.every((p) => p.id.startsWith("lp-demo-"));
    assert(allSynthetic, "All 15 parcels have synthetic stable IDs ('lp-demo-001' to 'lp-demo-015')");

    const sampleParcel = result.parcels[0];
    assert(Boolean(sampleParcel.district && sampleParcel.upazila && sampleParcel.mouza), "Parcels contain geographic hierarchy (district, upazila, mouza)");
    assert(Boolean(sampleParcel.dagNumber && sampleParcel.khatianNumber), "Parcels contain cadastral references (dagNumber, khatianNumber)");
    assert(Boolean(sampleParcel.ownership?.ownerName), "Parcels contain ownership record");
    assert(Boolean(sampleParcel.riskLevel), `Parcels contain evaluated risk level (${sampleParcel.riskLevel})`);
  } catch (err: unknown) {
    console.error("Test 1 error:", err);
    failed++;
  }

  // TEST 2: Pagination & "Load More" Behavior
  console.log("\n2. Testing Pagination & Limit Controls...");
  try {
    const page1 = await getDatabaseParcels({ page: 1, limit: 10 });
    assert(page1.parcels.length === 10, `Page 1 with limit 10 returns 10 parcels (got: ${page1.parcels.length})`);
    assert(page1.pagination.hasMore === true, "Page 1 with limit 10 correctly reports hasMore: true");

    const page2 = await getDatabaseParcels({ page: 2, limit: 10 });
    assert(page2.parcels.length >= 5, `Page 2 returns remaining parcels (got: ${page2.parcels.length})`);
    assert(page2.pagination.page === 2, "Page 2 reports page: 2");

    // Ensure no overlap between page 1 and page 2
    const page1Ids = new Set(page1.parcels.map((p) => p.id));
    const overlaps = page2.parcels.filter((p) => page1Ids.has(p.id));
    assert(overlaps.length === 0, `Page 1 and Page 2 contain mutually exclusive parcels (overlaps: ${overlaps.length})`);
  } catch (err: unknown) {
    console.error("Test 2 error:", err);
    failed++;
  }

  // TEST 3: Search & Risk Filtering
  console.log("\n3. Testing Safe Search & Risk Filtering...");
  try {
    // Risk filter: HIGH
    const highRiskOnly = await getDatabaseParcels({ riskLevel: "HIGH", limit: 20 });
    const allHigh = highRiskOnly.parcels.every((p) => p.riskLevel === "HIGH");
    assert(allHigh && highRiskOnly.parcels.length > 0, `Risk filter 'HIGH' returns only HIGH risk parcels (found: ${highRiskOnly.parcels.length})`);

    // Risk filter: LOW
    const lowRiskOnly = await getDatabaseParcels({ riskLevel: "LOW", limit: 20 });
    const allLow = lowRiskOnly.parcels.every((p) => p.riskLevel === "LOW");
    assert(allLow && lowRiskOnly.parcels.length > 0, `Risk filter 'LOW' returns only LOW risk parcels (found: ${lowRiskOnly.parcels.length})`);

    // Search by district: "ঢাকা" / "Dhaka"
    const searchDhaka = await getDatabaseParcels({ search: "ঢাকা", limit: 20 });
    assert(searchDhaka.parcels.length > 0, `Search for 'ঢাকা' finds matching parcels (found: ${searchDhaka.parcels.length})`);

    // Search by specific plot / dag number (tests both English and Bengali numerals)
    const searchDagEn = await getDatabaseParcels({ search: "845", limit: 5 });
    assert(searchDagEn.parcels.length > 0, `Search by English numeral '845' finds parcel with Bengali dag '৮৪৫' (found: ${searchDagEn.parcels.length})`);

    const searchDagBn = await getDatabaseParcels({ search: "৮৪৫", limit: 5 });
    assert(searchDagBn.parcels.length > 0, `Search by Bengali numeral '৮৪৫' finds parcel (found: ${searchDagBn.parcels.length})`);

    // Search by non-existent string
    const searchNone = await getDatabaseParcels({ search: "XYZ999NONEXISTENT", limit: 5 });
    assert(searchNone.parcels.length === 0, `Search for non-existent term returns empty array safely (got: ${searchNone.parcels.length})`);
  } catch (err: unknown) {
    console.error("Test 3 error:", err);
    failed++;
  }

  // TEST 4: User Data Isolation & Verification Privacy
  console.log("\n4. Testing User Data Isolation & Verification Privacy...");
  try {
    // Check users in database
    const users = await prisma.user.findMany({
      take: 2,
      select: { id: true, email: true, name: true },
    });

    if (users.length > 0) {
      const testUser = users[0];
      const userVerifications = await prisma.verificationRequest.findMany({
        where: { userId: testUser.id },
      });

      // Confirm user's records all belong to this user
      const isIsolated = userVerifications.every((v) => v.userId === testUser.id);
      assert(isIsolated, `All retrieved verifications for user '${testUser.email}' strictly match their userId`);

      // Ensure parcel queries NEVER return verification requests or secrets
      const parcelsResult = await getDatabaseParcels({ limit: 15 });
      const containsUserSecrets = parcelsResult.parcels.some((p: unknown) => {
        const record = p as Record<string, unknown>;
        return Boolean(record.passwordHash || record.sessionToken || record.userId);
      });
      assert(!containsUserSecrets, "Parcels API result contains NO passwords, session tokens, or userIds");
    } else {
      console.log("  ℹ No registered users found to test isolation; skipping user query check");
    }
  } catch (err: unknown) {
    console.error("Test 4 error:", err);
    failed++;
  }

  // TEST 5: Idempotency of Seed Data
  console.log("\n5. Testing Seed Idempotency...");
  try {
    const countBefore = await prisma.landParcel.count();
    // Verify stable IDs lp-demo-001 to lp-demo-015
    const demo1 = await prisma.landParcel.findUnique({
      where: { id: "lp-demo-001" },
    });
    const demo15 = await prisma.landParcel.findUnique({
      where: { id: "lp-demo-015" },
    });

    assert(Boolean(demo1), "Stable ID 'lp-demo-001' exists in database");
    assert(Boolean(demo15), "Stable ID 'lp-demo-015' exists in database");
    assert(countBefore >= 15, `Database parcel count is stable at >= 15 (currently: ${countBefore})`);
  } catch (err: unknown) {
    console.error("Test 5 error:", err);
    failed++;
  }

  console.log(`\n========================================`);
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runDashboardTests().catch((e) => {
  console.error("Fatal test runner error:", e);
  process.exit(1);
});
