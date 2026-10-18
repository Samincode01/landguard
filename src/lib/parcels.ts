/**
 * Database Parcel Service
 * LandGuard BD — Civic Tech for Land Due Diligence
 *
 * Provides server-side retrieval of illustrative land parcels from PostgreSQL via Prisma.
 * Supports safe search, risk filtering, and pagination.
 */

import { prisma } from "@/lib/prisma";
import {
  DemoLandParcel,
  ParcelRiskLevel,
  ParcelStatus,
  SYNTHETIC_DEMO_PARCELS,
} from "@/data/demo-data";

export interface ParcelQueryResult {
  parcels: DemoLandParcel[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
  summary: {
    totalParcels: number;
    lowRiskCount: number;
    mediumRiskCount: number;
    highRiskCount: number;
    totalRiskFlags: number;
  };
}

/**
 * Transforms a Prisma LandParcel record into a full DemoLandParcel domain object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapPrismaToDemoParcel(record: any): DemoLandParcel {
  let parsedMetadata: {
    historyEvents?: DemoLandParcel["historyEvents"];
    litigationStatus?: DemoLandParcel["litigationStatus"];
    encumbranceStatus?: DemoLandParcel["encumbranceStatus"];
    riskFlags?: DemoLandParcel["riskFlags"];
  } = {};

  if (record.metadata) {
    try {
      parsedMetadata = JSON.parse(record.metadata);
    } catch {
      parsedMetadata = {};
    }
  }

  const primaryOwnership = record.ownershipRecords?.[0];

  return {
    id: record.id,
    district: record.district,
    districtEn: record.districtEn || record.district,
    upazila: record.upazila,
    upazilaEn: record.upazilaEn || record.upazila,
    mouza: record.mouza,
    mouzaEn: record.mouzaEn || record.mouza,
    jlNumber: record.jlNumber,
    khatianNumber: record.khatianNumber,
    dagNumber: record.dagNumber,
    khatianType: record.khatianType,
    recordedArea: record.recordedArea,
    areaUnit: record.areaUnit || "শতক",
    areaUnitEn: record.areaUnitEn || "Decimal",
    riskLevel: (record.riskLevel as ParcelRiskLevel) || "LOW",
    riskScore: record.riskScore ?? 10,
    status: (record.status as ParcelStatus) || "ACTIVE",
    statusLabelBn: record.statusLabelBn || "নিয়মিত রেকর্ড",
    statusLabelEn: record.statusLabelEn || "Regular Record",
    ownership: {
      id: primaryOwnership?.id || `own-${record.id}`,
      ownerName: primaryOwnership?.ownerName || "নমুনা স্বত্বাধিকারী (কৃত্রিম ডেমো)",
      ownerNameEn: primaryOwnership?.ownerNameEn || "Sample Owner (Synthetic Demo)",
      deedNumber: primaryOwnership?.deedNumber || undefined,
      recordedArea: primaryOwnership?.recordedArea ?? record.recordedArea,
      areaUnit: primaryOwnership?.areaUnit || record.areaUnit || "শতক",
      status: primaryOwnership?.status || "ACTIVE",
      statusLabelBn: primaryOwnership?.statusLabelBn || "সক্রিয় স্বত্ব",
      isSynthetic: true,
    },
    riskFlags: parsedMetadata.riskFlags || [],
    approxLocation:
      typeof record.latitude === "number" &&
      typeof record.longitude === "number" &&
      Number.isFinite(record.latitude) &&
      Number.isFinite(record.longitude)
        ? { lat: record.latitude, lng: record.longitude }
        : undefined,
    notesBn: record.notesBn || "",
    notesEn: record.notesEn || "",
    historyEvents: parsedMetadata.historyEvents || [],
    litigationStatus: parsedMetadata.litigationStatus || { hasActiveCase: false },
    encumbranceStatus: parsedMetadata.encumbranceStatus || { isEncumbered: false },
  };
}

/**
 * Retrieves parcels from the database with optional search, risk filtering, and pagination.
 * Falls back safely to in-memory records if database is empty or unavailable.
 */
export async function getDatabaseParcels(options?: {
  page?: number;
  limit?: number;
  riskLevel?: string;
  search?: string;
}): Promise<ParcelQueryResult> {
  const page = Math.max(1, Number(options?.page) || 1);
  const limit = Math.max(1, Math.min(50, Number(options?.limit) || 15));
  const skip = (page - 1) * limit;

  const riskFilter =
    options?.riskLevel && ["LOW", "MEDIUM", "HIGH"].includes(options.riskLevel.toUpperCase())
      ? options.riskLevel.toUpperCase()
      : undefined;

  const searchQuery = options?.search?.trim();

  try {
    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (riskFilter) {
      where.riskLevel = riskFilter;
    }

    if (searchQuery) {
      const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
      const bnQuery = searchQuery.replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)]);
      const bnMap: Record<string, string> = {
        "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
        "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
      };
      const enQuery = searchQuery.replace(/[০-৯]/g, (d) => bnMap[d] || d);

