/**
 * Report Generation & Due Diligence Utilities
 * LandGuard BD — Civic Tech for Land Due Diligence (Track P5)
 *
 * Provides pure utility functions for report references, Bengali timestamps,
 * buyer due diligence checklist items, and report metadata formatting.
 * Pure in-memory helpers: zero persistence, zero tracking, safe for SSR.
 */

import { toBengaliNumerals } from "./formatters";

export interface BuyerChecklistItem {
  id: string;
  categoryBn: string;
  titleBn: string;
  officialSourceBn: string;
  actionBn: string;
  importance: "CRITICAL" | "HIGH" | "RECOMMENDED";
  importanceLabelBn: string;
}

const BN_MONTHS = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

/**
 * Generates a unique, reproducible-or-random session report reference.
 * Example format: LGBD-REP-2026-8742
 */
export function generateReportReference(seed?: string | number): string {
  let suffix: string;
  if (seed !== undefined && seed !== null) {
    // Deterministic 4-digit code based on seed
    const str = String(seed);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const positiveCode = Math.abs(hash) % 9000 + 1000;
    suffix = String(positiveCode);
  } else {
    // Random 4-digit numeric code
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    suffix = String(randomCode);
  }
  return `LGBD-REP-2026-${suffix}`;
}

/**
 * Formats a JavaScript Date into a localized Bengali date-time string.
 * Example: "১৭ অক্টোবর ২০২৬, ০২:২৫ পূর্বাহ্ন"
 */
export function formatReportDateTime(date: Date = new Date()): string {
  const day = date.getDate();
  const month = BN_MONTHS[date.getMonth()] || "";
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const isPm = hours >= 12;
  const periodBn = isPm ? "অপরাহ্ন" : "পূর্বাহ্ন";

  hours = hours % 12;
  if (hours === 0) hours = 12;

  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

  const dayBn = toBengaliNumerals(day);
  const yearBn = toBengaliNumerals(year);
  const timeBn = `${toBengaliNumerals(formattedHours)}:${toBengaliNumerals(formattedMinutes)}`;

  return `${dayBn} ${month} ${yearBn}, ${timeBn} ${periodBn}`;
}

/**
 * Returns practical buyer's due-diligence checklist items tailored for Bangladesh land purchases.
 * Covers official land offices, sub-registry volume searches, non-encumbrance, and physical demarcation.
 */
export function getBuyerDueDiligenceChecklist(): BuyerChecklistItem[] {
  return [
    {
      id: "chk-acland-mutation",
      categoryBn: "খতিয়ান ও নামজারি যাচাই",
      titleBn: "সহকারী কমিশনার (ভূমি) অফিসে নামজারি ও জমাভাগ রেকর্ড নিরীক্ষা",
      officialSourceBn: "উপজেলা সহকারী কমিশনার (ভূমি) অফিস ও ইউনিয়ন ভূমি অফিস",
      actionBn:
        "বিক্রেতার নামে এসএ/আরএস খতিয়ানের ভিত্তিতে নামজারি (মিউটেশন) সম্পন্ন হয়েছে কি না, এবং নামজারি ডিসিআর (DCR) ও হাল সন পর্যন্ত ভূমি উন্নয়ন কর (খাজনা) দাখিলা সঠিক আছে কি না তা যাচাই করুন।",
      importance: "CRITICAL",
      importanceLabelBn: "অত্যাবশ্যক",
    },
    {
      id: "chk-subregistry-volume",
      categoryBn: "বালাম বহি তল্লাশি",
      titleBn: "সাব-রেজিস্ট্রি অফিসে মূল বালাম বহি তল্লাশি ও বায়া দলিলের ধারাবাহিকতা",
      officialSourceBn: "সংশ্লিষ্ট উপজেলা বা জেলা সদর সাব-রেজিস্ট্রি অফিস",
      actionBn:
        "বিক্রেতার মূল ক্রয়/দান/হেবা দলিল এবং বিগত ১২ থেকে ২৫ বছরের পূর্ববর্তী সকল বায়া দলিলের ক্রম বালাম বহির ভলিউম ও পেজ নম্বরের সাথে মিলিয়ে ধারাবাহিক স্বত্ব (chain of title) অক্ষুণ্ণ রয়েছে কি না নিশ্চিত হন।",
      importance: "CRITICAL",
      importanceLabelBn: "অত্যাবশ্যক",
    },
    {
      id: "chk-subregistry-nec",
      categoryBn: "নির্দায় সনদপত্র (NEC)",
      titleBn: "১২-২৫ বছরের নির্দায় বা দায়মুক্ত সনদপত্র (Non-Encumbrance Certificate) উত্তোলন",
      officialSourceBn: "সংশ্লিষ্ট সাব-রেজিস্ট্রি অফিস (ফরম নং ৫৩ অনুযায়ী)",
      actionBn:
        "উক্ত দাগ ও খতিয়ানের জমিতে কোনো গোপন বিক্রয়চুক্তি (বায়নানামা), প্রাতিষ্ঠানিক ব্যাংক বন্ধক, দানপত্র বা আমমোক্তারনামা (POA) নিবন্ধিত রয়েছে কি না তা জানতে তল্লাশি দিয়ে দায়মুক্ত সনদপত্র সংগ্রহ করুন।",
      importance: "HIGH",
      importanceLabelBn: "উচ্চ গুরুত্ব",
    },
    {
      id: "chk-physical-demarcation",
      categoryBn: "সরেজমিন সীমানা ও দখল",
      titleBn: "অনুমোদিত সার্ভেয়ার/আমিন দ্বারা সরেজমিনে জমি পরিমাপ ও দখল পরীক্ষা",
      officialSourceBn: "সরকারি তালিকাভুক্ত সার্ভেয়ার / অভিজ্ঞ স্বাধীন আমিন",
      actionBn:
        "সিএস, আরএস ও বিএস মৌজা নকশার সাথে বাস্তব সীমানা, চারদিকের সীমানা চিহ্ন (চৌহদ্দি) এবং প্রতিবেশীদের সীমানা মিলিয়ে দখল পরীক্ষা করুন। নকশার বাইরে অতিরিক্ত জমির দখল কেনা থেকে বিরত থাকুন।",
      importance: "CRITICAL",
      importanceLabelBn: "অত্যাবশ্যক",
    },
    {
      id: "chk-court-litigation",
      categoryBn: "আদালতি মোকদ্দমা ও খাস জমি",
      titleBn: "দেওয়ানি মোকদ্দমা, সরকারি খাস/অর্পিত তালিকা ও অধিগ্রহণ অনুসন্ধান",
      officialSourceBn: "যুগ্ম জেলা জজ আদালত / জেলা প্রশাসকের এল.এ শাখা",
      actionBn:
        "জমিটি নিয়ে কোনো স্বত্ব ঘোষণা, বাটোয়ারা মোকদ্দমা বা স্থগিতাদেশ আছে কি না, কিংবা জমিটি সরকারি খাস, অর্পিত (ভিপি), বা কোনো উন্নয়ন প্রকল্পের জন্য অধিগ্রহণ তালিকায় রয়েছে কি না তা অভিজ্ঞ আইনজীবীর মাধ্যমে পরীক্ষা করুন।",
      importance: "HIGH",
      importanceLabelBn: "উচ্চ গুরুত্ব",
    },
  ];
}
