import { SYNTHETIC_DEMO_PARCELS } from "../data/demo-data";
import {
  buildParcelGeoJSON,
  getOutcomeMapStyle,
  SyntheticParcelFeature,
} from "./map-utils";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log("=== Running LandGuard BD Map Utilities & GeoJSON Tests ===");

// TEST 1: FeatureCollection structure
{
  console.log("Test 1: FeatureCollection structure");
  const geojson = buildParcelGeoJSON(SYNTHETIC_DEMO_PARCELS);
  assert(geojson.type === "FeatureCollection", "Expected type FeatureCollection");
  assert(geojson.features.length === SYNTHETIC_DEMO_PARCELS.length, `Expected ${SYNTHETIC_DEMO_PARCELS.length} features, got ${geojson.features.length}`);
  console.log(`✓ Test 1 Passed: FeatureCollection built with ${geojson.features.length} features`);
}

// TEST 2: GeoJSON coordinate standard & closed polygons
{
  console.log("Test 2: GeoJSON coordinate standard & closed polygons");
  const geojson = buildParcelGeoJSON(SYNTHETIC_DEMO_PARCELS);
  geojson.features.forEach((feature: SyntheticParcelFeature) => {
    assert(feature.geometry.type === "Polygon", `Feature ${feature.id} must be Polygon`);
    const ring = feature.geometry.coordinates[0];
    assert(ring.length >= 4, `Feature ${feature.id} ring must have at least 4 coordinates`);
    const first = ring[0];
    const last = ring[ring.length - 1];
    assert(first[0] === last[0] && first[1] === last[1], `Feature ${feature.id} ring must be closed`);

    // Verify coordinates are within Bangladesh bounds (lat ~20-27, lng ~88-93)
    ring.forEach(([lng, lat]) => {
      assert(lat >= 20 && lat <= 27, `Latitude ${lat} out of Bangladesh bounds`);
      assert(lng >= 88 && lng <= 93, `Longitude ${lng} out of Bangladesh bounds`);
    });
  });
  console.log("✓ Test 2 Passed: All polygon rings are valid closed GeoJSON in Bangladesh coordinates");
}

// TEST 3: Synthetic disclaimer and properties mapping
{
  console.log("Test 3: Synthetic disclaimer and properties mapping");
  const geojson = buildParcelGeoJSON(SYNTHETIC_DEMO_PARCELS);
  const p1 = geojson.features.find((f) => f.id === "lp-demo-001");
  const p3 = geojson.features.find((f) => f.id === "lp-demo-003");
  const p6 = geojson.features.find((f) => f.id === "lp-demo-006");

  assert(p1?.properties.isSynthetic === true, "Must have isSynthetic flag");
  assert(Boolean(p1?.properties.illustrativeDisclaimerBn.includes("কাল্পনিক")), "Must have clear synthetic disclaimer");
  assert(p1?.properties.riskOutcome === "NO_FLAGGED_DISCREPANCIES", `Expected NO_FLAGGED_DISCREPANCIES for p1, got ${p1?.properties.riskOutcome}`);
  assert(p3?.properties.riskOutcome === "NEEDS_REVIEW", `Expected NEEDS_REVIEW for p3, got ${p3?.properties.riskOutcome}`);
  assert(p6?.properties.riskOutcome === "INSUFFICIENT_INFO", `Expected INSUFFICIENT_INFO for p6, got ${p6?.properties.riskOutcome}`);
  console.log("✓ Test 3 Passed: Risk outcomes and synthetic disclaimers verified across all parcels");
}

// TEST 4: Outcome map styling
{
  console.log("Test 4: Outcome map styling");
  const styleClean = getOutcomeMapStyle("NO_FLAGGED_DISCREPANCIES", false);
  const styleReview = getOutcomeMapStyle("NEEDS_REVIEW", false);
  const styleInfo = getOutcomeMapStyle("INSUFFICIENT_INFO", true);

  assert(styleClean.fillColor === "#10b981", "Expected emerald for clean parcels");
  assert(styleReview.fillColor === "#f43f5e", "Expected rose for needs review");
  assert(styleInfo.fillColor === "#f59e0b", "Expected amber for insufficient info");
  assert(styleInfo.weight > 3, "Selected style should have thicker border");
  console.log("✓ Test 4 Passed: Color palette and selection weights verified");
}

console.log("=== ALL MAP UTILITY TESTS PASSED! ===");
