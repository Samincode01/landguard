"use client";

import React from "react";
import dynamic from "next/dynamic";
import { DemoLandParcel } from "@/data/demo-data";
import { useLanguage } from "@/context/LanguageContext";

interface ParcelMapProps {
  parcels: DemoLandParcel[];
  selectedParcelId?: string | null;
  onSelectParcel?: (parcel: DemoLandParcel) => void;
  onOpenVerification?: (parcelId: string) => void;
  onScrollToTable?: (parcelId: string) => void;
}

function MapLoadingFallback() {
  const { t } = useLanguage();
  return (
    <div className="h-[420px] w-full rounded-xl border border-slate-200 bg-slate-100 flex flex-col items-center justify-center text-slate-500 gap-2 p-6">
      <svg
        className="h-8 w-8 text-slate-400 animate-spin"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="text-sm font-medium text-slate-600">{t.map.loadingMap}</span>
      <span className="text-[11px] text-slate-400 text-center max-w-xs">
        {t.map.loadingSub}
      </span>
    </div>
  );
}

const DynamicParcelMapInner = dynamic(() => import("./ParcelMapInner"), {
  ssr: false,
  loading: () => <MapLoadingFallback />,
});

export default function ParcelMap({
  parcels,
  selectedParcelId,
  onSelectParcel,
  onOpenVerification,
  onScrollToTable,
}: ParcelMapProps) {
  const { t } = useLanguage();

  return (
    <div id="map-section" className="space-y-3.5 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {t.map.title}
            </h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 border border-slate-200/80">
              {t.map.demoBadge}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5 max-w-2xl">{t.map.subtitle}</p>
        </div>

        <p className="text-[11px] text-slate-400 italic sm:text-right max-w-sm">
          {t.map.boundaryNote}
        </p>
      </div>

      <DynamicParcelMapInner
        parcels={parcels}
        selectedParcelId={selectedParcelId}
        onSelectParcel={onSelectParcel}
        onOpenVerification={onOpenVerification}
        onScrollToTable={onScrollToTable}
      />
    </div>
  );
}
