"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DemoLandParcel } from "@/data/demo-data";
import {
  getOutcomeMapStyle,
  BANGLADESH_CENTER,
  BANGLADESH_DEFAULT_ZOOM,
  PARCEL_FOCUS_ZOOM,
  getValidApproxLocation,
  getParcelsWithValidLocation,
  getParcelLatLngBounds,
  getDisplayBoundaryForParcel,
} from "@/lib/map-utils";
import { analyzeParcelRisk } from "@/lib/risk-analysis";
import { toBengaliNumerals } from "@/lib/formatters";
import { useLanguage } from "@/context/LanguageContext";

interface ParcelMapInnerProps {
  parcels: DemoLandParcel[];
  selectedParcelId?: string | null;
  onSelectParcel?: (parcel: DemoLandParcel) => void;
  onOpenVerification?: (parcelId: string) => void;
  onScrollToTable?: (parcelId: string) => void;
}

const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors';

const ESRI_ATTRIBUTION =
  "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community";

export default function ParcelMapInner({
  parcels,
  selectedParcelId,
  onSelectParcel,
  onOpenVerification,
  onScrollToTable,
}: ParcelMapInnerProps) {
  const { t, language } = useLanguage();

  const formatNum = useCallback(
    (val: number | string) =>
      language === "bn" ? toBengaliNumerals(val) : String(val),
    [language]
  );

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.FeatureGroup | null>(null);
  const boundariesGroupRef = useRef<L.FeatureGroup | null>(null);
  const didInitialFitRef = useRef(false);
  const lastFlownIdRef = useRef<string | null>(null);

  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(
    selectedParcelId || null
  );
  const [prevSelectedParcelId, setPrevSelectedParcelId] = useState(selectedParcelId);
  const [tileError, setTileError] = useState(false);

  if (selectedParcelId !== prevSelectedParcelId) {
    setPrevSelectedParcelId(selectedParcelId);
    setInternalSelectedId(selectedParcelId || null);
  }

  const mappableParcels = useMemo(
    () => getParcelsWithValidLocation(parcels),
    [parcels]
  );

  const activeParcel = useMemo(() => {
    if (!internalSelectedId) return null;
    return parcels.find((p) => p.id === internalSelectedId) || null;
  }, [parcels, internalSelectedId]);

  const activeAnalysis = useMemo(() => {
    if (!activeParcel) return null;
    return analyzeParcelRisk(activeParcel);
  }, [activeParcel]);

  const createCustomPin = useCallback(
    (color: string, label: string, isSelected: boolean) => {
      const scale = isSelected ? 1.2 : 1.0;
      const shadow = isSelected
        ? "filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));"
        : "filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));";

      const safeLabel = String(label)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

      const svgHtml = `
      <div style="position: relative; width: 34px; height: 42px; ${shadow}">
        <svg viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;" aria-hidden="true">
          <path d="M17 0C7.611 0 0 7.611 0 17C0 27.5 14.5 40.5 16.2 41.9C16.68 42.3 17.32 42.3 17.8 41.9C19.5 40.5 34 27.5 34 17C34 7.611 26.389 0 17 0Z" fill="${color}"/>
          <circle cx="17" cy="16" r="9" fill="white"/>
          <text x="17" y="19.5" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" font-weight="bold" fill="${color}">${safeLabel}</text>
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
    },
    []
  );

  const buildPopupHtml = useCallback(
    (parcel: DemoLandParcel, lat: number, lng: number, isIllustrative: boolean) => {
      const mouza = language === "bn" ? parcel.mouza : parcel.mouzaEn;
      const upazila = language === "bn" ? parcel.upazila : parcel.upazilaEn;
      const district = language === "bn" ? parcel.district : parcel.districtEn;
      const location = [mouza, upazila, district].filter(Boolean).join(", ");
      const boundaryNote = isIllustrative
        ? t.map.illustrativeBoundaryDisclaimer
        : t.map.popupApproxNote;

      return `
        <div style="min-width:180px;max-width:260px;font-family:system-ui,sans-serif;font-size:12px;line-height:1.45;color:#0f172a;">
          <div style="font-weight:700;margin-bottom:4px;">
            ${language === "bn" ? "দাগ" : "Dag"} ${formatNum(parcel.dagNumber)}
          </div>
          <div style="color:#475569;margin-bottom:6px;">${location}</div>
          <div style="color:#64748b;font-size:11px;">
            <div><strong>${t.map.parcelIdLabel}:</strong> ${parcel.id}</div>
            <div><strong>${t.map.coordsLabel}:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}</div>
          </div>
          <div style="margin-top:6px;padding-top:6px;border-top:1px solid #e2e8f0;font-size:10px;color:#64748b;">
            ${boundaryNote}
          </div>
        </div>
      `;
    },
    [language, formatNum, t.map]
  );

  const fitToResults = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const bounds = getParcelLatLngBounds(mappableParcels);
    if (!bounds) {
      map.setView(BANGLADESH_CENTER, BANGLADESH_DEFAULT_ZOOM);
      return;
    }
    map.fitBounds(
      L.latLngBounds(bounds.southWest, bounds.northEast),
      { padding: [40, 40], maxZoom: 12, animate: true }
    );
  }, [mappableParcels]);

  const fitToParcel = useCallback(
    (parcel: DemoLandParcel | null | undefined) => {
      const map = mapInstanceRef.current;
      if (!map || !parcel) return;
      const loc = getValidApproxLocation(parcel);
      if (!loc) return;

      const display = getDisplayBoundaryForParcel(parcel);
      if (display) {
        try {
          const layer = L.geoJSON(display.geometry as GeoJSON.GeoJsonObject);
          const b = layer.getBounds();
          if (b.isValid()) {
            map.fitBounds(b, {
              padding: [36, 36],
              maxZoom: display.isIllustrative ? 15 : 16,
              animate: true,
            });
            return;
          }
        } catch {
          // fall through to point focus
        }
      }

      map.flyTo([loc.lat, loc.lng], PARCEL_FOCUS_ZOOM, { duration: 0.7 });
    },
    []
  );

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: BANGLADESH_CENTER,
      zoom: BANGLADESH_DEFAULT_ZOOM,
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: true,
    });

    const streets = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: `${OSM_ATTRIBUTION} | LandGuard BD demo`,
    });

    streets.on("tileerror", () => setTileError(true));
    streets.on("tileload", () => setTileError(false));

    // Optional satellite: Esri World Imagery (not OSM). Attributed per Esri terms.
    const satellite = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 19,
        attribution: `${ESRI_ATTRIBUTION} | LandGuard BD demo`,
      }
    );

    streets.addTo(map);

    const markersGroup = L.featureGroup().addTo(map);
    const boundariesGroup = L.featureGroup().addTo(map);
    markersGroupRef.current = markersGroup;
    boundariesGroupRef.current = boundariesGroup;

    L.control.scale({ imperial: false, metric: true, position: "bottomleft" }).addTo(map);

    L.control
      .layers(
        {
          [language === "bn" ? "রাস্তা মানচিত্র" : "Street map"]: streets,
          [language === "bn" ? "স্যাটেলাইট (Esri)" : "Satellite (Esri)"]: satellite,
        },
        {},
        { position: "topright", collapsed: true }
      )
      .addTo(map);

    mapInstanceRef.current = map;

    // Invalidate size after layout (mobile drawers / flex)
    requestAnimationFrame(() => {
      map.invalidateSize();
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersGroupRef.current = null;
      boundariesGroupRef.current = null;
      didInitialFitRef.current = false;
      lastFlownIdRef.current = null;
    };
    // language used only for initial layer names; remount not required on lang switch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rebuild markers + display boundaries (authentic or illustrative demo)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    const boundariesGroup = boundariesGroupRef.current;
    if (!map || !markersGroup || !boundariesGroup) return;

    markersGroup.clearLayers();
    boundariesGroup.clearLayers();

    mappableParcels.forEach((parcel) => {
      const loc = getValidApproxLocation(parcel);
      if (!loc) return;

      const isSelected = parcel.id === internalSelectedId;
      const analysis = analyzeParcelRisk(parcel);
      const display = getDisplayBoundaryForParcel(parcel);
      const isIllustrative = display?.isIllustrative ?? true;
      const style = getOutcomeMapStyle(
        analysis.outcome,
        isSelected,
        isIllustrative
      );
      const dagLabel =
        language === "bn" ? toBengaliNumerals(parcel.dagNumber) : parcel.dagNumber;

      // Authentic boundaryGeoJSON unchanged; otherwise deterministic demo shape
      if (display) {
        try {
          const polygonLayer = L.geoJSON(
            display.geometry as GeoJSON.GeoJsonObject,
            {
              style: () => ({
                fillColor: style.fillColor,
                color: style.color,
                weight: style.weight,
                fillOpacity: style.fillOpacity,
                dashArray: style.dashArray,
              }),
            }
          );
          polygonLayer.on("click", (e) => {
            L.DomEvent.stopPropagation(e);
            setInternalSelectedId(parcel.id);
            onSelectParcel?.(parcel);
          });
          polygonLayer.bindPopup(
            buildPopupHtml(parcel, loc.lat, loc.lng, isIllustrative)
          );
          polygonLayer.addTo(boundariesGroup);
        } catch {
          // Invalid GeoJSON — skip boundary, keep marker
        }
      }

      const marker = L.marker([loc.lat, loc.lng], {
        icon: createCustomPin(style.fillColor, dagLabel, isSelected),
        zIndexOffset: isSelected ? 1000 : 100,
        title: `${language === "bn" ? "দাগ" : "Dag"} ${parcel.dagNumber} — ${
          language === "bn" ? parcel.mouza : parcel.mouzaEn
        }`,
        riseOnHover: true,
      });

      marker.bindPopup(buildPopupHtml(parcel, loc.lat, loc.lng, isIllustrative), {
        maxWidth: 260,
        className: "landguard-map-popup",
      });

      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        setInternalSelectedId(parcel.id);
        onSelectParcel?.(parcel);
      });

      marker.addTo(markersGroup);
    });

    // Initial fit to all mappable points once data is available
    if (!didInitialFitRef.current && mappableParcels.length > 0 && !internalSelectedId) {
      didInitialFitRef.current = true;
      const bounds = getParcelLatLngBounds(mappableParcels);
      if (bounds) {
        map.fitBounds(L.latLngBounds(bounds.southWest, bounds.northEast), {
          padding: [40, 40],
          maxZoom: 11,
          animate: false,
        });
      }
    }

    map.invalidateSize();
  }, [
    mappableParcels,
    internalSelectedId,
    onSelectParcel,
    createCustomPin,
    buildPopupHtml,
    language,
  ]);

  // Fly / fit when selection changes (from map, table, or jump buttons)
  useEffect(() => {
    if (!internalSelectedId) {
      lastFlownIdRef.current = null;
      return;
    }
    if (lastFlownIdRef.current === internalSelectedId) return;
    lastFlownIdRef.current = internalSelectedId;
    const target = parcels.find((p) => p.id === internalSelectedId);
    fitToParcel(target);
  }, [internalSelectedId, parcels, fitToParcel]);

  const handleJumpToParcel = (parcel: DemoLandParcel) => {
    const loc = getValidApproxLocation(parcel);
    if (!loc) return;
    setInternalSelectedId(parcel.id);
    lastFlownIdRef.current = null; // force fit
    onSelectParcel?.(parcel);
  };

  const handleShowAll = () => {
    setInternalSelectedId(null);
    lastFlownIdRef.current = null;
    fitToResults();
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 text-xs min-w-0">
          <span className="font-semibold text-slate-500 shrink-0">{t.map.jumpLabel}</span>
          <button
            type="button"
            onClick={handleShowAll}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-700 hover:bg-slate-50 transition shadow-2xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 cursor-pointer"
          >
            {t.map.showAll}
          </button>
          <button
            type="button"
            onClick={fitToResults}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-700 hover:bg-slate-50 transition shadow-2xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 cursor-pointer"
          >
            {t.map.fitToResults}
          </button>
          {activeParcel && getValidApproxLocation(activeParcel) && (
            <button
              type="button"
              onClick={() => {
                lastFlownIdRef.current = null;
                fitToParcel(activeParcel);
              }}
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-900 hover:bg-emerald-100 transition shadow-2xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 cursor-pointer"
            >
              {t.map.fitToParcel}
            </button>
          )}
          {mappableParcels.slice(0, 8).map((p) => {
            const isSelected = p.id === internalSelectedId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleJumpToParcel(p)}
                className={`rounded-lg px-2.5 py-1 transition shadow-2xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {language === "bn" ? p.upazila : p.upazilaEn} (
                {language === "bn" ? "দাগ" : "Dag"} {formatNum(p.dagNumber)})
              </button>
            );
          })}
          {mappableParcels.length > 8 && (
            <span className="text-slate-400 text-[11px]">
              +{formatNum(mappableParcels.length - 8)}
            </span>
          )}
        </div>

        <div className="flex flex-col items-start sm:items-end gap-1.5 text-[11px] sm:text-xs shrink-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" aria-hidden />
              <span className="text-slate-600">{t.map.legendClean}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shrink-0" aria-hidden />
              <span className="text-slate-600">{t.map.legendReview}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" aria-hidden />
              <span className="text-slate-600">{t.map.legendInsufficient}</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5">
              <span
                className="h-2.5 w-4 shrink-0 border border-dashed border-emerald-700 bg-emerald-200/50"
                aria-hidden
              />
              <span className="text-slate-600">{t.map.legendIllustrativeBoundary}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="h-2.5 w-4 shrink-0 border border-solid border-slate-700 bg-slate-300/60"
                aria-hidden
              />
              <span className="text-slate-600">{t.map.legendAuthenticBoundary}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 relative overflow-hidden rounded-xl border border-slate-200/90 bg-slate-100 shadow-2xs">
          <div
            ref={mapContainerRef}
            className="h-[320px] sm:h-[420px] w-full z-10 touch-pan-y"
            role="region"
            aria-label={t.map.title}
          />

          {mappableParcels.length === 0 && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-100/90 px-4 text-center">
              <p className="text-sm text-slate-600 max-w-xs">{t.map.noCoordinates}</p>
            </div>
          )}

          {tileError && (
            <div className="absolute top-2 left-2 right-2 z-20 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1.5 text-[11px] text-amber-950">
              {language === "bn"
                ? "মানচিত্র টাইল লোডে সমস্যা হয়েছে। নেটওয়ার্ক পরীক্ষা করুন বা পরে আবার চেষ্টা করুন।"
                : "Map tiles failed to load. Check your network or try again later."}
            </div>
          )}

          <div className="absolute bottom-7 left-2 z-20 max-w-[min(100%-1rem,300px)] rounded-lg bg-white/95 px-2.5 py-1.5 text-[10px] sm:text-[11px] text-slate-600 backdrop-blur-xs border border-slate-200 shadow-xs pointer-events-none space-y-0.5">
            <p>
              <span className="font-semibold text-slate-800">
                {t.map.legendIllustrativeBoundary}:
              </span>{" "}
              {t.map.illustrativeBoundaryDisclaimer}
            </p>
            <p className="text-slate-500">{t.map.boundaryNote}</p>
          </div>
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-1 flex flex-col rounded-xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-2xs justify-between space-y-3.5">
          {activeParcel && activeAnalysis ? (
            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                      {t.map.selectedParcel}
                    </span>
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
                      {activeParcel.id}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                    {language === "en"
                      ? `Dag ${formatNum(activeParcel.dagNumber)} — ${activeParcel.mouzaEn}`
                      : `দাগ নং ${formatNum(activeParcel.dagNumber)} — ${activeParcel.mouza}`}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {language === "en"
                      ? `${activeParcel.upazilaEn}, ${activeParcel.districtEn}`
                      : `${activeParcel.upazila}, ${activeParcel.district}`}
                  </p>
                  {getValidApproxLocation(activeParcel) ? (
                    <p className="text-[11px] text-slate-400 bn-num mt-1">
                      {t.map.coordsLabel}:{" "}
                      {getValidApproxLocation(activeParcel)!.lat.toFixed(4)},{" "}
                      {getValidApproxLocation(activeParcel)!.lng.toFixed(4)}
                    </p>
                  ) : (
                    <p className="text-[11px] text-amber-700 mt-1">{t.map.noCoordinates}</p>
                  )}
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                    activeAnalysis.outcome === "NO_FLAGGED_DISCREPANCIES"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : activeAnalysis.outcome === "NEEDS_REVIEW"
                        ? "bg-rose-50 text-rose-800 border-rose-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
                >
                  {language === "en"
                    ? activeAnalysis.outcome === "NO_FLAGGED_DISCREPANCIES"
                      ? "Verified Match"
                      : activeAnalysis.outcome === "NEEDS_REVIEW"
                        ? "Needs Review"
                        : "Caution"
                    : activeAnalysis.outcomeLabelBn}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">
                    {t.map.specsKhatianSurvey}
                  </span>
                  <span className="font-semibold text-slate-800 bn-num text-xs">
                    {formatNum(activeParcel.khatianNumber)} ({activeParcel.khatianType})
                  </span>
                </div>
                <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">{t.map.specsArea}</span>
                  <span className="font-semibold text-slate-800 bn-num text-xs">
                    {formatNum(activeParcel.recordedArea)}{" "}
                    {language === "en"
                      ? activeParcel.areaUnitEn || activeParcel.areaUnit
                      : activeParcel.areaUnit}
                  </span>
                </div>
                <div className="col-span-2 rounded-lg bg-slate-50 p-2 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">{t.map.specsOwner}</span>
                  <span className="font-medium text-slate-800 text-xs">
                    {language === "en"
                      ? activeParcel.ownership.ownerNameEn
                      : activeParcel.ownership.ownerName}
                  </span>
                </div>
              </div>

              <div
                className={`rounded-lg p-2.5 text-xs leading-relaxed border ${
                  activeAnalysis.outcome === "NO_FLAGGED_DISCREPANCIES"
                    ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                    : activeAnalysis.outcome === "NEEDS_REVIEW"
                      ? "bg-rose-50/70 border-rose-200 text-rose-950"
                      : "bg-amber-50/70 border-amber-200 text-amber-950"
                }`}
              >
                <div className="font-bold mb-1 text-xs">{t.map.preAuditOutcome}</div>
                <p className="text-xs">{activeAnalysis.summaryBn}</p>
                {activeAnalysis.warnings.length > 0 && (
                  <ul className="mt-1 space-y-0.5 list-disc pl-4 text-[11px] text-rose-900 font-medium">
                    {activeAnalysis.warnings.map((w, idx) => (
                      <li key={idx}>{w.ruleTitleBn}</li>
                    ))}
                  </ul>
                )}
              </div>

              <p className="text-[11px] text-slate-400 italic">{t.map.syntheticCoordsNote}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 py-8 text-center text-slate-400 space-y-1.5">
              <p className="text-xs font-semibold text-slate-600">{t.map.noParcelSelected}</p>
              <p className="text-[11px] text-slate-400 max-w-[200px]">
                {t.map.noParcelSelectedSub}
              </p>
            </div>
          )}

          {activeParcel && (
            <div className="pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
              {onScrollToTable && (
                <button
                  type="button"
                  onClick={() => onScrollToTable(activeParcel.id)}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs text-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                >
                  {t.map.viewInTable}
                </button>
              )}
              {onOpenVerification && (
                <button
                  type="button"
                  onClick={() => onOpenVerification(activeParcel.id)}
                  className="flex-1 rounded-lg bg-emerald-800 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-900 transition shadow-2xs text-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                >
                  {t.map.verifyDeed}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
