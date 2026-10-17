"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.nav.switchLangAria}
      className="inline-flex items-center rounded-lg border border-slate-200/90 bg-slate-100/90 p-0.5 text-xs font-medium shadow-2xs"
    >
      <button
        type="button"
        onClick={() => setLanguage("bn")}
        aria-pressed={language === "bn"}
        className={`rounded-md px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-1 cursor-pointer ${
          language === "bn"
            ? "bg-emerald-800 text-white shadow-2xs"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
        }`}
      >
        বাংলা
      </button>

      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={`rounded-md px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-1 cursor-pointer ${
          language === "en"
            ? "bg-emerald-800 text-white shadow-2xs"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
        }`}
      >
        English
      </button>
    </div>
  );
}
