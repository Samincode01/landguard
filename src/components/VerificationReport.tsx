"use client";

import React, { useMemo, useState } from "react";
import { VerificationResult } from "@/lib/verification";
import { analyzeParcelRisk } from "@/lib/risk-analysis";
import {
  generateReportReference,
  formatReportDateTime,
  getBuyerDueDiligenceChecklist,
} from "@/lib/report-utils";
import { toBengaliNumerals, formatLandArea } from "@/lib/formatters";
import { LandHistoryEvent } from "@/data/demo-data";

interface VerificationReportProps {
  result: VerificationResult;
  onBack: () => void;
  onClose?: () => void;
}

export default function VerificationReport({
  result,
  onBack,
  onClose,
}: VerificationReportProps) {
  // Generate session reference deterministically for this parcel submission
  const reportRef = useMemo(
    () =>
      generateReportReference(
        `${result.referenceParcel.id}-${result.submitted.dagNumber}-${result.submitted.khatianNumber}`
      ),
    [result]
  );

  // Generation timestamp
  const [reportDate] = useState(() => formatReportDateTime(new Date()));

  // Deterministic explainable risk analysis of the reference parcel
  const riskAnalysis = useMemo(
    () => analyzeParcelRisk(result.referenceParcel),
    [result.referenceParcel]
  );

  // Due diligence checklist items
  const checklist = useMemo(() => getBuyerDueDiligenceChecklist(), []);

  // History events
  const historyEvents = result.referenceParcel.historyEvents || [];

  // Native browser print handler
  const handlePrint = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (typeof window !== "undefined") {
      window.print();
    }
  };

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
    <div className="report-root-container w-full max-w-4xl mx-auto space-y-6">
      {/* ── SCREEN ACTION BAR (Hidden in print) ── */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition active:scale-95 shadow-2xs"
          >
            <svg
              className="h-4 w-4 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span>ফিরে যান</span>
          </button>
          <span className="text-xs text-slate-500 hidden sm:inline">
            যাচাই ফলাফল স্ক্রিনে ফিরে যেতে
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              বন্ধ করুন
            </button>
          )}

          <button
            type="button"
            onClick={handlePrint}
            id="btn-print-verification-report"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow hover:bg-emerald-900 transition active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-1"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.72 13.829c-.24-1.076-.672-2.83-1.01-4.22m14.58 4.22c.24-1.076.672-2.83 1.01-4.22M3 13.5h18M6.75 6.75h10.5a2.25 2.25 0 012.25 2.25v6a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 15v-6a2.25 2.25 0 012.25-2.25zM6.75 17.25h10.5v3a1.5 1.5 0 01-1.5 1.5H8.25a1.5 1.5 0 01-1.5-1.5v-3z"
              />
            </svg>
            <span>রিপোর্ট প্রিন্ট / PDF সংরক্ষণ</span>
          </button>
        </div>
      </div>

      {/* Screen helper tip (Hidden in print) */}
      <div className="no-print flex items-center gap-2 rounded-xl bg-emerald-50/70 border border-emerald-200/80 px-4 py-2 text-xs text-emerald-900">
        <svg className="h-4 w-4 text-emerald-700 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <span>
          <strong>পরামর্শ:</strong> ব্রাউজারের প্রিন্ট ডায়ালগে Destination হিসেবে &ldquo;Save as PDF&rdquo; নির্বাচন করে পুরো রিপোর্টটি সরাসরি রঙিন বা সাদাকালো PDF হিসেবে সংরক্ষণ করতে পারেন।
        </span>
      </div>

      {/* ── PRINTABLE SHEET CONTAINER ── */}
      <div
        id="landguard-printable-report"
        className="report-sheet bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 text-slate-900 space-y-6"
      >
        {/* 1. REPORT HEADER */}
        <div className="border-b-2 border-emerald-800 pb-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100/90 px-2.5 py-0.5 text-xs font-bold text-emerald-900 border border-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-700" />
                <span>ল্যান্ডটেক ইনোভেশন হ্যাকাথন ২০২৬ (ট্র্যাক P5 — কেনার আগেই যাচাই)</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                ল্যান্ডগার্ড বিডি (LandGuard BD)
              </h1>
              <p className="text-sm font-semibold text-emerald-900">
                ভূমি প্রাক-ক্রয় তথ্য যাচাই ও তুলনামূলক ঝুঁকি নিরীক্ষা প্রতিবেদন
              </p>
              <p className="text-xs text-slate-500">
                Pre-Purchase Land Document Verification & Cadastral Audit Report
              </p>
            </div>

            {/* Session Reference & Date Meta Box */}
            <div className="sm:text-right shrink-0 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-500">প্রতিবেদন রেফারেন্স নং:</span>{" "}
                <strong className="font-mono font-bold text-slate-900">{reportRef}</strong>
              </div>
              <div>
                <span className="text-slate-500">ইস্যুর তারিখ ও সময়:</span>{" "}
                <strong className="font-medium text-slate-800">{reportDate}</strong>
              </div>
              <div>
                <span className="text-slate-500">নিরীক্ষার ধরন:</span>{" "}
                <span className="font-medium text-slate-700">ডিজিটাল প্রাক-নিরীক্ষা (কৃত্রিম ডেমো ডেটা)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. SYNTHETIC DATA & LEGAL DISCLAIMER (Prominent) */}
        <div className="avoid-page-break rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-900 uppercase tracking-wide">
            <svg className="h-4 w-4 text-amber-700 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>কৃত্রিম ডেমো ডেটা সতর্কবার্তা ও আইনি সীমাবদ্ধতার স্পষ্ট ঘোষণা</span>
          </div>
          <div className="space-y-1.5 leading-relaxed text-amber-950/90">
            <p>
              <strong>১. কৃত্রিম ডেমো ডেটা:</strong> এই প্রতিবেদনে ব্যবহৃত রেফারেন্স রেকর্ড, দাগ-খতিয়ান, ব্যক্তি মালিকানার নাম ও আদালতের মোকদ্দমার তথ্যসমূহ সম্পূর্ণ কাল্পনিক ও কৃত্রিম ডেমো ডেটা (Synthetic Data)। বাস্তব কোনো ব্যক্তি, চলমান মামলা বা প্রকৃত ভূ-সম্পত্তির সাথে এর কোনো সম্পর্ক নেই।
            </p>
            <p>
              <strong>২. আইনি মতামত বা স্বত্ব নিশ্চয়তা নয়:</strong> এই প্রতিবেদনটি কেবল দাখিলকৃত তথ্যের সাথে উপলব্ধ রেফারেন্স তথ্যের কম্পিউটার-ভিত্তিক প্রাথমিক প্রাক-তুলনা। এটি বাংলাদেশ সরকারের কোনো প্রাতিষ্ঠানিক প্রত্যয়নপত্র, সাব-রেজিস্ট্রার বা সহকারী কমিশনারের (ভূমি) কোনো সনদ, অভিজ্ঞ আইনজীবীর আইনি মতামত (legal opinion), বা স্বত্বের চূড়ান্ত গ্যারান্টি (title guarantee) নয়।
            </p>
            <p>
              <strong>৩. কোনো পক্ষকে প্রতারক প্রমাণের দাবি নয়:</strong> কোনো তথ্যের অমিল বা অসঙ্গতি কোনো অপরাধ বা প্রতারণার অকাট্য প্রমাণ নয়; এটি কেবল সংশ্লিষ্ট সরকারি দপ্তরে সশরীরে অনুসন্ধানের পরামর্শ নির্দেশ করে।
            </p>
          </div>
        </div>

        {/* 3. PARCEL IDENTIFIERS & LOCATION SUMMARY */}
        <div className="avoid-page-break space-y-2.5">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-700" />
            <span>১. নির্বাচিত প্লটের পরিচিতি ও অবস্থান বিবরণ (রেফারেন্স রেকর্ড)</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 space-y-0.5">
              <span className="text-slate-500 block">জেলা:</span>
              <strong className="text-slate-900 text-sm font-bold">
                {result.referenceParcel.district}
              </strong>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 space-y-0.5">
              <span className="text-slate-500 block">উপজেলা / থানা:</span>
              <strong className="text-slate-900 text-sm font-bold">
                {result.referenceParcel.upazila}
              </strong>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 space-y-0.5">
              <span className="text-slate-500 block">মৌজা ও জে.এল. নং:</span>
              <strong className="text-slate-900 text-sm font-bold bn-num">
                {result.referenceParcel.mouza} (জে.এল. {result.referenceParcel.jlNumber})
              </strong>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 space-y-0.5">
              <span className="text-slate-500 block">দাগ নম্বর (প্লট):</span>
              <strong className="text-slate-900 text-sm font-bold bn-num">
                {result.referenceParcel.dagNumber}
              </strong>
            </div>

            <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 space-y-0.5">
              <span className="text-slate-500 block">খতিয়ান ও জরিপ টাইপ:</span>
              <strong className="text-slate-900 text-sm font-bold bn-num">
                {result.referenceParcel.khatianNumber} ({result.referenceParcel.khatianType})
              </strong>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 space-y-0.5">
              <span className="text-slate-500 block">রেকর্ডীয় জমির পরিমাণ:</span>
              <strong className="text-slate-900 text-sm font-bold bn-num">
                {formatLandArea(result.referenceParcel.recordedArea, result.referenceParcel.areaUnit)}
              </strong>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 space-y-0.5 col-span-2">
              <span className="text-slate-500 block">রেফারেন্স রেকর্ডভুক্ত মালিক:</span>
              <strong className="text-slate-900 text-sm font-bold">
                {result.referenceParcel.ownership.ownerName}
                <span className="ml-1 text-[10px] font-normal text-slate-500">
                  (কৃত্রিম ডেমো স্বত্বাধিকারী)
                </span>
              </strong>
            </div>
          </div>
        </div>

        {/* 4. OVERALL VERIFICATION STATUS BANNER */}
        <div
          className={`avoid-page-break rounded-xl border p-4 ${
            result.category === "NO_DISCREPANCIES"
              ? "border-emerald-200 bg-emerald-50/80 text-emerald-950"
              : result.category === "DIFFERENCES_REQUIRE_REVIEW"
              ? "border-rose-200 bg-rose-50/80 text-rose-950"
              : "border-amber-200 bg-amber-50/80 text-amber-950"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold ${
                result.category === "NO_DISCREPANCIES"
                  ? "bg-emerald-600 text-white"
                  : result.category === "DIFFERENCES_REQUIRE_REVIEW"
                  ? "bg-rose-600 text-white"
                  : "bg-amber-600 text-white"
              }`}
            >
              {result.category === "NO_DISCREPANCIES" ? "✓" : "!"}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold leading-tight">
                  দাখিলকৃত দলিলের সামগ্রিক ফলাফল: {result.categoryLabelBn}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/80 font-bold border border-current/20">
                  {result.category === "NO_DISCREPANCIES"
                    ? "সব ক্ষেত্র মিলেছে"
                    : `${toBengaliNumerals(result.mismatchCount)}টি অমিল শনাক্ত`}
                </span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed opacity-95">{result.summaryBn}</p>
            </div>
          </div>
        </div>

        {/* 5. FIELD-BY-FIELD COMPARISON TABLE */}
        <div className="avoid-page-break space-y-2.5">
          <div className="flex items-center justify-between border-b pb-1">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-700" />
              <span>২. ক্ষেত্রভিত্তিক তুলনামূলক নিরীক্ষা (দাখিলকৃত বনাম রেফারেন্স রেকর্ড)</span>
            </h2>
            <span className="text-xs text-slate-500 bn-num">
              মোট ক্ষেত্র: {toBengaliNumerals(result.fieldResults.length)}টি | মিল: {toBengaliNumerals(result.matchCount)}টি | অমিল: {toBengaliNumerals(result.mismatchCount)}টি
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-300 bg-slate-100 text-slate-700 font-bold">
                <tr>
                  <th className="px-3.5 py-2.5 w-1/4">তালিকাকৃত ক্ষেত্র</th>
                  <th className="px-3.5 py-2.5 w-1/4">রেফারেন্স রেকর্ড (কৃত্রিম)</th>
                  <th className="px-3.5 py-2.5 w-1/4">আপনার দাখিলকৃত তথ্য</th>
                  <th className="px-3.5 py-2.5 text-center w-1/4">নিরীক্ষা ফলাফল</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {result.fieldResults.map((field) => (
                  <tr key={field.fieldName} className="hover:bg-slate-50/50">
                    <td className="px-3.5 py-2.5 font-semibold text-slate-800 whitespace-nowrap">
                      {field.fieldLabelBn}
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-600 bn-num">
                      {field.referenceValue}
                    </td>
                    <td
                      className={`px-3.5 py-2.5 font-medium bn-num ${
                        field.status === "MISMATCH"
                          ? "text-rose-700 font-bold bg-rose-50/30"
                          : field.status === "MISSING"
                          ? "text-slate-400 italic"
                          : "text-slate-900"
                      }`}
                    >
                      {field.submittedValue}
                    </td>
                    <td className="px-3.5 py-2.5 text-center">
                      {field.status === "MATCH" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                          মিল রয়েছে
                        </span>
                      )}
                      {field.status === "MISMATCH" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-800 border border-rose-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                          অমিল (পার্থক্য)
                        </span>
                      )}
                      {field.status === "MISSING" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700 border border-slate-200">
                          তথ্য দেওয়া হয়নি
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Discrepancy Reasons List */}
          {result.discrepancyReasons.length > 0 && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3.5 space-y-1.5 text-xs text-rose-950">
              <h4 className="font-bold flex items-center gap-1.5 text-rose-900">
                <span className="h-2 w-2 rounded-full bg-rose-600" />
                চিহ্নিত অমিলসমূহের সুনির্দিষ্ট বিবরণ ({toBengaliNumerals(result.discrepancyReasons.length)}টি):
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-rose-900/90 leading-relaxed">
                {result.discrepancyReasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 6. EXPLAINABLE RISK ANALYSIS OUTCOME */}
        <div className="avoid-page-break space-y-3">
          <div className="flex items-center justify-between border-b pb-1">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-700" />
              <span>৩. প্লটের ধারাবাহিক ঝুঁকি ও অসঙ্গতি বিশ্লেষণ (Explainable Risk Audit)</span>
            </h2>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                riskAnalysis.outcome === "NEEDS_REVIEW"
                  ? "bg-rose-50 text-rose-800 border-rose-200"
                  : riskAnalysis.outcome === "NO_FLAGGED_DISCREPANCIES"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}
            >
              {riskAnalysis.outcomeLabelBn}
            </span>
          </div>

          {/* Risk Analysis Summary Card */}
          <div
            className={`rounded-xl border p-4 text-xs leading-relaxed ${
              riskAnalysis.outcome === "NEEDS_REVIEW"
                ? "border-rose-200 bg-rose-50/50 text-rose-950"
                : riskAnalysis.outcome === "NO_FLAGGED_DISCREPANCIES"
                ? "border-emerald-200 bg-emerald-50/50 text-emerald-950"
                : "border-amber-200 bg-amber-50/50 text-amber-950"
            }`}
          >
            <p className="font-semibold text-slate-900 mb-1">{riskAnalysis.summaryBn}</p>
            {riskAnalysis.insufficientInfoReasonBn && (
              <p className="text-amber-900/90 italic">{riskAnalysis.insufficientInfoReasonBn}</p>
            )}
          </div>

          {/* Explainable Warnings (4-Part Explanations) */}
          {riskAnalysis.warnings.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                শনাক্তকৃত সতর্কবার্তা ও যৌক্তিক বিশ্লেষণ ({toBengaliNumerals(riskAnalysis.warnings.length)}টি বিষয়):
              </h4>
              <div className="space-y-3">
                {riskAnalysis.warnings.map((warning, idx) => (
                  <div
                    key={idx}
                    className="avoid-page-break rounded-xl border border-rose-200 bg-white p-3.5 text-xs shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="font-bold text-rose-950 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-rose-600" />
                        {toBengaliNumerals(idx + 1)}. {warning.ruleTitleBn}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 uppercase">
                        {warning.severity === "CRITICAL"
                          ? "জরুরি পর্যালোচনা"
                          : warning.severity === "HIGH"
                          ? "উচ্চ গুরুত্ব"
                          : "মাঝারি ঝুঁকি"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-800">
                      <div className="bg-slate-50/80 rounded-lg p-2 border border-slate-100 space-y-0.5">
                        <span className="font-bold text-slate-600 text-[11px] block">
                          ক. কী পাওয়া গেছে:
                        </span>
                        <p className="leading-relaxed">{warning.whatFoundBn}</p>
                      </div>
                      <div className="bg-slate-50/80 rounded-lg p-2 border border-slate-100 space-y-0.5">
                        <span className="font-bold text-slate-600 text-[11px] block">
                          খ. যে রেকর্ডে চিহ্নিত:
                        </span>
                        <p className="leading-relaxed font-mono text-[11px]">{warning.recordsTriggeredBn}</p>
                      </div>
                      <div className="bg-slate-50/80 rounded-lg p-2 border border-slate-100 space-y-0.5">
                        <span className="font-bold text-slate-600 text-[11px] block">
                          গ. কেন পর্যালোচনা প্রয়োজন:
                        </span>
                        <p className="leading-relaxed">{warning.whyReviewBn}</p>
                      </div>
                      <div className="bg-emerald-50/60 rounded-lg p-2 border border-emerald-100 space-y-0.5">
                        <span className="font-bold text-emerald-800 text-[11px] block">
                          ঘ. প্রস্তাবিত পরবর্তী পদক্ষেপ:
                        </span>
                        <p className="leading-relaxed text-emerald-950 font-medium">{warning.nextStepsBn}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : riskAnalysis.outcome === "NO_FLAGGED_DISCREPANCIES" ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3 text-xs text-emerald-950">
              <p className="flex items-center gap-1.5 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                উপলব্ধ কৃত্রিম ডেমো রেকর্ডে কোনো দ্বৈত বিক্রয়, নামের অসঙ্গতি বা দেওয়ানি মোকদ্দমার সূচক পাওয়া যায়নি।
              </p>
            </div>
          ) : null}
        </div>

        {/* 7. RELEVANT LAND HISTORY (CHRONOLOGICAL TIMELINE) */}
        <div className="avoid-page-break space-y-2.5">
          <div className="flex items-center justify-between border-b pb-1">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-700" />
              <span>৪. ধারাবাহিক হস্তান্তর ও বায়া দলিল ইতিহাস (কৃত্রিম ডেমো রেকর্ড)</span>
            </h2>
            <span className="text-xs text-slate-400">
              {historyEvents.length > 0
                ? `${toBengaliNumerals(historyEvents.length)}টি ঐতিহাসিক ঘটনা লিপিবদ্ধ`
                : "কোনো ইতিহাস রেকর্ড নেই"}
            </span>
          </div>

          {historyEvents.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-300 bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="px-3 py-2 w-20">সন / তারিখ</th>
                    <th className="px-3 py-2 w-28">ঘটনার ধরন</th>
                    <th className="px-3 py-2">হস্তান্তর পক্ষসমূহ (থেকে ➔ প্রতি)</th>
                    <th className="px-3 py-2">দলিল / খতিয়ান নম্বর</th>
                    <th className="px-3 py-2">সারসংক্ষেপ ও মন্তব্য</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {historyEvents.map((evt) => {
                    const badge = getEventTypeBadge(evt.eventType);
                    return (
                      <tr
                        key={evt.id}
                        className={
                          evt.isConflictingTransfer
                            ? "bg-rose-50/60 font-medium"
                            : "hover:bg-slate-50/50"
                        }
                      >
                        <td className="px-3 py-2 text-slate-700 font-bold bn-num whitespace-nowrap">
                          {toBengaliNumerals(evt.year)}
                          <span className="block text-[10px] font-normal text-slate-500">
                            {evt.dateBn}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${badge.badgeClass}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-slate-800">
                          <div className="space-y-0.5">
                            {evt.fromPartyBn && (
                              <div className="text-slate-500 text-[11px]">
                                পূর্ববর্তী: {evt.fromPartyBn}
                              </div>
                            )}
                            <div className="font-semibold text-slate-900">
                              গ্রহীতা: {evt.toPartyBn}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-slate-700 font-mono text-[11px] bn-num">
                          {evt.deedNumber ? (
                            <div>দলিল: {evt.deedNumber}</div>
                          ) : evt.khatianNumber ? (
                            <div>খতিয়ান: {toBengaliNumerals(evt.khatianNumber)}</div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-slate-600 leading-relaxed">
                          {evt.notesBn}
                          {evt.isConflictingTransfer && (
                            <span className="block text-rose-700 font-bold text-[10px] mt-0.5">
                              [দ্বৈত হস্তান্তরের সন্দেহজনক সংকেত]
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 text-center">
              উপলব্ধ কৃত্রিম ডেমো ডেটাসেটে এই প্লটের ধারাবাহিক হস্তান্তর ইতিহাস বা বায়া দলিলের তথ্য এখনো অন্তর্ভুক্ত করা হয়নি।
            </div>
          )}
        </div>

        {/* 8. PRACTICAL BUYER'S DUE DILIGENCE CHECKLIST */}
        <div className="avoid-page-break space-y-2.5">
          <div className="flex items-center justify-between border-b pb-1">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-700" />
              <span>৫. জমি ক্রেতার জন্য অত্যাবশ্যকীয় সরকারি দপ্তর ও সরেজমিন করণীয় চেকলিস্ট</span>
            </h2>
            <span className="text-xs text-emerald-800 font-bold">আইনগত সতর্কতা</span>
          </div>

          <div className="space-y-2">
            {checklist.map((item, index) => (
              <div
                key={item.id}
                className="avoid-page-break rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs space-y-1.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-800 text-[10px] font-bold text-white">
                      {toBengaliNumerals(index + 1)}
                    </span>
                    <h4 className="font-bold text-slate-900">{item.titleBn}</h4>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      item.importance === "CRITICAL"
                        ? "bg-rose-50 text-rose-800 border-rose-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    {item.importanceLabelBn}
                  </span>
                </div>

                <div className="text-slate-700 pl-7 space-y-1">
                  <p className="leading-relaxed">{item.actionBn}</p>
                  <p className="text-[11px] text-slate-500">
                    <strong>সংশ্লিষ্ট কর্তৃপক্ষ / অফিস:</strong> {item.officialSourceBn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 9. REPORT FOOTER & SIGN-OFF METADATA */}
        <div className="avoid-page-break border-t-2 border-slate-200 pt-4 space-y-3 text-xs text-slate-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="font-semibold text-slate-800">
                ল্যান্ডগার্ড বিডি (LandGuard BD) — নাগরিক প্রযুক্তি উদ্যোগ
              </p>
              <p className="leading-relaxed">
                উদ্দেশ্য: জমি ক্রয়ের পূর্বে সাধারণ ক্রেতাকে প্রাথমিক সতর্কতা ও যাচাইকরণে সহায়তা প্রদান।
              </p>
              <p className="text-[11px] font-mono text-slate-400">
                Session ID: {reportRef} | Generated in-memory (No persistence)
              </p>
            </div>

            <div className="sm:text-right space-y-1">
              <p className="text-slate-600 font-medium">
                প্রতিবেদন প্রস্তুতের তারিখ: <strong className="text-slate-800">{reportDate}</strong>
              </p>
              <div className="pt-2">
                <div className="inline-block border-t border-slate-400 px-6 pt-1 text-[11px] font-semibold text-slate-700">
                  সিস্টেম জেনারেটেড ডিজিটাল প্রিভিউ
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center border-t border-slate-100 pt-2">
            ভূমি মন্ত্রণালয় ও সংশ্লিষ্ট সরকারি কর্তৃপক্ষের আসল বালাম ও রেকর্ডই চূড়ান্ত আইনগত প্রমাণ। জমি ক্রয়ের আগে বিশেষজ্ঞ আইনজীবীর পরামর্শ গ্রহণ করুন।
          </div>
        </div>
      </div>
    </div>
  );
}
