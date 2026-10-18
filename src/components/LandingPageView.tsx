"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import DisclaimerBanner from "./DisclaimerBanner";
import ChatSupportWidget from "./ChatSupportWidget";
import LandingVerificationPreview from "./LandingVerificationPreview";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  UserPlus,
  LogIn,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  FileSearch,
  TriangleAlert,
  MapPinned,
  FileDown,
  MessageCircle,
  Lock,
} from "lucide-react";

export default function LandingPageView() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const reduceMotion = useReducedMotion();

  const reveal = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-40px" },
          transition: { duration: 0.45, delay, ease: "easeOut" as const },
        };

  const features = [
    {
      title: t.landing.feat1Title,
      desc: t.landing.feat1Desc,
      icon: FileSearch,
      tone: "bg-emerald-900 text-emerald-100",
    },
    {
      title: t.landing.feat2Title,
      desc: t.landing.feat2Desc,
      icon: TriangleAlert,
      tone: "bg-amber-700 text-amber-50",
    },
    {
      title: t.landing.feat3Title,
      desc: t.landing.feat3Desc,
      icon: MapPinned,
      tone: "bg-slate-800 text-slate-100",
    },
    {
      title: t.landing.feat4Title,
      desc: t.landing.feat4Desc,
      icon: FileDown,
      tone: "bg-emerald-800 text-emerald-100",
    },
    {
      title: t.landing.feat5Title,
      desc: t.landing.feat5Desc,
      icon: MessageCircle,
      tone: "bg-emerald-700 text-emerald-50",
    },
    {
      title: t.landing.feat6Title,
      desc: t.landing.feat6Desc,
      icon: Lock,
      tone: "bg-slate-700 text-slate-100",
    },
  ] as const;

  const steps = [
    {
      num: t.landing.step1Num,
      title: t.landing.step1Title,
      desc: t.landing.step1Desc,
    },
    {
      num: t.landing.step2Num,
      title: t.landing.step2Title,
      desc: t.landing.step2Desc,
    },
    {
      num: t.landing.step3Num,
      title: t.landing.step3Title,
      desc: t.landing.step3Desc,
    },
  ] as const;

  const checks = [
    t.landing.checkChainOfTitle,
    t.landing.checkKhatianShare,
    t.landing.checkKhasWarning,
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f7f5] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Header
        isLandingPage={true}
        onOpenChat={() => setIsChatOpen(true)}
      />

      <main className="flex-1 w-full">
        {/* Compact disclaimer — kept visible, not competing with hero */}
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4">
          <DisclaimerBanner />
        </div>

        {/* ── HERO: full-bleed composition ── */}
        <section className="relative mt-3 sm:mt-4 overflow-hidden border-y border-emerald-950/10">
          <div
            className="absolute inset-0 bg-[linear-gradient(135deg,#042f2e_0%,#064e3b_42%,#0f172a_100%)]"
            aria-hidden
          />
          <div
            className="absolute inset-0 opacity-[0.12] pointer-events-none"
            aria-hidden
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(52,211,153,0.35), transparent 40%), radial-gradient(circle at 80% 70%, rgba(148,163,184,0.2), transparent 45%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            aria-hidden
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />

          <div className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-16 items-center">
              {/* Copy column */}
              <motion.div
                className="space-y-5 sm:space-y-6 text-white order-1"
                {...(reduceMotion
                  ? {}
                  : {
                      initial: { opacity: 0, y: 14 },
                      animate: { opacity: 1, y: 0 },
                      transition: { duration: 0.5, ease: "easeOut" as const },
                    })}
              >
                <p className="text-[11px] sm:text-xs font-medium tracking-wide text-emerald-200/80">
                  {t.landing.hackathonTrack}
                </p>

                <div className="space-y-3 sm:space-y-4">
                  <p className="flex items-center gap-2 text-emerald-200">
                    <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" aria-hidden />
                    <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
                      {t.landing.brandHero}
                    </span>
                  </p>

                  <h1 className="text-2xl sm:text-3xl lg:text-[2.35rem] font-bold tracking-tight leading-[1.25] max-w-xl">
                    {t.landing.heroTitleStart}{" "}
                    <span className="text-emerald-300">
                      {t.landing.heroTitleHighlight}
                    </span>
                  </h1>

                  <p className="text-sm sm:text-base text-emerald-50/90 leading-relaxed max-w-lg">
                    {t.landing.heroSubtitle}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/dashboard"
                        id="hero-cta-dashboard"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-emerald-950 shadow-md hover:bg-emerald-50 active:scale-[0.98] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-900"
                      >
                        <LayoutDashboard className="h-4 w-4 text-emerald-800" aria-hidden />
                        <span>{t.nav.viewDashboard}</span>
                        <ArrowRight className="h-4 w-4 text-emerald-800" aria-hidden />
                      </Link>
                      <a
                        href="#workflow"
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20 active:scale-[0.98] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                      >
                        {t.nav.workflow}
                      </a>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/signup"
                        id="hero-cta-signup"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-emerald-950 shadow-md hover:bg-emerald-50 active:scale-[0.98] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-900"
                      >
                        <UserPlus className="h-4 w-4 text-emerald-800" aria-hidden />
                        <span>{t.landing.startVerificationBtn}</span>
                        <ArrowRight className="h-4 w-4 text-emerald-800" aria-hidden />
                      </Link>
                      <Link
                        href="/login"
                        id="hero-cta-login"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20 active:scale-[0.98] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                      >
                        <LogIn className="h-4 w-4 text-emerald-200" aria-hidden />
                        <span>{t.nav.login}</span>
                      </Link>
                      <a
                        href="#workflow"
                        className="inline-flex items-center justify-center gap-1 px-2 py-2 text-sm font-medium text-emerald-200 hover:text-white transition focus:outline-none focus-visible:underline"
                      >
                        {t.landing.viewDemoRecordsBtn}
                        <span aria-hidden="true">&rarr;</span>
                      </a>
                    </>
                  )}
                </div>

                <p className="text-[11px] sm:text-xs text-emerald-200/75 leading-snug max-w-lg pt-1">
                  {t.landing.heroDisclaimerNote}
                </p>
              </motion.div>

              {/* Dominant visual */}
              <div className="order-2 lg:pl-2">
                <LandingVerificationPreview />
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-14 sm:space-y-16">
          {/* ── What gets checked ── */}
          <motion.section
            {...reveal()}
            className="space-y-4"
            aria-labelledby="benefits-heading"
          >
            <h2
              id="benefits-heading"
              className="text-center text-lg sm:text-xl font-bold text-slate-900"
            >
              {t.landing.benefitsTitle}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {checks.map((label) => (
                <li
                  key={label}
                  className="flex items-start gap-2.5 px-1 py-1 sm:justify-center"
                >
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700"
                    aria-hidden
                  />
                  <span className="text-sm font-medium text-slate-800 leading-snug">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* ── How it works ── */}
          <motion.section
            id="workflow"
            {...reveal(0.05)}
            className="scroll-mt-24 space-y-6"
            aria-labelledby="workflow-heading"
          >
            <div className="text-center max-w-lg mx-auto space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                {t.landing.workflowBadge}
              </p>
              <h2
                id="workflow-heading"
                className="text-xl sm:text-2xl font-bold text-slate-900"
              >
                {t.landing.workflowTitle}
              </h2>
              <p className="text-sm text-slate-600">{t.landing.workflowSubtitle}</p>
            </div>

            <ol className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
              {/* Connector line (desktop) */}
              <div
                className="pointer-events-none absolute top-7 left-[16%] right-[16%] hidden md:block h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent"
                aria-hidden
              />
              {steps.map((step, index) => (
                <li key={step.num} className="relative text-center md:text-left md:px-2">
                  <div className="flex flex-col items-center md:items-start gap-3">
                    <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-900 text-white shadow-md ring-4 ring-[#f4f7f5]">
                      <span className="bn-num text-lg font-bold">{step.num}</span>
                    </div>
                    <div className="space-y-1 max-w-xs mx-auto md:mx-0">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        {t.landing.stepLabel} {step.num}
                      </p>
                      <h3 className="text-base font-bold text-slate-900">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <span className="md:hidden mx-auto mt-4 block h-6 w-px bg-emerald-200" aria-hidden />
                  )}
                </li>
              ))}
            </ol>
          </motion.section>

          {/* ── Features ── */}
          <motion.section
            id="features"
            {...reveal(0.05)}
            className="scroll-mt-24 space-y-6"
            aria-labelledby="features-heading"
          >
            <div className="text-center max-w-lg mx-auto space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                {t.landing.featuresBadge}
              </p>
              <h2
                id="features-heading"
                className="text-xl sm:text-2xl font-bold text-slate-900"
              >
                {t.landing.featuresTitle}
              </h2>
              <p className="text-sm text-slate-600">{t.landing.featuresSubtitle}</p>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
              {features.map((feat) => {
                const Icon = feat.icon;
                return (
                  <li
                    key={feat.title}
                    className="flex items-start gap-3 border-t border-slate-200/90 pt-4"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${feat.tone}`}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        {feat.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.section>

          {/* ── Final CTA ── */}
          <motion.section
            {...reveal(0.05)}
            className="relative overflow-hidden rounded-2xl bg-emerald-950 px-5 py-8 sm:px-8 sm:py-10 text-center text-white"
            aria-labelledby="callout-heading"
          >
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              aria-hidden
              style={{
                backgroundImage:
                  "radial-gradient(ellipse at 50% 0%, rgba(52,211,153,0.35), transparent 55%)",
              }}
            />
            <div className="relative space-y-4 max-w-xl mx-auto">
              <h2
                id="callout-heading"
                className="text-xl sm:text-2xl font-bold tracking-tight"
              >
                {t.landing.calloutTitle}
              </h2>
              <p className="text-sm text-emerald-100/85 leading-relaxed">
                {t.landing.calloutDesc}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-emerald-950 hover:bg-emerald-50 transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <LayoutDashboard className="h-4 w-4" aria-hidden />
                    <span>{t.nav.viewDashboard}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                ) : (
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-emerald-950 hover:bg-emerald-50 transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <UserPlus className="h-4 w-4" aria-hidden />
                    <span>{t.landing.enterDashboardBtn}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setIsChatOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <Sparkles className="h-4 w-4 text-emerald-300" aria-hidden />
                  <span>{t.landing.askAssistantBtn}</span>
                </button>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      <ChatSupportWidget
        isOpen={isChatOpen}
        onOpen={() => setIsChatOpen(true)}
        onClose={() => setIsChatOpen(false)}
      />

      <Footer />
    </div>
  );
}
