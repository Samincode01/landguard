"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="mt-10 sm:mt-14 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3.5 md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6.5 w-6.5 items-center justify-center rounded-lg bg-emerald-800 text-white font-bold text-xs">
              LG
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              {language === "en" ? "LandGuard BD (ল্যান্ডগার্ড বিডি)" : "ল্যান্ডগার্ড বিডি (LandGuard BD)"}
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-2xs font-medium text-slate-600">
              {t.footer.demoBadge}
            </span>
          </div>

          <p className="text-center text-2xs sm:text-xs text-slate-500 md:text-right">
            {t.footer.disclaimer}
          </p>
        </div>

        <div className="mt-4 sm:mt-5 border-t border-slate-100 pt-3.5 text-center text-2xs sm:text-xs text-slate-400">
          {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
