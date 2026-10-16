"use client";

import React from "react";
import dynamic from "next/dynamic";
import { DemoLandParcel } from "@/data/demo-data";

interface ParcelMapProps {
  parcels: DemoLandParcel[];
  selectedParcelId?: string | null;
  onSelectParcel?: (parcel: DemoLandParcel) => void;
  onOpenVerification?: (parcelId: string) => void;
  onScrollToTable?: (parcelId: string) => void;
}

// Dynamically import Leaflet inner map component with ssr: false to prevent window/document SSR errors
const DynamicParcelMapInner = dynamic(() => import("./ParcelMapInner"), {
  ssr: false,
  loading: () => (
    <div className="h-[460px] w-full rounded-2xl border border-slate-200 bg-slate-100 flex flex-col items-center justify-center text-slate-500 gap-2 p-6 animate-pulse">
      <svg
        className="h-8 w-8 text-slate-400 animate-spin"
        fill="none"
        viewBox="0 0 24 24"
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
      <span className="text-sm font-medium text-slate-600">
        ইন্টারেক্টিভ মানচিত্র লোড হচ্ছে...
      </span>
      <span className="text-2xs text-slate-400">
        বাংলাদেশ ভৌগোলিক স্থানাঙ্ক ও পলিগন রেন্ডার হচ্ছে
      </span>
    </div>
  ),
});

export default function ParcelMap({
  parcels,
  selectedParcelId,
  onSelectParcel,
  onOpenVerification,
  onScrollToTable,
}: ParcelMapProps) {
  return (
    <div id="map-section" className="space-y-3.5 pt-2">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              নমুনা জমির ভৌগোলিক প্রাক-যাচাই মানচিত্র
            </h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 border border-slate-200/80">
              কাল্পনিক ডেমো
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            মানচিত্রের যেকোনো মার্কার বা পলিগনে ক্লিক করে সংশ্লিষ্ট প্লটের প্রাথমিক ঝুঁকি ফলাফল পর্যালোচনা করুন
          </p>
        </div>

        <div className="text-2xs text-slate-400 italic sm:text-right">
          * কোনো জরিপ-নির্ভুল বা বাস্তব সরকারি মৌজা সীমানা নির্দেশ করে না।
        </div>
      </div>

      {/* Map Component Canvas */}
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
