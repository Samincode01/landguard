"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Layers,
  MapPinned,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type SlideId = "result" | "map" | "document";

/**
 * Illustrative verification UI for the landing hero.
 * Decorative carousel of product-style panels — no API calls, no official imagery.
 */
export default function LandingVerificationPreview() {
  const { t, language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slides: { id: SlideId; tag: string; title: string }[] = [
    {
      id: "result",
      tag: t.landing.slide3Tag,
      title: t.landing.previewDocTitle,
    },
    {
      id: "map",
      tag: t.landing.slide2Tag,
      title: t.landing.slide2Title,
    },
    {
      id: "document",
      tag: t.landing.slide1Tag,
      title: t.landing.slide1Title,
    },
  ];

  const goTo = useCallback((next: number) => {
    setIndex(((next % slides.length) + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (reduceMotion || paused) return;
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5200);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [reduceMotion, paused, slides.length]);

  const active = slides[index];

  const fadeIn = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, ease: "easeOut" as const },
      };

  const slideTransition = reduceMotion
    ? { duration: 0.01 }
    : { duration: 0.4, ease: "easeInOut" as const };

  return (
    <div className="relative w-full max-w-md lg:max-w-none mx-auto lg:mx-0">
      {/* Atmospheric backdrop plane */}
      <div className="absolute -inset-6 sm:-inset-10 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(6,78,59,0.22),transparent_65%)]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <motion.div
        {...fadeIn}
        className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_24px_60px_-28px_rgba(6,78,59,0.45)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setPaused(false);
          }
        }}
        role="region"
        aria-roledescription="carousel"
        aria-label={
          language === "bn"
            ? "নমুনা যাচাই ভিজ্যুয়াল স্লাইডার"
            : "Sample verification visual carousel"
        }
      >
        {/* Document header bar */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/90 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-900 text-emerald-200">
              <FileText className="h-4.5 w-4.5" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 truncate">
                {t.landing.previewLabel}
              </p>
              <p className="text-sm font-bold text-slate-900 truncate">
                {active.title}
              </p>
            </div>
          </div>
          <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden />
        </div>

        {/* Sliding visual area */}
        <div className="relative">
          <div className="relative min-h-[280px] sm:min-h-[300px] overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                initial={reduceMotion ? false : { opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -18 }}
                transition={slideTransition}
                className="absolute inset-0 p-4 sm:p-5"
                role="group"
                aria-roledescription="slide"
                aria-label={`${t.landing.carouselSlide} ${index + 1}`}
              >
                {active.id === "result" && <ResultSlide />}
                {active.id === "map" && <MapSlide tag={active.tag} />}
                {active.id === "document" && <DocumentSlide tag={active.tag} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Indicators */}
          <div className="flex items-center justify-between gap-3 px-4 sm:px-5 pb-4 pt-1">
            <p className="text-[11px] leading-snug text-slate-500 min-w-0 flex-1">
              {t.landing.previewSampleNote}
            </p>
            <div className="flex items-center gap-1.5 shrink-0" role="tablist" aria-label={t.landing.carouselSlide}>
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`${t.landing.carouselSlide} ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 cursor-pointer ${
                    i === index
                      ? "w-4 bg-emerald-700"
                      : "w-1.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ResultSlide() {
  const { t } = useLanguage();

  return (
    <div className="flex h-full flex-col justify-between space-y-4">
      <dl className="grid grid-cols-1 gap-2.5 text-sm">
        <div className="flex items-baseline justify-between gap-3 border-b border-slate-100 pb-2">
          <dt className="text-slate-500 shrink-0">{t.landing.previewOwnerLabel}</dt>
          <dd className="font-semibold text-slate-900 text-right truncate">
            {t.landing.previewOwnerValue}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3 border-b border-slate-100 pb-2">
          <dt className="text-slate-500 shrink-0">{t.landing.previewMouzaLabel}</dt>
          <dd className="font-semibold text-slate-900 text-right truncate">
            {t.landing.previewMouzaValue}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-slate-500 shrink-0">{t.landing.previewKhatianLabel}</dt>
          <dd className="bn-num font-semibold text-slate-900 text-right truncate">
            {t.landing.previewKhatianValue}
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-900 ring-1 ring-emerald-200/80">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" aria-hidden />
          {t.landing.previewMatch}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-950 ring-1 ring-amber-200/80">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-700" aria-hidden />
          {t.landing.previewCaution}
        </span>
      </div>

      <ul className="space-y-2 rounded-xl bg-slate-50 px-3 py-3 ring-1 ring-slate-100">
        <li className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
            <AlertTriangle className="h-3 w-3" aria-hidden />
          </span>
          <span>{t.landing.previewFlagShare}</span>
        </li>
        <li className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="h-3 w-3" aria-hidden />
          </span>
          <span>{t.landing.previewFlagChain}</span>
        </li>
      </ul>
    </div>
  );
}

function MapSlide({ tag }: { tag: string }) {
  const { language } = useLanguage();
  const dagLabel = language === "bn" ? "দাগ ৪৫২" : "Dag 452";

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="inline-flex w-fit items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
        <MapPinned className="h-3.5 w-3.5 text-emerald-700" aria-hidden />
        {tag}
      </div>

      {/* Stylized cadastral / parcel schematic — not an official map */}
      <div className="relative flex-1 min-h-[200px] overflow-hidden rounded-xl border border-emerald-900/10 bg-[#ecf4ef]">
        <svg
          viewBox="0 0 320 200"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <defs>
            <pattern id="parcel-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="#94a3b8" strokeWidth="0.4" opacity="0.45" />
            </pattern>
          </defs>
          <rect width="320" height="200" fill="url(#parcel-grid)" />
          <path
            d="M28 150 L70 48 L145 62 L168 128 L110 168 Z"
            fill="#a7f3d0"
            stroke="#047857"
            strokeWidth="1.5"
            opacity="0.85"
          />
          <path
            d="M145 62 L220 40 L278 78 L250 145 L168 128 Z"
            fill="#bbf7d0"
            stroke="#065f46"
            strokeWidth="1.5"
            opacity="0.75"
          />
          <path
            d="M70 48 L120 22 L180 30 L145 62 Z"
            fill="#d1fae5"
            stroke="#059669"
            strokeWidth="1.25"
            opacity="0.9"
          />
          <circle cx="118" cy="105" r="4" fill="#b45309" />
          <circle cx="210" cy="95" r="3.5" fill="#047857" />
          <path
            d="M40 175 Q160 155 280 170"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="2"
            opacity="0.35"
          />
        </svg>
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 rounded-lg bg-white/90 px-2.5 py-1.5 text-[11px] shadow-sm ring-1 ring-slate-200/80 backdrop-blur-sm">
          <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
            <Layers className="h-3 w-3 text-emerald-700" aria-hidden />
            <span className="bn-num">{dagLabel}</span>
          </span>
          <span className="rounded bg-amber-50 px-1.5 py-0.5 font-semibold text-amber-900 ring-1 ring-amber-200/80">
            !
          </span>
        </div>
      </div>
    </div>
  );
}

function DocumentSlide({ tag }: { tag: string }) {
  const { t, language } = useLanguage();
  const sheetLabel = language === "bn" ? "নমুনা পত্র" : "Sample sheet";
  const demoBadge = language === "bn" ? "নমুনা" : "DEMO";

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="inline-flex w-fit items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
        <FileText className="h-3.5 w-3.5 text-emerald-700" aria-hidden />
        {tag}
      </div>

      {/* Stylized deed / khatian sheet — illustrative only */}
      <div className="relative flex-1 min-h-[200px] overflow-hidden rounded-xl border border-slate-200 bg-[#faf8f5] p-3.5 sm:p-4 shadow-inner">
        <div className="mb-3 flex items-start justify-between gap-2 border-b border-slate-300/70 pb-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {sheetLabel}
            </p>
            <p className="text-sm font-bold text-slate-800">{t.landing.previewDocTitle}</p>
          </div>
          <div className="rounded border border-dashed border-emerald-700/40 px-2 py-1 text-[10px] font-bold text-emerald-800">
            {demoBadge}
          </div>
        </div>

        <div className="space-y-2.5">
          {[0.92, 0.78, 0.85, 0.7, 0.88].map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-2 w-12 shrink-0 rounded-sm bg-slate-300/80" />
              <div
                className="h-2 rounded-sm bg-slate-200"
                style={{ width: `${w * 100}%` }}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-white px-2.5 py-2 ring-1 ring-slate-200">
            <p className="text-[10px] text-slate-500">{t.landing.previewKhatianLabel}</p>
            <p className="bn-num text-xs font-bold text-slate-800">
              {t.landing.previewKhatianValue}
            </p>
          </div>
          <div className="rounded-lg bg-white px-2.5 py-2 ring-1 ring-slate-200">
            <p className="text-[10px] text-slate-500">{t.landing.previewMouzaLabel}</p>
            <p className="text-xs font-bold text-slate-800">
              {t.landing.previewMouzaValue}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
          {t.landing.previewFlagChain}
        </div>
      </div>
    </div>
  );
}
