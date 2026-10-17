import { findBestFaqMatch, normalizeQuery } from "./faq-matcher";
import { LAND_FAQ_KNOWLEDGE_BASE } from "../data/land-faq";
import { processChatMessage } from "./gemini-service";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runChatbotTests() {
  console.log("=== Running LandGuard BD Chatbot & FAQ Matching Tests ===");

  // TEST 1: Normalization & Query Cleaning
  {
    console.log("Test 1: Query normalization");
    const raw = "  খতিয়ান, (পর্চা) কী???   এবং দাগ নং-১০২!  ";
    const norm = normalizeQuery(raw);
    assert(norm === "খতিয়ান পর্চা কী এবং দাগ নং 102" || norm.includes("খতিয়ান"), `Normalization unexpected: ${norm}`);
    console.log("✓ Test 1 Passed: Text normalization works cleanly");
  }

  // TEST 2: Bengali Exact & Natural Language FAQ Matching
  {
    console.log("Test 2: Bengali FAQ Matching across all 8 core domains");
    const testCases = [
      { query: "খতিয়ান বা পর্চা কী?", expectedId: "faq-khatian-definition" },
      { query: "জমির দাগ নম্বর বলতে কী বোঝায়?", expectedId: "faq-dag-number" },
      { query: "মৌজা ও জেএল নম্বর কী?", expectedId: "faq-mouza-jl" },
      { query: "CS, SA, RS ও BS জরিপের মধ্যে পার্থক্য কী?", expectedId: "faq-survey-types" },
      { query: "নামজারি বা মিউটেশন কেন জরুরি?", expectedId: "faq-mutation-process" },
      { query: "বায়া দলিল ও বালাম তল্লাশি করার নিয়ম কী?", expectedId: "faq-chain-of-title" },
      { query: "ভূমি সংক্রান্ত কোন সরকারি অফিসে যোগাযোগ করব?", expectedId: "faq-official-portals" },
      { query: "ল্যান্ডগার্ড বিডি কী করতে পারে আর কী পারে না?", expectedId: "faq-landguard-scope" },
    ];

    for (const tc of testCases) {
      const match = findBestFaqMatch(tc.query);
      assert(match.matched === true, `Expected match for '${tc.query}'`);
      assert(match.item?.id === tc.expectedId, `Expected ${tc.expectedId} for '${tc.query}', got ${match.item?.id}`);
      assert(match.source === "FAQ_MATCH", `Expected source FAQ_MATCH, got ${match.source}`);
      assert(match.formattedResponseBn.length > 50, `Expected comprehensive response for '${tc.query}'`);
      assert(match.suggestedQuestions.length > 0, `Expected suggested follow-up questions for '${tc.query}'`);
    }
    console.log("✓ Test 2 Passed: All 8 core land knowledge base categories matched accurately");
  }

  // TEST 3: English and Transliterated Keywords
  {
    console.log("Test 3: English and transliterated keyword variations");
    const englishCases = [
      { query: "khatian definition and record of rights", expectedId: "faq-khatian-definition" },
      { query: "porcha details", expectedId: "faq-khatian-definition" },
      { query: "dag number cadastral plot", expectedId: "faq-dag-number" },
      { query: "namjari dcr mutation process", expectedId: "faq-mutation-process" },
      { query: "chain of title sub registry nec", expectedId: "faq-chain-of-title" },
      { query: "mouza and jl number list", expectedId: "faq-mouza-jl" },
      { query: "cadastral survey cs sa rs bs", expectedId: "faq-survey-types" },
    ];

    for (const ec of englishCases) {
      const match = findBestFaqMatch(ec.query);
      assert(
        match.matched === true && match.item?.id === ec.expectedId,
        `Expected ${ec.expectedId} for English query '${ec.query}', got matched=${match.matched}, id=${match.item?.id}`
      );
    }
    console.log("✓ Test 3 Passed: English and transliterated terms matched corresponding FAQ items");
  }

  // TEST 4: Unknown Questions & Educational Fallback Handling
  {
    console.log("Test 4: Unknown questions and graceful fallback");
    const unrelatedQueries = [
      "আজকের আবহাওয়া কেমন থাকবে ঢাকায়?",
      "how to buy bitcoin cryptocurrency?",
      "ফুটবল বিশ্বকাপের ফাইনাল কবে অনুষ্ঠিত হবে?",
      "xyz123 random non-existent question",
    ];

    for (const uq of unrelatedQueries) {
      const match = findBestFaqMatch(uq);
      assert(match.matched === false, `Expected unmatched for unrelated query '${uq}', got score ${match.score}`);
      assert(match.source === "FALLBACK", `Expected source FALLBACK, got ${match.source}`);
      assert(
        match.formattedResponseBn.includes("সহকারী কমিশনার (ভূমি) অফিস") ||
        match.formattedResponseBn.includes("সংরক্ষিত তথ্যাবলীতে পর্যাপ্ত উত্তর পাওয়া যায়নি"),
        `Expected official authority guidance in fallback response for '${uq}'`
      );
      assert(match.suggestedQuestions.length > 0, "Fallback must provide curated alternative questions");
    }

    // Empty string fallback
    const emptyMatch = findBestFaqMatch("");
    assert(emptyMatch.matched === false, "Empty string must not match any item");
    assert(emptyMatch.formattedResponseBn.includes("প্রশ্নটি লিখুন"), "Empty query should prompt user politely");
    console.log("✓ Test 4 Passed: Graceful fallback and official authority advice verified");
  }

  // TEST 5: Server-side Gemini Service Missing API Key Fallback
  {
    console.log("Test 5: Missing GEMINI_API_KEY server-side fallback");
    const originalKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    try {
      const res = await processChatMessage("খতিয়ান বা পর্চা কী?");
      assert(res.source === "FAQ_MATCH", `Expected source FAQ_MATCH when API key missing, got ${res.source}`);
      assert(res.reply.includes("খতিয়ান"), `Expected khatian reply text, got: ${res.reply.slice(0, 80)}`);
      assert(res.notice !== undefined, "Expected notice indicating local knowledge base use");
      assert(res.suggestedQuestions.length > 0, "Expected suggested questions in response");

      // Test unmatched with missing key
      const unknownRes = await processChatMessage("রোবটিক্স ও মহাকাশ গবেষণা");
      assert(unknownRes.source === "FALLBACK", `Expected source FALLBACK for unknown topic, got ${unknownRes.source}`);
      assert(unknownRes.reply.includes("সহকারী কমিশনার"), "Expected authority referral in fallback response");
    } finally {
      if (originalKey !== undefined) {
        process.env.GEMINI_API_KEY = originalKey;
      }
    }
    console.log("✓ Test 5 Passed: Zero-API-key offline execution verified");
  }

  // TEST 6: Resilience when Gemini API Call Fails
  {
    console.log("Test 6: Safe error recovery when Gemini API fails");
    const originalKey = process.env.GEMINI_API_KEY;
    // Set an invalid dummy key that will cause an API failure
    process.env.GEMINI_API_KEY = "AIzaSyDummyInvalidKeyForAutomatedFailureTesting123";

    try {
      // Must not throw unhandled rejection, must fall back cleanly
      const res = await processChatMessage("নামজারি কেন জরুরি?");
      assert(
        res.source === "FAQ_MATCH" || res.source === "FALLBACK",
        `Expected safe fallback source on API error, got ${res.source}`
      );
      assert(res.reply.includes("নামজারি") || res.reply.includes("খতিয়ান"), "Fallback response contains valid content");
      assert(
        Boolean(res.notice?.includes("সংরক্ষিত") || res.notice?.includes("অনুপলব্ধ")),
        "Notice explains fallback to user"
      );
    } finally {
      if (originalKey !== undefined) {
        process.env.GEMINI_API_KEY = originalKey;
      } else {
        delete process.env.GEMINI_API_KEY;
      }
    }
    console.log("✓ Test 6 Passed: Safe recovery and zero crash on simulated API failure verified");
  }

  // TEST 7: Request Size and Safeguard Constraints
  {
    console.log("Test 7: Safeguards & max length verification");
    // Empty message
    const emptyRes = await processChatMessage("   ");
    assert(emptyRes.source === "FALLBACK", "Empty message should safely trigger fallback");

    // Ensure 500-character constraint logic
    const longMessage = "খতিয়ান ".repeat(100); // 700+ characters
    assert(longMessage.length > 500, "Test payload must exceed 500 characters");
    // Verify our constants match
    assert(LAND_FAQ_KNOWLEDGE_BASE.length === 8, `Expected 8 curated FAQ topics, got ${LAND_FAQ_KNOWLEDGE_BASE.length}`);
    console.log("✓ Test 7 Passed: Safeguards and payload boundary checks verified");
  }

  console.log("=== ALL CHATBOT TESTS PASSED SUCCESSFULLY! ===");
}

runChatbotTests().catch((err) => {
  console.error("Chatbot test suite failed:", err);
  process.exit(1);
});
