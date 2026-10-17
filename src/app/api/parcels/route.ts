/**
 * Public Parcels API Endpoint
 * GET /api/parcels
 * LandGuard BD — Civic Tech for Land Due Diligence
 *
 * Retrieves illustrative sample land parcels from PostgreSQL with pagination,
 * risk level filtering, and query searching.
 * Zero user private records exposed.
 */

import { NextRequest, NextResponse } from "next/server";
import { getDatabaseParcels } from "@/lib/parcels";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "15", 10);
    const riskLevel = searchParams.get("riskLevel") || undefined;
    const search = searchParams.get("search") || undefined;

    const result = await getDatabaseParcels({
      page,
      limit,
      riskLevel,
      search,
    });

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error: unknown) {
    console.error("[GET /api/parcels] Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve land records." },
      { status: 500 }
    );
  }
}
