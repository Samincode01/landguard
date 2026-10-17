/**
 * Single Verification History Record API Route
 * GET /api/verify/history/[id]
 *
 * Security:
 * - Enforces server-verified session cookie.
 * - Strictly verifies ownership: `record.userId === session.userId`.
 * - Cross-user access returns 403 Forbidden.
 */

import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { error: "রেকর্ড আইডি প্রদান করা হয়নি।" },
        { status: 400 }
      );
    }

    const record = await prisma.verificationRequest.findUnique({
      where: { id },
    });

    if (!record) {
      return NextResponse.json(
        { error: "যাচাইকরণ রেকর্ডটি খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    // Security ownership check: verify record belongs to the requesting user
    if (record.userId !== payload.userId) {
      return NextResponse.json(
        { error: "অননুমোদিত অ্যাক্সেস। এই যাচাইকরণ রেকর্ডের মালিকানা আপনার নয়।" },
        { status: 403 }
      );
    }

    let parsedData = null;
    try {
      if (record.extractedData) {
        parsedData = JSON.parse(record.extractedData);
      }
    } catch {
      parsedData = null;
    }

    return NextResponse.json(
      {
        verification: {
          id: record.id,
          createdAt: record.createdAt,
          status: record.status,
          riskLevel: record.riskLevel,
          riskScore: record.riskScore,
          documentFilename: record.documentFilename,
          notes: record.notes,
          submitted: parsedData?.submitted || null,
          verification: parsedData?.verification || null,
          extractedOcr: parsedData?.extractedOcr || null,
          riskSummary: parsedData?.riskSummary || null,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Single verification record fetch error:", error);
    return NextResponse.json(
      { error: "যাচাইকরণ রেকর্ড লোড করা যায়নি।" },
      { status: 500 }
    );
  }
}
