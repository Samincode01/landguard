"use client";

import React, { useMemo } from "react";
import { DemoLandParcel, LandHistoryEvent } from "@/data/demo-data";
import { analyzeParcelRisk } from "@/lib/risk-analysis";
import { toBengaliNumerals } from "@/lib/formatters";
import { useLanguage } from "@/context/LanguageContext";

interface ParcelHistoryAndRiskProps {
  parcel: DemoLandParcel;
}

export default function ParcelHistoryAndRisk({ parcel }: ParcelHistoryAndRiskProps) {
  const { t, language } = useLanguage();
  // Deterministic explainable risk analysis
  const analysis = useMemo(() => analyzeParcelRisk(parcel), [parcel]);
  const historyEvents = parcel.historyEvents || [];

  const formatNum = (val: number | string) => {
    return language === "bn" ? toBengaliNumerals(val) : String(val);
  };

  const getEventTypeBadge = (eventType: LandHistoryEvent["eventType"]) => {
    switch (eventType) {
      case "SURVEY_RECORD":
        return {
          label: language === "en" ? "Cadastral Survey" : "জরিপ রেকর্ড",
          badgeClass: "bg-blue-50 text-blue-800 border-blue-200",
        };
      case "DEED_TRANSFER":
        return {
          label: language === "en" ? "Deed Transfer" : "সাফ-কবলা হস্তান্তর",
          badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
        };
      case "INHERITANCE":
        return {
          label: language === "en" ? "Inheritance" : "ওয়ারিশান বণ্টন",
          badgeClass: "bg-purple-50 text-purple-800 border-purple-200",
        };
      case "MUTATION":
        return {
          label: language === "en" ? "Mutation & Dakhila" : "নামজারি ও দাখিলা",
          badgeClass: "bg-teal-50 text-teal-800 border-teal-200",
        };
      case "LITIGATION":
        return {
          label: language === "en" ? "Civil Litigation" : "আদালতি মোকদ্দমা",
          badgeClass: "bg-rose-50 text-rose-800 border-rose-200",
        };
      case "MORTGAGE":
        return {
          label: language === "en" ? "Bank Mortgage" : "ব্যাংক বন্ধক",
          badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
        };
      default:
        return {
          label: language === "en" ? "Record Entry" : "নথিভুক্তি",
          badgeClass: "bg-slate-50 text-slate-800 border-slate-200",
        };
    }
  };

  const outcomeBadge = useMemo(() => {
    if (analysis.outcome === "NEEDS_REVIEW") {
      return {
        label: language === "en" ? "Requires Detailed Review" : analysis.outcomeLabelBn,
        badgeClass: "bg-rose-50 text-rose-800 border-rose-200",
        dotClass: "bg-rose-600 animate-pulse",
      };
    }
    if (analysis.outcome === "NO_FLAGGED_DISCREPANCIES") {
      return {
        label: language === "en" ? "No Discrepancies Flagged" : analysis.outcomeLabelBn,
        badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
        dotClass: "bg-emerald-600",
      };
    }
    return {
      label: language === "en" ? "Insufficient Information" : analysis.outcomeLabelBn,
      badgeClass: "bg-amber-50 text-amber-900 border-amber-200",
      dotClass: "bg-amber-500",
    };
  }, [analysis, language]);

  return (
    <div className="space-y-4 pt-1">
      {/* 1. EXPLAINABLE RISK ANALYSIS SECTION */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-slate-700" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              {t.history.riskAnalysisTitle}
            </h4>
          </div>

          {/* Outcome Badge */}
          <div className="flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold border ${outcomeBadge.badgeClass}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${outcomeBadge.dotClass}`} />
              {outcomeBadge.label}
              {analysis.warnings.length > 0 && (
                <span> ({formatNum(analysis.warnings.length)} {t.history.itemCountSuffix})</span>
              )}
            </span>
          </div>
        </div>

        {/* Outcome Summary Card */}
        <div
          className={`rounded-lg border p-3 text-xs sm:text-sm leading-relaxed ${
            analysis.outcome === "NEEDS_REVIEW"
              ? "border-rose-200/90 bg-rose-50/60 text-rose-950"
              : analysis.outcome === "NO_FLAGGED_DISCREPANCIES"
              ? "border-emerald-200/90 bg-emerald-50/60 text-emerald-950"
              : "border-amber-200/90 bg-amber-50/60 text-amber-950"
          }`}
        >
          <div className="flex items-start gap-2">
            <span
              className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white mt-0.5 ${
                analysis.outcome === "NO_FLAGGED_DISCREPANCIES"
                  ? "bg-emerald-600"
                  : analysis.outcome === "NEEDS_REVIEW"
                  ? "bg-rose-600"
                  : "bg-amber-600"
              }`}
            >
              {analysis.outcome === "NO_FLAGGED_DISCREPANCIES" ? "✓" : "!"}
            </span>
            <div className="space-y-0.5">
              <p className="font-semibold text-slate-900 text-xs sm:text-sm">{analysis.summaryBn}</p>
              {analysis.insufficientInfoReasonBn && (
                <p className="text-xs text-amber-900/90 opacity-90">{analysis.insufficientInfoReasonBn}</p>
              )}
            </div>
          </div>
        </div>

        {/* Explainable Warnings List (4-part breakdown for every warning) */}
        {analysis.warnings.length > 0 && (
          <div className="space-y-2 pt-0.5">
            <h5 className="text-2xs sm:text-xs font-bold text-slate-700 uppercase tracking-wide">
              {t.history.warningsExplanation}
            </h5>
            <div className="grid gap-2 sm:grid-cols-1">
              {analysis.warnings.map((warning, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg border p-3 text-xs space-y-2 shadow-2xs ${
                    warning.severity === "CRITICAL"
                      ? "border-rose-300 bg-rose-50/50 text-slate-900"
                      : warning.severity === "HIGH"
                      ? "border-rose-200 bg-rose-50/30 text-slate-900"
                      : "border-amber-200 bg-amber-50/30 text-slate-900"
                  }`}
                >
                  {/* Warning Header */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-200/60 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`h-2 w-2 rounded-full shrink-0 ${
                          warning.severity === "CRITICAL"
                            ? "bg-rose-600"
                            : warning.severity === "HIGH"
                            ? "bg-rose-500"
                            : "bg-amber-500"
                        }`}
                      />
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
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
                        ? (language === "en" ? "Critical Alert" : "অতি জরুরি সতর্কতা")
                        : warning.severity === "HIGH"
                        ? (language === "en" ? "High Priority" : "উচ্চ গুরুত্ব")
                        : (language === "en" ? "Review Needed" : "সতর্কতা নিরীক্ষা")}
                    </span>
                  </div>

                  {/* 4 Required Structured Details */}
                  <div className="grid gap-1.5 text-xs leading-relaxed">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                      <span className="font-bold text-slate-800 min-w-[140px] shrink-0">
                        {t.history.whatFound}
                      </span>
                      <span className="text-slate-700">{warning.whatFoundBn}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                      <span className="font-bold text-slate-800 min-w-[140px] shrink-0">
                        {t.history.recordsTriggered}
                      </span>
                      <span className="text-slate-700 font-mono text-2xs bg-white/80 px-2 py-0.5 rounded border border-slate-200/60">
                        {warning.recordsTriggeredBn}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                      <span className="font-bold text-slate-800 min-w-[140px] shrink-0">
                        {t.history.whyReview}
                      </span>
                      <span className="text-slate-700">{warning.whyReviewBn}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                      <span className="font-bold text-emerald-900 min-w-[140px] shrink-0">
                        {t.history.nextSteps}
                      </span>
                      <span className="text-emerald-950 font-medium bg-emerald-50/70 px-2 py-0.5 rounded border border-emerald-200/60">
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
      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-700" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              {t.history.historyTitle}
            </h4>
          </div>
          <span className="text-2xs rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-500 border border-slate-200/80 self-start sm:self-auto">
            {t.history.historyBadge}
          </span>
        </div>

        <p className="text-2xs sm:text-xs text-slate-400">
          {t.history.historyNotice}
        </p>

        {historyEvents.length > 0 ? (
          <div className="relative pl-5 sm:pl-7 space-y-3 before:absolute before:left-2 sm:before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {historyEvents.map((event) => {
              const badge = getEventTypeBadge(event.eventType);

              return (
                <div key={event.id} className="relative group">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-5 sm:-left-7 top-1.5 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full border-2 border-white text-2xs font-bold shadow-2xs ${
                      event.isConflictingTransfer
                        ? "bg-rose-600 text-white"
                        : event.eventType === "LITIGATION"
                        ? "bg-rose-500 text-white"
                        : event.eventType === "MUTATION"
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-600 text-white"
                    }`}
                  >
                    <span className="h-1 w-1 rounded-full bg-white" />
                  </div>

                  {/* Event Content Card */}
                  <div
                    className={`rounded-lg border p-3 text-xs space-y-1.5 shadow-2xs transition hover:border-slate-300 ${
                      event.isConflictingTransfer
                        ? "border-rose-300 bg-rose-50/40"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    {/* Event Header */}
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">
                          {event.titleBn}
                        </span>
                        <span className={`text-2xs font-semibold px-2 py-0.5 rounded-md border ${badge.badgeClass}`}>
                          {badge.label}
                        </span>
                        {event.isConflictingTransfer && (
                          <span className="text-2xs font-bold px-2 py-0.5 rounded-md bg-rose-600 text-white">
                            {t.history.conflictingClaim}
                          </span>
                        )}
                      </div>
                      <span className="text-2xs font-semibold text-slate-600 bn-num bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                        {event.dateBn}
                      </span>
                    </div>

                    {/* Parties involved */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-600">
                      {event.fromPartyBn && (
                        <div>
                          <span className="font-semibold text-slate-700">{t.history.transferor} </span>
                          <span>{event.fromPartyBn}</span>
                        </div>
                      )}
                      {event.fromPartyBn && <span className="text-slate-300">➔</span>}
                      <div>
                        <span className="font-semibold text-slate-700">{t.history.transferee} </span>
                        <span className="text-slate-900 font-medium">{event.toPartyBn}</span>
                      </div>
                    </div>

                    {/* Identifiers pills */}
                    <div className="flex flex-wrap items-center gap-1 text-2xs pt-0.5">
                      {event.khatianNumber && (
                        <span className="rounded bg-slate-50 border border-slate-200 px-1.5 py-0.5 text-slate-700 bn-num">
                          {language === "en" ? "Khatian: " : "খতিয়ান: "}{formatNum(event.khatianNumber)}
                        </span>
                      )}
                      {event.dagNumber && (
                        <span className="rounded bg-slate-50 border border-slate-200 px-1.5 py-0.5 text-slate-700 bn-num">
                          {language === "en" ? "Dag: " : "দাগ: "}{formatNum(event.dagNumber)}
                        </span>
                      )}
                      {event.deedNumber && (
                        <span className="rounded bg-slate-50 border border-slate-200 px-1.5 py-0.5 text-slate-700 font-mono">
                          {language === "en" ? "Deed: " : "দলিল: "}{event.deedNumber}
                        </span>
                      )}
                      {event.recordedArea && (
                        <span className="rounded bg-slate-50 border border-slate-200 px-1.5 py-0.5 text-slate-700 bn-num">
                          {language === "en" ? "Area: " : "পরিমাণ: "}{formatNum(event.recordedArea)} {event.areaUnit || (language === "en" ? "Dec" : "শতক")}
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
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/60 p-4 text-center text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">{t.history.noHistory}</p>
            <p>{t.history.noHistorySub}</p>
          </div>
        )}
      </div>

      {/* 3. SIMULATED LITIGATION & ENCUMBRANCE STATUS BOX (if active) */}
      {(parcel.litigationStatus?.hasActiveCase || parcel.encumbranceStatus?.isEncumbered) && (
        <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-3 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-rose-950 text-xs sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />
            <span>{t.history.litigationAlert}</span>
          </div>
          {parcel.litigationStatus?.hasActiveCase && (
            <div className="text-rose-900 leading-relaxed pl-3 border-l-2 border-rose-300 text-xs">
              <p><strong>{t.history.caseDetails}</strong> {parcel.litigationStatus.caseNumber} — {parcel.litigationStatus.courtNameBn}</p>
              <p><strong>{t.history.caseSubject}</strong> {parcel.litigationStatus.caseTypeBn}</p>
              {parcel.litigationStatus.detailsBn && (
                <p className="text-rose-800/90 mt-0.5">{parcel.litigationStatus.detailsBn}</p>
              )}
            </div>
          )}
          {parcel.encumbranceStatus?.isEncumbered && (
            <div className="text-amber-950 leading-relaxed pl-3 border-l-2 border-amber-300 mt-1.5 text-xs">
              <p><strong>{t.history.govtBuffer}</strong> {parcel.encumbranceStatus.institutionNameBn}</p>
              <p>{parcel.encumbranceStatus.detailsBn}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

