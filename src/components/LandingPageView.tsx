"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import DisclaimerBanner from "./DisclaimerBanner";
import ChatSupportWidget from "./ChatSupportWidget";
import HeroCarousel from "./HeroCarousel";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  UserPlus,
  LogIn,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Info,
  ShieldCheck,
} from "lucide-react";

export default function LandingPageView() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Shared Navigation Header */}
      <Header
        isLandingPage={true}
        onOpenChat={() => setIsChatOpen(true)}
      />

      <main className="flex-1 w-full space-y-10 sm:space-y-12 py-5 sm:py-6 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Civic Tech Synthetic Disclaimer */}
        <DisclaimerBanner />

        {/* ── HERO SECTION (Two-Column Desktop: 45% Slider Left / 55% Content Right) ── */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-900/60 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white p-5 sm:p-8 lg:p-10 shadow-xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-10">
            {/* ── LEFT SIDE (45% Width on Desktop): Relevant Sliding Imagery ── */}
            <div className="w-full lg:w-[45%] order-2 lg:order-1 flex-shrink-0">
              <HeroCarousel />
            </div>

            {/* ── RIGHT SIDE (55% Width on Desktop): Headline, Copy & CTAs ── */}
            <div className="w-full lg:w-[55%] order-1 lg:order-2 space-y-4 sm:space-y-5">
              {/* Hackathon Track Tag */}
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-800/80 border border-emerald-600/40 px-3 py-1 text-xs font-semibold text-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{t.landing.hackathonTrack}</span>
              </div>

              {/* Primary Heading */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug text-white">
                {t.landing.heroTitleStart}{" "}
                <span className="text-emerald-300">
                  {t.landing.heroTitleHighlight}
                </span>
              </h1>

              {/* Sub-heading */}
              <p className="text-xs sm:text-sm lg:text-base text-emerald-100/90 leading-relaxed font-normal max-w-xl">
                {t.landing.heroSubtitle}
              </p>

              {/* Primary & Secondary Actions */}
              <div className="pt-1 flex flex-wrap items-center gap-2.5 sm:gap-3.5">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      id="hero-cta-dashboard"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs sm:text-sm font-bold text-emerald-950 shadow-md hover:bg-emerald-50 active:scale-[0.98] transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-900"
                    >
                      <LayoutDashboard className="h-4 w-4 text-emerald-800" />
                      <span>{t.nav.viewDashboard}</span>
                      <ArrowRight className="h-4 w-4 text-emerald-800" />
                    </Link>

                    <a
                      href="#workflow"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-white/20 active:scale-[0.98] transition focus:outline-none focus:ring-2 focus:ring-white/40"
                    >
                      <span>{t.nav.workflow}</span>
                    </a>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      id="hero-cta-signup"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs sm:text-sm font-bold text-emerald-950 shadow-md hover:bg-emerald-50 active:scale-[0.98] transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-900"
                    >
                      <UserPlus className="h-4 w-4 text-emerald-800" />
                      <span>{t.landing.startVerificationBtn}</span>
                      <ArrowRight className="h-4 w-4 text-emerald-800" />
                    </Link>

                    <Link
                      href="/login"
                      id="hero-cta-login"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-white/20 active:scale-[0.98] transition focus:outline-none focus:ring-2 focus:ring-white/40"
                    >
                      <LogIn className="h-4 w-4 text-emerald-200" />
                      <span>{t.nav.login}</span>
                    </Link>

                    <a
                      href="#workflow"
                      className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs sm:text-sm font-medium text-emerald-200 hover:text-white transition"
                    >
                      <span>{t.landing.viewDemoRecordsBtn}</span>
                      <span aria-hidden="true">&rarr;</span>
                    </a>
                  </>
                )}
              </div>

              {/* Feature Checkpoints */}
              <div className="pt-3 border-t border-emerald-800/60 flex flex-wrap items-center gap-y-1.5 gap-x-5 text-xs text-emerald-200/90 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{t.landing.checkChainOfTitle}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{t.landing.checkKhatianShare}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{t.landing.checkKhasWarning}</span>
                </div>
              </div>

              {/* Civic Disclaimer Note */}
              <div className="flex items-start gap-2 pt-1 text-[11px] text-emerald-300/80">
                <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-400" />
                <p className="leading-snug">
                  {t.landing.heroDisclaimerNote}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS (3-STEP WORKFLOW) ── */}
        <section id="workflow" className="space-y-4 sm:space-y-5 pt-2">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {t.landing.workflowBadge}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t.landing.workflowTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {t.landing.workflowSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 pt-1">
            {/* Step 1 */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs hover:border-emerald-300 transition flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800 font-bold text-sm border border-emerald-100">
                  {t.landing.step1Num}
                </div>
                <span className="text-xs font-medium text-slate-400">
                  {t.landing.step1Num === "১" ? "ধাপ ১" : "Step 1"}
                </span>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                  {t.landing.step1Title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t.landing.step1Desc}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs hover:border-emerald-300 transition flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800 font-bold text-sm border border-emerald-100">
                  {t.landing.step2Num}
                </div>
                <span className="text-xs font-medium text-slate-400">
                  {t.landing.step2Num === "২" ? "ধাপ ২" : "Step 2"}
                </span>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                  {t.landing.step2Title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t.landing.step2Desc}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs hover:border-emerald-300 transition flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800 font-bold text-sm border border-emerald-100">
                  {t.landing.step3Num}
                </div>
                <span className="text-xs font-medium text-slate-400">
                  {t.landing.step3Num === "৩" ? "ধাপ ৩" : "Step 3"}
                </span>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                  {t.landing.step3Title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t.landing.step3Desc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CORE CAPABILITIES & FEATURES ── */}
        <section id="features" className="space-y-4 sm:space-y-5 pt-2">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {t.landing.featuresBadge}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t.landing.featuresTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {t.landing.featuresSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 pt-1">
            {/* Feature 1: Pre-Verification */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition flex flex-col space-y-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-800 text-white shrink-0">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {t.landing.feat1Title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed flex-1">
                {t.landing.feat1Desc}
              </p>
            </div>

            {/* Feature 2: Explainable Risk */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition flex flex-col space-y-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white shrink-0">
                <svg
                  className="h-4.5 w-4.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {t.landing.feat2Title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed flex-1">
                {t.landing.feat2Desc}
              </p>
            </div>

            {/* Feature 3: Interactive Map */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition flex flex-col space-y-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shrink-0">
                <svg
                  className="h-4.5 w-4.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                  />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {t.landing.feat3Title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed flex-1">
                {t.landing.feat3Desc}
              </p>
            </div>

            {/* Feature 4: Printable PDF Report */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition flex flex-col space-y-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-white shrink-0">
                <svg
                  className="h-4.5 w-4.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.72 13.829c-.24-1.076-.672-2.83-1.01-4.22m14.58 4.22c.24-1.076.672-2.83 1.01-4.22M3 13.5h18M6.75 6.75h10.5a2.25 2.25 0 012.25 2.25v6a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 15v-6a2.25 2.25 0 012.25-2.25zM6.75 17.25h10.5v3a1.5 1.5 0 01-1.5 1.5H8.25a1.5 1.5 0 01-1.5-1.5v-3z"
                  />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {t.landing.feat4Title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed flex-1">
                {t.landing.feat4Desc}
              </p>
            </div>

            {/* Feature 5: Land Support AI Assistant */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition flex flex-col space-y-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-white shrink-0">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {t.landing.feat5Title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed flex-1">
                {t.landing.feat5Desc}
              </p>
            </div>

            {/* Feature 6: Civic Privacy */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition flex flex-col space-y-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700 text-white shrink-0">
                <svg
                  className="h-4.5 w-4.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {t.landing.feat6Title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed flex-1">
                {t.landing.feat6Desc}
              </p>
            </div>
          </div>
        </section>

        {/* ── CALLOUT TO LIVE DASHBOARD ── */}
        <section className="rounded-2xl border border-emerald-200/90 bg-emerald-50/60 p-6 sm:p-8 text-center max-w-3xl mx-auto space-y-4 shadow-2xs">
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-emerald-950">
              {t.landing.calloutTitle}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-900/80 max-w-xl mx-auto leading-relaxed">
              {t.landing.calloutDesc}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-2xs hover:bg-emerald-900 transition active:scale-[0.98]"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>{t.nav.viewDashboard}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-2xs hover:bg-emerald-900 transition active:scale-[0.98]"
              >
                <UserPlus className="h-4 w-4" />
                <span>{t.landing.enterDashboardBtn}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-4.5 py-2.5 text-xs sm:text-sm font-semibold text-emerald-900 hover:bg-emerald-50 transition cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-emerald-700" />
              <span>{t.landing.askAssistantBtn}</span>
            </button>
          </div>
        </section>
      </main>

      {/* Floating Chat Support Widget */}
      <ChatSupportWidget
        isOpen={isChatOpen}
        onOpen={() => setIsChatOpen(true)}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
