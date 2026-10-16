"use client";

import React, { useMemo } from "react";
import { DemoLandParcel, LandHistoryEvent } from "@/data/demo-data";
import { analyzeParcelRisk } from "@/lib/risk-analysis";
import { toBengaliNumerals } from "@/lib/formatters";

interface ParcelHistoryAndRiskProps {
  parcel: DemoLandParcel;
}

export default function ParcelHistoryAndRisk({ parcel }: ParcelHistoryAndRiskProps) {
  // Deterministic explainable risk analysis
  const analysis = useMemo(() => analyzeParcelRisk(parcel), [parcel]);
  const historyEvents = parcel.historyEvents || [];

  const getEventTypeBadge = (eventType: LandHistoryEvent["eventType"]) => {
    switch (eventType) {
      case "SURVEY_RECORD":
        return { label: "জরিপ রেকর্ড", badgeClass: "bg-blue-50 text-blue-800 border-blue-200" };
      case "DEED_TRANSFER":
        return { label: "সাফ-কবলা হস্তান্তর", badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200" };
      case "INHERITANCE":
        return { label: "ওয়ারিশান বণ্টন", badgeClass: "bg-purple-50 text-purple-800 border-purple-200" };
      case "MUTATION":
        return { label: "নামজারি ও দাখিলা", badgeClass: "bg-teal-50 text-teal-800 border-teal-200" };
      case "LITIGATION":
        return { label: "আদালতি মোকদ্দমা", badgeClass: "bg-rose-50 text-rose-800 border-rose-200" };
      case "MORTGAGE":
        return { label: "ব্যাংক বন্ধক", badgeClass: "bg-amber-50 text-amber-800 border-amber-200" };
      default:
        return { label: "নথিভুক্তি", badgeClass: "bg-slate-50 text-slate-800 border-slate-200" };
    }
  };

  return (
    <div className="space-y-6 pt-2">
      {/* 1. EXPLAINABLE RISK ANALYSIS SECTION */}
      <div className="space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-slate-700" />
            <h4 className="text-sm sm:text-base font-bold text-slate-900">
              ব্যাখ্যামূলক ঝুঁকি ও অসঙ্গতি বিশ্লেষণ
            </h4>
          </div>

          {/* Outcome Badge */}
          <div className="flex items-center gap-1.5">
            {analysis.outcome === "NEEDS_REVIEW" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-800 border border-rose-200">
                <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse" />
                {analysis.outcomeLabelBn} ({toBengaliNumerals(analysis.warnings.length)}টি বিষয়)
              </span>
            )}
            {analysis.outcome === "NO_FLAGGED_DISCREPANCIES" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                {analysis.outcomeLabelBn}
              </span>
            )}
            {analysis.outcome === "INSUFFICIENT_INFO" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-200">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                {analysis.outcomeLabelBn}
              </span>
            )}
          </div>
        </div>

        {/* Outcome Summary Card */}
        <div
          className={`rounded-xl border p-4 text-xs sm:text-sm leading-relaxed ${
            analysis.outcome === "NEEDS_REVIEW"
              ? "border-rose-200/90 bg-rose-50/60 text-rose-950"
              : analysis.outcome === "NO_FLAGGED_DISCREPANCIES"
              ? "border-emerald-200/90 bg-emerald-50/60 text-emerald-950"
              : "border-amber-200/90 bg-amber-50/60 text-amber-950"
          }`}
        >
          <div className="flex items-start gap-2.5">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white mt-0.5 ${
                analysis.outcome === "NEEDS_REVIEW"
                  ? "bg-rose-600"
                  : analysis.outcome === "NO_FLAGGED_DISCREPANCIES"
                  ? "bg-emerald-600"
                  : "bg-amber-600"
              }`}
            >
              {analysis.outcome === "NO_FLAGGED_DISCREPANCIES" ? "✓" : "!"}
            </span>
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{analysis.summaryBn}</p>
              {analysis.insufficientInfoReasonBn && (
                <p className="text-xs text-amber-900/90 opacity-90">{analysis.insufficientInfoReasonBn}</p>
              )}
            </div>
          </div>
        </div>

        {/* Explainable Warnings List (4-part breakdown for every warning) */}
        {analysis.warnings.length > 0 && (
          <div className="space-y-3 pt-1">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              শনাক্তকৃত সতর্কবার্তা ও কারণের বিস্তারিত ব্যাখ্যা:
            </h5>
            <div className="grid gap-3 sm:grid-cols-1">
              {analysis.warnings.map((warning, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border p-4 text-xs sm:text-sm space-y-2.5 shadow-2xs ${
                    warning.severity === "CRITICAL"
                      ? "border-rose-300 bg-rose-50/50 text-slate-900"
                      : warning.severity === "HIGH"
                      ? "border-rose-200 bg-rose-50/30 text-slate-900"
                      : "border-amber-200 bg-amber-50/30 text-slate-900"
                  }`}
                >
                  {/* Warning Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                          warning.severity === "CRITICAL"
                            ? "bg-rose-600"
                            : warning.severity === "HIGH"
                            ? "bg-rose-500"
                            : "bg-amber-500"
                        }`}
                      />
                      <span className="font-bold text-slate-900 text-sm">
                        {warning.ruleTitleBn}
                      </span>
                    </div>
                    <span
                      className={`text-2xs font-semibold px-2 py-0.5 rounded-full border ${
                        warning.severity === "CRITICAL"
                          ? "bg-rose-100 text-rose-800 border-rose-300"
                          : warning.severity === "HIGH"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {warning.severity === "CRITICAL"
                        ? "অতি জরুরি সতর্কতা"
                        : warning.severity === "HIGH"
                        ? "উচ্চ গুরুত্ব"
                        : "সতর্কতা নিরীক্ষা"}
                    </span>
                  </div>

                  {/* 4 Required Structured Details */}
                  <div className="grid gap-2 text-xs leading-relaxed">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                      <span className="font-bold text-slate-800 min-w-[130px] shrink-0">
                        ১. কী পাওয়া গেছে:
                      </span>
                      <span className="text-slate-700">{warning.whatFoundBn}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                      <span className="font-bold text-slate-800 min-w-[130px] shrink-0">
                        ২. যে সূত্রে চিহ্নিত:
                      </span>
                      <span className="text-slate-700 font-mono text-2xs sm:text-xs bg-white/70 px-2 py-0.5 rounded border border-slate-200/60">
                        {warning.recordsTriggeredBn}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                      <span className="font-bold text-slate-800 min-w-[130px] shrink-0">
                        ৩. কেন পর্যালোচনা প্রয়োজন:
                      </span>
                      <span className="text-slate-700">{warning.whyReviewBn}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                      <span className="font-bold text-emerald-900 min-w-[130px] shrink-0">
                        ৪. পরবর্তী করণীয়:
                      </span>
                      <span className="text-emerald-950 font-medium bg-emerald-50/60 px-2 py-0.5 rounded border border-emerald-200/60">
                        {warning.nextStepsBn}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. CHRONOLOGICAL LAND HISTORY TIMELINE SECTION */}
      <div className="space-y-3.5 pt-2 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-700" />
            <h4 className="text-sm sm:text-base font-bold text-slate-900">
              ধারাবাহিক হস্তান্তর ইতিহাস ও বায়া দলিলের পরম্পরা
            </h4>
          </div>
          <span className="text-2xs rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-slate-500 border border-slate-200/80 self-start sm:self-auto">
            নমুনা ইতিহাস (কাল্পনিক ডেমো তথ্য)
          </span>
        </div>

        <p className="text-xs text-slate-500">
          * এটি সচেতনতামূলক উদ্দেশ্যে প্রস্তুতকৃত কৃত্রিম ধারাবাহিক ইতিহাস — কোনো সরকারি বা আইনি সনদ নয়।
        </p>

        {historyEvents.length > 0 ? (
          <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {historyEvents.map((event) => {
              const badge = getEventTypeBadge(event.eventType);

              return (
                <div key={event.id} className="relative group">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-1.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full border-2 border-white text-2xs font-bold shadow-2xs ${
                      event.isConflictingTransfer
                        ? "bg-rose-600 text-white"
                        : event.eventType === "LITIGATION"
                        ? "bg-rose-500 text-white"
                        : event.eventType === "MUTATION"
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-600 text-white"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>

                  {/* Event Content Card */}
                  <div
                    className={`rounded-xl border p-3.5 sm:p-4 text-xs sm:text-sm space-y-2 shadow-2xs transition hover:border-slate-300 ${
                      event.isConflictingTransfer
                        ? "border-rose-300 bg-rose-50/40"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    {/* Event Header */}
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {event.titleBn}
                        </span>
                        <span className={`text-2xs font-semibold px-2 py-0.5 rounded-md border ${badge.badgeClass}`}>
                          {badge.label}
                        </span>
                        {event.isConflictingTransfer && (
                          <span className="text-2xs font-bold px-2 py-0.5 rounded-md bg-rose-600 text-white">
                            পরস্পরবিরোধী সমান্তরাল হস্তান্তর দাবি
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-slate-600 bn-num bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                        {event.dateBn}
                      </span>
                    </div>

                    {/* Parties involved */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 pt-0.5">
                      {event.fromPartyBn && (
                        <div>
                          <span className="font-semibold text-slate-700">হস্তান্তরকারী: </span>
                          <span>{event.fromPartyBn}</span>
                        </div>
                      )}
                      {event.fromPartyBn && <span className="text-slate-300">➔</span>}
                      <div>
                        <span className="font-semibold text-slate-700">গ্রহীতা / বর্তমান: </span>
                        <span className="text-slate-900 font-medium">{event.toPartyBn}</span>
                      </div>
                    </div>

                    {/* Identifiers pills */}
                    <div className="flex flex-wrap items-center gap-1.5 text-2xs pt-1">
                      {event.khatianNumber && (
                        <span className="rounded-md bg-slate-50 border border-slate-200 px-2 py-0.5 text-slate-700 bn-num">
                          খতিয়ান: {toBengaliNumerals(event.khatianNumber)}
                        </span>
                      )}
                      {event.dagNumber && (
                        <span className="rounded-md bg-slate-50 border border-slate-200 px-2 py-0.5 text-slate-700 bn-num">
                          দাগ: {toBengaliNumerals(event.dagNumber)}
                        </span>
                      )}
                      {event.deedNumber && (
                        <span className="rounded-md bg-slate-50 border border-slate-200 px-2 py-0.5 text-slate-700 font-mono">
                          দলিল: {event.deedNumber}
                        </span>
                      )}
                      {event.recordedArea && (
                        <span className="rounded-md bg-slate-50 border border-slate-200 px-2 py-0.5 text-slate-700 bn-num">
                          পরিমাণ: {toBengaliNumerals(event.recordedArea)} {event.areaUnit || "শতক"}
                        </span>
                      )}
                    </div>

                    {/* Remarks/Notes */}
                    <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                      {event.notesBn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-5 text-center text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">এই প্লটের জন্য কোনো ঐতিহাসিক হস্তান্তর রেকর্ড অন্তর্ভুক্ত নেই</p>
            <p>পর্যাপ্ত বায়া দলিল ছাড়া কেবল বর্তমান খতিয়ানের ওপর ভিত্তি করে জমি ক্রয় করা অত্যন্ত ঝুঁকিপূর্ণ।</p>
          </div>
        )}
      </div>

      {/* 3. SIMULATED LITIGATION & ENCUMBRANCE STATUS BOX (if active) */}
      {(parcel.litigationStatus?.hasActiveCase || parcel.encumbranceStatus?.isEncumbered) && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-rose-950 text-xs sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse" />
            <span>সতর্ক সংকেত: বিচারাধীন আইনি মামলা বা সরকারি বাফার সংক্রান্ত তথ্য</span>
          </div>
          {parcel.litigationStatus?.hasActiveCase && (
            <div className="text-rose-900 leading-relaxed pl-3.5 border-l-2 border-rose-300">
              <p><strong>মামলার বিবরণ:</strong> {parcel.litigationStatus.caseNumber} — {parcel.litigationStatus.courtNameBn}</p>
              <p><strong>বিষয়বস্তু:</strong> {parcel.litigationStatus.caseTypeBn}</p>
              {parcel.litigationStatus.detailsBn && (
                <p className="text-rose-800/90 mt-0.5">{parcel.litigationStatus.detailsBn}</p>
              )}
            </div>
          )}
          {parcel.encumbranceStatus?.isEncumbered && (
            <div className="text-amber-950 leading-relaxed pl-3.5 border-l-2 border-amber-300 mt-2">
              <p><strong>সরকারি বাফার / দায়বদ্ধতা:</strong> {parcel.encumbranceStatus.institutionNameBn}</p>
              <p>{parcel.encumbranceStatus.detailsBn}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
