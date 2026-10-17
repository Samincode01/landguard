/**
 * Authentication Input Validation & Normalization
 * LandGuard BD — Civic Tech for Land Due Diligence (Track P5)
 *
 * Strict server-side validation and sanitization for signup and login requests.
 * Normalizes emails (lowercasing, trimming) and phone numbers (Bengali digit translation).
 */

export interface SignupInput {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  occupation?: unknown;
  password?: unknown;
  confirmPassword?: unknown;
}

export interface NormalizedSignupData {
  name: string;
  phone: string;
  email: string;
  occupation: string;
  password: string;
}

export interface ValidationSuccess<T> {
  valid: true;
  data: T;
}

export interface ValidationFailure {
  valid: false;
  errors: Record<string, string>;
  message: string;
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

export interface LoginInput {
  email?: unknown;
  password?: unknown;
}

export interface NormalizedLoginData {
  email: string;
  password: string;
}

/**
 * Maps Bengali numerals (০-৯) to standard ASCII numerals (0-9).
 */
export function normalizeBengaliDigits(input: string): string {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return input.replace(/[০-৯]/g, (match) => {
    const idx = bengaliDigits.indexOf(match);
    return idx !== -1 ? idx.toString() : match;
  });
}

/**
 * Normalizes a Bangladeshi or international phone number:
 * - Converts Bengali numerals to ASCII
 * - Removes whitespace, hyphens, and parentheses
 * - Standardizes Bangladeshi mobile numbers (+8801... or 8801... to 01...)
 */
export function normalizePhoneNumber(rawPhone: string): string {
  let cleaned = normalizeBengaliDigits(rawPhone).replace(/[\s\-\(\)\.]/g, "");
  if (cleaned.startsWith("+8801")) {
    cleaned = cleaned.slice(3); // +8801XXXXXXXXX -> 01XXXXXXXXX
  } else if (cleaned.startsWith("8801")) {
    cleaned = cleaned.slice(2); // 8801XXXXXXXXX -> 01XXXXXXXXX
  }
  return cleaned;
}

/**
 * Validates whether a phone number matches standard Bangladeshi mobile prefix or valid E.164.
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Standard Bangladeshi mobile: 01[3-9] followed by 8 digits (total 11 digits)
  const bdMobileRegex = /^01[3-9]\d{8}$/;
  // General international format: 8 to 15 digits
  const intlRegex = /^\+?[1-9]\d{7,14}$/;
  return bdMobileRegex.test(phone) || intlRegex.test(phone);
}

/**
 * Validates email format.
 */
export function isValidEmail(email: string): boolean {
  if (email.length > 150) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Validates and normalizes user signup input.
 */
export function validateSignupInput(input: SignupInput): ValidationResult<NormalizedSignupData> {
  const errors: Record<string, string> = {};

  // 1. Name validation
  if (typeof input.name !== "string" || !input.name.trim()) {
    errors.name = "নাম প্রদান করা আবশ্যক।";
  } else {
    const trimmedName = input.name.trim();
    if (trimmedName.length < 2) {
      errors.name = "নাম কমপক্ষে ২ অক্ষরের হতে হবে।";
    } else if (trimmedName.length > 100) {
      errors.name = "নাম সর্বোচ্চ ১০০ অক্ষরের মধ্যে হতে হবে।";
    }
  }

  // 2. Email validation
  let normalizedEmail = "";
  if (typeof input.email !== "string" || !input.email.trim()) {
    errors.email = "ইমেইল প্রদান করা আবশ্যক।";
  } else {
    normalizedEmail = input.email.trim().toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      errors.email = "সঠিক ইমেইল ঠিকানা প্রদান করুন।";
    }
  }

  // 3. Phone validation
  let normalizedPhone = "";
  if (typeof input.phone !== "string" || !input.phone.trim()) {
    errors.phone = "মোবাইল নম্বর প্রদান করা আবশ্যক।";
  } else {
    normalizedPhone = normalizePhoneNumber(input.phone.trim());
    if (!isValidPhoneNumber(normalizedPhone)) {
      errors.phone = "সঠিক মোবাইল নম্বর প্রদান করুন (যেমন: 017XXXXXXXX)।";
    }
  }

  // 4. Occupation validation
  let normalizedOccupation = "";
  if (typeof input.occupation !== "string" || !input.occupation.trim()) {
    errors.occupation = "পেশা বা ভূমিকার বিবরণ প্রদান করা আবশ্যক।";
  } else {
    normalizedOccupation = input.occupation.trim();
    if (normalizedOccupation.length < 2) {
      errors.occupation = "পেশা কমপক্ষে ২ অক্ষরের হতে হবে।";
    } else if (normalizedOccupation.length > 100) {
      errors.occupation = "পেশা সর্বোচ্চ ১০০ অক্ষরের মধ্যে হতে হবে।";
    }
  }

  // 5. Password validation
  if (typeof input.password !== "string" || !input.password) {
    errors.password = "পাসওয়ার্ড প্রদান করা আবশ্যক।";
  } else if (input.password.length < 8) {
    errors.password = "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।";
  } else if (input.password.length > 128) {
    errors.password = "পাসওয়ার্ড সর্বোচ্চ ১২৮ অক্ষরের হতে পারে।";
  }

  // 6. Confirm Password validation
  if (typeof input.confirmPassword !== "string" || !input.confirmPassword) {
    errors.confirmPassword = "পাসওয়ার্ড নিশ্চিতকরণ প্রদান করা আবশ্যক।";
  } else if (input.password !== input.confirmPassword) {
    errors.confirmPassword = "পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মিলছে না।";
  }

  if (Object.keys(errors).length > 0) {
    const firstErrorMessage = Object.values(errors)[0];
    return {
      valid: false,
      errors,
      message: firstErrorMessage,
    };
  }

  return {
    valid: true,
    data: {
      name: (input.name as string).trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      occupation: normalizedOccupation,
      password: input.password as string,
    },
  };
}

/**
 * Validates and normalizes login input.
 */
export function validateLoginInput(input: LoginInput): ValidationResult<NormalizedLoginData> {
  const errors: Record<string, string> = {};

  if (typeof input.email !== "string" || !input.email.trim()) {
    errors.email = "ইমেইল প্রদান করা আবশ্যক।";
  }

  if (typeof input.password !== "string" || !input.password) {
    errors.password = "পাসওয়ার্ড প্রদান করা আবশ্যক।";
  }

  if (Object.keys(errors).length > 0) {
    return {
      valid: false,
      errors,
      message: "ইমেইল এবং পাসওয়ার্ড উভয়ই প্রদান করতে হবে।",
    };
  }

  return {
    valid: true,
    data: {
      email: (input.email as string).trim().toLowerCase(),
      password: input.password as string,
    },
  };
}
