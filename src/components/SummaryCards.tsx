import React from "react";
import { DashboardSummary } from "@/data/demo-data";
import { toBengaliNumerals } from "@/lib/formatters";

interface SummaryCardsProps {
  stats: DashboardSummary;
}

export default function SummaryCards({ stats: s }: SummaryCardsProps) {
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {/* 1. Total Parcels */}
        <div className="px-4 py-4 sm:px-5 border-b sm:border-b-0 sm:border-r border-slate-100 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-slate-400 shrink-0" />
            <span>মোট ডেমো জমি</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-bold text-slate-900 bn-num">{toBengaliNumerals(s.totalParcels)}</span>
            <span className="text-xs text-slate-500">টি প্লট</span>
          </div>
          <p className="text-xs text-slate-400">নমুনা ডেটাসেট</p>
        </div>

        {/* 2. Low Risk */}
        <div className="px-4 py-4 sm:px-5 border-b sm:border-b-0 sm:border-r border-slate-100 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-600 shrink-0" />
            <span>ঝুঁকিহীন</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-bold text-emerald-900 bn-num">{toBengaliNumerals(s.lowRiskCount)}</span>
            <span className="text-xs text-emerald-700 font-medium">টি</span>
          </div>
          <p className="text-xs text-emerald-700/70">স্বচ্ছ মালিকানা ধারা</p>
        </div>

        {/* 3. Medium Risk */}
        <div className="px-4 py-4 sm:px-5 border-b lg:border-b-0 sm:border-r border-slate-100 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-amber-800 text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
            <span>সতর্কতা প্রয়োজন</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-bold text-amber-900 bn-num">{toBengaliNumerals(s.mediumRiskCount)}</span>
            <span className="text-xs text-amber-800 font-medium">টি</span>
          </div>
          <p className="text-xs text-amber-700/70">পরিমাপে গরমিল পাওয়া গেছে</p>
        </div>

        {/* 4. High Risk */}
        <div className="px-4 py-4 sm:px-5 border-b sm:border-b-0 sm:border-r border-slate-100 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-rose-800 text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
            <span>উচ্চ ঝুঁকি</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-bold text-rose-900 bn-num">{toBengaliNumerals(s.highRiskCount)}</span>
            <span className="text-xs text-rose-800 font-medium">টি</span>
          </div>
          <p className="text-xs text-rose-700/70">খাস বা শরিকি বিরোধ</p>
        </div>

        {/* 5. Total Flags */}
        <div className="col-span-2 sm:col-span-1 px-4 py-4 sm:px-5 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-slate-500 shrink-0" />
            <span>চিহ্নিত অসঙ্গতি</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-bold text-slate-900 bn-num">{toBengaliNumerals(s.totalRiskFlags)}</span>
            <span className="text-xs text-slate-500">টি</span>
          </div>
          <p className="text-xs text-slate-400">সক্রিয় ঝুঁকি পয়েন্ট</p>
        </div>
      </div>
    </div>
  );
}
