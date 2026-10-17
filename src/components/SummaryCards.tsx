"use client";

import React from "react";
import { DashboardSummary } from "@/data/demo-data";
import { toBengaliNumerals } from "@/lib/formatters";
import { useLanguage } from "@/context/LanguageContext";

interface SummaryCardsProps {
  stats: DashboardSummary;
}

export default function SummaryCards({ stats: s }: SummaryCardsProps) {
  const { t, language } = useLanguage();

  const formatNum = (val: number) => {
    return language === "bn" ? toBengaliNumerals(val) : String(val);
  };

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
        {/* 1. Total Parcels */}
        <div className="p-3 sm:p-3.5 lg:p-4 flex flex-col justify-between gap-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-slate-400 shrink-0" />
            <span className="line-clamp-1">{t.summary.totalParcels}</span>
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 bn-num">{formatNum(s.totalParcels)}</span>
            <span className="text-xs text-slate-500 font-normal">{t.summary.parcelsUnit}</span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 leading-tight">{t.summary.totalParcelsSub}</p>
        </div>

        {/* 2. Low Risk */}
        <div className="p-3 sm:p-3.5 lg:p-4 flex flex-col justify-between gap-1">
          <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-600 shrink-0" />
            <span className="line-clamp-1">{t.summary.lowRisk}</span>
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl sm:text-2xl font-bold text-emerald-900 bn-num">{formatNum(s.lowRiskCount)}</span>
            <span className="text-xs text-emerald-700 font-normal">{t.summary.lowRiskUnit}</span>
          </div>
          <p className="text-[11px] sm:text-xs text-emerald-700/70 leading-tight">{t.summary.lowRiskSub}</p>
        </div>

        {/* 3. Medium Risk */}
        <div className="p-3 sm:p-3.5 lg:p-4 flex flex-col justify-between gap-1">
          <div className="flex items-center gap-1.5 text-amber-800 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
            <span className="line-clamp-1">{t.summary.mediumRisk}</span>
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl sm:text-2xl font-bold text-amber-900 bn-num">{formatNum(s.mediumRiskCount)}</span>
            <span className="text-xs text-amber-800 font-normal">{t.summary.mediumRiskUnit}</span>
          </div>
          <p className="text-[11px] sm:text-xs text-amber-700/70 leading-tight">{t.summary.mediumRiskSub}</p>
        </div>

        {/* 4. High Risk */}
        <div className="p-3 sm:p-3.5 lg:p-4 flex flex-col justify-between gap-1">
          <div className="flex items-center gap-1.5 text-rose-800 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
            <span className="line-clamp-1">{t.summary.highRisk}</span>
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl sm:text-2xl font-bold text-rose-900 bn-num">{formatNum(s.highRiskCount)}</span>
            <span className="text-xs text-rose-800 font-normal">{t.summary.highRiskUnit}</span>
          </div>
          <p className="text-[11px] sm:text-xs text-rose-700/70 leading-tight">{t.summary.highRiskSub}</p>
        </div>

        {/* 5. Total Flags */}
        <div className="col-span-2 sm:col-span-1 p-3 sm:p-3.5 lg:p-4 flex flex-col justify-between gap-1 border-t sm:border-t-0">
          <div className="flex items-center gap-1.5 text-slate-600 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-slate-500 shrink-0" />
            <span className="line-clamp-1">{t.summary.riskFlags}</span>
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 bn-num">{formatNum(s.totalRiskFlags)}</span>
            <span className="text-xs text-slate-500 font-normal">{t.summary.riskFlagsUnit}</span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 leading-tight">{t.summary.riskFlagsSub}</p>
        </div>
      </div>
    </div>
  );
}
