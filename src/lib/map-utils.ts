/**
 * Map Utilities & Illustrative GeoJSON Generator for LandGuard BD
 * Track P5 — Check Before You Buy (LandTech Innovation Hackathon 2026)
 *
 * Provides illustrative synthetic polygon geometries and GeoJSON features
 * for demo parcels. Explicitly labeled as synthetic demonstration shapes,
 * not real government cadastral maps or DLRS survey boundaries.
 */

import { DemoLandParcel } from "@/data/demo-data";
import { analyzeParcelRisk, RiskAnalysisOutcome } from "./risk-analysis";

export interface SyntheticParcelProperties {
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
  illustrativeDisclaimerBn: string;
}

export interface SyntheticParcelFeature {
  type: "Feature";
  id: string;
  properties: SyntheticParcelProperties;
  geometry: {
    type: "Polygon";
    coordinates: [number, number][][]; // GeoJSON standard: [lng, lat]
  };
}

export interface SyntheticParcelFeatureCollection {
  type: "FeatureCollection";
  features: SyntheticParcelFeature[];
}

/**
 * Deterministic illustrative polygon offsets around a center [lat, lng].
 * Creates illustrative cadastre-like quadrilateral/pentagonal shapes.
 * Size roughly corresponds to ~100m - ~200m span.
 */
function createIllustrativePolygon(
  centerLat: number,
  centerLng: number,
  index: number
): [number, number][][] {
  // Variations based on index to make adjacent demo parcels look natural and distinct
  const offsets: [number, number][][] = [
    // Shape 0: slightly irregular rectangle
    [
      [-0.0008, -0.0006],
      [0.0007, -0.0005],
      [0.0009, 0.0006],
      [-0.0006, 0.0007],
      [-0.0008, -0.0006], // Closed ring
    ],
    // Shape 1: angled polygon
    [
      [-0.0007, -0.0008],
      [0.0008, -0.0004],
      [0.0006, 0.0008],
      [-0.0009, 0.0005],
      [-0.0007, -0.0008],
    ],
    // Shape 2: trapezoid
    [
      [-0.0009, -0.0005],
      [0.0009, -0.0007],
      [0.0007, 0.0006],
      [-0.0008, 0.0008],
      [-0.0009, -0.0005],
    ],
    // Shape 3: 5-sided parcel
    [
      [-0.0007, -0.0007],
      [0.0005, -0.0008],
      [0.0009, 0.0002],
      [0.0004, 0.0008],
      [-0.0008, 0.0005],
      [-0.0007, -0.0007],
    ],
    // Shape 4: canal/buffer adjacent oblong
    [
      [-0.0011, -0.0004],
      [0.0011, -0.0003],
      [0.0010, 0.0005],
      [-0.0009, 0.0006],
      [-0.0011, -0.0004],
    ],
    // Shape 5: compact quad
    [
      [-0.0006, -0.0006],
      [0.0006, -0.0006],
      [0.0006, 0.0006],
      [-0.0006, 0.0006],
      [-0.0006, -0.0006],
    ],
  ];

  const template = offsets[index % offsets.length];
  // In GeoJSON standard: coordinates are [longitude, latitude]
  const ring: [number, number][] = template.map(([dLng, dLat]) => [
    Number((centerLng + dLng).toFixed(6)),
    Number((centerLat + dLat).toFixed(6)),
  ]);

  return [ring];
}

/**
 * Builds a GeoJSON FeatureCollection from synthetic parcels with illustrative polygon boundaries.
 */
export function buildParcelGeoJSON(parcels: DemoLandParcel[]): SyntheticParcelFeatureCollection {
  const features: SyntheticParcelFeature[] = [];

  parcels.forEach((parcel, idx) => {
    if (!parcel.approxLocation) return;

    const analysis = analyzeParcelRisk(parcel);
    const coordinates = createIllustrativePolygon(
      parcel.approxLocation.lat,
      parcel.approxLocation.lng,
      idx
    );

    features.push({
      type: "Feature",
      id: parcel.id,
      properties: {
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
        illustrativeDisclaimerBn:
          "এটি কাল্পনিক প্রদর্শনী সীমানা — কোনো সরকারি মৌজা নকশা বা জরিপভিত্তিক সীমানা নয়।",
      },
      geometry: {
        type: "Polygon",
        coordinates,
      },
    });
  });

  return {
    type: "FeatureCollection",
    features,
  };
}

/**
 * Default map view bounding box for Bangladesh parcels
 */
export const BANGLADESH_CENTER: [number, number] = [23.8103, 90.4125]; // Dhaka center [lat, lng]
export const BANGLADESH_DEFAULT_ZOOM = 7;

/**
 * Gets styling configuration for a risk outcome
 */
export function getOutcomeMapStyle(outcome: RiskAnalysisOutcome, isSelected = false) {
  switch (outcome) {
    case "NO_FLAGGED_DISCREPANCIES":
      return {
        fillColor: "#10b981", // Emerald 500
        color: isSelected ? "#064e3b" : "#047857", // Emerald 900 / 700
        weight: isSelected ? 3.5 : 2,
        fillOpacity: isSelected ? 0.65 : 0.4,
        dashArray: isSelected ? "4 4" : undefined,
      };
    case "NEEDS_REVIEW":
      return {
        fillColor: "#f43f5e", // Rose 500
        color: isSelected ? "#881337" : "#be123c", // Rose 900 / 700
        weight: isSelected ? 3.5 : 2,
        fillOpacity: isSelected ? 0.65 : 0.4,
        dashArray: isSelected ? "4 4" : undefined,
      };
    case "INSUFFICIENT_INFO":
    default:
      return {
        fillColor: "#f59e0b", // Amber 500
        color: isSelected ? "#78350f" : "#b45309", // Amber 900 / 700
        weight: isSelected ? 3.5 : 2,
        fillOpacity: isSelected ? 0.65 : 0.4,
        dashArray: isSelected ? "4 4" : undefined,
      };
  }
}
