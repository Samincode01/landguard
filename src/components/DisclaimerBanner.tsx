"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function DisclaimerBanner() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();

  return (
    <div
      id="disclaimer-section"
      className="rounded-xl border border-amber-200/80 bg-amber-50/70 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-amber-950 shadow-2xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-3">
        <div className="flex items-start sm:items-center gap-2">
          <svg
            className="h-4 w-4 text-amber-700 shrink-0 mt-0.5 sm:mt-0"
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
          <p className="text-amber-900 leading-snug">
            <strong className="font-semibold text-amber-950">{t.disclaimer.badge}</strong>{" "}
            {t.disclaimer.shortNotice}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="self-end sm:self-auto shrink-0 font-medium text-amber-800 hover:text-amber-950 underline underline-offset-2 transition-colors text-xs whitespace-nowrap cursor-pointer"
        >
          {isExpanded ? t.disclaimer.collapse : t.disclaimer.learnMore}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 border-t border-amber-200/60 pt-2.5 text-sm text-amber-900/90 leading-relaxed">
          <p>{t.disclaimer.fullNotice}</p>
        </div>
      )}
    </div>
  );
}

