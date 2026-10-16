/**
 * Bengali numeral and text formatting utilities for LandGuard BD.
 */

const BN_DIGITS: string[] = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/**
 * Converts any number or string containing ASCII digits (0-9) to Bengali digits (০-৯).
 * Non-digit characters (including decimal points, hyphens, and slashes) are preserved.
 *
 * @example
 * toBengaliNumerals(123) => "১২৩"
 * toBengaliNumerals(7.5) => "৭.৫"
 * toBengaliNumerals("DEED-2020") => "DEED-২০২০"
 */
export function toBengaliNumerals(input: number | string | null | undefined): string {
  if (input === null || input === undefined) return "";
  return String(input).replace(/[0-9]/g, (digit) => BN_DIGITS[parseInt(digit, 10)] ?? digit);
}

/**
 * Formats land area with Bengali numerals and unit.
 *
 * @example
 * formatLandArea(7.5, "শতক") => "৭.৫ শতক"
 */
export function formatLandArea(area: number | null | undefined, unit: string = "শতক"): string {
  if (area === null || area === undefined) return "—";
  return `${toBengaliNumerals(area)} ${unit}`;
}
