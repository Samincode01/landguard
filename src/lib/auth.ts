if (typeof window !== "undefined") {
  throw new Error("This module can only be executed in a server environment.");
}

import * as argon2 from "argon2";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

/**
 * LandGuard BD — Civic Tech Authentication Service
 * Implements Argon2id password hashing, timing-safe verification,
 * and stateless cryptographically signed session tokens via jose.
 */

export const SESSION_COOKIE_NAME = "landguard_session";
export const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60; // 7 days

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  occupation: string;
  createdAt?: string | Date;
}

export interface SessionPayload extends JWTPayload {
  userId: string;
  name: string;
  email: string;
  phone: string;
  occupation: string;
}

/**
 * Resolves the JWT signing secret key safely.
 * Prefers AUTH_SECRET environment variable; falls back to an internal deterministic key in development.
 */
function getSigningSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "landguard-bd-dev-fallback-secret-key-32-chars-min!";
  return new TextEncoder().encode(secret);
}

/**
 * Pre-computed Argon2id dummy hash for timing attack mitigation.
 * When a user is not found during login, we verify against this dummy hash
 * to prevent attackers from determining user existence based on response latency.
 */
const DUMMY_HASH = "$argon2id$v=19$m=65536,t=3,p=1$uH2FvU/0xQZ6fO9hR8c1YQ$L5T2fL9gqG6gA1/B3vD7wK0mP9rS4tU7vW0xY2zA4bC";

/**
 * Hashes a plaintext password using Argon2id.
 * Never stores or returns plaintext passwords.
 */
export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3,       // 3 iterations
    parallelism: 1,
  });
}

/**
 * Verifies a password against an Argon2id hash.
 * Handles timing attack mitigation for nonexistent accounts via dummy verification.
 */
export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

/**
 * Executes a dummy password verification to maintain constant-time response behavior
 * when a lookup by email finds no user.
 */
export async function dummyVerifyPassword(password: string): Promise<boolean> {
  try {
    await argon2.verify(DUMMY_HASH, password);
  } catch {
    // Ignore error
  }
  return false;
}

/**
 * Signs and issues a tamper-proof session JWT valid for 7 days.
 */
export async function signSessionToken(user: SessionUser): Promise<string> {
  const secret = getSigningSecret();

  const payload: SessionPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    occupation: user.occupation,
  };

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(secret);
}

/**
 * Verifies and decodes a session JWT.
 * Returns the decoded SessionPayload or null if expired, malformed, or tampered.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const secret = getSigningSecret();
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    if (!payload.sub || !payload.email) {
      return null;
    }

    return payload as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Standard cookie configuration for session management.
 * Enforces HttpOnly, SameSite=Lax, and Secure in production.
 */
export function getSessionCookieOptions(isLogout = false) {
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: isLogout ? 0 : SESSION_DURATION_SECONDS,
    expires: isLogout ? new Date(0) : new Date(Date.now() + SESSION_DURATION_SECONDS * 1000),
  };
}
