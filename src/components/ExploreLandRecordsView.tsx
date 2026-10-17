"use client";

import React, { useState } from "react";
import { DemoLandParcel, DashboardSummary } from "@/data/demo-data";
import { useLanguage } from "@/context/LanguageContext";
import { useDashboard } from "@/context/DashboardContext";
import SummaryCards from "./SummaryCards";
import ParcelMap from "./ParcelMap";
import ParcelTable from "./ParcelTable";
import AboutSection from "./AboutSection";
import {
  Compass,
  Info,
  RefreshCw,
  AlertCircle,
  FileSearch,
} from "lucide-react";

interface ExploreLandRecordsViewProps {
  initialParcels: DemoLandParcel[];
  summary: DashboardSummary;
  totalRecords: number;
}

export default function ExploreLandRecordsView({
  initialParcels,
  summary,
  totalRecords,
}: ExploreLandRecordsViewProps) {
  const { language, t } = useLanguage();
  const { openVerificationModal } = useDashboard();

  const [parcels, setParcels] = useState<DemoLandParcel[]>(initialParcels);
  const [highlightedParcelId, setHighlightedParcelId] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialParcels.length < totalRecords);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Map & Table row synchronization
  const handleSelectFromMap = (parcel: DemoLandParcel) => {
    setHighlightedParcelId(parcel.id);
    const rowEl = document.getElementById(`parcel-row-${parcel.id}`);
    if (rowEl) {
      rowEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleViewOnMap = (parcel: DemoLandParcel) => {
    setHighlightedParcelId(parcel.id);
    const mapEl = document.getElementById("explore-map-section") || document.getElementById("map-section");
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    setLoadError(null);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/parcels?page=${nextPage}&limit=15`);
      if (!res.ok) {
        throw new Error("Failed to load more records");
      }
      const data = await res.json();
      if (data.parcels && data.parcels.length > 0) {
        setParcels((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newUnique = data.parcels.filter((p: DemoLandParcel) => !existingIds.has(p.id));
          return [...prev, ...newUnique];
        });
        setPage(nextPage);
        setHasMore(data.pagination?.hasMore ?? false);
      } else {
        setHasMore(false);
      }
    } catch {
      setLoadError(
        language === "bn"
          ? "অতিরিক্ত রেকর্ড লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
          : "Failed to load additional records. Please try again."
      );
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* ── 1. PAGE HEADER & DISCLAIMER ── */}
      <div className="space-y-3 pb-2 border-b border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                <Compass className="h-5 w-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {t.explore.title}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t.explore.subtitle}
            </p>
          </div>

          {/* Records Counter Pill */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>
                {language === "bn"
                  ? `${parcels.length}টি ডাটাবেজ রেকর্ড লোড হয়েছে`
                  : `${parcels.length} database records loaded`}
              </span>
            </span>
          </div>
        </div>

        {/* Subtle, Visible Civic Tech Illustrative Disclaimer */}
        <div className="rounded-xl border border-slate-200 bg-slate-100/80 px-3.5 py-2.5 text-xs text-slate-700 flex items-start gap-2.5">
          <Info className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-900">
              {language === "bn" ? "প্রদর্শনমূলক সতর্কবার্তা: " : "Illustrative Notice: "}
            </strong>
            {t.explore.disclaimer}
          </p>
        </div>
      </div>

      {/* ── 2. DATABASE PARCEL KPI SUMMARY CARDS ── */}
      <SummaryCards stats={summary} />

      {/* ── 3. GEOGRAPHIC RISK MAP ── */}
      <div id="explore-map-section" className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {language === "bn" ? "ভৌগোলিক ক্যাডাস্ট্রাল ঝুঁকি মানচিত্র" : "Cadastral Risk Map"}
          </h2>
          <span className="text-2xs text-slate-400">
            {language === "bn"
              ? "মার্কারে ক্লিক করে পার্সেলের বিবরণ দেখুন"
              : "Click markers to inspect parcel details"}
          </span>
        </div>

        <ParcelMap
          parcels={parcels}
          selectedParcelId={highlightedParcelId}
          onSelectParcel={handleSelectFromMap}
          onOpenVerification={(parcelId) => openVerificationModal(parcelId)}
          onScrollToTable={(parcelId) => {
            setHighlightedParcelId(parcelId);
            const rowEl = document.getElementById(`parcel-row-${parcelId}`);
            if (rowEl) {
              rowEl.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }}
        />
      </div>

      {/* ── 4. CADASTRAL RECORDS TABLE ── */}
      <div id="explore-table-section" className="space-y-3">
        <ParcelTable
          parcels={parcels}
          selectedParcelId={highlightedParcelId}
          onSelectParcel={(parcel) => openVerificationModal(parcel.id)}
          onViewOnMap={handleViewOnMap}
        />

        {/* Load More / Pagination Button */}
        {hasMore && (
          <div className="pt-2 text-center">
            {loadError && (
              <div className="mb-3 inline-flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
                <AlertCircle className="h-4 w-4" />
                <span>{loadError}</span>
              </div>
            )}
            <div>
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition disabled:opacity-50 cursor-pointer"
              >
                {isLoadingMore ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-emerald-700" />
                    <span>{t.explore.loading}</span>
                  </>
                ) : (
                  <>
                    <FileSearch className="h-4 w-4 text-emerald-700" />
                    <span>{t.explore.loadMore}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── 5. CIVIC TECHNOLOGY RISK GUIDE ── */}
      <AboutSection />
    </div>
  );
}
