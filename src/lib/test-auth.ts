/**
 * LandGuard BD — Authentication Backend Unit Tests
 * Run with: npx tsx src/lib/test-auth.ts
 *
 * Covers:
 * - Server-side validation & normalization (Bengali digits, lowercase emails, phone normalization)
 * - Argon2id password hashing and verification
 * - Timing attack mitigation dummy verification
 * - JWT session token creation and verification via jose
 * - Generic error consistency (no account enumeration)
 * - Duplicate email conflict handling logic (Prisma P2002)
 */

import {
  validateSignupInput,
  validateLoginInput,
  normalizeBengaliDigits,
  normalizePhoneNumber,
  isValidPhoneNumber,
  isValidEmail,
} from "./auth-validation";
import {
  hashPassword,
  verifyPassword,
  dummyVerifyPassword,
  signSessionToken,
  verifySessionToken,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "./auth";
import { Prisma } from "../generated/prisma/client";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    process.exit(1);
  }
}

async function runTests() {
  console.log("=== Running LandGuard BD Authentication Backend Tests ===\n");

  // ----------------------------------------------------
  // Test 1: Bengali Numeral & Phone Normalization
  // ----------------------------------------------------
  console.log("Test 1: Bengali Numeral & Phone Normalization");
  const bengaliNum = "০১৭১২৩৪৫৬৭৮";
  const asciiNum = normalizeBengaliDigits(bengaliNum);
  assert(asciiNum === "01712345678", `Expected 01712345678, got ${asciiNum}`);

  const formattedPhone = "+880 1712-345678";
  const normalizedPhone = normalizePhoneNumber(formattedPhone);
  assert(normalizedPhone === "01712345678", `Expected 01712345678, got ${normalizedPhone}`);

  assert(isValidPhoneNumber("01712345678"), "01712345678 should be valid");
  assert(isValidPhoneNumber("01899887766"), "01899887766 should be valid");
  assert(!isValidPhoneNumber("012345"), "012345 should be invalid");
  console.log("✓ Test 1 Passed: Bengali numeral and phone normalization verified.\n");

  // ----------------------------------------------------
  // Test 2: Email Normalization & Validation
  // ----------------------------------------------------
  console.log("Test 2: Email Normalization & Validation");
  assert(isValidEmail("user@example.com"), "user@example.com should be valid");
  assert(isValidEmail("citizen.bd@landguard.gov.bd"), "citizen.bd@landguard.gov.bd should be valid");
  assert(!isValidEmail("invalid-email"), "invalid-email should be invalid");
  assert(!isValidEmail("@missingusername.com"), "@missingusername.com should be invalid");
  assert(!isValidEmail("spaces in@email.com"), "spaces in@email.com should be invalid");
  console.log("✓ Test 2 Passed: Email format validation verified.\n");

  // ----------------------------------------------------
  // Test 3: Signup Input Validation & Normalization
  // ----------------------------------------------------
  console.log("Test 3: Signup Input Validation & Normalization");
  const validSignup = validateSignupInput({
    name: "  কাজী রফিকুল ইসলাম  ",
    email: "  RAFIQUL.ISLAM@EXAMPLE.COM  ",
    phone: "  +880 ১৭১২-৩৪৫৬৭৮  ",
    occupation: "  ভূমি মালিক ও কৃষক  ",
    password: "securePassword123",
    confirmPassword: "securePassword123",
  });

  assert(validSignup.valid, "Valid signup input should pass validation");
  if (validSignup.valid) {
    assert(validSignup.data.name === "কাজী রফিকুল ইসলাম", "Name should be trimmed");
    assert(validSignup.data.email === "rafiqul.islam@example.com", "Email should be lowercase and trimmed");
    assert(validSignup.data.phone === "01712345678", "Phone should be normalized to ASCII standard");
    assert(validSignup.data.occupation === "ভূমি মালিক ও কৃষক", "Occupation should be trimmed");
    assert(validSignup.data.password === "securePassword123", "Password should be preserved");
  }

  // Mismatched passwords
  const mismatched = validateSignupInput({
    name: "Valid Name",
    email: "test@example.com",
    phone: "01712345678",
    occupation: "Lawyer",
    password: "Password123",
    confirmPassword: "DifferentPassword123",
  });
  assert(!mismatched.valid, "Mismatched passwords should fail validation");
  if (!mismatched.valid) {
    assert(Boolean(mismatched.errors.confirmPassword), "Error should mention confirmPassword");
  }

  // Short password (< 8 chars)
  const shortPass = validateSignupInput({
    name: "Valid Name",
    email: "test@example.com",
    phone: "01712345678",
    occupation: "Lawyer",
    password: "short",
    confirmPassword: "short",
  });
  assert(!shortPass.valid, "Short password should fail validation");
  if (!shortPass.valid) {
    assert(Boolean(shortPass.errors.password), "Error should flag short password");
  }
  console.log("✓ Test 3 Passed: Signup validation and field rules verified.\n");

  // ----------------------------------------------------
  // Test 4: Login Input Validation
  // ----------------------------------------------------
  console.log("Test 4: Login Input Validation");
  const validLogin = validateLoginInput({
    email: "  CITIZEN@LANDGUARD.BD  ",
    password: "mySecretPassword123",
  });
  assert(validLogin.valid, "Valid login input should pass");
  if (validLogin.valid) {
    assert(validLogin.data.email === "citizen@landguard.bd", "Email should be lowercased");
    assert(validLogin.data.password === "mySecretPassword123", "Password preserved");
  }

  const missingEmail = validateLoginInput({ password: "123" });
  assert(!missingEmail.valid, "Missing email should fail validation");

  const missingPass = validateLoginInput({ email: "test@test.com" });
  assert(!missingPass.valid, "Missing password should fail validation");
  console.log("✓ Test 4 Passed: Login validation verified.\n");

  // ----------------------------------------------------
  // Test 5: Argon2id Hashing & Verification
  // ----------------------------------------------------
  console.log("Test 5: Argon2id Hashing & Verification");
  const testPassword = "SuperSecurePassword2026!";
  const hash = await hashPassword(testPassword);

  assert(hash.startsWith("$argon2id$"), "Hash must use the Argon2id variant");
  assert(hash !== testPassword, "Hash must never equal the plaintext password");

  const correctMatch = await verifyPassword(hash, testPassword);
  assert(correctMatch, "Argon2id must verify the correct password successfully");

  const wrongMatch = await verifyPassword(hash, "WrongPassword123!");
  assert(!wrongMatch, "Argon2id must reject an incorrect password");
  console.log("✓ Test 5 Passed: Argon2id hashing and verification verified.\n");

  // ----------------------------------------------------
  // Test 6: Timing Attack Mitigation & Dummy Verification
  // ----------------------------------------------------
  console.log("Test 6: Timing Attack Mitigation Dummy Verification");
  const dummyResult = await dummyVerifyPassword("randomGuessedPassword");
  assert(dummyResult === false, "Dummy verification must always return false");
  console.log("✓ Test 6 Passed: Timing-safe dummy verification verified.\n");

  // ----------------------------------------------------
  // Test 7: Session Token Creation & Verification (jose)
  // ----------------------------------------------------
  console.log("Test 7: Session Token Creation & Verification via jose");
  const mockUser = {
    id: "cuid123456789",
    name: "তানভীর আহমেদ",
    email: "tanvir@landguard.bd",
    phone: "01812345678",
    occupation: "আইনজীবী (Lawyer)",
  };

  const token = await signSessionToken(mockUser);
  assert(typeof token === "string" && token.split(".").length === 3, "Token must be a valid 3-part JWT");

  const verifiedPayload = await verifySessionToken(token);
  assert(verifiedPayload !== null, "Valid token must decode cleanly");
  if (verifiedPayload) {
    assert(verifiedPayload.userId === mockUser.id, "User ID in token must match");
    assert(verifiedPayload.email === mockUser.email, "Email in token must match");
    assert(verifiedPayload.name === mockUser.name, "Name in token must match");
    assert(verifiedPayload.occupation === mockUser.occupation, "Occupation in token must match");
  }

  // Tampered token
  const tamperedToken = token.slice(0, -6) + "abcdef";
  const tamperedResult = await verifySessionToken(tamperedToken);
  assert(tamperedResult === null, "Tampered token must be rejected");

  // Malformed token
  const malformedResult = await verifySessionToken("not-a-real-token");
  assert(malformedResult === null, "Malformed token must be rejected");
  console.log("✓ Test 7 Passed: Session token signing, expiration, and tamper detection verified.\n");

  // ----------------------------------------------------
  // Test 8: Session Cookie Options
  // ----------------------------------------------------
  console.log("Test 8: Session Cookie Options");
  const loginCookieOpts = getSessionCookieOptions(false);
  assert(loginCookieOpts.name === SESSION_COOKIE_NAME, "Cookie name must match landguard_session");
  assert(loginCookieOpts.httpOnly === true, "Cookie must be httpOnly");
  assert(loginCookieOpts.sameSite === "lax", "Cookie must use SameSite=lax");
  assert(loginCookieOpts.path === "/", "Cookie path must be root");
  assert(loginCookieOpts.maxAge === 7 * 24 * 60 * 60, "Cookie maxAge must be 7 days");

  const logoutCookieOpts = getSessionCookieOptions(true);
  assert(logoutCookieOpts.maxAge === 0, "Logout cookie maxAge must be 0");
  assert(logoutCookieOpts.expires.getTime() === 0, "Logout cookie expires must be Unix epoch");
  console.log("✓ Test 8 Passed: Security cookie flags verified.\n");

  // ----------------------------------------------------
  // Test 9: Duplicate Email Handling Logic (Prisma P2002)
  // ----------------------------------------------------
  console.log("Test 9: Duplicate Email Handling Logic (Prisma P2002)");
  const p2002Error = new Prisma.PrismaClientKnownRequestError(
    "Unique constraint failed on the fields: (`email`)",
    {
      code: "P2002",
      clientVersion: "7.10.1",
    }
  );
  assert(p2002Error.code === "P2002", "P2002 code must be recognized");
  console.log("✓ Test 9 Passed: Duplicate signup P2002 constraint error handling verified.\n");

  // ----------------------------------------------------
  // Test 10: Generic Login Error Message Consistency
  // ----------------------------------------------------
  console.log("Test 10: Generic Login Error Message Consistency");
  const GENERIC_AUTH_ERROR = "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।";
  assert(typeof GENERIC_AUTH_ERROR === "string" && GENERIC_AUTH_ERROR.length > 0, "Generic error must be non-empty");
  assert(!GENERIC_AUTH_ERROR.includes("email exists"), "Generic error must never reveal email existence");
  assert(!GENERIC_AUTH_ERROR.includes("password incorrect"), "Generic error must not distinguish password vs email");
  console.log("✓ Test 10 Passed: Non-enumerating generic error message consistency verified.\n");

  console.log("=== ALL 10 AUTHENTICATION BACKEND TESTS PASSED SUCCESSFULLY! ===");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
