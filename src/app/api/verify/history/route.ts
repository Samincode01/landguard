/**
 * Verification History API Route
 * POST /api/verify/history — Saves a successfully completed land verification
 * GET /api/verify/history  — Lists the authenticated user's verification history (newest first)
 *
 * Security:
 * - Requires a valid, cryptographically verified session token.
 * - UserId is derived exclusively from the verified session payload, never from the request body.
 * - Stores no uploaded file binaries or raw document contents.
 */

import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    if (!sessionCookie?.value) {
      return NextResponse.json(
        { error: "অননুমোদিত অনুরোধ। অনুগ্রহ করে লগইন করুন।" },
        { status: 401 }
      );
    }

    const payload = await verifySessionToken(sessionCookie.value);
    if (!payload?.userId) {
      return NextResponse.json(
        { error: "সেশনটি অবৈধ বা মেয়াদোত্তীর্ণ।" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { submitted, verification, extractedOcr, documentFilename, riskSummary } = body;

    // Validate that verification engine result completed successfully
    if (!verification || !verification.category || !submitted) {
      return NextResponse.json(
        { error: "অসম্পূর্ণ বা অবৈধ যাচাইকরণ ডেটা।" },
        { status: 400 }
      );
    }

    const validCategories = [
      "NO_DISCREPANCIES",
      "DIFFERENCES_REQUIRE_REVIEW",
      "INSUFFICIENT_INFO",
    ];

    if (!validCategories.includes(verification.category)) {
      return NextResponse.json(
        { error: "অবৈধ যাচাইকরণ ফলাফল ক্যাটাগরি।" },
        { status: 400 }
      );
    }

    // Map verification category to risk level
    const riskLevel =
      verification.category === "NO_DISCREPANCIES"
        ? "LOW"
        : verification.category === "DIFFERENCES_REQUIRE_REVIEW"
        ? "HIGH"
        : "MEDIUM";

    // Clean client-provided filename only (strip path traversal, enforce no binary)
    const cleanFilename = documentFilename
      ? String(documentFilename).replace(/^.*[\\/]/, "").slice(0, 150)
      : null;

    // Sanitize OCR fields: keep only string values and confidence metrics, no raw content
    const sanitizedOcr = extractedOcr
      ? Object.entries(extractedOcr).reduce<Record<string, { value: string | null; confidence: string }>>(
          (acc, [key, field]: [string, unknown]) => {
            if (field && typeof field === "object") {
              const f = field as { value?: unknown; confidence?: unknown };
              acc[key] = {
                value: f.value !== undefined && f.value !== null ? String(f.value) : null,
                confidence: typeof f.confidence === "string" ? f.confidence : "LOW",
              };
            }
            return acc;
          },
          {}
        )
      : null;

    // Deduplication check: avoid duplicate records caused by rapid retries or double clicks
    // Check if an identical record was saved by the same user within the last 60 seconds
    const sixtySecondsAgo = new Date(Date.now() - 60 * 1000);
    const existingRecent = await prisma.verificationRequest.findFirst({
      where: {
        userId: payload.userId,
        status: "COMPLETED",
        createdAt: { gte: sixtySecondsAgo },
      },
      orderBy: { createdAt: "desc" },
    });

    if (existingRecent?.extractedData) {
      try {
        const parsed = JSON.parse(existingRecent.extractedData);
        if (
          parsed.submitted?.dagNumber === submitted.dagNumber &&
          parsed.submitted?.khatianNumber === submitted.khatianNumber &&
          parsed.submitted?.mouza === submitted.mouza &&
          parsed.submitted?.ownerName === submitted.ownerName &&
          parsed.submitted?.parcelId === submitted.parcelId
        ) {
          // Identical verification already persisted recently — return existing record
          return NextResponse.json(
            {
              success: true,
              id: existingRecent.id,
              createdAt: existingRecent.createdAt,
              isDuplicate: true,
            },
            { status: 200 }
          );
        }
      } catch {
        // Continue creating if parse fails
      }
    }

    // Package safe structured verification JSON
    const extractedDataPayload = {
      submitted: {
        parcelId: submitted.parcelId || "",
        ownerName: submitted.ownerName || "",
        district: submitted.district || "",
        upazila: submitted.upazila || "",
        mouza: submitted.mouza || "",
        khatianNumber: submitted.khatianNumber || "",
        khatianType: submitted.khatianType || "",
        dagNumber: submitted.dagNumber || "",
        recordedArea: submitted.recordedArea || "",
        areaUnit: submitted.areaUnit || "শতক",
      },
      verification: {
        category: verification.category,
        categoryLabelBn: verification.categoryLabelBn || "",
        summaryBn: verification.summaryBn || "",
        advisoryBn: verification.advisoryBn || "",
        matchCount: Number(verification.matchCount) || 0,
        mismatchCount: Number(verification.mismatchCount) || 0,
        missingCount: Number(verification.missingCount) || 0,
        discrepancyReasons: Array.isArray(verification.discrepancyReasons)
          ? verification.discrepancyReasons
          : [],
        fieldResults: Array.isArray(verification.fieldResults)
          ? verification.fieldResults
          : [],
      },
      extractedOcr: sanitizedOcr,
      riskSummary: riskSummary || null,
    };

    const newRecord = await prisma.verificationRequest.create({
      data: {
        userId: payload.userId,
        status: "COMPLETED",
        riskLevel,
        riskScore: verification.category === "NO_DISCREPANCIES" ? 15 : verification.category === "DIFFERENCES_REQUIRE_REVIEW" ? 85 : 45,
        documentFilename: cleanFilename,
        notes: verification.advisoryBn || verification.summaryBn || null,
        extractedData: JSON.stringify(extractedDataPayload),
      },
    });

    return NextResponse.json(
      {
        success: true,
        id: newRecord.id,
        createdAt: newRecord.createdAt,
        isDuplicate: false,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Verification history save error:", error);
    return NextResponse.json(
      { error: "যাচাইকরণ ফলাফল সংরক্ষণ করা যায়নি।" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    if (!sessionCookie?.value) {
      return NextResponse.json(
        { error: "অননুমোদিত অনুরোধ। অনুগ্রহ করে লগইন করুন।" },
        { status: 401 }
      );
    }

    const payload = await verifySessionToken(sessionCookie.value);
    if (!payload?.userId) {
      return NextResponse.json(
        { error: "সেশনটি অবৈধ বা মেয়াদোত্তীর্ণ।" },
        { status: 401 }
      );
    }

    // Strict ownership filter: only retrieve records belonging to the authenticated user
    const records = await prisma.verificationRequest.findMany({
      where: {
        userId: payload.userId,
        status: "COMPLETED",
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        createdAt: true,
        status: true,
        riskLevel: true,
        riskScore: true,
        documentFilename: true,
        notes: true,
        extractedData: true,
      },
    });

    interface StoredHistoryPayload {
      submitted?: Record<string, string>;
      verification?: {
        category?: "NO_DISCREPANCIES" | "DIFFERENCES_REQUIRE_REVIEW" | "INSUFFICIENT_INFO";
        categoryLabelBn?: string;
        summaryBn?: string;
        matchCount?: number;
        mismatchCount?: number;
        missingCount?: number;
      };
      extractedOcr?: Record<string, unknown>;
    }

    // Format records for client consumption
    const formatted = records.map((record) => {
      let details: StoredHistoryPayload | null = null;
      try {
        if (record.extractedData) {
          details = JSON.parse(record.extractedData) as StoredHistoryPayload;
        }
      } catch {
        details = null;
      }

      return {
        id: record.id,
        createdAt: record.createdAt,
        status: record.status,
        riskLevel: record.riskLevel,
        riskScore: record.riskScore,
        documentFilename: record.documentFilename,
        hasOcr: Boolean(details?.extractedOcr && Object.keys(details.extractedOcr).length > 0),
        landDetails: details?.submitted || null,
        category: details?.verification?.category || "INSUFFICIENT_INFO",
        categoryLabelBn: details?.verification?.categoryLabelBn || "",
        summaryBn: details?.verification?.summaryBn || "",
        matchCount: details?.verification?.matchCount ?? 0,
        mismatchCount: details?.verification?.mismatchCount ?? 0,
        missingCount: details?.verification?.missingCount ?? 0,
      };
    });

    return NextResponse.json(
      { verifications: formatted },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Verification history fetch error:", error);
    return NextResponse.json(
      { error: "যাচাইকরণ ইতিহাস লোড করা যায়নি।" },
      { status: 500 }
    );
  }
}
