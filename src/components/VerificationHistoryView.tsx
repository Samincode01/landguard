"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useDashboard } from "@/context/DashboardContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import VerificationModal from "@/components/VerificationModal";
import ChatSupportWidget from "@/components/ChatSupportWidget";
import VerificationDetailModal from "@/components/VerificationDetailModal";
import { SYNTHETIC_DEMO_PARCELS } from "@/data/demo-data";
import { toBengaliNumerals } from "@/lib/formatters";
import {
  ShieldCheck,
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileText,
  Calendar,
  Eye,
  Plus,
  RefreshCw,
} from "lucide-react";

export interface HistoryItem {
  id: string;
  createdAt: string;
  status: string;
  riskLevel: string;
  riskScore: number | null;
  documentFilename: string | null;
  hasOcr: boolean;
  landDetails: {
    parcelId?: string;
    ownerName?: string;
    district?: string;
    upazila?: string;
    mouza?: string;
    khatianNumber?: string;
    khatianType?: string;
    dagNumber?: string;
    recordedArea?: string;
    areaUnit?: string;
  } | null;
  category: "NO_DISCREPANCIES" | "DIFFERENCES_REQUIRE_REVIEW" | "INSUFFICIENT_INFO";
  categoryLabelBn: string;
  summaryBn: string;
  matchCount: number;
  mismatchCount: number;
  missingCount: number;
}

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

interface VerificationHistoryViewProps {
  hideHeaderFooter?: boolean;
}

