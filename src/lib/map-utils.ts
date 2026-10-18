/**
 * Map utilities for LandGuard BD (Leaflet + OpenStreetMap).
 *
 * Parcels store approximate WGS84 points. For the hackathon demo, deterministic
 * illustrative polygons are generated around those points when no authentic
 * `boundaryGeoJSON` is supplied. Real geometry is never replaced or persisted.
 */

import { DemoLandParcel } from "@/data/demo-data";
import { analyzeParcelRisk, RiskAnalysisOutcome } from "./risk-analysis";

/** Dhaka / central Bangladesh — Leaflet [lat, lng] */
export const BANGLADESH_CENTER: [number, number] = [23.8103, 90.4125];
export const BANGLADESH_DEFAULT_ZOOM = 7;
export const PARCEL_FOCUS_ZOOM = 14;

/** Soft geographic envelope used for demo validation (Bangladesh mainland + coast). */
export const BANGLADESH_SOFT_BOUNDS = {
  minLat: 20.5,
  maxLat: 26.7,
  minLng: 88.0,
  maxLng: 92.7,
} as const;

export interface ParcelMapProperties {
  parcelId: string;
  dagNumber: string;
  khatianNumber: string;
  mouza: string;
  upazila: string;
  district: string;
  recordedArea: number;
  areaUnit: string;
  ownerName: string;
  riskOutcome: RiskAnalysisOutcome;
  riskOutcomeLabelBn: string;
  statusLabelBn: string;
  warningCount: number;
  isSynthetic: true;
  isApproximatePoint: true;
  hasAuthenticBoundary: boolean;
  lat: number;
  lng: number;
  illustrativeDisclaimerBn: string;
}

export interface ParcelPointFeature {
  type: "Feature";
  id: string;
  properties: ParcelMapProperties;
  geometry: {
    type: "Point";
    coordinates: [number, number]; // GeoJSON: [lng, lat]
  };
}

export interface ParcelPointFeatureCollection {
  type: "FeatureCollection";
  features: ParcelPointFeature[];
}

/** @deprecated Alias kept for older tests / imports — point features only. */
export type SyntheticParcelProperties = ParcelMapProperties;
export type SyntheticParcelFeature = ParcelPointFeature;
export type SyntheticParcelFeatureCollection = ParcelPointFeatureCollection;

/**
 * Validates WGS84 latitude/longitude (Leaflet order: lat, lng).
 * Rejects non-finite values and out-of-range coordinates.
 */
export function isValidLatLng(lat: unknown, lng: unknown): boolean {
  if (typeof lat !== "number" || typeof lng !== "number") return false;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;
  return true;
}

/** Soft check that a point lies within Bangladesh’s demo envelope. */
export function isWithinBangladeshSoftBounds(lat: number, lng: number): boolean {
  return (
    lat >= BANGLADESH_SOFT_BOUNDS.minLat &&
    lat <= BANGLADESH_SOFT_BOUNDS.maxLat &&
    lng >= BANGLADESH_SOFT_BOUNDS.minLng &&
    lng <= BANGLADESH_SOFT_BOUNDS.maxLng
  );
}

export function getValidApproxLocation(
  parcel: DemoLandParcel
): { lat: number; lng: number } | null {
  const loc = parcel.approxLocation;
  if (!loc) return null;
  if (!isValidLatLng(loc.lat, loc.lng)) return null;
  return { lat: loc.lat, lng: loc.lng };
}

export function getParcelsWithValidLocation(
  parcels: DemoLandParcel[]
): DemoLandParcel[] {
  return parcels.filter((p) => getValidApproxLocation(p) !== null);
}

/**
 * True when parcel carries authentic cadastral GeoJSON (not invented).
 */
export function hasAuthenticBoundary(parcel: DemoLandParcel): boolean {
  const g = parcel.boundaryGeoJSON;
  if (!g) return false;
  if (g.type !== "Polygon" && g.type !== "MultiPolygon") return false;
  if (!Array.isArray(g.coordinates) || g.coordinates.length === 0) return false;
  return true;
}

