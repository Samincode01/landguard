import React from "react";

export default function AboutSection() {
  return (
    <div id="risk-guide" className="space-y-4 pt-4">
      {/* Title */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-700" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            বাংলাদেশে জমি ক্রয়ের সাধারণ ৩টি মৌলিক ঝুঁকি
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          প্রাক-যাচাইকরণের ক্ষেত্রে যে বিষয়গুলোতে ক্রেতাদের সতর্ক থাকা প্রয়োজন
        </p>
      </div>

      {/* 3 Risk Pillars */}
      <div className="grid gap-3.5 sm:grid-cols-3">
        {/* Card 1 */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs transition hover:border-slate-300">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 mb-3">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
            ১. সরকারি খাস ও অর্পিত সম্পত্তি
          </h4>
          <p className="text-xs leading-relaxed text-slate-600">
            ১ নং খতিয়ানভুক্ত সরকারি খাস জমি বা খাল-নদীর তীরবর্তী জায়গা অনেক সময় ভুয়া পর্চা তৈরি করে বিক্রির চেষ্টা করা হয়। ১ নং খতিয়ানের জমি ব্যক্তিগতভাবে হস্তান্তরযোগ্য নয়।
          </p>
        </div>

        {/* Card 2 */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs transition hover:border-slate-300">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 mb-3">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
            ২. বায়া দলিলের ধারাবাহিকতায় ঘাটতি
          </h4>
          <p className="text-xs leading-relaxed text-slate-600">
            সিএস, এসএ, আরএস থেকে বর্তমান বিএস/সিটি জরিপ পর্যন্ত হস্তান্তরের অবিচ্ছিন্ন বায়া দলিল ও উত্তরাধিকার বণ্টননামা না থাকলে ভবিষ্যৎ মালিকানা স্বত্ব ঝুঁকিপূর্ণ হতে পারে।
          </p>
        </div>

        {/* Card 3 */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs transition hover:border-slate-300">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 mb-3">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
            ৩. খতিয়ানের হিস্যা ও দলিলের পরিমাপে অমিল
          </h4>
          <p className="text-xs leading-relaxed text-slate-600">
            দলিলে বিক্রিত জমির পরিমাণ মূল খতিয়ানের হিস্যা বা অংশের চেয়ে বেশি হওয়া বিরোধের প্রধান কারণ। নামজারি খতিয়ানের সাথে দাগের অবশিষ্ট জমি মিলিয়ে নেওয়া আবশ্যক।
          </p>
        </div>
      </div>

      {/* What LandGuard Can and Cannot Establish */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col gap-1 border-b border-slate-100 pb-3">
          <h4 className="text-sm sm:text-base font-bold text-slate-900">
            প্রাথমিক প্রাক-যাচাই যা নিরূপণ করে এবং যা প্রমাণ করে না
          </h4>
          <p className="text-xs text-slate-500">
            সচেতন জমি ক্রেতা হিসেবে প্রযুক্তিগত প্রাক-যাচাইয়ের পরিধি স্পষ্ট জেনে নেওয়া জরুরি
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 text-xs sm:text-sm">
          {/* Can check */}
          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">✓</span>
              <span>এই প্রাথমিক যাচাইকরণ যা নিরূপণ করে:</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 pl-7 list-disc">
              <li>খতিয়ানের মোট হিস্যা ও দলিলের হস্তান্তরিত শতকের মধ্যকার পরিমাপের পার্থক্য।</li>
              <li>সিএস, এসএ, আরএস ও বিএস রেকর্ডের মধ্যে বায়া দলিলের ধারাবাহিকতার সম্ভাব্য ফাঁক।</li>
              <li>সরকারি ১ নং খাস খতিয়ান বা অর্পিত সম্পত্তির দাগের সাথে প্রাথমিক সংস্পর্শ বা মিল।</li>
            </ul>
          </div>

          {/* Cannot prove */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-700">✕</span>
              <span>এই প্রাথমিক যাচাইকরণ যা প্রমাণ করে না:</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 pl-7 list-disc">
              <li>কোনো ব্যক্তির চূড়ান্ত আইনসম্মত মালিকানা বা আদালতের কোনো আদেশ।</li>
              <li>সরেজমিনে সীমানা ও দাগের প্রকৃত সীমানা বা শারীরিক দখল।</li>
              <li>কোনো দলিল ভুয়া, জালিয়াতিযুক্ত বা ব্যাংকে গোপনে বন্ধক রাখা আছে কি না।</li>
            </ul>
          </div>
        </div>

        <div className="rounded-xl bg-amber-50/60 border border-amber-200/70 p-3.5 text-xs text-amber-950 flex items-start gap-2.5">
          <svg className="h-4 w-4 text-amber-800 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="leading-relaxed">
            <strong>জরুরি নাগরিক পরামর্শ:</strong> জমি ক্রয়ের বায়না বা অর্থ পরিশোধের পূর্বে অবশ্যই সংশ্লিষ্ট উপজেলা ভূমি অফিস (এসি ল্যান্ড), সাব-রেজিস্ট্রি অফিস এবং অভিজ্ঞ আইনজীবীর মাধ্যমে মূল রেকর্ড সরেজমিনে যাচাই করুন।
          </p>
        </div>
      </div>
    </div>
  );
}
