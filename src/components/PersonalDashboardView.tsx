"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useDashboard } from "@/context/DashboardContext";
import { toBengaliNumerals } from "@/lib/formatters";
import VerificationDetailModal from "./VerificationDetailModal";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  Eye,
  FileCheck2,
  HelpCircle,
  History,
  MessageCircle,
  Plus,
  ShieldCheck,
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
  const { openVerificationModal, openChat } = useDashboard();
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const pd = t.personalDashboard;

  const formatNum = (val: number | string) =>
    language === "bn" ? toBengaliNumerals(val) : String(val);

  const formatDate = (isoStr: string) => {
    try {
      return new Date(isoStr).toLocaleDateString(
        language === "bn" ? "bn-BD" : "en-US",
        { year: "numeric", month: "short", day: "numeric" }
      );
    } catch {
      return isoStr;
    }
  };

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

  const recentItems = verifications.slice(0, 5);

  const quickActions = [
    {
      id: "verify",
      title: pd.actionVerify,
      desc: pd.actionVerifyDesc,
      icon: FileCheck2,
      tone: "bg-emerald-900 text-emerald-100",
      onClick: () => openVerificationModal(),
    },
    {
      id: "explore",
      title: pd.actionExplore,
      desc: pd.actionExploreDesc,
      icon: Compass,
      tone: "bg-slate-800 text-slate-100",
      href: "/dashboard/explore",
    },
    {
      id: "history",
      title: pd.actionHistory,
      desc: pd.actionHistoryDesc,
      icon: History,
      tone: "bg-emerald-800 text-emerald-100",
      href: "/dashboard/history",
    },
    {
      id: "chat",
      title: pd.actionChat,
      desc: pd.actionChatDesc,
      icon: MessageCircle,
      tone: "bg-emerald-700 text-emerald-50",
      onClick: () => openChat(),
    },
  ] as const;

  return (
    <div className="mx-auto w-full max-w-5xl px-3 py-5 sm:px-6 sm:py-7 lg:px-8 space-y-7 sm:space-y-8">
      {/* Welcome */}
      <header className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          {pd.welcomeBack}{" "}
          <span className="text-emerald-900">{user.name}</span>
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          {pd.subtitle}
        </p>
      </header>

      {/* Primary action band — aligned with landing hero language */}
      <section
        className="relative overflow-hidden rounded-2xl border border-emerald-950/10 text-white"
        aria-labelledby="dashboard-hero-heading"
      >
        <div
          className="absolute inset-0 bg-[linear-gradient(135deg,#042f2e_0%,#064e3b_45%,#0f172a_100%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 80% 20%, rgba(52,211,153,0.28), transparent 50%)",
          }}
        />
        <div className="relative px-4 py-6 sm:px-7 sm:py-8 space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
              <ShieldCheck className="h-5 w-5 text-emerald-300" aria-hidden />
            </div>
            <div className="min-w-0 space-y-1.5">
              <h2
                id="dashboard-hero-heading"
                className="text-lg sm:text-xl font-bold tracking-tight"
              >
                {pd.heroTitle}
              </h2>
              <p className="text-sm text-emerald-50/90 leading-relaxed max-w-xl">
                {pd.heroDesc}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 sm:pl-[3.25rem]">
            <button
              type="button"
              onClick={() => openVerificationModal()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-emerald-950 shadow-md hover:bg-emerald-50 active:scale-[0.98] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-900 cursor-pointer"
            >
              <Plus className="h-4 w-4 text-emerald-800" aria-hidden />
              <span>{pd.startCheckBtn}</span>
              <ArrowRight className="h-4 w-4 text-emerald-800" aria-hidden />
            </button>
            <Link
              href="/dashboard/explore"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <Compass className="h-4 w-4 text-emerald-200" aria-hidden />
              <span>{pd.actionExplore}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section aria-labelledby="quick-actions-heading" className="space-y-3">
        <h2
          id="quick-actions-heading"
          className="text-sm font-bold text-slate-900"
        >
          {pd.quickActionsTitle}
        </h2>
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const className =
              "group flex w-full items-start gap-3 rounded-xl border border-slate-200/90 bg-white px-3 py-3 sm:px-3.5 sm:py-3.5 text-left shadow-2xs transition hover:border-emerald-300/80 hover:bg-emerald-50/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700";
            const inner = (
              <>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${action.tone}`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-slate-900 group-hover:text-emerald-950">
                    {action.title}
                  </span>
                  <span className="block text-xs text-slate-500 mt-0.5 leading-snug">
                    {action.desc}
                  </span>
                </span>
              </>
            );

            if ("href" in action && action.href) {
              return (
                <li key={action.id}>
                  <Link href={action.href} className={className}>
                    {inner}
                  </Link>
                </li>
              );
            }

            return (
              <li key={action.id}>
                <button
                  type="button"
                  onClick={action.onClick}
                  className={`${className} cursor-pointer`}
                >
                  {inner}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Compact activity — only when user has real data */}
      {totalCount > 0 && (
        <section
          aria-labelledby="activity-heading"
          className="space-y-2.5"
        >
          <div className="flex items-baseline justify-between gap-2">
            <h2
              id="activity-heading"
              className="text-sm font-bold text-slate-900"
            >
              {pd.activityTitle}
            </h2>
            <span className="text-[11px] text-slate-400">{pd.activityHint}</span>
          </div>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-xl border border-slate-200/90 bg-slate-200/70">
            <StatCell label={pd.totalLabel} value={formatNum(totalCount)} />
            <StatCell
              label={pd.cleanLabel}
              value={formatNum(cleanCount)}
              tone="text-emerald-800"
            />
            <StatCell
              label={pd.reviewLabel}
              value={formatNum(discrepancyCount)}
              tone="text-rose-800"
            />
            <StatCell
              label={pd.partialLabel}
              value={formatNum(insufficientCount)}
              tone="text-amber-800"
            />
          </dl>
        </section>
      )}

      {/* Recent history */}
      <section aria-labelledby="recent-heading" className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h2
              id="recent-heading"
              className="text-base sm:text-lg font-bold text-slate-900"
            >
              {pd.recentTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {pd.recentSubtitle}
            </p>
          </div>
          {totalCount > 0 && (
            <Link
              href="/dashboard/history"
              className="inline-flex items-center gap-1 shrink-0 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 focus:outline-none focus-visible:underline"
            >
              {pd.viewAllHistory}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          )}
        </div>

        {totalCount === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 px-4 py-8 sm:px-8 sm:py-10 text-center space-y-5">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200">
              <FileCheck2 className="h-6 w-6" aria-hidden />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="text-base font-bold text-slate-900">{pd.emptyTitle}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{pd.emptyDesc}</p>
            </div>
            <button
              type="button"
              onClick={() => openVerificationModal()}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 cursor-pointer"
            >
              <Plus className="h-4 w-4 text-emerald-300" aria-hidden />
              {pd.emptyCta}
            </button>

            <ol className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto pt-4 border-t border-slate-100 text-left">
              {[
                { n: "1", title: pd.step1Title, desc: pd.step1Desc },
                { n: "2", title: pd.step2Title, desc: pd.step2Desc },
                { n: "3", title: pd.step3Title, desc: pd.step3Desc },
              ].map((step) => (
                <li key={step.n} className="space-y-1 px-1">
                  <span className="bn-num inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-900 text-[11px] font-bold text-white">
                    {language === "bn" ? toBengaliNumerals(step.n) : step.n}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                  <p className="text-xs text-slate-500 leading-snug">{step.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200/90 bg-white">
            {recentItems.map((item) => {
              const isClean =
                item.category === "NO_DISCREPANCIES" || item.riskLevel === "LOW";
              const isDiscrepant =
                item.category === "DIFFERENCES_REQUIRE_REVIEW" ||
                item.riskLevel === "HIGH";

              const location = [item.mouza, item.upazila, item.district]
                .filter(Boolean)
                .join(", ");

              return (
                <li key={item.id}>
                  <div className="flex flex-col gap-3 p-3.5 sm:p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold ${
                            isClean
                              ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80"
                              : isDiscrepant
                                ? "bg-rose-50 text-rose-800 ring-1 ring-rose-200/80"
                                : "bg-amber-50 text-amber-900 ring-1 ring-amber-200/80"
                          }`}
                        >
                          {isClean ? (
                            <CheckCircle2 className="h-3 w-3" aria-hidden />
                          ) : isDiscrepant ? (
                            <AlertTriangle className="h-3 w-3" aria-hidden />
                          ) : (
                            <HelpCircle className="h-3 w-3" aria-hidden />
                          )}
                          {isClean
                            ? t.verificationHistory.cleanBadge
                            : isDiscrepant
                              ? t.verificationHistory.discrepancyBadge
                              : t.verificationHistory.insufficientBadge}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bn-num">
                          <Clock className="h-3 w-3" aria-hidden />
                          {formatDate(item.createdAt)}
                        </span>
                        {item.hasOcr && (
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                            {t.verificationHistory.ocrBadge}
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-bold text-slate-900 truncate">
                        {item.ownerName || pd.unspecifiedOwner}
                      </p>
                      {location && (
                        <p className="text-xs text-slate-500 truncate">{location}</p>
                      )}
                      <p className="text-xs text-slate-600 bn-num">
                        <span className="text-slate-400">{pd.dagLabel}: </span>
                        <strong>{item.dagNumber || "—"}</strong>
                        <span className="mx-1.5 text-slate-300">·</span>
                        <span className="text-slate-400">{pd.khatianLabel}: </span>
                        <strong>{item.khatianNumber || "—"}</strong>
                        {item.recordedArea && (
                          <>
                            <span className="mx-1.5 text-slate-300">·</span>
                            <strong>{item.recordedArea}</strong>{" "}
                            {item.areaUnit || ""}
                          </>
                        )}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {item.summaryBn}
                      </p>
                      <p
                        className={`text-[11px] font-semibold bn-num ${
                          isDiscrepant && item.mismatchCount > 0
                            ? "text-rose-700"
                            : "text-emerald-800"
                        }`}
                      >
                        {isDiscrepant && item.mismatchCount > 0
                          ? `${formatNum(item.mismatchCount)} ${pd.mismatchFields}`
                          : `${formatNum(item.matchCount)} ${pd.matchFields}`}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedRecordId(item.id)}
                      className="inline-flex items-center justify-center gap-1.5 self-start sm:self-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-950 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 cursor-pointer shrink-0"
                    >
                      <Eye className="h-3.5 w-3.5 text-emerald-700" aria-hidden />
                      {t.verificationHistory.viewResultBtn}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Compact tips — not a heavy card grid */}
      <aside
        className="rounded-xl border border-slate-200/90 bg-white px-4 py-4 sm:px-5 space-y-2.5"
        aria-labelledby="tips-heading"
      >
        <h2
          id="tips-heading"
          className="text-sm font-bold text-slate-900 flex items-center gap-2"
        >
          <ShieldCheck className="h-4 w-4 text-emerald-700" aria-hidden />
          {pd.tipTitle}
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs sm:text-sm text-slate-600">
          {[pd.tip1, pd.tip2, pd.tip3, pd.tip4].map((tip) => (
            <li key={tip} className="flex gap-2 leading-snug">
              <CheckCircle2
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700"
                aria-hidden
              />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
        <p className="text-[11px] text-slate-500 leading-snug pt-1 border-t border-slate-100">
          {pd.tipNote}
        </p>
      </aside>

      {selectedRecordId && (
        <VerificationDetailModal
          recordId={selectedRecordId}
          onClose={() => setSelectedRecordId(null)}
        />
      )}
    </div>
  );
}

function StatCell({
  label,
  value,
  tone = "text-slate-900",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="bg-white px-3 py-3 sm:px-4 sm:py-3.5">
      <dt className="text-[11px] font-medium text-slate-500">{label}</dt>
      <dd className={`mt-0.5 text-xl sm:text-2xl font-extrabold bn-num ${tone}`}>
        {value}
      </dd>
    </div>
  );
}