      where.OR = [
        { district: { contains: searchQuery, mode: "insensitive" } },
        { districtEn: { contains: searchQuery, mode: "insensitive" } },
        { upazila: { contains: searchQuery, mode: "insensitive" } },
        { upazilaEn: { contains: searchQuery, mode: "insensitive" } },
        { mouza: { contains: searchQuery, mode: "insensitive" } },
        { mouzaEn: { contains: searchQuery, mode: "insensitive" } },
        { dagNumber: { contains: searchQuery } },
        { dagNumber: { contains: bnQuery } },
        { dagNumber: { contains: enQuery } },
        { khatianNumber: { contains: searchQuery } },
        { khatianNumber: { contains: bnQuery } },
        { khatianNumber: { contains: enQuery } },
        { ownershipRecords: { some: { ownerName: { contains: searchQuery, mode: "insensitive" } } } },
        { ownershipRecords: { some: { ownerNameEn: { contains: searchQuery, mode: "insensitive" } } } },
      ];
    }

    const [total, records] = await Promise.all([
      prisma.landParcel.count({ where }),
      prisma.landParcel.findMany({
        where,
        include: { ownershipRecords: true },
        orderBy: [{ id: "asc" }],
        skip,
        take: limit,
      }),
    ]);

    // If database has records, format them
    if (total > 0 && records.length > 0) {
      const parcels = records.map(mapPrismaToDemoParcel);

      // Compute overall risk summary across database
      const [allParcelsCount, lowCount, medCount, highCount] = await Promise.all([
        prisma.landParcel.count(),
        prisma.landParcel.count({ where: { riskLevel: "LOW" } }),
        prisma.landParcel.count({ where: { riskLevel: "MEDIUM" } }),
        prisma.landParcel.count({ where: { riskLevel: "HIGH" } }),
      ]);

      const totalRiskFlags = parcels.reduce((acc, p) => acc + (p.riskFlags?.length || 0), 0);

      return {
        parcels,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + records.length < total,
        },
        summary: {
          totalParcels: allParcelsCount,
          lowRiskCount: lowCount,
          mediumRiskCount: medCount,
          highRiskCount: highCount,
          totalRiskFlags,
        },
      };
    }
  } catch (error) {
    console.warn("[getDatabaseParcels] Database query failed, falling back to static dataset:", error);
  }

  // Graceful fallback to SYNTHETIC_DEMO_PARCELS if DB has not yet been seeded
  let filtered = [...SYNTHETIC_DEMO_PARCELS];
  if (riskFilter) {
    filtered = filtered.filter((p) => p.riskLevel === riskFilter);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.district.toLowerCase().includes(q) ||
        p.districtEn.toLowerCase().includes(q) ||
        p.upazila.toLowerCase().includes(q) ||
        p.upazilaEn.toLowerCase().includes(q) ||
        p.mouza.toLowerCase().includes(q) ||
        p.mouzaEn.toLowerCase().includes(q) ||
        p.dagNumber.includes(q) ||
        p.khatianNumber.includes(q) ||
        p.ownership.ownerName.toLowerCase().includes(q) ||
        p.ownership.ownerNameEn.toLowerCase().includes(q)
    );
  }

  const paginated = filtered.slice(skip, skip + limit);

  return {
    parcels: paginated,
    pagination: {
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
      hasMore: skip + paginated.length < filtered.length,
    },
    summary: {
      totalParcels: SYNTHETIC_DEMO_PARCELS.length,
      lowRiskCount: SYNTHETIC_DEMO_PARCELS.filter((p) => p.riskLevel === "LOW").length,
      mediumRiskCount: SYNTHETIC_DEMO_PARCELS.filter((p) => p.riskLevel === "MEDIUM").length,
      highRiskCount: SYNTHETIC_DEMO_PARCELS.filter((p) => p.riskLevel === "HIGH").length,
      totalRiskFlags: SYNTHETIC_DEMO_PARCELS.reduce((acc, p) => acc + (p.riskFlags?.length || 0), 0),
    },
  };
}
