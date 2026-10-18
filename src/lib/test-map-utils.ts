import { DemoLandParcel, SYNTHETIC_DEMO_PARCELS } from "../data/demo-data";
import {
  buildParcelGeoJSON,
  createIllustrativeDemoPolygon,
  getDisplayBoundaryForParcel,
  getOutcomeMapStyle,
  getValidApproxLocation,
  getParcelsWithValidLocation,
  getParcelLatLngBounds,
  hasAuthenticBoundary,
  hashParcelId,
  isValidLatLng,
  isWithinBangladeshSoftBounds,
  ParcelPointFeature,
} from "./map-utils";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log("=== Running LandGuard BD Map Utilities Tests ===");

// TEST 1: Point FeatureCollection still built for markers
{
  console.log("Test 1: Point FeatureCollection structure");
  const geojson = buildParcelGeoJSON(SYNTHETIC_DEMO_PARCELS);
  assert(geojson.type === "FeatureCollection", "Expected type FeatureCollection");
  assert(
    geojson.features.length === SYNTHETIC_DEMO_PARCELS.length,
    `Expected ${SYNTHETIC_DEMO_PARCELS.length} features, got ${geojson.features.length}`
  );
  geojson.features.forEach((f) => {
    assert(f.geometry.type === "Point", `Feature ${f.id} must be Point`);
  });
  console.log(`✓ Test 1 Passed: ${geojson.features.length} point features`);
}

// TEST 2: GeoJSON [lng, lat] + Bangladesh soft bounds
{
  console.log("Test 2: Coordinate order & Bangladesh soft bounds");
  const geojson = buildParcelGeoJSON(SYNTHETIC_DEMO_PARCELS);
  geojson.features.forEach((feature: ParcelPointFeature) => {
    const [lng, lat] = feature.geometry.coordinates;
    assert(isValidLatLng(lat, lng), `Invalid lat/lng for ${feature.id}`);
    assert(
      isWithinBangladeshSoftBounds(lat, lng),
      `Point ${feature.id} outside Bangladesh soft bounds: ${lat}, ${lng}`
    );
  });
  console.log("✓ Test 2 Passed: Valid WGS84 points in Bangladesh soft bounds");
}

// TEST 3: Deterministic illustrative polygon generation
{
  console.log("Test 3: Deterministic illustrative demo polygons");
  const parcel = SYNTHETIC_DEMO_PARCELS[0];
  const loc = getValidApproxLocation(parcel)!;
  const a = createIllustrativeDemoPolygon(parcel.id, loc.lat, loc.lng);
  const b = createIllustrativeDemoPolygon(parcel.id, loc.lat, loc.lng);

  assert(a.type === "Polygon", "Must be Polygon");
  assert(a.coordinates.length === 1, "Single outer ring");
  const ring = a.coordinates[0];
  assert(ring.length >= 4, "Ring needs at least 4 positions");
  const first = ring[0];
  const last = ring[ring.length - 1];
  assert(
    first[0] === last[0] && first[1] === last[1],
    "Ring must be closed"
  );
  assert(
    JSON.stringify(a) === JSON.stringify(b),
    "Same parcelId+coords must yield identical polygon"
  );

  // Different parcel IDs at same center should still be deterministic per ID
  const other = createIllustrativeDemoPolygon("lp-demo-002", loc.lat, loc.lng);
  assert(
    JSON.stringify(a) !== JSON.stringify(other) ||
      hashParcelId(parcel.id) % 6 === hashParcelId("lp-demo-002") % 6,
    "Different IDs typically produce different templates (or same template index by chance)"
  );

  ring.forEach(([lng, lat]) => {
    assert(isValidLatLng(lat, lng), `Ring vertex invalid: ${lat}, ${lng}`);
    assert(
      isWithinBangladeshSoftBounds(lat, lng),
      `Ring vertex outside BD soft bounds: ${lat}, ${lng}`
    );
  });

  console.log("✓ Test 3 Passed: Deterministic closed demo polygons in bounds");
}

