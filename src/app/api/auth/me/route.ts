/**
 * Session Verification / Current User API Route
 * GET /api/auth/me
 * LandGuard BD — Civic Tech for Land Due Diligence (Track P5)
 *
 * Verifies the HTTP-only session cookie and returns the active user profile.
 */

import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json(
        { user: null, message: "অননুমোদিত ব্যবহারকারী।" },
        { status: 401 }
      );
    }

    const payload = await verifySessionToken(sessionCookie.value);
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { user: null, message: "সেশনটি অবৈধ বা মেয়াদোত্তীর্ণ।" },
        { status: 401 }
      );
    }

    // Confirm user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        occupation: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { user: null, message: "ব্যবহারকারী খুঁজে পাওয়া যায়নি।" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        user,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Internal server error";
    // Avoid logging benign prerender bailout during Next.js static page generation
    if (!errorMsg.includes("needs to bail out of prerendering")) {
      console.error("[API /api/auth/me Error]", errorMsg);
    }

    return NextResponse.json(
      { error: "সার্ভারে একটি সাময়িক সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
