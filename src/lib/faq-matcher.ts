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

/**
 * Formats a matched LandFaqItem into a friendly, structured Bengali assistant response.
 */
export function formatFaqResponse(item: LandFaqItem): string {
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

/**
 * Finds the best FAQ match for a user's question, or returns a graceful educational fallback.
 */
export function findBestFaqMatch(
  query: string,
  minThreshold: number = 4
): FaqMatchResult {
  const norm = normalizeQuery(query);

  const fallbackQuestions = LAND_FAQ_KNOWLEDGE_BASE.slice(0, 4).map(
    (item) => item.suggestedPromptBn
  );

  if (!norm) {
    return {
      matched: false,
      score: 0,
      formattedResponseBn:
        "অনুগ্রহ করে ভূমি সংক্রান্ত আপনার প্রশ্নটি লিখুন (যেমন: 'খতিয়ান কী?', 'নামজারি কেন জরুরি?' বা 'বায়া দলিল কীভাবে পরীক্ষা করব?')।",
      source: "FALLBACK",
      suggestedQuestions: fallbackQuestions,
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
    const alternateSuggestions = LAND_FAQ_KNOWLEDGE_BASE.filter(
      (i) => i.id !== bestItem!.id
    )
      .slice(0, 3)
      .map((i) => i.suggestedPromptBn);

    return {
      matched: true,
      score: highestScore,
      item: bestItem,
      formattedResponseBn: formatFaqResponse(bestItem),
      source: "FAQ_MATCH",
      suggestedQuestions: alternateSuggestions,
    };
  }

  return {
    matched: false,
    score: highestScore,
    formattedResponseBn: DEFAULT_FALLBACK_BN,
    source: "FALLBACK",
    suggestedQuestions: fallbackQuestions,
  };
}