export default function VerificationHistoryView({
  hideHeaderFooter = true,
}: VerificationHistoryViewProps) {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inspector modal state for viewing full saved record
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  // Modal controls
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Fetch verification history on demand
  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/verify/history", {
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data.verifications || []);
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(
          errData.error ||
            (language === "en"
              ? "Failed to load verification history."
              : "যাচাইকরণ ইতিহাস লোড করা যায়নি।")
        );
      }
    } catch {
      setError(
        language === "en"
          ? "Network error while loading history."
          : "ইতিহাস লোড করতে নেটওয়ার্ক সমস্যা হয়েছে।"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const loadInitialHistory = async () => {
      try {
        const res = await fetch("/api/verify/history", {
          headers: { "Cache-Control": "no-cache" },
        });
        if (ignore) return;
        if (res.ok) {
          const data = await res.json();
          setHistory(data.verifications || []);
        } else {
          const errData = await res.json().catch(() => ({}));
          setError(
            errData.error ||
              (language === "en"
                ? "Failed to load verification history."
                : "যাচাইকরণ ইতিহাস লোড করা যায়নি।")
          );
        }
      } catch {
        if (!ignore) {
          setError(
            language === "en"
              ? "Network error while loading history."
              : "ইতিহাস লোড করতে নেটওয়ার্ক সমস্যা হয়েছে।"
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadInitialHistory();

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, language]);

  // Open detail inspector for a specific record
  const handleOpenDetail = (id: string) => {
    setSelectedRecordId(id);
  };

  const handleCloseDetail = () => {
    setSelectedRecordId(null);
  };

  // Date formatter
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      if (language === "bn") {
        const d = toBengaliNumerals(date.getDate());
        const m = toBengaliNumerals(date.getMonth() + 1);
        const y = toBengaliNumerals(date.getFullYear());
        const h = toBengaliNumerals(date.getHours() % 12 || 12);
        const min = toBengaliNumerals(String(date.getMinutes()).padStart(2, "0"));
        const ampm = date.getHours() >= 12 ? "বিকাল/রাত" : "সকাল";
        return `${d}/${m}/${y}, ${ampm} ${h}:${min}`;
      } else {
        return date.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });
      }
    } catch {
      return isoString;
    }
  };

  // Stats calculation
  const totalCount = history.length;
  const matchCount = history.filter((h) => h.category === "NO_DISCREPANCIES").length;
  const discrepancyCount = history.filter((h) => h.category === "DIFFERENCES_REQUIRE_REVIEW").length;
  const insufficientCount = history.filter((h) => h.category === "INSUFFICIENT_INFO").length;

  // Dashboard context if embedded
  let dashboard: ReturnType<typeof useDashboard> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    dashboard = useDashboard();
  } catch {
    dashboard = null;
  }

  const handleOpenVerificationModal = () => {
    if (dashboard) {
      dashboard.openVerificationModal();
    } else {
      setIsVerificationModalOpen(true);
    }
  };

  return (
    <div className={hideHeaderFooter ? "w-full" : "flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900"}>
      {!hideHeaderFooter && (
        <Header
          onOpenVerificationModal={() => setIsVerificationModalOpen(true)}
          onOpenChat={() => setIsChatOpen(true)}
        />
      )}

      <div
        className={`dashboard-page-content flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 ${
          selectedRecordId ? "print:hidden" : ""
        }`}
      >
        {/* Compact Civic Tech Disclaimer Banner */}
        <DisclaimerBanner />

        {/* Breadcrumb & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/dashboard" className="hover:text-emerald-800 transition">
              {t.nav.dashboard}
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">
              {t.verificationHistory.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchHistory}
              disabled={isLoading}
              title={language === "en" ? "Refresh" : "রিফ্রেশ"}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-2xs cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-emerald-700" : "text-slate-500"}`} />
              <span className="hidden sm:inline">{language === "en" ? "Refresh" : "রিফ্রেশ"}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenVerificationModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-900 transition focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer active:scale-[0.98]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{t.verificationHistory.startVerificationBtn}</span>
            </button>
          </div>
        </div>

        {/* Page Title & User Summary */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-2xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                <span>{language === "en" ? "Authenticated Citizen Record" : "যাচাইকৃত নাগরিক রেকর্ড"}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {t.verificationHistory.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                {t.verificationHistory.subtitle}
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-200/80 text-center shrink-0">
              <div className="px-1.5 sm:px-2">
                <p className="text-2xs text-slate-500 font-medium">{language === "en" ? "Total" : "মোট"}</p>
                <p className="text-base sm:text-lg font-black text-slate-900 bn-num">
                  {language === "bn" ? toBengaliNumerals(totalCount) : totalCount}
                </p>
              </div>
              <div className="px-1.5 sm:px-2 border-l sm:border-x border-slate-200">
                <p className="text-2xs text-emerald-700 font-medium">{language === "en" ? "Matches" : "মিল"}</p>
                <p className="text-base sm:text-lg font-black text-emerald-800 bn-num">
                  {language === "bn" ? toBengaliNumerals(matchCount) : matchCount}
                </p>
              </div>
              <div className="px-1.5 sm:px-2 border-t sm:border-t-0 sm:border-r border-slate-200">
                <p className="text-2xs text-rose-600 font-medium">{language === "en" ? "Discrepancy" : "অমিল"}</p>
                <p className="text-base sm:text-lg font-black text-rose-700 bn-num">
                  {language === "bn" ? toBengaliNumerals(discrepancyCount) : discrepancyCount}
                </p>
              </div>
              <div className="px-1.5 sm:px-2 border-t sm:border-t-0 border-l border-slate-200">
                <p className="text-2xs text-amber-600 font-medium">{language === "en" ? "Insufficient" : "অপর্যাপ্ত"}</p>
                <p className="text-base sm:text-lg font-black text-amber-700 bn-num">
                  {language === "bn" ? toBengaliNumerals(insufficientCount) : insufficientCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section: Loading, Error, Empty State, or List */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-2xs">
            <RefreshCw className="h-8 w-8 text-emerald-700 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-700">
              {t.verificationHistory.loading}
            </p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3">
            <AlertTriangle className="h-8 w-8 text-rose-600 mx-auto" />
            <p className="text-sm font-semibold text-rose-800">{error}</p>
            <button
              type="button"
              onClick={fetchHistory}
              className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition"
            >
              {language === "en" ? "Try Again" : "পুনরায় চেষ্টা করুন"}
            </button>
          </div>
        ) : history.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 sm:p-16 text-center space-y-4 shadow-2xs">
            <div className="h-16 w-16 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-xs border border-emerald-100">
              <FileSearch className="h-8 w-8 text-emerald-700" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {t.verificationHistory.emptyTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {t.verificationHistory.emptySubtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenVerificationModal}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-emerald-900 transition active:scale-[0.98] cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{t.verificationHistory.startVerificationBtn}</span>
            </button>
          </div>
        ) : (
          /* Verification History Records Table / Grid */
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide">
                {language === "en" ? "Recent Verification Records" : "সাম্প্রতিক যাচাইকরণ রেকর্ড"}
              </h2>
              <span className="text-xs text-slate-500 bn-num">
                {language === "bn"
                  ? `${toBengaliNumerals(history.length)} ${t.verificationHistory.recordsCount}`
                  : `${history.length} ${t.verificationHistory.recordsCount}`}
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold text-2xs sm:text-xs">
                    <tr>
                      <th className="px-4 py-3 min-w-[140px]">{t.verificationHistory.dateCol}</th>
                      <th className="px-4 py-3 min-w-[180px]">{t.verificationHistory.parcelCol}</th>
                      <th className="px-4 py-3 min-w-[110px]">{t.verificationHistory.plotCol}</th>
                      <th className="px-4 py-3 min-w-[160px]">{t.verificationHistory.submittedOwnerCol}</th>
                      <th className="px-4 py-3 min-w-[150px]">{t.verificationHistory.statusCol}</th>
                      <th className="px-4 py-3 text-right min-w-[110px]">{t.verificationHistory.actionCol}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {history.map((item) => {
                      const isClean = item.category === "NO_DISCREPANCIES";
                      const isDiscrepant = item.category === "DIFFERENCES_REQUIRE_REVIEW";

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Date & OCR Badge */}
                          <td className="px-4 py-3.5 align-top">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 bn-num">
                                <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <span>{formatDate(item.createdAt)}</span>
                              </div>
                              {item.hasOcr && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                                  <FileText className="h-2.5 w-2.5 text-emerald-700" />
                                  <span>{t.verificationHistory.ocrBadge}</span>
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Parcel & Location */}
                          <td className="px-4 py-3.5 align-top">
                            <div className="space-y-0.5">
                              <p className="font-bold text-slate-900">
                                {item.landDetails?.mouza || (language === "en" ? "Unspecified Mouza" : "অনির্দিষ্ট মৌজা")}
                              </p>
                              <p className="text-xs text-slate-500">
                                {item.landDetails?.upazila ? `${item.landDetails.upazila}, ` : ""}
                                {item.landDetails?.district || ""}
                              </p>
                              {item.landDetails?.khatianNumber && (
                                <p className="text-2xs text-slate-500 font-medium bn-num">
                                  {language === "en" ? "Khatian: " : "খতিয়ান: "}
                                  <span className="font-semibold text-slate-800">{item.landDetails.khatianNumber}</span>
                                  {item.landDetails.khatianType && ` (${item.landDetails.khatianType})`}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Dag / Plot & Area */}
                          <td className="px-4 py-3.5 align-top">
                            <div className="space-y-0.5 bn-num">
                              <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-900 font-bold text-xs border border-slate-200/80">
                                #{item.landDetails?.dagNumber || "—"}
                              </span>
                              {item.landDetails?.recordedArea && (
                                <p className="text-2xs text-slate-600 font-medium">
                                  {item.landDetails.recordedArea} {item.landDetails.areaUnit || "শতক"}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Submitted Owner / Seller */}
                          <td className="px-4 py-3.5 align-top">
                            <div className="space-y-0.5">
                              <p className="font-semibold text-slate-900 leading-tight">
                                {item.landDetails?.ownerName || (language === "en" ? "Not Recorded" : "নাম অনুপস্থিত")}
                              </p>
                              {item.documentFilename && (
                                <p className="text-[11px] text-slate-400 truncate max-w-[150px]" title={item.documentFilename}>
                                  {item.documentFilename}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="px-4 py-3.5 align-top">
                            <div className="space-y-1">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-2xs font-bold border ${
                                  isClean
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                    : isDiscrepant
                                    ? "bg-rose-50 text-rose-800 border-rose-200"
                                    : "bg-amber-50 text-amber-800 border-amber-200"
                                }`}
                              >
                                {isClean ? (
                                  <CheckCircle2 className="h-3 w-3 text-emerald-700 shrink-0" />
                                ) : isDiscrepant ? (
                                  <AlertTriangle className="h-3 w-3 text-rose-600 shrink-0" />
                                ) : (
                                  <HelpCircle className="h-3 w-3 text-amber-600 shrink-0" />
                                )}
                                <span>
                                  {isClean
                                    ? t.verificationHistory.cleanBadge
                                    : isDiscrepant
                                    ? t.verificationHistory.discrepancyBadge
                                    : t.verificationHistory.insufficientBadge}
                                </span>
                              </span>

                              {isDiscrepant && item.mismatchCount > 0 && (
                                <p className="text-2xs text-rose-600 font-semibold bn-num">
                                  {language === "en"
                                    ? `${item.mismatchCount} Discrepancies`
                                    : `${toBengaliNumerals(item.mismatchCount)}টি ক্ষেত্রে অমিল`}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Action Button */}
                          <td className="px-4 py-3.5 align-top text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenDetail(item.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-900 transition cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5 text-emerald-700" />
                              <span>{t.verificationHistory.viewResultBtn}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Individual Verification Record Inspector Modal */}
      {selectedRecordId && (
        <VerificationDetailModal
          recordId={selectedRecordId}
          onClose={handleCloseDetail}
        />
      )}

      {/* Render standalone Header/Footer/Modals ONLY if not embedded in DashboardLayout */}
      {!hideHeaderFooter && (
        <>
          <VerificationModal
            isOpen={isVerificationModalOpen}
            onClose={() => {
              setIsVerificationModalOpen(false);
              fetchHistory();
            }}
            parcels={SYNTHETIC_DEMO_PARCELS}
          />

          <ChatSupportWidget
            isOpen={isChatOpen}
            onOpen={() => setIsChatOpen(true)}
            onClose={() => setIsChatOpen(false)}
          />
          <Footer />
        </>
      )}
    </div>
  );
}
