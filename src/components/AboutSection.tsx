"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutSection() {
  const { t, language } = useLanguage();

  return (
    <div id="risk-guide" className="space-y-3.5 pt-2">
      {/* Title */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-700" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            {t.about.title}
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          {t.about.subtitle}
        </p>
      </div>

      {/* 3 Risk Pillars */}
      <div className="grid gap-3 sm:grid-cols-3">
        {/* Card 1 */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-2xs transition hover:border-slate-300 flex flex-col">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700 mb-2.5">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
            {t.about.risk1Title}
          </h4>
          <p className="text-xs leading-relaxed text-slate-600">
            {t.about.risk1Desc}
          </p>
        </div>

        {/* Card 2 */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-2xs transition hover:border-slate-300 flex flex-col">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700 mb-2.5">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
            {t.about.risk2Title}
          </h4>
          <p className="text-xs leading-relaxed text-slate-600">
            {t.about.risk2Desc}
          </p>
        </div>

        {/* Card 3 */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-2xs transition hover:border-slate-300 flex flex-col">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700 mb-2.5">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
            {t.about.risk3Title}
          </h4>
          <p className="text-xs leading-relaxed text-slate-600">
            {t.about.risk3Desc}
          </p>
        </div>
      </div>

      {/* What LandGuard Can and Cannot Establish */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col gap-1 border-b border-slate-100 pb-2.5">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
            {language === "en"
              ? "What Computer-Assisted Pre-Verification Establishes vs. What It Cannot Prove"
              : "প্রাথমিক প্রাক-যাচাই যা নিরূপণ করে এবং যা প্রমাণ করে না"}
          </h4>
          <p className="text-2xs sm:text-xs text-slate-500">
            {language === "en"
              ? "Prospective buyers must understand the precise scope of algorithmic record auditing"
              : "সচেতন জমি ক্রেতা হিসেবে প্রযুক্তিগত প্রাক-যাচাইয়ের পরিধি স্পষ্ট জেনে নেওয়া জরুরি"}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 text-xs">
          {/* Can check */}
          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-3 sm:p-3.5 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs">✓</span>
              <span>
                {language === "en"
                  ? "What this pre-verification verifies:"
                  : "এই প্রাথমিক যাচাইকরণ যা নিরূপণ করে:"}
              </span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 pl-6 list-disc">
              {language === "en" ? (
                <>
                  <li>Discrepancies between khatian recorded share and transferred deed acreage.</li>
                  <li>Potential missing links in chain of title (Baya deeds) between CS, SA, RS, and BS surveys.</li>
                  <li>Proximity flags or direct plot overlaps with Khatian No. 1 khas and vested property.</li>
                </>
              ) : (
                <>
                  <li>খতিয়ানের মোট হিস্যা ও দলিলের হস্তান্তরিত শতকের মধ্যকার পরিমাপের পার্থক্য।</li>
                  <li>সিএস, এসএ, আরএস ও বিএস রেকর্ডের মধ্যে বায়া দলিলের ধারাবাহিকতার সম্ভাব্য ফাঁক।</li>
                  <li>সরকারি ১ নং খাস খতিয়ান বা অর্পিত সম্পত্তির দাগের সাথে প্রাথমিক সংস্পর্শ বা মিল।</li>
                </>
              )}
            </ul>
          </div>

          {/* Cannot prove */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 sm:p-3.5 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-slate-200 text-slate-700 text-xs">✕</span>
              <span>
                {language === "en"
                  ? "What this pre-verification cannot prove:"
                  : "এই প্রাথমিক যাচাইকরণ যা প্রমাণ করে না:"}
              </span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 pl-6 list-disc">
              {language === "en" ? (
                <>
                  <li>Final legal ownership or judicial decree by any competent court of law.</li>
                  <li>Ground-truth physical possession, demarcated boundaries, or on-site occupancy.</li>
                  <li>Whether a deed is fraudulent, encumbered by unrecorded private mortgages, or under active injunction.</li>
                </>
              ) : (
                <>
                  <li>কোনো ব্যক্তির চূড়ান্ত আইনসম্মত মালিকানা বা আদালতের কোনো আদেশ।</li>
                  <li>সরেজমিনে সীমানা ও দাগের প্রকৃত সীমানা বা শারীরিক দখল।</li>
                  <li>কোনো দলিল ভুয়া, জালিয়াতিযুক্ত বা ব্যাংকে গোপনে বন্ধক রাখা আছে কি না।</li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="rounded-xl bg-amber-50/60 border border-amber-200/70 p-3 text-xs text-amber-950 flex items-start gap-2.5">
          <svg className="h-4 w-4 text-amber-800 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="leading-relaxed text-xs">
            {language === "en" ? (
              <>
                <strong>Essential Buyer Advice:</strong> Before executing any deed of agreement (Baina) or releasing funds, always perform an in-person search at the local Upazila Land Office (AC Land), Sub-Registry Office, and consult an experienced land advocate.
              </>
            ) : (
              <>
                <strong>জরুরি নাগরিক পরামর্শ:</strong> জমি ক্রয়ের বায়না বা অর্থ পরিশোধের পূর্বে অবশ্যই সংশ্লিষ্ট উপজেলা ভূমি অফিস (এসি ল্যান্ড), সাব-রেজিস্ট্রি অফিস এবং অভিজ্ঞ আইনজীবীর মাধ্যমে মূল রেকর্ড সরেজমিনে যাচাই করুন।
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
