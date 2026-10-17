"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useDashboard } from "@/context/DashboardContext";
import { toBengaliNumerals } from "@/lib/formatters";
import VerificationDetailModal from "./VerificationDetailModal";
import {
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Eye,
  FileText,
  Compass,
  Sparkles,
  ChevronRight,
  Plus,
} from "lucide-react";

export interface PersonalVerificationItem {
  id: string;
  createdAt: string;
  status: string;
  riskLevel: string;
  riskScore: number | null;
  category: "NO_DISCREPANCIES" | "DIFFERENCES_REQUIRE_REVIEW" | "INSUFFICIENT_INFO" | string;
  categoryLabelBn: string;
  summaryBn: string;
  mouza?: string;
  upazila?: string;
  district?: string;
  dagNumber?: string;
  khatianNumber?: string;
  recordedArea?: string;
  areaUnit?: string;
  ownerName?: string;
  matchCount: number;
  mismatchCount: number;
  missingCount: number;
  hasOcr: boolean;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  occupation?: string | null;
}

interface PersonalDashboardViewProps {
  user: UserProfile;
  verifications: PersonalVerificationItem[];
}

export default function PersonalDashboardView({
  user,
  verifications,
}: PersonalDashboardViewProps) {
  const { language, t } = useLanguage();
  const { openVerificationModal } = useDashboard();
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const formatNum = (val: number | string) => {
    return language === "bn" ? toBengaliNumerals(val) : String(val);
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(language === "bn" ? "bn-BD" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return isoStr;
    }
  };

  // Activity Metrics for the signed-in user
  const totalCount = verifications.length;
  const cleanCount = verifications.filter(
    (v) => v.category === "NO_DISCREPANCIES" || v.riskLevel === "LOW"
  ).length;
  const discrepancyCount = verifications.filter(
    (v) => v.category === "DIFFERENCES_REQUIRE_REVIEW" || v.riskLevel === "HIGH"
  ).length;
  const insufficientCount = verifications.filter(
    (v) => v.category === "INSUFFICIENT_INFO" || v.riskLevel === "MEDIUM"
  ).length;

  // Recent 4 items
  const recentItems = verifications.slice(0, 4);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* ── 1. WELCOME & WORKSPACE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {language === "bn" ? `স্বাগতম, ${user.name}` : `Welcome back, ${user.name}`}
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-2xs font-semibold text-emerald-800 border border-emerald-200">
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              {language === "bn" ? "যাচাইকারী নাগরিক" : "Citizen Workspace"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === "bn"
              ? "আপনার ব্যক্তিগত ভূমি প্রাক-যাচাই ও খতিয়ান হিস্যা ওয়ার্কস্পেস"
              : "Your personal land due diligence & verification workspace"}
          </p>
        </div>

        {/* Header Quick CTA */}
        <button
          type="button"
          onClick={() => openVerificationModal()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-900 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-emerald-800 transition focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4 text-emerald-300" />
          <span>{t.sidebar.verifyDocument}</span>
        </button>
      </div>

      {/* ── 2. PRIMARY ACTION HERO CARD ── */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-900/10 bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white p-5 sm:p-7 shadow-md">
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-emerald-400/15 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700/60 px-3 py-1 text-2xs font-semibold uppercase tracking-wider text-emerald-200 backdrop-blur-xs border border-emerald-500/30">
            <Sparkles className="h-3 w-3 text-emerald-300" />
            <span>{language === "bn" ? "প্রাথমিক ভূমি প্রাক-যাচাই" : "Automated Land Due Diligence"}</span>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {language === "bn"
                ? "জমি ক্রয়ের পূর্বে দলিলের বৈধতা ও হিস্যা যাচাই করুন"
                : "Verify Land Deed Validity & Cadastral Shares Before Buying"}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
              {language === "bn"
                ? "বিক্রেতার দাখিলকৃত দলিলের মালিকের নাম, দাগ নম্বর ও রেকর্ডকৃত জমির পরিমাণ সরকারের ক্যাডাস্ট্রাল খতিয়ান ও ১ নং খাস বাফারের সাথে স্বয়ংক্রিয়ভাবে তুলনা করুন।"
                : "Instantly compare submitted deed ownership, plot numbers, and recorded land area against government cadastral records and protected khas buffer zones."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => openVerificationModal()}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-emerald-950 shadow-sm hover:bg-emerald-50 transition focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
            >
              <FileCheck2 className="h-4 w-4 text-emerald-700" />
              <span>{language === "bn" ? "দলিল যাচাই শুরু করুন" : "Start Deed Verification"}</span>
            </button>

            <Link
              href="/dashboard/explore"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-800/80 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white border border-emerald-600/50 hover:bg-emerald-700/80 transition focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <Compass className="h-4 w-4 text-emerald-300" />
              <span>{language === "bn" ? "নমুনা ভূমি রেকর্ড অনুসন্ধান" : "Explore Land Records"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Feature Highlights Pills */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-emerald-700/60 text-2xs text-emerald-200">
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-300" />
              {language === "bn" ? "স্বয়ংক্রিয় দাগ ও খতিয়ান হিস্যা তুলনা" : "Automated Dag & Share Match"}
            </span>
            <span className="text-emerald-500">•</span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-300" />
              {language === "bn" ? "১ নং খাস ও মামলা সতর্কতা" : "Khas Ledger & Case Warnings"}
            </span>
            <span className="text-emerald-500">•</span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-300" />
              {language === "bn" ? "স্মার্ট দলিল ওসিআর বিশ্লেষণ" : "Deed Image AI OCR"}
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. USER'S PERSONAL ACTIVITY OVERVIEW (KPIs) ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {language === "bn" ? "আপনার যাচাইকরণ সারসংক্ষেপ" : "Your Verification Activity"}
          </h2>
          <span className="text-2xs text-slate-400 font-medium">
            {language === "bn" ? "কেবল আপনার সংরক্ষিত ডাটা" : "Personal activity only"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Total Verifications */}
          <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">
                {language === "bn" ? "মোট যাচাইকরণ" : "Total Verified"}
              </span>
              <FileText className="h-4 w-4 text-slate-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 bn-num">
                {formatNum(totalCount)}
              </span>
              <span className="text-xs text-slate-400">
                {language === "bn" ? "টি" : "records"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-tight">
              {language === "bn" ? "সম্পন্ন অডিট ও তুলনা" : "Completed due diligence"}
            </p>
          </div>

          {/* Clean / Verified Matches */}
          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-3.5 sm:p-4 shadow-2xs">
            <div className="flex items-center justify-between text-emerald-800">
              <span className="text-xs font-semibold">
                {language === "bn" ? "সঠিক ও মিল রয়েছে" : "Clean Matches"}
              </span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-950 bn-num">
                {formatNum(cleanCount)}
              </span>
              <span className="text-xs text-emerald-700">
                {language === "bn" ? "টি" : "clean"}
              </span>
            </div>
            <p className="text-[11px] text-emerald-700/80 mt-1 leading-tight">
              {language === "bn" ? "কোনো অসঙ্গতি মেলেনি" : "No discrepancies found"}
            </p>
          </div>

          {/* Discrepancies Requiring Review */}
          <div className="rounded-xl border border-rose-200/80 bg-rose-50/50 p-3.5 sm:p-4 shadow-2xs">
            <div className="flex items-center justify-between text-rose-800">
              <span className="text-xs font-semibold">
                {language === "bn" ? "অসঙ্গতি চিহ্নিত" : "Discrepancies"}
              </span>
              <AlertTriangle className="h-4 w-4 text-rose-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-rose-950 bn-num">
                {formatNum(discrepancyCount)}
              </span>
              <span className="text-xs text-rose-700">
                {language === "bn" ? "টি" : "flagged"}
              </span>
            </div>
            <p className="text-[11px] text-rose-700/80 mt-1 leading-tight">
              {language === "bn" ? "পর্যালোচনা ও সতর্কতা আবশ্যক" : "Careful review recommended"}
            </p>
          </div>

          {/* Insufficient / Pending */}
          <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-3.5 sm:p-4 shadow-2xs">
            <div className="flex items-center justify-between text-amber-800">
              <span className="text-xs font-semibold">
                {language === "bn" ? "অসম্পূর্ণ তথ্য" : "Insufficient Info"}
              </span>
              <HelpCircle className="h-4 w-4 text-amber-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-950 bn-num">
                {formatNum(insufficientCount)}
              </span>
              <span className="text-xs text-amber-800">
                {language === "bn" ? "টি" : "partial"}
              </span>
            </div>
            <p className="text-[11px] text-amber-700/80 mt-1 leading-tight">
              {language === "bn" ? "অতিরিক্ত তথ্যের প্রয়োজন" : "Required more data"}
            </p>
          </div>
        </div>
      </div>

      {/* ── 4. RECENT PERSONAL VERIFICATION HISTORY ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {language === "bn" ? "সাম্প্রতিক যাচাইকরণ ইতিহাস" : "Recent Verifications"}
            </h2>
            <p className="text-xs text-slate-500">
              {language === "bn"
                ? "আপনার অ্যাকাউন্টে সংরক্ষিত দলিলের ফলাফল ও তুলনামূলক অডিট"
                : "Audited deed comparisons saved to your personal account"}
            </p>
          </div>

          {totalCount > 0 && (
            <Link
              href="/dashboard/history"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition"
            >
              <span>{language === "bn" ? "সম্পূর্ণ ইতিহাস দেখুন" : "View All History"}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {totalCount === 0 ? (
          /* High-Quality Empty State for New Users */
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 sm:p-12 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
              <ShieldCheck className="h-7 w-7 text-emerald-700" />
            </div>

            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {language === "bn"
                  ? "এখনও কোনো দলিল যাচাই করা হয়নি"
                  : "No land verifications yet"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {language === "bn"
                  ? "জমি ক্রয়ের পূর্বে দলিলের মালিকানা, দাগ নম্বর ও খতিয়ানের হিস্যা সরকারের ক্যাডাস্ট্রাল রেকর্ডের সাথে মিলিয়ে দেখতে প্রথম যাচাইকরণ শুরু করুন।"
                  : "Pre-verify submitted plot numbers, ownership records, and cadastral shares to make sure your land purchase is safe."}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => openVerificationModal()}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-emerald-800 transition focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
              >
                <Plus className="h-4 w-4 text-emerald-300" />
                <span>
                  {language === "bn"
                    ? "প্রথম দলিল যাচাই শুরু করুন"
                    : "Start Your First Verification"}
                </span>
              </button>
            </div>

            {/* 3 Simple Steps Guide for New Users */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto pt-6 text-left border-t border-slate-100">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/60">
                <span className="text-2xs font-extrabold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                  ১
                </span>
                <h4 className="text-xs font-bold text-slate-800 mt-1.5">
                  {language === "bn" ? "দলিল বা খতিয়ান পূরণ" : "1. Enter Deed Details"}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {language === "bn"
                    ? "মৌজা, দাগ, খতিয়ান বা দলিল ছবি আপলোড করুন।"
                    : "Enter mouza, dag, khatian or upload deed image."}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/60">
                <span className="text-2xs font-extrabold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                  ২
                </span>
                <h4 className="text-xs font-bold text-slate-800 mt-1.5">
                  {language === "bn" ? "স্বয়ংক্রিয় অডিট ও তুলনা" : "2. Automated Audit"}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {language === "bn"
                    ? "মালিকানা হিস্যা ও খাস বাফার যাচাই সম্পন্ন হবে।"
                    : "Compares shares & detects khas zone risks."}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/60">
                <span className="text-2xs font-extrabold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                  ৩
                </span>
                <h4 className="text-xs font-bold text-slate-800 mt-1.5">
                  {language === "bn" ? "অডিট রিপোর্ট সংরক্ষণ" : "3. Permanent Report"}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {language === "bn"
                    ? "ফলাফল আপনার ড্যাশবোর্ডে সংরক্ষিত থাকবে।"
                    : "Results are saved permanently for future review."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Cards Grid for Recent Personal Verifications */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {recentItems.map((item) => {
              const isClean = item.category === "NO_DISCREPANCIES" || item.riskLevel === "LOW";
              const isDiscrepant = item.category === "DIFFERENCES_REQUIRE_REVIEW" || item.riskLevel === "HIGH";

              return (
                <div
                  key={item.id}
                  className={`flex flex-col justify-between rounded-xl border bg-white p-4 shadow-2xs transition hover:shadow-xs ${
                    isClean
                      ? "border-emerald-200 hover:border-emerald-300"
                      : isDiscrepant
                      ? "border-rose-200 hover:border-rose-300"
                      : "border-amber-200 hover:border-amber-300"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Date, OCR Badge & Status Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-2xs text-slate-500 bn-num">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span>{formatDate(item.createdAt)}</span>
                        {item.hasOcr && (
                          <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-bold text-[10px] bg-emerald-100 text-emerald-800">
                            OCR
                          </span>
                        )}
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-bold ${
                          isClean
                            ? "bg-emerald-100 text-emerald-800"
                            : isDiscrepant
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {isClean ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : isDiscrepant ? (
                          <AlertTriangle className="h-3 w-3" />
                        ) : (
                          <HelpCircle className="h-3 w-3" />
                        )}
                        <span>
                          {isClean
                            ? t.verificationHistory.cleanBadge
                            : isDiscrepant
                            ? t.verificationHistory.discrepancyBadge
                            : t.verificationHistory.insufficientBadge}
                        </span>
                      </span>
                    </div>

                    {/* Parcel Details Snapshot */}
                    <div>
                      <div className="text-xs text-slate-400">
                        {item.mouza ? `${item.mouza}, ` : ""}
                        {item.upazila ? `${item.upazila}, ` : ""}
                        {item.district || "বাংলাদেশ"}
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">
                        {item.ownerName ? (
                          <span>{item.ownerName}</span>
                        ) : (
                          <span className="text-slate-400 font-normal italic">
                            {language === "bn" ? "মালিকের নাম অপ্রকাশিত" : "Unspecified Owner"}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-600 mt-1 bn-num">
                        <span>
                          <span className="text-slate-400 font-normal">
                            {language === "bn" ? "দাগ: " : "Dag: "}
                          </span>
                          <strong>{item.dagNumber || "—"}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          <span className="text-slate-400 font-normal">
                            {language === "bn" ? "খতিয়ান: " : "Khatian: "}
                          </span>
                          <strong>{item.khatianNumber || "—"}</strong>
                        </span>
                        {item.recordedArea && (
                          <>
                            <span>•</span>
                            <span>
                              <strong>{item.recordedArea}</strong> {item.areaUnit || "শতক"}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Summary text */}
                    <p className="text-xs text-slate-600 leading-snug line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {item.summaryBn}
                    </p>
                  </div>

                  {/* Bottom Action: View Details Button */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-2xs text-slate-400 bn-num">
                      {isDiscrepant && item.mismatchCount > 0 ? (
                        <span className="text-rose-600 font-semibold">
                          {language === "bn"
                            ? `${toBengaliNumerals(item.mismatchCount)}টি ক্ষেত্রে অমিল`
                            : `${item.mismatchCount} Discrepancies`}
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">
                          {language === "bn"
                            ? `${toBengaliNumerals(item.matchCount)}টি ক্ষেত্র সম্পূর্ণ মিলেছে`
                            : `${item.matchCount} Fields Matched`}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedRecordId(item.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-900 transition cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5 text-emerald-700" />
                      <span>{t.verificationHistory.viewResultBtn}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 5. CIVIC PRECAUTIONS & EXPLORE LAND RECORDS SHORTCUT ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
        {/* Explore Land Records Card */}
        <div className="md:col-span-1 rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-800">
              <Compass className="h-4 w-4" />
              <h3 className="text-sm font-bold">
                {language === "bn" ? "ভূমি রেকর্ড অনুসন্ধান" : "Explore Land Records"}
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === "bn"
                ? "ক্যাডাস্ট্রাল ঝুঁকি মানচিত্র এবং ১৫টি নমুনা পার্সেল রেকর্ডের মালিকানা ও খাস বাফার অডিট দেখুন।"
                : "Explore geographic cadastral risk map visualizer and 15 sample land records."}
            </p>
          </div>

          <Link
            href="/dashboard/explore"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50/70 px-3 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition"
          >
            <span>{language === "bn" ? "মানচিত্র ও রেকর্ড খুলুন" : "Open Map & Records"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 5 Essential Precautions Banner */}
        <div className="md:col-span-2 rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-slate-900">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            <h3 className="text-sm font-bold">
              {language === "bn"
                ? "জমি ক্রয়ের পূর্বে ৫টি নাগরিক সতর্কতা"
                : "5 Essential Precautions Before Buying Land"}
            </h3>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-700 font-bold">•</span>
              <span>
                {language === "bn"
                  ? "সিএস, এসএ, আরএস ও বিএস খতিয়ানের ধারাবাহিকতা নিশ্চিত করুন।"
                  : "Verify historical succession from CS, SA, RS to BS khatians."}
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-700 font-bold">•</span>
              <span>
                {language === "bn"
                  ? "নামজারি (মিউটেশন) ও হাল সন পর্যন্ত খাজনা দাখিলা পরীক্ষা করুন।"
                  : "Inspect recent mutation records and land development tax receipts."}
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-700 font-bold">•</span>
              <span>
                {language === "bn"
                  ? "১ নং খাস খতিয়ান, নদীভাঙা বা অর্পিত সম্পত্তি নয় তা নিশ্চিত হোন।"
                  : "Ensure the plot is not on protected 1 No. Khas or vested property."}
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-700 font-bold">•</span>
              <span>
                {language === "bn"
                  ? "জমির সরেজমিন শারীরিক দখল ও সীমানা যাচাই করুন।"
                  : "Physically verify boundary demarcation and actual possession on-site."}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Verification Record Inspector Modal */}
      {selectedRecordId && (
        <VerificationDetailModal
          recordId={selectedRecordId}
          onClose={() => setSelectedRecordId(null)}
        />
      )}
    </div>
  );
}