/** Stable hash so the same parcel ID always maps to the same shape template. */
export function hashParcelId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Deterministic illustrative polygon offsets around a center [lat, lng].
 * Display-only demo shapes (~100–200 m span). Not survey boundaries.
 * Offsets are [dLng, dLat]; GeoJSON ring uses [lng, lat].
 */
const ILLUSTRATIVE_SHAPE_TEMPLATES: [number, number][][] = [
  [
    [-0.0008, -0.0006],
    [0.0007, -0.0005],
    [0.0009, 0.0006],
    [-0.0006, 0.0007],
    [-0.0008, -0.0006],
  ],
  [
    [-0.0007, -0.0008],
    [0.0008, -0.0004],
    [0.0006, 0.0008],
    [-0.0009, 0.0005],
    [-0.0007, -0.0008],
  ],
  [
    [-0.0009, -0.0005],
    [0.0009, -0.0007],
    [0.0007, 0.0006],
    [-0.0008, 0.0008],
    [-0.0009, -0.0005],
  ],
  [
    [-0.0007, -0.0007],
    [0.0005, -0.0008],
    [0.0009, 0.0002],
    [0.0004, 0.0008],
    [-0.0008, 0.0005],
    [-0.0007, -0.0007],
  ],
  [
    [-0.0011, -0.0004],
    [0.0011, -0.0003],
    [0.0010, 0.0005],
    [-0.0009, 0.0006],
    [-0.0011, -0.0004],
  ],
  [
    [-0.0006, -0.0006],
    [0.0006, -0.0006],
    [0.0006, 0.0006],
    [-0.0006, 0.0006],
    [-0.0006, -0.0006],
  ],
];

/**
 * Builds a closed GeoJSON Polygon ring for a demo parcel from its sample point.
 * Deterministic for a given parcelId + coordinates. Never writes to the database.
 */
export function createIllustrativeDemoPolygon(
  parcelId: string,
  centerLat: number,
  centerLng: number
): {
  type: "Polygon";
  coordinates: [number, number][][];
} {
  const template =
    ILLUSTRATIVE_SHAPE_TEMPLATES[
      hashParcelId(parcelId) % ILLUSTRATIVE_SHAPE_TEMPLATES.length
    ];

  // Tiny deterministic scale jitter (0.92–1.08) so nearby parcels look distinct
  const scale = 0.92 + (hashParcelId(`${parcelId}:scale`) % 17) / 100;

  const ring: [number, number][] = template.map(([dLng, dLat]) => [
    Number((centerLng + dLng * scale).toFixed(6)),
    Number((centerLat + dLat * scale).toFixed(6)),
  ]);

  // Ensure ring is closed
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    ring.push([first[0], first[1]]);
  }

  return { type: "Polygon", coordinates: [ring] };
}

export type DisplayBoundary = {
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
  /** false = authentic supplied GeoJSON; true = generated demo illustration */
  isIllustrative: boolean;
};

/**
 * Returns the boundary to render: authentic `boundaryGeoJSON` unchanged when
 * present; otherwise a deterministic illustrative polygon for demo display.
 */
export function getDisplayBoundaryForParcel(
  parcel: DemoLandParcel
): DisplayBoundary | null {
  if (hasAuthenticBoundary(parcel) && parcel.boundaryGeoJSON) {
    return {
      geometry: {
        type: parcel.boundaryGeoJSON.type,
        coordinates: parcel.boundaryGeoJSON.coordinates,
      },
      isIllustrative: false,
    };
  }

  const loc = getValidApproxLocation(parcel);
  if (!loc) return null;

  return {
    geometry: createIllustrativeDemoPolygon(parcel.id, loc.lat, loc.lng),
    isIllustrative: true,
  };
}

