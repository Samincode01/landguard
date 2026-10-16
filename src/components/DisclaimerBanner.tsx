"use client";

import React, { useState } from "react";

export default function DisclaimerBanner() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      id="disclaimer-section"
      className="rounded-xl border border-amber-200/70 bg-amber-50/60 px-4 py-3 text-sm text-amber-950"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <svg
            className="h-4 w-4 text-amber-700 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <p className="text-amber-900">
            <strong className="font-semibold">কৃত্রিম ডেমো ডেটা:</strong>{" "}
            প্রদর্শিত সকল খতিয়ান ও দাগ নম্বর কাল্পনিক।
            জমি ক্রয়ের সিদ্ধান্তের আগে সংশ্লিষ্ট ভূমি অফিসে মূল রেকর্ড যাচাই করুন।
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="self-end sm:self-auto shrink-0 font-medium text-amber-800 hover:text-amber-950 underline underline-offset-2 transition-colors text-xs whitespace-nowrap"
        >
          {isExpanded ? "সংক্ষেপ করুন" : "আরও জানুন"}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 border-t border-amber-200/60 pt-2.5 text-sm text-amber-900/90 leading-relaxed">
          <p>
            ল্যান্ডগার্ড বিডি জমি ক্রেতাদের সচেতন করার উদ্দেশ্যে তৈরি একটি নাগরিক প্রযুক্তি প্রোটোটাইপ।
            এখানে দেখানো রেকর্ডগুলো সম্পূর্ণ কাল্পনিক — কোনো প্রকৃত ভূমি মালিক, জমি বা সরকারি রেকর্ডের সাথে
            এর কোনো সম্পর্ক নেই। এটি কোনো সরকারি সনদ বা আইনি পরামর্শ নয়।
          </p>
        </div>
      )}
    </div>
  );
}
