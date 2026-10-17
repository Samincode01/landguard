/**
 * Repeatable, Idempotent Seed Script for LandGuard BD
 * Populates 15 illustrative synthetic land parcels in PostgreSQL via Prisma.
 *
 * Guarantees:
 * - 100% idempotent: running repeatedly does not create duplicate parcels.
 * - Uses stable unique IDs (lp-demo-001 through lp-demo-015).
 * - Clearly synthetic illustrative records (not genuine people or official records).
 */

import { prisma } from "../src/lib/prisma";
import { SYNTHETIC_DEMO_PARCELS } from "../src/data/demo-data";

export async function seedParcels() {
  console.log(`[Seed] Seeding ${SYNTHETIC_DEMO_PARCELS.length} illustrative land parcels...`);

  for (const parcel of SYNTHETIC_DEMO_PARCELS) {
    // Pack rich timeline, litigation, encumbrance, and riskFlags into JSON metadata
    const metadataPayload = JSON.stringify({
      historyEvents: parcel.historyEvents || [],
      litigationStatus: parcel.litigationStatus || { hasActiveCase: false },
      encumbranceStatus: parcel.encumbranceStatus || { isEncumbered: false },
      riskFlags: parcel.riskFlags || [],
    });

    // 1. Upsert LandParcel record
    await prisma.landParcel.upsert({
      where: { id: parcel.id },
      update: {
        district: parcel.district,
        districtEn: parcel.districtEn,
        upazila: parcel.upazila,
        upazilaEn: parcel.upazilaEn,
        mouza: parcel.mouza,
        mouzaEn: parcel.mouzaEn,
        jlNumber: parcel.jlNumber,
        khatianNumber: parcel.khatianNumber,
        dagNumber: parcel.dagNumber,
        khatianType: parcel.khatianType,
        recordedArea: parcel.recordedArea,
        areaUnit: parcel.areaUnit,
        areaUnitEn: parcel.areaUnitEn,
        riskLevel: parcel.riskLevel,
        riskScore: parcel.riskScore,
        status: parcel.status,
        statusLabelBn: parcel.statusLabelBn,
        statusLabelEn: parcel.statusLabelEn,
        notesBn: parcel.notesBn,
        notesEn: parcel.notesEn,
        latitude: parcel.approxLocation?.lat || null,
        longitude: parcel.approxLocation?.lng || null,
        metadata: metadataPayload,
      },
      create: {
        id: parcel.id,
        district: parcel.district,
        districtEn: parcel.districtEn,
        upazila: parcel.upazila,
        upazilaEn: parcel.upazilaEn,
        mouza: parcel.mouza,
        mouzaEn: parcel.mouzaEn,
        jlNumber: parcel.jlNumber,
        khatianNumber: parcel.khatianNumber,
        dagNumber: parcel.dagNumber,
        khatianType: parcel.khatianType,
        recordedArea: parcel.recordedArea,
        areaUnit: parcel.areaUnit,
        areaUnitEn: parcel.areaUnitEn,
        riskLevel: parcel.riskLevel,
        riskScore: parcel.riskScore,
        status: parcel.status,
        statusLabelBn: parcel.statusLabelBn,
        statusLabelEn: parcel.statusLabelEn,
        notesBn: parcel.notesBn,
        notesEn: parcel.notesEn,
        latitude: parcel.approxLocation?.lat || null,
        longitude: parcel.approxLocation?.lng || null,
        metadata: metadataPayload,
      },
    });

    // 2. Upsert associated OwnershipRecord
    if (parcel.ownership) {
      await prisma.ownershipRecord.upsert({
        where: { id: parcel.ownership.id },
        update: {
          ownerName: parcel.ownership.ownerName,
          ownerNameEn: parcel.ownership.ownerNameEn,
          landParcelId: parcel.id,
          deedNumber: parcel.ownership.deedNumber || null,
          recordedArea: parcel.ownership.recordedArea || parcel.recordedArea,
          areaUnit: parcel.ownership.areaUnit || parcel.areaUnit,
          status: parcel.ownership.status || "ACTIVE",
          statusLabelBn: parcel.ownership.statusLabelBn || null,
        },
        create: {
          id: parcel.ownership.id,
          ownerName: parcel.ownership.ownerName,
          ownerNameEn: parcel.ownership.ownerNameEn,
          landParcelId: parcel.id,
          deedNumber: parcel.ownership.deedNumber || null,
          recordedArea: parcel.ownership.recordedArea || parcel.recordedArea,
          areaUnit: parcel.ownership.areaUnit || parcel.areaUnit,
          status: parcel.ownership.status || "ACTIVE",
          statusLabelBn: parcel.ownership.statusLabelBn || null,
        },
      });
    }
  }

  const count = await prisma.landParcel.count();
  console.log(`[Seed] Success! Total database LandParcel records: ${count}`);
}

// Allow direct CLI execution
if (require.main === module || process.argv[1]?.includes("seed.ts")) {
  seedParcels()
    .then(async () => {
      await prisma.$disconnect();
      process.exit(0);
    })
    .catch(async (e) => {
      console.error("[Seed Error]:", e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