// TEST 4: Real boundaryGeoJSON takes precedence over generated shapes
{
  console.log("Test 4: Authentic boundary precedence");
  const base = SYNTHETIC_DEMO_PARCELS[0];
  const loc = getValidApproxLocation(base)!;

  const authenticRing: [number, number][] = [
    [loc.lng - 0.001, loc.lat - 0.001],
    [loc.lng + 0.001, loc.lat - 0.001],
    [loc.lng + 0.001, loc.lat + 0.001],
    [loc.lng - 0.001, loc.lat + 0.001],
    [loc.lng - 0.001, loc.lat - 0.001],
  ];

  const withReal: DemoLandParcel = {
    ...base,
    boundaryGeoJSON: {
      type: "Polygon",
      coordinates: [authenticRing],
    },
  };

  assert(hasAuthenticBoundary(withReal) === true, "Must detect authentic boundary");
  assert(hasAuthenticBoundary(base) === false, "Demo parcels have no stored geometry");

  const displayReal = getDisplayBoundaryForParcel(withReal);
  const displayDemo = getDisplayBoundaryForParcel(base);

  assert(displayReal !== null && displayDemo !== null, "Both should have display boundaries");
  assert(displayReal!.isIllustrative === false, "Real geometry must not be marked illustrative");
  assert(displayDemo!.isIllustrative === true, "Generated shape must be illustrative");
  assert(
    JSON.stringify(displayReal!.geometry.coordinates) === JSON.stringify([authenticRing]),
    "Authentic coordinates must be returned unchanged"
  );
  assert(
    JSON.stringify(displayDemo!.geometry) !== JSON.stringify(displayReal!.geometry),
    "Demo illustration must not replace / equal authentic geometry"
  );

  console.log("✓ Test 4 Passed: Real boundaryGeoJSON precedence preserved");
}

// TEST 5: Display boundaries for all demo parcels are illustrative
{
  console.log("Test 5: All demo parcels get illustrative display boundaries");
  SYNTHETIC_DEMO_PARCELS.forEach((p) => {
    const d = getDisplayBoundaryForParcel(p);
    assert(d !== null, `${p.id} should have a display boundary`);
    assert(d!.isIllustrative === true, `${p.id} should be illustrative`);
    assert(d!.geometry.type === "Polygon", `${p.id} demo boundary is Polygon`);
  });
  console.log("✓ Test 5 Passed: Demo parcels use generated illustrations only");
}

// TEST 6: Outcome map styling distinguishes illustrative dashes
{
  console.log("Test 6: Outcome map styling");
  const styleClean = getOutcomeMapStyle("NO_FLAGGED_DISCREPANCIES", false, false);
  const styleIllustrative = getOutcomeMapStyle("NO_FLAGGED_DISCREPANCIES", false, true);
  const styleReview = getOutcomeMapStyle("NEEDS_REVIEW", false, true);
  const styleInfo = getOutcomeMapStyle("INSUFFICIENT_INFO", true, true);

  assert(styleClean.fillColor === "#10b981", "Expected emerald for clean parcels");
  assert(styleClean.dashArray === undefined, "Authentic non-selected should be solid");
  assert(styleIllustrative.dashArray === "6 4", "Illustrative should be dashed");
  assert(styleReview.fillColor === "#f43f5e", "Expected rose for needs review");
  assert(styleInfo.fillColor === "#f59e0b", "Expected amber for insufficient info");
  assert(styleInfo.weight > 3, "Selected style should have thicker border");
  console.log("✓ Test 6 Passed: Color palette and illustrative dash styles verified");
}

// TEST 7: Validation helpers & bounds
{
  console.log("Test 7: Validation helpers");
  assert(isValidLatLng(23.81, 90.41) === true, "Dhaka should be valid");
  assert(isValidLatLng(91, 23) === false, "Swapped lat/lng out of lat range should fail");
  assert(isValidLatLng(NaN, 90) === false, "NaN rejected");
  assert(getValidApproxLocation(SYNTHETIC_DEMO_PARCELS[0]) !== null, "Demo parcel has location");
  assert(
    getParcelsWithValidLocation(SYNTHETIC_DEMO_PARCELS).length === SYNTHETIC_DEMO_PARCELS.length,
    "All demo parcels mappable"
  );
  const bounds = getParcelLatLngBounds(SYNTHETIC_DEMO_PARCELS);
  assert(bounds !== null, "Bounds should exist");
  assert(hashParcelId("lp-demo-001") === hashParcelId("lp-demo-001"), "Hash is stable");
  console.log("✓ Test 7 Passed: Validation and bounds helpers");
}

console.log("=== ALL MAP UTILITY TESTS PASSED! ===");
