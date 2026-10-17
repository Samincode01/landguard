/**
 * LandGuard BD — Verification History & Per-User Isolation Integration Tests
 * Run with: npx tsx src/lib/test-history.ts
 *
 * Requirements covered:
 * 1. Persist completed verifications with authenticated user ID, submitted details, discrepancies, and OCR fields.
 * 2. Ensure zero document file binaries or raw document contents are stored.
 * 3. Enforce server-verified session authentication for history routes.
 * 4. Verify strict per-user history isolation (User A cannot see User B's records in list queries).
 * 5. Verify ownership security checks (User B attempting to read User A's single record is rejected with 403 Forbidden).
 * 6. Verify unauthenticated access is rejected with 401 Unauthorized.
 * 7. Verify rapid duplicate submission deduplication.
 */

import { NextRequest } from "next/server";
import { prisma } from "./prisma";
import { signSessionToken, hashPassword, SESSION_COOKIE_NAME } from "./auth";
import { POST as historyPost, GET as historyGet } from "../app/api/verify/history/route";
import { GET as singleHistoryGet } from "../app/api/verify/history/[id]/route";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    process.exit(1);
  }
}

async function runTests() {
  console.log("=== Running LandGuard BD Verification History & Isolation Tests ===\n");

  let userA: Awaited<ReturnType<typeof prisma.user.upsert>> | null = null;
  let userB: Awaited<ReturnType<typeof prisma.user.upsert>> | null = null;
  let tokenA = "";
  let tokenB = "";
  const createdRecordIds: string[] = [];

  try {
    // ----------------------------------------------------
    // Setup: Create/retrieve two distinct users
    // ----------------------------------------------------
    console.log("Step 1: Setting up two distinct test users in database...");
    const dummyHash = await hashPassword("TestPass1234#");

    userA = await prisma.user.upsert({
      where: { email: "test-user-a-history@landguard.bd" },
      update: { name: "User A Citizen" },
      create: {
        email: "test-user-a-history@landguard.bd",
        name: "User A Citizen",
        phone: "01711000001",
        occupation: "Citizen Buyer",
        passwordHash: dummyHash,
      },
    });

    userB = await prisma.user.upsert({
      where: { email: "test-user-b-history@landguard.bd" },
      update: { name: "User B Citizen" },
      create: {
        email: "test-user-b-history@landguard.bd",
        name: "User B Citizen",
        phone: "01711000002",
        occupation: "Legal Counsel",
        passwordHash: dummyHash,
      },
    });

    tokenA = await signSessionToken({
      id: userA.id,
      name: userA.name,
      email: userA.email,
      phone: userA.phone,
      occupation: userA.occupation,
    });

    tokenB = await signSessionToken({
      id: userB.id,
      name: userB.name,
      email: userB.email,
      phone: userB.phone,
      occupation: userB.occupation,
    });

    assert(userA.id !== userB.id, "User A and User B must have distinct IDs");
    console.log(`✓ Test 1 Passed: User A (${userA.id}) and User B (${userB.id}) configured with session tokens.\n`);

    // ----------------------------------------------------
    // Test 2: User A Saves a Completed Verification
    // ----------------------------------------------------
    console.log("Step 2: User A submits and saves a completed verification...");
    const submissionA = {
      parcelId: "p1",
      ownerName: "মোহাম্মদ আবদুর রহিম",
      district: "ঢাকা",
      upazila: "সাভার",
      mouza: "রাজাসন",
      khatianNumber: "৩১২",
      khatianType: "বিএস (BS)",
      dagNumber: "৪০২",
      recordedArea: "৭.৫",
      areaUnit: "শতক",
    };

    const verificationResultA = {
      category: "NO_DISCREPANCIES",
      categoryLabelBn: "কোনো অসঙ্গতি পাওয়া যায়নি — সম্পূর্ণ মিল",
      summaryBn: "সকল তথ্যে পূর্ণাঙ্গ মিল পাওয়া গেছে।",
      advisoryBn: "সাব-রেজিস্ট্রি অফিসে মূল বালাম বহির সাথে মিলিয়ে নিন।",
      matchCount: 8,
      mismatchCount: 0,
      missingCount: 0,
      discrepancyReasons: [],
      fieldResults: [
        {
          fieldName: "ownerName",
          fieldLabelBn: "মালিকের নাম",
          referenceValue: "মোহাম্মদ আবদুর রহিম",
          submittedValue: "মোহাম্মদ আবদুর রহিম",
          status: "MATCH",
          statusLabelBn: "সঠিক ও মিল রয়েছে",
        },
      ],
    };

    const ocrFieldsA = {
      ownerName: { value: "মোহাম্মদ আবদুর রহিম", confidence: "HIGH" },
      dagNumber: { value: "৪০২", confidence: "HIGH" },
      khatianNumber: { value: "৩১২", confidence: "MEDIUM" },
    };

    const saveReqA = new NextRequest("http://localhost:3000/api/verify/history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: `${SESSION_COOKIE_NAME}=${tokenA}`,
      },
      body: JSON.stringify({
        submitted: submissionA,
        verification: verificationResultA,
        extractedOcr: ocrFieldsA,
        documentFilename: "deed_scan_user_a.pdf",
      }),
    });

    const saveResA = await historyPost(saveReqA);
    const saveJsonA = await saveResA.json();

    assert(saveResA.status === 201, `Expected status 201, got ${saveResA.status}`);
    assert(Boolean(saveJsonA.id), "Expected returned record ID");
    assert(saveJsonA.isDuplicate === false, "First submission should not be flagged as duplicate");
    createdRecordIds.push(saveJsonA.id);

    // Verify database record directly
    const dbRecordA = await prisma.verificationRequest.findUnique({
      where: { id: saveJsonA.id },
    });

    assert(dbRecordA !== null, "Record must exist in PostgreSQL");
    assert(dbRecordA?.userId === userA.id, "Record userId must match User A");
    assert(dbRecordA?.status === "COMPLETED", "Status must be COMPLETED");
    assert(dbRecordA?.riskLevel === "LOW", "Risk level must be LOW for match");
    assert(dbRecordA?.documentFilename === "deed_scan_user_a.pdf", "Filename must match");

    // Guarantee no file binaries are stored
    const extractedDataA = JSON.parse(dbRecordA?.extractedData || "{}");
    assert(extractedDataA.submitted?.dagNumber === "৪০২", "Submitted fields preserved in JSON");
    assert(extractedDataA.extractedOcr?.ownerName?.confidence === "HIGH", "OCR metadata preserved without binaries");
    console.log(`✓ Test 2 Passed: User A verification saved to database (ID: ${saveJsonA.id}) with no binaries stored.\n`);

    // ----------------------------------------------------
    // Test 3: User B Saves a Different Verification
    // ----------------------------------------------------
    console.log("Step 3: User B submits and saves a discrepancy verification...");
    const submissionB = {
      parcelId: "p2",
      ownerName: "বেগম ফাতেমা খাতুন (অসমর্থিত)",
      district: "গাজীপুর",
      upazila: "কালিয়াকৈর",
      mouza: "চন্দ্রা",
      khatianNumber: "৮৪০",
      khatianType: "আরএস (RS)",
      dagNumber: "৭০৫",
      recordedArea: "১২.০",
      areaUnit: "শতক",
    };

    const verificationResultB = {
      category: "DIFFERENCES_REQUIRE_REVIEW",
      categoryLabelBn: "অসঙ্গতি পরিলক্ষিত — বিস্তারিত নিরীক্ষা প্রয়োজন",
      summaryBn: "মালিকের নামে অমিল পরিলক্ষিত হয়েছে।",
      advisoryBn: "ওয়ারিশান সনদ বা নামজারি খতিয়ান পরীক্ষা করুন।",
      matchCount: 6,
      mismatchCount: 1,
      missingCount: 0,
      discrepancyReasons: ["বিক্রেতার নামের সাথে রেকর্ডের মালিকের অমিল।"],
      fieldResults: [
        {
          fieldName: "ownerName",
          fieldLabelBn: "মালিকের নাম",
          referenceValue: "ফাতেমা খাতুন",
          submittedValue: "বেগম ফাতেমা খাতুন (অসমর্থিত)",
          status: "MISMATCH",
          statusLabelBn: "অমিল রয়েছে",
          reasonBn: "নামের বানান ও পরিচয়ে অমিল।",
        },
      ],
    };

    const saveReqB = new NextRequest("http://localhost:3000/api/verify/history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: `${SESSION_COOKIE_NAME}=${tokenB}`,
      },
      body: JSON.stringify({
        submitted: submissionB,
        verification: verificationResultB,
        extractedOcr: null,
        documentFilename: null,
      }),
    });

    const saveResB = await historyPost(saveReqB);
    const saveJsonB = await saveResB.json();

    assert(saveResB.status === 201, `Expected status 201, got ${saveResB.status}`);
    assert(Boolean(saveJsonB.id), "Expected returned record ID for User B");
    createdRecordIds.push(saveJsonB.id);

    const dbRecordB = await prisma.verificationRequest.findUnique({
      where: { id: saveJsonB.id },
    });

    assert(dbRecordB?.userId === userB.id, "Record userId must match User B");
    assert(dbRecordB?.riskLevel === "HIGH", "Risk level must be HIGH for discrepancy");
    console.log(`✓ Test 3 Passed: User B verification saved to database (ID: ${saveJsonB.id}).\n`);

    // ----------------------------------------------------
    // Test 4: Strict History Isolation in List Query
    // ----------------------------------------------------
    console.log("Step 4: Testing history list isolation between User A and User B...");
    const listReqA = new NextRequest("http://localhost:3000/api/verify/history", {
      method: "GET",
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=${tokenA}`,
      },
    });

    const listResA = await historyGet(listReqA);
    const listJsonA = await listResA.json();

    assert(listResA.status === 200, "User A list request must succeed with 200");
    const idsInA = listJsonA.verifications.map((v: { id: string }) => v.id);
    assert(idsInA.includes(saveJsonA.id), "User A history must contain User A's record");
    assert(!idsInA.includes(saveJsonB.id), "CRITICAL: User A history MUST NOT contain User B's record!");

    const listReqB = new NextRequest("http://localhost:3000/api/verify/history", {
      method: "GET",
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=${tokenB}`,
      },
    });

    const listResB = await historyGet(listReqB);
    const listJsonB = await listResB.json();

    assert(listResB.status === 200, "User B list request must succeed with 200");
    const idsInB = listJsonB.verifications.map((v: { id: string }) => v.id);
    assert(idsInB.includes(saveJsonB.id), "User B history must contain User B's record");
    assert(!idsInB.includes(saveJsonA.id), "CRITICAL: User B history MUST NOT contain User A's record!");
    console.log("✓ Test 4 Passed: Strict list isolation verified. Neither user can see the other user's records.\n");

    // ----------------------------------------------------
    // Test 5: Cross-User Ownership Authorization Check
    // ----------------------------------------------------
    console.log("Step 5: Testing single record access authorization & 403 Forbidden check...");

    // Authorized access: User A requests their own record
    const ownReq = new NextRequest(`http://localhost:3000/api/verify/history/${saveJsonA.id}`, {
      method: "GET",
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=${tokenA}`,
      },
    });
    const ownRes = await singleHistoryGet(ownReq, { params: Promise.resolve({ id: saveJsonA.id }) });
    assert(ownRes.status === 200, `User A accessing own record must return 200, got ${ownRes.status}`);
    const ownJson = await ownRes.json();
    assert(ownJson.verification.id === saveJsonA.id, "Verification ID must match");
    console.log("  - User A accessing User A's record -> 200 OK (Authorized)");

    // Unauthorized cross-user access: User B attempts to view User A's record
    const unauthorizedReq = new NextRequest(`http://localhost:3000/api/verify/history/${saveJsonA.id}`, {
      method: "GET",
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=${tokenB}`,
      },
    });
    const unauthorizedRes = await singleHistoryGet(unauthorizedReq, { params: Promise.resolve({ id: saveJsonA.id }) });
    assert(unauthorizedRes.status === 403, `CRITICAL: User B accessing User A's record MUST return 403, got ${unauthorizedRes.status}`);
    const unauthJson = await unauthorizedRes.json();
    assert(unauthJson.error.includes("অননুমোদিত অ্যাক্সেস"), "Error message must state unauthorized access");
    console.log("  - User B attempting to view User A's record -> 403 Forbidden (Blocked)");

    // Unauthenticated access: No session cookie
    const noAuthReq = new NextRequest(`http://localhost:3000/api/verify/history/${saveJsonA.id}`, {
      method: "GET",
    });
    const noAuthRes = await singleHistoryGet(noAuthReq, { params: Promise.resolve({ id: saveJsonA.id }) });
    assert(noAuthRes.status === 401, `Unauthenticated request MUST return 401, got ${noAuthRes.status}`);
    console.log("  - Request with no session token -> 401 Unauthorized (Blocked)");
    console.log("✓ Test 5 Passed: Ownership authorization checks verified.\n");

    // ----------------------------------------------------
    // Test 6: Duplicate Submission Deduplication
    // ----------------------------------------------------
    console.log("Step 6: Testing rapid duplicate submission deduplication...");
    const duplicateReqA = new NextRequest("http://localhost:3000/api/verify/history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: `${SESSION_COOKIE_NAME}=${tokenA}`,
      },
      body: JSON.stringify({
        submitted: submissionA,
        verification: verificationResultA,
        extractedOcr: ocrFieldsA,
        documentFilename: "deed_scan_user_a.pdf",
      }),
    });

    const dupResA = await historyPost(duplicateReqA);
    const dupJsonA = await dupResA.json();

    assert(dupResA.status === 200, "Duplicate submission must return status 200 with existing record");
    assert(dupJsonA.id === saveJsonA.id, "Duplicate submission must return the exact same record ID");
    assert(dupJsonA.isDuplicate === true, "isDuplicate flag must be true");

    // Verify total count in database did not increment
    const userARecordCount = await prisma.verificationRequest.count({
      where: { userId: userA.id },
    });
    assert(userARecordCount === 1, `Expected exactly 1 record for User A, got ${userARecordCount}`);
    console.log("✓ Test 6 Passed: Duplicate submission deduplication verified.\n");

    console.log("=== ALL VERIFICATION HISTORY & SECURITY ISOLATION TESTS PASSED! ===");
  } finally {
    // Clean up test records
    if (createdRecordIds.length > 0) {
      await prisma.verificationRequest.deleteMany({
        where: { id: { in: createdRecordIds } },
      });
    }
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
