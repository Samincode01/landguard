/**
 * Gemini API Integration & Resilient Fallback Service
 * LandGuard BD — Civic Tech for Land Due Diligence (Track P5)
 *
 * Handles AI-powered Bengali conversational assistance using Gemini Flash,
 * backed by the curated offline FAQ knowledge base as ground truth.
 *
 * Privacy & Security:
 * - Server-only execution.
 * - Reads GEMINI_API_KEY only on server. Never uses NEXT_PUBLIC_ prefixes.
 * - Zero database writes.
 * - Zero user document or parcel data sent to external APIs.
 */

import { GoogleGenAI } from "@google/genai";
import { LAND_FAQ_KNOWLEDGE_BASE } from "@/data/land-faq";
import { findBestFaqMatch, FaqMatchResult } from "./faq-matcher";

export interface ChatServiceResponse {
  reply: string;
  source: "GEMINI_AI" | "FAQ_MATCH" | "FALLBACK";
  suggestedQuestions: string[];
  notice?: string;
}

/**
 * Compiles curated FAQ entries into a concise, factual context block for the model.
 */
function buildFaqKnowledgeContext(): string {
  return LAND_FAQ_KNOWLEDGE_BASE.map(
    (item, index) =>
      `[বিষয় ${index + 1}: ${item.topicBn}]\nপ্রশ্ন: ${item.questionBn}\nতথ্য: ${item.answerBn}\nকর্তৃপক্ষ: ${item.officialSourceBn}${
        item.verifiedUrl ? ` (পোর্টাল: ${item.verifiedUrl})` : ""
      }\nআইনগত সতর্কতা: ${item.disclaimerBn}`
  ).join("\n\n");
}

const SYSTEM_INSTRUCTION_BN = `
আপনি "ল্যান্ডগার্ড বিডি" (LandGuard BD)-এর বাংলা ভাষাভিত্তিক জমি সহায়তা সহকারী (Land Assistance AI Assistant)।
আপনি বাংলাদেশের সাধারণ নাগরিকদের জমি-জমা সংক্রান্ত মৌলিক পরিভাষা, দলিল তল্লাশি, খতিয়ান এবং সরকারি প্রক্রিয়া বুঝতে সহায়তা করেন।

তথ্যভাণ্ডার (শুধুমাত্র এই তথ্যের ওপর ভিত্তি করে উত্তর দিন):
${buildFaqKnowledgeContext()}

মৌলিক আচরণবিধি ও নির্দেশনাবলী:
১. সর্বদা শুদ্ধ, স্বাভাবিক ও সহযোগিতাপূর্ণ বাংলায় (বাংলা হরফে) উত্তর দিন।
২. আপনার উত্তর সংক্ষিপ্ত, বুলেট পয়েন্ট আকারে স্পষ্ট ও সহজবোধ্য রাখুন।
৩. শুধুমাত্র উপরে প্রদত্ত তথ্যভাণ্ডারের সত্য তথ্যের ভিত্তিতে খতিয়ান, দাগ, মৌজা, সিএস/এসএ/আরএস/বিএস জরিপ, নামজারি ও বায়া দলিলের ব্যাখ্যা দিন।
৪. কোনো মনগড়া সরকারি ফি, সুনির্দিষ্ট আইনগত সময়সীমা কিংবা অপ্রমাণিত নিয়ম আবিষ্কার করবেন না।
৫. স্পষ্টভাবে মনে করিয়ে দিন যে আপনার বক্তব্য সাধারণ নাগরিক সচেতনতার অংশ, কোনো আনুষ্ঠানিক আইনি মতামত (Legal Opinion) কিংবা স্বত্ব নিশ্চয়তা (Title Guarantee) নয়।
৬. যদি ব্যবহারকারীর প্রশ্নের উত্তর আপনার তথ্যভাণ্ডারে না থাকে বা নিশ্চিত হওয়া না যায়, তবে বিনীতভাবে সীমাবদ্ধতা স্বীকার করুন এবং সংশ্লিষ্ট উপজেলা সহকারী কমিশনার (ভূমি) অফিস, সাব-রেজিস্ট্রি অফিস বা বিজ্ঞ আইনজীবীর পরামর্শ নেওয়ার সুস্পষ্ট উপদেশ দিন।
৭. কোনো পক্ষকে প্রতারক বা অপরাধী হিসেবে সাব্যস্ত করবেন না।
`.trim();

/**
 * Handles chat query processing with Gemini API and guaranteed fallback.
 */
export async function processChatMessage(
  message: string
): Promise<ChatServiceResponse> {
  const trimmed = message.trim();

  // Validate length
  if (!trimmed) {
    const fallback = findBestFaqMatch("");
    return {
      reply: fallback.formattedResponseBn,
      source: "FALLBACK",
      suggestedQuestions: fallback.suggestedQuestions,
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // If no API key is configured, immediately use offline curated FAQ engine
  if (!apiKey || apiKey.trim() === "") {
    const faqResult: FaqMatchResult = findBestFaqMatch(trimmed);
    return {
      reply: faqResult.formattedResponseBn,
      source: faqResult.source,
      suggestedQuestions: faqResult.suggestedQuestions,
      notice: "সংরক্ষিত প্রশ্নোত্তর ভাণ্ডার থেকে উত্তর প্রদান করা হয়েছে।",
    };
  }

  // Attempt Gemini API request with curated context and timeout
  try {
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    // Call generateContent with timeout protection (8 seconds)
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Gemini API request timed out after 8000ms")), 8000)
    );

    const apiPromise = ai.models.generateContent({
      model: modelName,
      contents: trimmed,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_BN,
        temperature: 0.2, // Low temperature for high factual alignment
        maxOutputTokens: 800,
      },
    });

    const response = await Promise.race([apiPromise, timeoutPromise]);
    const responseText = response.text?.trim();

    if (!responseText) {
      throw new Error("Received empty text response from Gemini API");
    }

    // Curate relevant suggested questions
    const suggestedQuestions = LAND_FAQ_KNOWLEDGE_BASE.slice(0, 3).map(
      (item) => item.suggestedPromptBn
    );

    return {
      reply: responseText,
      source: "GEMINI_AI",
      suggestedQuestions,
    };
  } catch (error: unknown) {
    // Graceful error logging without exposing secrets or credentials
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.warn(`[LandGuard Chatbot] Gemini API unavailable (${errorMsg}). Falling back to curated FAQ.`);

    // Fall back seamlessly to curated offline FAQ
    const fallbackResult = findBestFaqMatch(trimmed);
    return {
      reply: fallbackResult.formattedResponseBn,
      source: fallbackResult.source,
      suggestedQuestions: fallbackResult.suggestedQuestions,
      notice: "এআই সেবা সাময়িকভাবে অনুপলব্ধ থাকায় সংরক্ষিত প্রশ্নোত্তর থেকে উত্তর প্রদান করা হয়েছে।",
    };
  }
}
