import type { Metadata } from "next";
import { getDatabaseParcels } from "@/lib/parcels";
import ExploreLandRecordsView from "@/components/ExploreLandRecordsView";
import { DashboardSummary } from "@/data/demo-data";

export const instant = false;

export const metadata: Metadata = {
  title: "ভূমি রেকর্ড অনুসন্ধান — ল্যান্ডগার্ড বিডি (LandGuard BD)",
  description:
    "ক্যাডাস্ট্রাল ঝুঁকি মানচিত্র ও ১৫টি নমুনা পার্সেল রেকর্ডের মালিকানা ও খাস বাফার অডিট অন্বেষণ করুন।",
};

export default async function ExplorePage() {
  // Retrieve initial 15 illustrative parcels directly from Neon PostgreSQL via Prisma
  const { parcels, pagination, summary } = await getDatabaseParcels({
    page: 1,
    limit: 15,
  });

  const dashboardSummary: DashboardSummary = {
    totalParcels: summary.totalParcels,
    lowRiskCount: summary.lowRiskCount,
    mediumRiskCount: summary.mediumRiskCount,
    highRiskCount: summary.highRiskCount,
    totalRiskFlags: summary.totalRiskFlags,
    activeVerifications: parcels.length,
  };

  return (
    <ExploreLandRecordsView
      initialParcels={parcels}
      summary={dashboardSummary}
      totalRecords={pagination.total}
    />
  );
}
