"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  FileText,
  AlertTriangle,
  RefreshCw,
  Printer,
  X,
} from "lucide-react";

export interface DetailedRecord {
  id: string;
  createdAt: string;
  status: string;
  riskLevel: string;
  riskScore: number | null;
  documentFilename: string | null;
  notes: string | null;
  submitted: Record<string, string> | null;
  verification: {
    category: string;
    categoryLabelBn: string;
    summaryBn: string;
    advisoryBn: string;
    matchCount: number;
    mismatchCount: number;
    missingCount: number;
    discrepancyReasons: string[];
    fieldResults: Array<{
      fieldName: string;
      fieldLabelBn: string;
      referenceValue: string;
      submittedValue: string;
      status: "MATCH" | "MISMATCH" | "MISSING";
      statusLabelBn: string;
      reasonBn?: string;
    }>;
  } | null;
  extractedOcr: Record<string, { value: string | null; confidence: string }> | null;
  riskSummary: Record<string, unknown> | null;
}

interface VerificationDetailModalProps {
  recordId: string | null;
  onClose: () => void;
}

export default function VerificationDetailModal({
  recordId,
  onClose,
}: VerificationDetailModalProps) {
  const { language, t } = useLanguage();
  const [record, setRecord] = useState<DetailedRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recordId) return;

    let isMounted = true;

    fetch(`/api/verify/history?id=${encodeURIComponent(recordId)}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(
            language === "en"
              ? "Failed to load verification record details."
              : "রেকর্ডের বিস্তারিত লোড করা সম্ভব হয়নি।"
          );
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setRecord(data.record || null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [recordId, language]);

  if (!recordId) return null;

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      const formatted = d.toLocaleDateString(
        language === "bn" ? "bn-BD" : "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
      return formatted;
    } catch {
      return isoStr;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-3 sm:px-6 sm:py-3.5 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {t.verificationHistory.modalTitle}
              </h3>
              <span className="text-2xs px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {language === "en" ? "Permanent Record" : "সংরক্ষিত রেকর্ড"}
              </span>
            </div>
            {record && (
              <p className="text-2xs text-slate-500 bn-num">
                {formatDate(record.createdAt)}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label={t.verificationHistory.modalClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {loading ? (
            <div className="py-12 text-center space-y-2">
              <RefreshCw className="h-7 w-7 text-emerald-700 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-600">
                {language === "en"
                  ? "Loading verification record..."
                  : "রেকর্ডের বিস্তারিত লোড হচ্ছে..."}
              </p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-center space-y-2">
              <AlertTriangle className="h-6 w-6 text-rose-600 mx-auto" />
              <p className="text-xs font-semibold text-rose-800">{error}</p>
            </div>
          ) : record ? (
            <div className="space-y-4">
              {/* Category Status Banner */}
              <div
                className={`rounded-xl border p-3.5 ${
                  record.verification?.category === "NO_DISCREPANCIES"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                    : record.verification?.category === "DIFFERENCES_REQUIRE_REVIEW"
                    ? "border-rose-200 bg-rose-50 text-rose-950"
                    : "border-amber-200 bg-amber-50 text-amber-950"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-bold text-xs ${
                      record.verification?.category === "NO_DISCREPANCIES"
                        ? "bg-emerald-600 text-white"
                        : record.verification?.category === "DIFFERENCES_REQUIRE_REVIEW"
                        ? "bg-rose-600 text-white"
                        : "bg-amber-600 text-white"
                    }`}
                  >
                    {record.verification?.category === "NO_DISCREPANCIES" ? "✓" : "!"}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold">
                      {record.verification?.categoryLabelBn || record.riskLevel}
                    </h4>
                    <p className="text-xs leading-relaxed opacity-90">
                      {record.verification?.summaryBn || record.notes}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submitted Land Snapshot */}
              {record.submitted && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-2">
                  <h4 className="text-2xs font-bold uppercase tracking-wide text-slate-600">
                    {language === "en"
                      ? "Submitted Land Identification"
                      : "দাখিলকৃত ভূমির পরিচিতি"}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-2xs text-slate-400 block">
                        {language === "en" ? "Mouza" : "মৌজা"}
                      </span>
                      <span className="font-bold text-slate-800">
                        {record.submitted.mouza || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-2xs text-slate-400 block">
                        {language === "en" ? "Plot (Dag)" : "দাগ নম্বর"}
                      </span>
                      <span className="font-bold text-slate-800 bn-num">
                        {record.submitted.dagNumber || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-2xs text-slate-400 block">
                        {language === "en" ? "Khatian" : "খতিয়ান"}
                      </span>
                      <span className="font-bold text-slate-800 bn-num">
                        {record.submitted.khatianNumber || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-2xs text-slate-400 block">
                        {language === "en" ? "Area" : "জমির পরিমাণ"}
                      </span>
                      <span className="font-bold text-slate-800 bn-num">
                        {record.submitted.recordedArea}{" "}
                        {record.submitted.areaUnit || "শতক"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Field-by-Field Comparative Results */}
              {record.verification?.fieldResults &&
                record.verification.fieldResults.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-2xs font-bold uppercase tracking-wide text-slate-700">
                      {language === "en"
                        ? "Field-Level Comparison"
                        : "ক্ষেত্রভিত্তিক তুলনামূলক নিরীক্ষা"}
                    </h4>
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-2xs">
                          <tr>
                            <th className="px-3 py-2">
                              {language === "en" ? "Field" : "ক্ষেত্র"}
                            </th>
                            <th className="px-3 py-2">
                              {language === "en" ? "Reference" : "রেফারেন্স"}
                            </th>
                            <th className="px-3 py-2">
                              {language === "en" ? "Submitted" : "দাখিলকৃত"}
                            </th>
                            <th className="px-3 py-2 text-center">
                              {language === "en" ? "Status" : "অবস্থা"}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {record.verification.fieldResults.map((fr, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="px-3 py-2 font-medium text-slate-900">
                                {fr.fieldLabelBn || fr.fieldName}
                              </td>
                              <td className="px-3 py-2 text-slate-600 bn-num">
                                {fr.referenceValue}
                              </td>
                              <td className="px-3 py-2 font-semibold text-slate-900 bn-num">
                                {fr.submittedValue}
                              </td>
                              <td className="px-3 py-2 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-2xs font-bold ${
                                    fr.status === "MATCH"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : fr.status === "MISMATCH"
                                      ? "bg-rose-100 text-rose-800"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {fr.status === "MATCH"
                                    ? "✓ মিল"
                                    : fr.status === "MISMATCH"
                                    ? "✕ অমিল"
                                    : "! অনুপস্থিত"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {/* Identified Discrepancy Reasons (if any) */}
              {record.verification?.discrepancyReasons &&
                record.verification.discrepancyReasons.length > 0 && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3 space-y-1.5">
                    <h4 className="text-2xs font-bold text-rose-950 uppercase tracking-wide">
                      {language === "en"
                        ? "Identified Discrepancy Details:"
                        : "চিহ্নিত অমিল ও সতর্কবার্তা:"}
                    </h4>
                    <ul className="space-y-1 text-xs text-rose-900 pl-4 list-disc leading-relaxed">
                      {record.verification.discrepancyReasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* OCR Metadata Snapshot (if available) */}
              {record.extractedOcr &&
                Object.keys(record.extractedOcr).length > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-emerald-50/30 p-3 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-emerald-700" />
                      <h4 className="text-2xs font-bold text-emerald-950 uppercase tracking-wide">
                        {language === "en"
                          ? "Document OCR Metadata (AI Extracted)"
                          : "দলিল OCR মেটাডেটা (AI উদ্ধারকৃত)"}
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {Object.entries(record.extractedOcr).map(
                        ([key, val]) =>
                          val.value !== null && (
                            <span
                              key={key}
                              className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-slate-800"
                            >
                              <span className="text-slate-400 text-2xs">
                                {key}:
                              </span>
                              <span className="font-semibold">{val.value}</span>
                              <span className="text-[10px] text-emerald-700">
                                ({val.confidence})
                              </span>
                            </span>
                          )
                      )}
                    </div>
                  </div>
                )}

              {/* Legal Advisory */}
              <div className="rounded-xl bg-slate-100/90 border border-slate-200 p-3 text-2xs sm:text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900">
                  {language === "en" ? "Civic Tech Advisory: " : "নাগরিক পরামর্শ: "}
                </span>
                <span>
                  {record.verification?.advisoryBn ||
                    (language === "en"
                      ? "This verification was conducted against demonstration cadastral records. Always verify original title records at the Assistant Commissioner (Land) office."
                      : "এটি কাল্পনিক ডেমো রেকর্ডের ভিত্তিতে তৈরি প্রাক-যাচাই। চূড়ান্ত লেনদেনের পূর্বে মূল দলিল ও খতিয়ান সহকারী কমিশনার (ভূমি) অফিসে অনুসন্ধান করুন।")}
                </span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-4 py-2.5 sm:px-6 sm:py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition shadow-2xs cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-slate-500" />
            <span>{t.verificationHistory.printReport}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            {t.verificationHistory.modalClose}
          </button>
        </div>
      </div>
    </div>
  );
}