function buildProperties(parcel: DemoLandParcel, lat: number, lng: number): ParcelMapProperties {
  const analysis = analyzeParcelRisk(parcel);
  return {
    parcelId: parcel.id,
    dagNumber: parcel.dagNumber,
    khatianNumber: parcel.khatianNumber,
    mouza: parcel.mouza,
    upazila: parcel.upazila,
    district: parcel.district,
    recordedArea: parcel.recordedArea,
    areaUnit: parcel.areaUnit,
    ownerName: parcel.ownership.ownerName,
    riskOutcome: analysis.outcome,
    riskOutcomeLabelBn: analysis.outcomeLabelBn,
    statusLabelBn: parcel.statusLabelBn,
    warningCount: analysis.warnings.length,
    isSynthetic: true,
    isApproximatePoint: true,
    hasAuthenticBoundary: hasAuthenticBoundary(parcel),
    lat,
    lng,
    illustrativeDisclaimerBn:
      "দৃষ্টান্তমূলক ডেমো সীমানা — সরকারি খতিয়ান/জরিপভিত্তিক দাগ সীমানা নয়।",
  };
}

/**
 * Builds a GeoJSON FeatureCollection of Point features from parcels
 * that have valid approximate coordinates. Does not invent polygons.
 */
export function buildParcelGeoJSON(
  parcels: DemoLandParcel[]
): ParcelPointFeatureCollection {
  const features: ParcelPointFeature[] = [];

  for (const parcel of parcels) {
    const loc = getValidApproxLocation(parcel);
    if (!loc) continue;

    features.push({
      type: "Feature",
      id: parcel.id,
      properties: buildProperties(parcel, loc.lat, loc.lng),
      geometry: {
        type: "Point",
        coordinates: [loc.lng, loc.lat],
      },
    });
  }

  return { type: "FeatureCollection", features };
}

/**
 * Leaflet LatLngBounds corners for parcels with valid points.
 * Returns null when fewer than one valid point exists.
 */
export function getParcelLatLngBounds(
  parcels: DemoLandParcel[]
): { southWest: [number, number]; northEast: [number, number] } | null {
  const pts = getParcelsWithValidLocation(parcels)
    .map((p) => getValidApproxLocation(p)!)
    .filter(Boolean);

  if (pts.length === 0) return null;

  let minLat = pts[0].lat;
  let maxLat = pts[0].lat;
  let minLng = pts[0].lng;
  let maxLng = pts[0].lng;

  for (const p of pts) {
    minLat = Math.min(minLat, p.lat);
    maxLat = Math.max(maxLat, p.lat);
    minLng = Math.min(minLng, p.lng);
    maxLng = Math.max(maxLng, p.lng);
  }

  // Pad single-point bounds slightly so fitBounds has room
  if (pts.length === 1) {
    const pad = 0.02;
    return {
      southWest: [minLat - pad, minLng - pad],
      northEast: [maxLat + pad, maxLng + pad],
    };
  }

  return {
    southWest: [minLat, minLng],
    northEast: [maxLat, maxLng],
  };
}

export function getOutcomeMapStyle(
  outcome: RiskAnalysisOutcome,
  isSelected = false,
  isIllustrative = false
) {
  // Illustrative demo boundaries always use a dashed outline so they are
  // visually distinct from solid authentic cadastral geometry.
  const dashArray = isIllustrative
    ? isSelected
      ? "5 3"
      : "6 4"
    : isSelected
      ? "4 4"
      : undefined;

  switch (outcome) {
    case "NO_FLAGGED_DISCREPANCIES":
      return {
        fillColor: "#10b981",
        color: isSelected ? "#064e3b" : "#047857",
        weight: isSelected ? 3.5 : 2,
        fillOpacity: isIllustrative
          ? isSelected
            ? 0.45
            : 0.28
          : isSelected
            ? 0.65
            : 0.4,
        dashArray,
      };
    case "NEEDS_REVIEW":
      return {
        fillColor: "#f43f5e",
        color: isSelected ? "#881337" : "#be123c",
        weight: isSelected ? 3.5 : 2,
        fillOpacity: isIllustrative
          ? isSelected
            ? 0.45
            : 0.28
          : isSelected
            ? 0.65
            : 0.4,
        dashArray,
      };
    case "INSUFFICIENT_INFO":
    default:
      return {
        fillColor: "#f59e0b",
        color: isSelected ? "#78350f" : "#b45309",
        weight: isSelected ? 3.5 : 2,
        fillOpacity: isIllustrative
          ? isSelected
            ? 0.45
            : 0.28
          : isSelected
            ? 0.65
            : 0.4,
        dashArray,
      };
  }
}
