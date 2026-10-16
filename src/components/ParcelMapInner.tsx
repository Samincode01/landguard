"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DemoLandParcel } from "@/data/demo-data";
import {
  buildParcelGeoJSON,
  getOutcomeMapStyle,
  BANGLADESH_CENTER,
  BANGLADESH_DEFAULT_ZOOM,
} from "@/lib/map-utils";
import { analyzeParcelRisk } from "@/lib/risk-analysis";
import { toBengaliNumerals } from "@/lib/formatters";

interface ParcelMapInnerProps {
  parcels: DemoLandParcel[];
  selectedParcelId?: string | null;
  onSelectParcel?: (parcel: DemoLandParcel) => void;
  onOpenVerification?: (parcelId: string) => void;
  onScrollToTable?: (parcelId: string) => void;
}

export default function ParcelMapInner({
  parcels,
  selectedParcelId,
  onSelectParcel,
  onOpenVerification,
  onScrollToTable,
}: ParcelMapInnerProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geoJsonLayerGroupRef = useRef<L.FeatureGroup | null>(null);
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(
    selectedParcelId || null
  );
  const [prevSelectedParcelId, setPrevSelectedParcelId] = useState(selectedParcelId);

  // Sync internal selected ID with external prop during render
  if (selectedParcelId !== prevSelectedParcelId) {
    setPrevSelectedParcelId(selectedParcelId);
    setInternalSelectedId(selectedParcelId || null);
  }

  const activeParcel = useMemo(() => {
    if (!internalSelectedId) return null;
    return parcels.find((p) => p.id === internalSelectedId) || null;
  }, [parcels, internalSelectedId]);

  const activeAnalysis = useMemo(() => {
    if (!activeParcel) return null;
    return analyzeParcelRisk(activeParcel);
  }, [activeParcel]);

  // Create custom SVG DivIcon for pins
  const createCustomPin = (color: string, label: string, isSelected: boolean) => {
    const scale = isSelected ? 1.2 : 1.0;
    const shadow = isSelected
      ? "filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4)); transform: scale(1.15);"
      : "filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));";

    const svgHtml = `
      <div style="position: relative; width: 34px; height: 42px; ${shadow} transition: transform 0.2s ease;">
        <svg viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
          <path d="M17 0C7.611 0 0 7.611 0 17C0 27.5 14.5 40.5 16.2 41.9C16.68 42.3 17.32 42.3 17.8 41.9C19.5 40.5 34 27.5 34 17C34 7.611 26.389 0 17 0Z" fill="${color}"/>
          <circle cx="17" cy="16" r="9" fill="white"/>
          <text x="17" y="19.5" text-anchor="middle" font-family="'Hind Siliguri', sans-serif" font-size="9" font-weight="bold" fill="${color}">${label}</text>
        </svg>
      </div>
    `;

    return L.divIcon({
      className: "custom-leaflet-pin",
      html: svgHtml,
      iconSize: [34 * scale, 42 * scale],
      iconAnchor: [17 * scale, 42 * scale],
      popupAnchor: [0, -38 * scale],
    });
  };

  // Initialize Map Once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: BANGLADESH_CENTER,
      zoom: BANGLADESH_DEFAULT_ZOOM,
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: true,
    });

    // Base OpenStreetMap tile layer (light, clean)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors | LandGuard BD Demo',
    }).addTo(map);

    const layerGroup = L.featureGroup().addTo(map);
    geoJsonLayerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      geoJsonLayerGroupRef.current = null;
    };
  }, []);

  // Update GeoJSON Polygons and Markers whenever parcels or selection changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = geoJsonLayerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    const geojsonData = buildParcelGeoJSON(parcels);

    geojsonData.features.forEach((feature) => {
      const parcel = parcels.find((p) => p.id === feature.id);
      if (!parcel || !parcel.approxLocation) return;

      const isSelected = parcel.id === internalSelectedId;
      const analysis = analyzeParcelRisk(parcel);
      const style = getOutcomeMapStyle(analysis.outcome, isSelected);

      // 1. Draw Illustrative GeoJSON Polygon
      const polygonLayer = L.geoJSON(feature as unknown as GeoJSON.GeoJsonObject, {
        style: () => ({
          fillColor: style.fillColor,
          color: style.color,
          weight: style.weight,
          fillOpacity: style.fillOpacity,
          dashArray: style.dashArray,
        }),
      });

      polygonLayer.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        setInternalSelectedId(parcel.id);
        if (onSelectParcel) onSelectParcel(parcel);
      });

      polygonLayer.addTo(layerGroup);

      // 2. Add Center Custom Pin Marker
      const pinColor = style.fillColor;
      const pinIcon = createCustomPin(pinColor, parcel.dagNumber, isSelected);

      const marker = L.marker([parcel.approxLocation.lat, parcel.approxLocation.lng], {
        icon: pinIcon,
        zIndexOffset: isSelected ? 1000 : 100,
        title: `দাগ নং ${parcel.dagNumber} — ${parcel.mouza}`,
      });

      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        setInternalSelectedId(parcel.id);
        if (onSelectParcel) onSelectParcel(parcel);
      });

      marker.addTo(layerGroup);
    });

    // If a parcel is selected, fly to its coordinates
    if (internalSelectedId) {
      const target = parcels.find((p) => p.id === internalSelectedId);
      if (target?.approxLocation) {
        map.flyTo([target.approxLocation.lat, target.approxLocation.lng], 13, {
          duration: 1.0,
        });
      }
    }
  }, [parcels, internalSelectedId, onSelectParcel]);

  // Handle jump to parcel button
  const handleJumpToParcel = (parcel: DemoLandParcel) => {
    setInternalSelectedId(parcel.id);
    if (onSelectParcel) onSelectParcel(parcel);
    if (mapInstanceRef.current && parcel.approxLocation) {
      mapInstanceRef.current.flyTo(
        [parcel.approxLocation.lat, parcel.approxLocation.lng],
        13,
        { duration: 1.0 }
      );
    }
  };

  // Reset to full view of Bangladesh
  const handleResetFullView = () => {
    setInternalSelectedId(null);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(BANGLADESH_CENTER, BANGLADESH_DEFAULT_ZOOM, {
        duration: 0.8,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Control Bar & Quick Jumps */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-semibold text-slate-500">দ্রুত অবস্থান দেখুন:</span>
          <button
            type="button"
            onClick={handleResetFullView}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-700 hover:bg-slate-50 transition shadow-2xs font-medium"
          >
            সমগ্র বাংলাদেশ
          </button>
          {parcels.map((p) => {
            const isSelected = p.id === internalSelectedId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleJumpToParcel(p)}
                className={`rounded-lg px-2.5 py-1 transition shadow-2xs font-medium ${
                  isSelected
                    ? "bg-slate-900 text-white font-semibold"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {p.upazila} (দাগ {p.dagNumber})
              </button>
            );
          })}
        </div>

        {/* Map Legend */}
        <div className="flex flex-wrap items-center gap-2.5 text-2xs sm:text-xs">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-slate-600">ঝুঁকিহীন</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shrink-0" />
            <span className="text-slate-600">পর্যালোচনা প্রয়োজন</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
            <span className="text-slate-600">তথ্য অপর্যাপ্ত</span>
          </span>
        </div>
      </div>

      {/* Main Map + Side Detail Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-100 shadow-xs">
          <div
            ref={mapContainerRef}
            className="h-[380px] sm:h-[460px] w-full z-10"
            aria-label="ইন্টারেক্টিভ নমুনা জমির মানচিত্র"
          />

          {/* Floating Notice on bottom-left of map */}
          <div className="absolute bottom-2 left-2 z-20 max-w-[280px] rounded-lg bg-white/95 px-2.5 py-1.5 text-2xs text-slate-500 backdrop-blur-xs border border-slate-200 shadow-xs pointer-events-none">
            <span className="font-semibold text-slate-700">কাল্পনিক প্রদর্শনী:</span>{" "}
            মানচিত্রের সীমানা ও অবস্থান কৃত্রিম নমুনা মাত্র — কোনো বাস্তব মৌজা নকশা নয়।
          </div>
        </div>

        {/* Selected Parcel Details Card */}
        <div className="lg:col-span-1 flex flex-col rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs justify-between space-y-4">
          {activeParcel && activeAnalysis ? (
            <div className="space-y-3.5 flex-1">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                      নির্বাচিত প্লট
                    </span>
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-2xs font-mono text-slate-500">
                      {activeParcel.id}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-0.5">
                    দাগ নং {activeParcel.dagNumber} — মৌজা {activeParcel.mouza}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {activeParcel.upazila}, {activeParcel.district}
                  </p>
                </div>

                {/* Outcome Badge */}
                <span
                  className={`text-2xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                    activeAnalysis.outcome === "NO_FLAGGED_DISCREPANCIES"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : activeAnalysis.outcome === "NEEDS_REVIEW"
                      ? "bg-rose-50 text-rose-800 border-rose-200"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
                >
                  {activeAnalysis.outcomeLabelBn}
                </span>
              </div>

              {/* Cadastral Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                  <span className="text-2xs text-slate-400 block">খতিয়ান ও জরিপ</span>
                  <span className="font-semibold text-slate-800 bn-num">
                    {activeParcel.khatianNumber} ({activeParcel.khatianType})
                  </span>
                </div>
                <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                  <span className="text-2xs text-slate-400 block">জমির পরিমাণ</span>
                  <span className="font-semibold text-slate-800 bn-num">
                    {toBengaliNumerals(activeParcel.recordedArea)} {activeParcel.areaUnit}
                  </span>
                </div>
                <div className="col-span-2 rounded-lg bg-slate-50 p-2 border border-slate-100">
                  <span className="text-2xs text-slate-400 block">নথিভুক্ত মালিক</span>
                  <span className="font-medium text-slate-800">
                    {activeParcel.ownership.ownerName}
                  </span>
                </div>
              </div>

              {/* Risk Summary Note */}
              <div
                className={`rounded-xl p-3 text-xs leading-relaxed border ${
                  activeAnalysis.outcome === "NO_FLAGGED_DISCREPANCIES"
                    ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                    : activeAnalysis.outcome === "NEEDS_REVIEW"
                    ? "bg-rose-50/70 border-rose-200 text-rose-950"
                    : "bg-amber-50/70 border-amber-200 text-amber-950"
                }`}
              >
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      activeAnalysis.outcome === "NO_FLAGGED_DISCREPANCIES"
                        ? "bg-emerald-600"
                        : activeAnalysis.outcome === "NEEDS_REVIEW"
                        ? "bg-rose-600"
                        : "bg-amber-600"
                    }`}
                  />
                  <span>স্বয়ংক্রিয় প্রাক-নিরীক্ষা ফলাফল:</span>
                </div>
                <p>{activeAnalysis.summaryBn}</p>
                {activeAnalysis.warnings.length > 0 && (
                  <ul className="mt-1.5 space-y-1 list-disc pl-4 text-2xs text-rose-900 font-medium">
                    {activeAnalysis.warnings.map((w, idx) => (
                      <li key={idx}>{w.ruleTitleBn}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Synthetic Disclaimer */}
              <p className="text-2xs text-slate-400 italic">
                * কৃত্রিম ডেমো স্থানাঙ্ক ({activeParcel.approxLocation?.lat},{" "}
                {activeParcel.approxLocation?.lng}) — কোনো বাস্তব সীমানা নির্দেশ করে না।
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 py-10 text-center text-slate-400 space-y-2">
              <svg
                className="h-10 w-10 text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.814c-.319-.16-.69-.16-1.008 0L4.625 5.75c-.38.19-.625.58-.625 1.006v11.928c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.997 2.498c.319.16.69.16 1.008 0z"
                />
              </svg>
              <p className="text-xs font-semibold text-slate-600">কোনো প্লট নির্বাচিত নেই</p>
              <p className="text-2xs text-slate-400 max-w-[200px]">
                মানচিত্রের যেকোনো মার্কার বা পলিগনে ক্লিক করে জমির বিস্তারিত ও ঝুঁকি বিশ্লেষণ দেখুন।
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {activeParcel && (
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
              {onScrollToTable && (
                <button
                  type="button"
                  onClick={() => onScrollToTable(activeParcel.id)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs text-center"
                >
                  তালিকায় বিশদ দেখুন
                </button>
              )}
              {onOpenVerification && (
                <button
                  type="button"
                  onClick={() => onOpenVerification(activeParcel.id)}
                  className="flex-1 rounded-xl bg-emerald-800 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-900 transition shadow-xs text-center"
                >
                  দলিল যাচাই করুন
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
