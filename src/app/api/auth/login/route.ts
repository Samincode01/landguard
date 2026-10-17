/**
 * User Login API Route
 * POST /api/auth/login
 * LandGuard BD — Civic Tech for Land Due Diligence (Track P5)
 *
 * Implements secure login:
 * - Server-side validation and normalization
 * - Timing-attack resistant verification with Argon2id
 * - Generic authentication error messages to prevent account enumeration
 * - Issues HTTP-only, SameSite=Lax session cookie
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateLoginInput } from "@/lib/auth-validation";
import {
  verifyPassword,
  dummyVerifyPassword,
  signSessionToken,
  getSessionCookieOptions,
} from "@/lib/auth";

const GENERIC_AUTH_ERROR = "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।";

export async function POST(request: NextRequest) {
  try {
    // 1. Verify content-type
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
        { error: "অনুরোধের তথ্য সঠিক নয়।" },
        { status: 400 }
      );
    }

    // 3. Validate login input
    const validation = validateLoginInput(body);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: validation.message,
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // 4. Look up user by normalized email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Execute dummy password verification to maintain constant-time behavior
      // and prevent timing-based user enumeration.
      await dummyVerifyPassword(password);
      return NextResponse.json(
        { error: GENERIC_AUTH_ERROR },
        { status: 401 }
      );
    }

    // 5. Verify password hash using Argon2id
    const isPasswordValid = await verifyPassword(user.passwordHash, password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: GENERIC_AUTH_ERROR },
        { status: 401 }
      );
    }

    // 6. Issue cryptographically signed session token
    const sessionToken = await signSessionToken({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      occupation: user.occupation,
      createdAt: user.createdAt,
    });

    // 7. Prepare response and set HTTP-only cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "লগইন সফল হয়েছে।",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          occupation: user.occupation,
          createdAt: user.createdAt,
        },
      },
      { status: 200 }
    );

    const cookieOptions = getSessionCookieOptions(false);
    response.cookies.set({
      name: cookieOptions.name,
      value: sessionToken,
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
      maxAge: cookieOptions.maxAge,
      expires: cookieOptions.expires,
    });

    return response;
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Internal server error";
    console.error("[API /api/auth/login Error]", errorMsg);

    return NextResponse.json(
      {
        error: "সার্ভারে একটি সাময়িক সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর পুনরায় চেষ্টা করুন।",
      },
      { status: 500 }
    );
  }
}
