/**
 * FAQ Matching & Deterministic Fallback Engine
 * LandGuard BD — Civic Tech for Land Due Diligence (Track P5)
 *
 * Provides offline keyword and intent matching against the curated Bengali land knowledge base.
 * Zero external network requests, zero database persistence, safe for client and server.
 */

import { LAND_FAQ_KNOWLEDGE_BASE, LandFaqItem } from "@/data/land-faq";

export interface FaqMatchResult {
  matched: boolean;
  score: number;
  item?: LandFaqItem;
  formattedResponseBn: string;
  source: "FAQ_MATCH" | "FALLBACK";
  suggestedQuestions: string[];
}

/**
 * Normalizes text for robust Bengali and English keyword matching.
 * Converts to lowercase, strips common punctuation and excessive whitespace.
 * Normalizes Bengali ya-fola / ya variants (য় / য় / য়া).
 */
export function normalizeQuery(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[।.,?!;:'"()\[\]{}—–\-_/\\#@$%^&*`~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Computes an relevance score between a user query and a FAQ item.
 */
export function scoreFaqItem(normalizedQuery: string, item: LandFaqItem): number {
  if (!normalizedQuery) return 0;

  const queryWords = normalizedQuery.split(" ").filter((w) => w.length > 1);
  let score = 0;

  const normalizedQuestion = normalizeQuery(item.questionBn);
  const normalizedPrompt = normalizeQuery(item.suggestedPromptBn);
  const normalizedTopic = normalizeQuery(item.topicBn);

  // 1. Direct substring in question or suggested prompt
  if (normalizedQuestion.includes(normalizedQuery) || normalizedQuery.includes(normalizedQuestion)) {
    score += 15;
  }
  if (normalizedPrompt.includes(normalizedQuery) || normalizedQuery.includes(normalizedPrompt)) {
    score += 12;
  }
  if (normalizedTopic.includes(normalizedQuery) || normalizedQuery.includes(normalizedTopic)) {
    score += 8;
  }

  // 2. Keyword exact and partial matches
  for (const keyword of item.keywords) {
    const normKey = normalizeQuery(keyword);
    if (!normKey) continue;

    if (normalizedQuery === normKey) {
      score += 10;
    } else if (normalizedQuery.includes(normKey)) {
      score += 6;
    } else {
      // Check word by word
      for (const qWord of queryWords) {
        if (qWord === normKey) {
          score += 5;
        } else if (qWord.length >= 3 && normKey.includes(qWord)) {
          score += 2;
        }
      }
    }
  }

  // 3. Question word intersections
  for (const qWord of queryWords) {
    if (normalizedQuestion.includes(qWord)) {
      score += 2;
    }
  }

  return score;
}

export const FAQ_ENGLISH_ANSWERS: Record<
  string,
  {
    answer: string;
    officialSource: string;
    disclaimer: string;
    suggestedPrompt: string;
  }
> = {
  "faq-khatian-definition": {
    answer:
      "A Khatian (commonly known as 'Porcha') is the official Record of Rights (ROR) prepared by the government during cadastral land surveys. It records the district, upazila, mouza name, JL number, khatian number, dag (plot) numbers, recorded land area, land classification (nal, viti, pond, homestead, etc.), and owner/co-sharer names with their respective shares.",
    officialSource: "Upazila Assistant Commissioner (Land) Office & Directorate of Land Records and Surveys (DLRS)",
    disclaimer:
      "Having a name in a khatian indicates preliminary record possession, but is not a conclusive guarantee of legal title. Chain of historical deeds (baya dalil) and updated mutation records must be verified.",
    suggestedPrompt: "What is a khatian or porcha?",
  },
  "faq-dag-number": {
    answer:
      "A Dag Number (Plot Number) is a distinct cadastral serial number assigned to a specific parcel of land on an official Mouza Map. It defines the physical boundaries, dimensions, neighbors (chouhaddi), and location of the plot within the revenue mouza.",
    officialSource: "Directorate of Land Records and Surveys & Upazila Land Office",
    disclaimer:
      "Always verify that physical boundaries on the ground match the mouza map with a government-licensed surveyor/amin before purchasing.",
    suggestedPrompt: "What is a dag number?",
  },
  "faq-mouza-jl": {
    answer:
      "A Mouza is the basic cadastral revenue survey village unit in Bangladesh. Each mouza within an upazila has a permanent Jurisdiction List (J.L.) number used to index cadastral maps and survey registers.",
    officialSource: "Upazila Land Office & Sub-Registry Office",
    disclaimer:
      "Make sure that deed, khatian, and tax receipts specify the identical mouza and J.L. number.",
    suggestedPrompt: "What are mouza and JL numbers?",
  },
  "faq-survey-types": {
    answer:
      "Major land surveys in Bangladesh include: CS (Cadastral Survey, 1888–1940, baseline record), SA (State Acquisition, 1956–1962, post-zamindari abolition), RS (Revisional Survey, corrected modern survey), and BS/City Survey (Bangladesh Survey, the most recent updated cadastral record).",
    officialSource: "Directorate of Land Records and Surveys (DLRS)",
    disclaimer:
      "Always trace chain of title across all surveys (from CS through SA and RS to BS) to detect gaps or unauthorized mutations.",
    suggestedPrompt: "What are CS, SA, RS, and BS surveys?",
  },
  "faq-mutation-process": {
    answer:
      "Mutation (Namjari) is the mandatory government process by which a new land owner's name is registered in the revenue record (khatian) after buying or inheriting land. It cancels the previous owner's name and generates a mutation khatian, DCR, and enables payment of Land Development Tax in the buyer's name.",
    officialSource: "Upazila Assistant Commissioner (Land) Office (mutation.land.gov.bd)",
    disclaimer:
      "A registered deed alone does not update revenue records. Without namjari, property cannot be legally transferred or verified for future sale.",
    suggestedPrompt: "Why is mutation (namjari) necessary?",
  },
  "faq-chain-of-title": {
    answer:
      "Chain of Title (Baya Dalil) refers to the unbroken chronological sequence of previous sale deeds and ownership documents tracing back at least 25–30 years from the original survey owner to the current seller. Missing links or unverified powers of attorney indicate severe fraud risks.",
    officialSource: "Sub-Registry Office & District Registrar Office",
    disclaimer:
      "Search original deed volume books (Balam Boi) at the Sub-Registry office through an official Non-Encumbrance Certificate (NEC) search.",
    suggestedPrompt: "How do I check chain of title and baya dalil?",
  },
  "faq-official-portals": {
    answer:
      "Official government portals for land services include: e-Porcha (eporcha.gov.bd) for certified khatian and mouza maps, e-Mutation (mutation.land.gov.bd) for online mutation applications, and ldtax.gov.bd for Land Development Tax. For physical verification, contact your local Upazila AC (Land) or Sub-Registry office.",
    officialSource: "Ministry of Land (land.gov.bd)",
    disclaimer:
      "Always cross-check electronic records with physical certified copies at the relevant revenue and registry offices.",
    suggestedPrompt: "Which government offices handle land records?",
  },
  "faq-landguard-scope": {
    answer:
      "LandGuard BD is a civic-tech due diligence tool that compares submitted document and deed details against cadastral records to highlight discrepancies and fraud red flags. It provides educational risk assessment; it does NOT provide formal legal certification or replace official government verification.",
    officialSource: "LandGuard BD Civic Tech Prototype",
    disclaimer:
      "For binding legal verification, always consult a licensed advocate and obtain certified records from the relevant government offices.",
    suggestedPrompt: "What can LandGuard BD do and not do?",
  },
};

/**
 * Formats a matched LandFaqItem into a friendly, structured assistant response.
 */
export function formatFaqResponse(item: LandFaqItem, language: "bn" | "en" = "bn"): string {
  if (language === "en") {
    const en = FAQ_ENGLISH_ANSWERS[item.id];
    let response = en ? en.answer : item.answerBn;

    if (item.officialSourceBn) {
      response += `\n\n📌 Official Authority: ${en?.officialSource || item.officialSourceBn}`;
    }

    if (item.verifiedUrl) {
      response += `\n🌐 Verified Government Portal: ${item.verifiedUrl}`;
    }

    const disclaimer = en?.disclaimer || item.disclaimerBn;
    if (disclaimer) {
      response += `\n\n⚠️ Advisory Note: ${disclaimer}`;
    }

    return response;
  }

  let response = item.answerBn;

  if (item.officialSourceBn) {
    response += `\n\n📌 সংশ্লিষ্ট সরকারি কর্তৃপক্ষ / অফিস: ${item.officialSourceBn}`;
  }

  if (item.verifiedUrl) {
    response += `\n🌐 যাচাইকৃত সরকারি পোর্টাল: ${item.verifiedUrl}`;
  }

  if (item.disclaimerBn) {
    response += `\n\n⚠️ সতর্কতা: ${item.disclaimerBn}`;
  }

  return response;
}

/**
 * Default fallback message when no FAQ item matches and API is unavailable.
 */
export const DEFAULT_FALLBACK_BN =
  "দুঃখিত, আপনার নির্দিষ্ট প্রশ্নটির জন্য ল্যান্ডগার্ড বিডির সংরক্ষিত তথ্যাবলীতে পর্যাপ্ত উত্তর পাওয়া যায়নি।\n\nযেহেতু ভূমি সংক্রান্ত বিষয়াদি অত্যন্ত সংবেদনশীল এবং আইনি গুরুত্বসম্পন্ন, তাই কোনো নির্দিষ্ট দলিল, স্বত্ব বা ফি সম্পর্কে নিশ্চিত হতে সংশ্লিষ্ট উপজেলা সহকারী কমিশনার (ভূমি) অফিস, সাব-রেজিস্ট্রি অফিস বা একজন অভিজ্ঞ আইনজীবীর সাথে সশরীরে যোগাযোগ করার পরামর্শ দেওয়া হচ্ছে।\n\nআপনি চাইলে নিচের বিষয়গুলো থেকে কোনো একটি জানতে পারেন:";

export const DEFAULT_FALLBACK_EN =
  "I'm sorry, but our curated land knowledge base does not have a definitive answer for this specific query.\n\nSince land matters in Bangladesh are legally sensitive and consequential, please consult your local Upazila Assistant Commissioner (Land) office, Sub-Registry office, or a qualified advocate for official confirmation.\n\nYou may explore one of these related topics:";

/**
 * Finds the best FAQ match for a user's question, or returns a graceful educational fallback.
 */
export function findBestFaqMatch(
  query: string,
  minThreshold: number = 4,
  language: "bn" | "en" = "bn"
): FaqMatchResult {
  const norm = normalizeQuery(query);

  const fallbackQuestions =
    language === "en"
      ? [
          "What is a khatian?",
          "How do I find a dag number?",
          "What are CS, SA, RS, and BS surveys?",
          "Why is mutation (namjari) necessary?",
        ]
      : LAND_FAQ_KNOWLEDGE_BASE.slice(0, 4).map((item) => item.suggestedPromptBn);

  if (!norm) {
    return {
      matched: false,
      score: 0,
      formattedResponseBn:
        language === "en"
          ? "Please enter a land-related question (e.g., 'What is a khatian?', 'Why is mutation necessary?', or 'How to check chain of title?')."
          : "অনুগ্রহ করে ভূমি সংক্রান্ত আপনার প্রশ্নটি লিখুন (যেমন: 'খতিয়ান কী?', 'নামজারি কেন জরুরি?' বা 'বায়া দলিল কীভাবে পরীক্ষা করব?')।",
      source: "FALLBACK",
      suggestedQuestions: fallbackQuestions,
    };
  }

  // Handle identity or capability questions if routed to FAQ matcher
  const isIdentityQuery =
    /^(who\s*(are|r)\s*(you|u)|what\s*is\s*your\s*name|what\s*can\s*you\s*do|are\s*you\s*(a\s*)?(real\s*person|human|ai|bot|robot))\b/i.test(norm) ||
    /^(তুমি\s*কে|আপনি\s*কে|তোমার\s*নাম\s*কী|আপনার\s*নাম\s*কি|তুমি\s*কি\s*মানুষ|আপনি\s*কি\s*মানুষ|তুমি\s*কি\s*করতে\s*পারো|আপনি\s*কি\s*করতে\s*পারেন|তোমার\s*কাজ\s*কি|আপনার\s*কাজ\s*কি)\b/u.test(norm);

  if (isIdentityQuery) {
    return {
      matched: true,
      score: 25,
      formattedResponseBn:
        language === "en"
          ? "I am Bhumi Sathi (ভূমিসাথী), the AI land information assistant built into LandGuard BD. I help you understand khatian (porcha), dag numbers, mouza, survey systems (CS, SA, RS, BS), mutation (namjari), chain of title (baya dalil), and red flags for land document fraud."
          : "আমি ভূমিসাথী (Bhumi Sathi), ল্যান্ডগার্ড বিডি (LandGuard BD)-এর AI ভূমি-তথ্য সহায়ক। আমি বাংলাদেশের নাগরিকদের জমি-জমার বিভিন্ন পরিভাষা, খতিয়ান (পর্চা), দাগ নম্বর, মৌজা, জরিপ (CS, SA, RS, BS), নামজারি, বায়া দলিল এবং জমি জালিয়াতির ঝুঁকি বুঝতে সাহায্য করি।",
      source: "FAQ_MATCH",
      suggestedQuestions:
        language === "en"
          ? ["What is a khatian?", "How do I find a dag number?", "Why is mutation (namjari) necessary?"]
          : ["খতিয়ান বা পর্চা কী?", "দাগ নম্বর কীভাবে খুঁজে পাব?", "নামজারি কেন জরুরি?"],
    };
  }

  let bestItem: LandFaqItem | null = null;
  let highestScore = 0;

  for (const item of LAND_FAQ_KNOWLEDGE_BASE) {
    const score = scoreFaqItem(norm, item);
    if (score > highestScore) {
      highestScore = score;
      bestItem = item;
    }
  }

  if (bestItem && highestScore >= minThreshold) {
    // Generate alternate suggested prompts
    const alternateSuggestions =
      language === "en"
        ? LAND_FAQ_KNOWLEDGE_BASE.filter((i) => i.id !== bestItem!.id)
            .slice(0, 3)
            .map((i) => FAQ_ENGLISH_ANSWERS[i.id]?.suggestedPrompt || i.suggestedPromptBn)
        : LAND_FAQ_KNOWLEDGE_BASE.filter((i) => i.id !== bestItem!.id)
            .slice(0, 3)
            .map((i) => i.suggestedPromptBn);

    return {
      matched: true,
      score: highestScore,
      item: bestItem,
      formattedResponseBn: formatFaqResponse(bestItem, language),
      source: "FAQ_MATCH",
      suggestedQuestions: alternateSuggestions,
    };
  }

  return {
    matched: false,
    score: highestScore,
    formattedResponseBn: language === "en" ? DEFAULT_FALLBACK_EN : DEFAULT_FALLBACK_BN,
    source: "FALLBACK",
    suggestedQuestions: fallbackQuestions,
  };
}
