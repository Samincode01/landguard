/**
 * Chat Support API Route
 * POST /api/chat
 * LandGuard BD — Civic Tech for Land Due Diligence (Track P5)
 *
 * Provides safe conversational endpoints for land record due diligence.
 * Enforces server-side secret isolation, rate/size limits, and zero persistence.
 */

import { NextRequest, NextResponse } from "next/server";
import { processChatMessage } from "@/lib/gemini-service";

const MAX_MESSAGE_LENGTH = 500;

export async function POST(request: NextRequest) {
  try {
    // 1. Content-Type check
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "অনুরোধের ফরম্যাট অবৈধ। JSON ফরম্যাটে ডেটা প্রেরণ করুন।" },
        { status: 400 }
      );
    }

    // 2. Parse request body safely
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "অনুরোধের JSON পার্স করা সম্ভব হয়নি।" },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "অনুরোধের বডি সঠিক নয়।" },
        { status: 400 }
      );
    }

    const { message, language, history } = body as {
      message?: unknown;
      language?: unknown;
      history?: unknown;
    };
    const preferredLang = language === "en" ? "en" : "bn";

    // 3. Validate message type and content
    if (typeof message !== "string") {
      return NextResponse.json(
        {
          error:
            preferredLang === "en"
              ? "Invalid message format. Text message required."
              : "বার্তার ধরন অবশ্যই টেক্সট হতে হবে।",
        },
        { status: 400 }
      );
    }

    const trimmed = message.trim();

    if (!trimmed) {
      return NextResponse.json(
        {
          error:
            preferredLang === "en"
              ? "Message cannot be empty. Please enter your question."
              : "বার্তা খালি হতে পারে না। অনুগ্রহ করে আপনার প্রশ্নটি লিখুন।",
        },
        { status: 400 }
      );
    }

    // 4. Message length safeguard
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        {
          error:
            preferredLang === "en"
              ? `Message is too long. Please summarize your query within ${MAX_MESSAGE_LENGTH} characters.`
              : `বার্তার দৈর্ঘ্য অতিরিক্ত বড়। সর্বোচ্চ ${MAX_MESSAGE_LENGTH} অক্ষরের মধ্যে আপনার প্রশ্নটি সংক্ষেপ করুন।`,
        },
        { status: 400 }
      );
    }

    // 5. Sanitize optional history (max 8 turns, valid text)
    let sanitizedHistory: Array<{ role: "user" | "model"; text: string }> | undefined;
    if (Array.isArray(history)) {
      sanitizedHistory = history
        .filter(
          (item): item is { role: "user" | "model"; text: string } =>
            Boolean(
              item &&
              typeof item === "object" &&
              (item.role === "user" || item.role === "model") &&
              typeof item.text === "string" &&
              item.text.trim().length > 0 &&
              item.text.length <= 1000
            )
        )
        .slice(-8);
    }

    // 6. Process message through Bhumi Sathi / Gemini / FAQ fallback service
    const result = await processChatMessage(trimmed, preferredLang, sanitizedHistory);

    return NextResponse.json(
      {
        reply: result.reply,
        source: result.source,
        suggestedQuestions: result.suggestedQuestions,
        notice: result.notice,
        isLive: result.isLive ?? (result.source === "GEMINI_AI"),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Internal server error";
    console.error("[Bhumi Sathi API Error]", errorMsg);

    return NextResponse.json(
      {
        error: "সার্ভারে একটি সাময়িক সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর পুনরায় চেষ্টা করুন। (A temporary server error occurred. Please try again shortly.)",
      },
      { status: 500 }
    );
  }
}
