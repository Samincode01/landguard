/**
 * User Registration API Route
 * POST /api/auth/signup
 * LandGuard BD — Civic Tech for Land Due Diligence (Track P5)
 *
 * Implements secure user signup:
 * - Server-side validation and normalization (email lowercasing, phone digit conversion)
 * - Argon2id password hashing
 * - Safe unique email enforcement via Prisma / PostgreSQL
 * - Issues HTTP-only, SameSite=Lax session cookie
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSignupInput } from "@/lib/auth-validation";
import { hashPassword, signSessionToken, getSessionCookieOptions } from "@/lib/auth";
import { Prisma } from "@/generated/prisma/client";

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

    // 3. Server-side validation and normalization
    const validation = validateSignupInput(body);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: validation.message,
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    const { name, email, phone, occupation, password } = validation.data;

    // 4. Hash password with Argon2id (never store or log plaintext)
    const passwordHash = await hashPassword(password);

    // 5. Create user in PostgreSQL database
    let newUser;
    try {
      newUser = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          occupation,
          passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          occupation: true,
          createdAt: true,
        },
      });
    } catch (dbError: unknown) {
      // Prisma P2002: Unique constraint failed on field `email`
      if (
        dbError instanceof Prisma.PrismaClientKnownRequestError &&
        dbError.code === "P2002"
      ) {
        return NextResponse.json(
          {
            error: "এই ইমেইল ঠিকানা দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট নিবন্ধিত রয়েছে। অনুগ্রহ করে লগইন করুন।",
            field: "email",
          },
          { status: 409 }
        );
      }
      throw dbError;
    }

    // 6. Issue cryptographically signed session token
    const sessionToken = await signSessionToken(newUser);

    // 7. Prepare response and set HTTP-only cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।",
        user: newUser,
      },
      { status: 201 }
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
    console.error("[API /api/auth/signup Error]", errorMsg);

    return NextResponse.json(
      {
        error: "সার্ভারে একটি সাময়িক সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর পুনরায় চেষ্টা করুন।",
      },
      { status: 500 }
    );
  }
}
