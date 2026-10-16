import React from "react";

interface VerificationCTAProps {
  onOpenVerificationModal: () => void;
}

export default function VerificationCTA({ onOpenVerificationModal }: VerificationCTAProps) {
  return (
    <div className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-900 to-emerald-800 p-6 sm:p-8 shadow-sm text-white">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3 max-w-2xl">
          {/* Eyebrow label */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/20 px-3 py-0.5 text-xs font-medium text-emerald-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              নাগরিক ভূমি প্রাক-যাচাই উদ্যোগ
            </span>
          </div>

          {/* Primary heading — bigger, bolder, dominant */}
          <h1 className="text-2xl sm:text-3xl font-bold leading-snug text-white">
            জমি কিনতে যাচ্ছেন? আগে দলিল ও খতিয়ান যাচাই করুন।
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            বায়া দলিলের ধারাবাহিকতা, হিস্যার অমিল এবং সরকারি খাস জমির ঝুঁকি
            প্রাথমিকভাবে পরীক্ষা করে নিরাপদ সিদ্ধান্ত নিন।
          </p>

          {/* Key check indicators */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-sm text-emerald-100/80 pt-1">
            <span className="inline-flex items-center gap-2">
              <svg className="h-4 w-4 text-emerald-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              বায়া দলিলের পরম্পরা
            </span>
            <span className="inline-flex items-center gap-2">
              <svg className="h-4 w-4 text-emerald-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              খতিয়ানের হিস্যা ও পরিমাণ
            </span>
            <span className="inline-flex items-center gap-2">
              <svg className="h-4 w-4 text-emerald-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              ১ নং খাস ও সরকারি বাফার
            </span>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
          <button
            onClick={onOpenVerificationModal}
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-emerald-900 shadow-sm hover:bg-emerald-50 transition active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-900"
          >
            <svg className="h-4 w-4 text-emerald-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span>নতুন দলিল যাচাই করুন</span>
          </button>

          <a
            href="#records-section"
            className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-medium text-white hover:bg-white/20 transition"
          >
            নমুনা রেকর্ড দেখুন
          </a>
        </div>
      </div>
    </div>
  );
}
