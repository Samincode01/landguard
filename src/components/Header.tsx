"use client";

import React from "react";

interface HeaderProps {
  onOpenVerificationModal: () => void;
  onOpenChat?: () => void;
}

export default function Header({ onOpenVerificationModal, onOpenChat }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/98 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-900 text-white shadow-xs">
            <svg
              className="h-5 w-5 text-emerald-300"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-slate-900 leading-none">
                ল্যান্ডগার্ড <span className="text-emerald-800">বিডি</span>
              </span>
              <span className="hidden sm:inline text-xs text-slate-400 font-medium">LandGuard BD</span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block mt-0.5">
              জমি ক্রয়ের আগে প্রাথমিক দলিল যাচাই
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <nav className="hidden md:flex items-center gap-0.5">
            <a
              href="#map-section"
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-emerald-800 hover:bg-slate-50 rounded-lg transition-colors"
            >
              মানচিত্র
            </a>
            <a
              href="#records-section"
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-emerald-800 hover:bg-slate-50 rounded-lg transition-colors"
            >
              রেকর্ড তালিকা
            </a>
            <a
              href="#risk-guide"
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-emerald-800 hover:bg-slate-50 rounded-lg transition-colors"
            >
              ঝুঁকি সহায়িকা
            </a>
            {onOpenChat && (
              <button
                type="button"
                onClick={onOpenChat}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-emerald-800 hover:bg-slate-50 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <span>সহায়তা চ্যাট</span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 font-semibold">AI</span>
              </button>
            )}
          </nav>

          {/* Demo badge — smaller, less distracting */}
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            ডেমো
          </span>

          <button
            onClick={onOpenVerificationModal}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-900 transition focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-1 active:scale-[0.98]"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>দলিল যাচাই</span>
          </button>
        </div>
      </div>
    </header>
  );
}
