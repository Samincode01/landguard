/**
 * User Logout API Route
 * POST /api/auth/logout
 * LandGuard BD — Civic Tech for Land Due Diligence (Track P5)
 *
 * Clears the HTTP-only session cookie.
 */

import { NextResponse } from "next/server";
import { getSessionCookieOptions } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json(
    {
      success: true,
      message: "সফলভাবে লগআউট করা হয়েছে।",
    },
    { status: 200 }
  );

  const cookieOptions = getSessionCookieOptions(true);
  response.cookies.set({
    name: cookieOptions.name,
    value: "",
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    path: cookieOptions.path,
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}
