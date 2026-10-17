"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, FileCheck, Layers, ImageOff } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface HeroSlide {
  id: string;
  src: string;
  tagBn: string;
  tagEn: string;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  icon: React.ComponentType<{ className?: string }>;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "agriculture",
    src: "/images/hero/agricultural-land.jpg",
    tagBn: "প্রাকৃতিক মৌজা ও কৃষিজমি",
    tagEn: "Agricultural & Rural Mouza",
    titleBn: "বাংলাদেশের উর্বর কৃষিজমি ও নদীবিধৌত ভূখণ্ড",
    titleEn: "Agricultural Riverine Parcels of Bangladesh",
    descBn: "প্রস্তাবিত প্লটের পারিপার্শ্বিক অবস্থা ও মৌজা সীমানা নিরীক্ষা",
    descEn: "Pre-verifying field boundaries and environmental context",
    icon: MapPin,
  },
  {
    id: "cadastral-map",
    src: "/images/hero/mouza-cadastral-map.jpg",
    tagBn: "ক্যাডাস্ট্রাল জরিপ নকশা",
    tagEn: "Cadastral Survey Map Sheet",
    titleBn: "সিএস, এসএ, আরএস ও বিএস মৌজা নকশা ও দাগ",
    titleEn: "CS, SA, RS & BS Mouza Sheet & Dag Boundary",
    descBn: "মৌজা ম্যাপে দাগের সঠিক অবস্থান ও প্রতিবেশীর সীমানা অডিট",
    descEn: "Survey plot boundaries and neighborhood demarcation",
    icon: Layers,
  },
  {
    id: "deed-verification",
    src: "/images/hero/deed-verification.jpg",
    tagBn: "দলিল ও খতিয়ান প্রাক-যাচাই",
    tagEn: "Deed & Khatian Verification",
    titleBn: "বায়া দলিল পরম্পরা ও খতিয়ান হিস্যা যাচাই",
    titleEn: "Deed Chain of Title & Khatian Share Audit",
    descBn: "১ নং খাস বাফার ও দ্বৈত হস্তান্তরের ঝুঁকি শনাক্তকরণ",
    descEn: "Detecting Khas land overlap and duplicate sales",
    icon: FileCheck,
  },
];

export default function HeroCarousel() {
  const { language, t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Auto-slide every 6 seconds, paused on hover
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  const activeSlide = HERO_SLIDES[currentIndex];
  const ActiveIcon = activeSlide.icon;

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  // Variants for Framer Motion
  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: shouldReduceMotion ? 0 : dir > 0 ? 30 : -30,
      scale: shouldReduceMotion ? 1 : 0.98,
    }),
    center: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.45,
        ease: "easeInOut" as const,
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: shouldReduceMotion ? 0 : dir > 0 ? -30 : 30,
      scale: shouldReduceMotion ? 1 : 0.98,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.35,
        ease: "easeInOut" as const,
      },
    }),
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-700/60 bg-emerald-950/70 shadow-xl sm:shadow-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label={language === "bn" ? "ল্যান্ডগার্ড হিরো স্লাইডার" : "LandGuard Hero Carousel"}
    >
      {/* 4:3 Aspect Ratio Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900" suppressHydrationWarning>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeSlide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 h-full w-full"
          >
            {failedImages[activeSlide.id] ? (
              /* Graceful image fallback */
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 p-6 text-center text-white">
                <ImageOff className="mb-2 h-10 w-10 text-emerald-400 opacity-60" />
                <p className="text-sm font-semibold text-emerald-200">
                  {language === "bn" ? activeSlide.titleBn : activeSlide.titleEn}
                </p>
                <p className="text-xs text-emerald-400/80 mt-1">
                  {language === "bn" ? activeSlide.descBn : activeSlide.descEn}
                </p>
              </div>
            ) : (
              /* Photo Slide */
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={activeSlide.src}
                alt={language === "bn" ? activeSlide.titleBn : activeSlide.titleEn}
                onError={() => handleImageError(activeSlide.id)}
                className="h-full w-full object-cover object-center transform scale-100 hover:scale-102 transition-transform duration-700 ease-out"
                loading="eager"
              />
            )}

            {/* Gradient Overlay for Readable Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />

            {/* Top Pill: Category Tag */}
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/70 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30 shadow-xs">
                <ActiveIcon className="h-3.5 w-3.5 text-emerald-400" />
                <span>
                  {language === "bn" ? activeSlide.tagBn : activeSlide.tagEn}
                </span>
              </span>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-14 sm:right-16 z-10">
              <h3 className="text-xs sm:text-sm font-bold text-white drop-shadow-sm leading-snug line-clamp-1">
                {language === "bn" ? activeSlide.titleBn : activeSlide.titleEn}
              </h3>
              <p className="text-[11px] sm:text-xs text-emerald-200/90 drop-shadow-sm mt-0.5 line-clamp-1">
                {language === "bn" ? activeSlide.descBn : activeSlide.descEn}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Previous / Next Arrow Controls */}
        <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-20 flex items-center gap-1.5">
          <button
            type="button"
            onClick={prevSlide}
            aria-label={t.landing.carouselPrev}
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-slate-950/75 text-white backdrop-blur-md hover:bg-emerald-900 border border-white/20 transition focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer active:scale-95 shadow-md"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label={t.landing.carouselNext}
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-slate-950/75 text-white backdrop-blur-md hover:bg-emerald-900 border border-white/20 transition focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer active:scale-95 shadow-md"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Slide Indicator Dots (Top Right) */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`${t.landing.carouselSlide} ${index + 1}`}
              aria-current={currentIndex === index ? "true" : "false"}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === index
                  ? "w-4 bg-emerald-400 shadow-xs"
                  : "w-1.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
