import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PersonalDashboardView, {
  PersonalVerificationItem,
} from "@/components/PersonalDashboardView";

export const instant = false;

export const metadata: Metadata = {
  title: "ড্যাশবোর্ড — ল্যান্ডগার্ড বিডি",
  description:
    "জমির দলিল যাচাই করুন, সাম্প্রতিক ফলাফল দেখুন এবং নমুনা ভূমি রেকর্ড ঘুরে দেখুন।",
};

interface StoredHistoryPayload {
  submitted?: {
    parcelId?: string;
    ownerName?: string;
    district?: string;
    upazila?: string;
    mouza?: string;
    khatianNumber?: string;
    khatianType?: string;
    dagNumber?: string;
    recordedArea?: string;
    areaUnit?: string;
  };
  verification?: {
    category?: string;
    categoryLabelBn?: string;
    summaryBn?: string;
    matchCount?: number;
    mismatchCount?: number;
    missingCount?: number;
  };
  extractedOcr?: Record<string, unknown>;
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    redirect("/login");
  }

  const payload = await verifySessionToken(sessionCookie.value);
  if (!payload || !payload.userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      occupation: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Fetch only the signed-in user's completed verification history (Strict user isolation)
  const rawRecords = await prisma.verificationRequest.findMany({
    where: {
      userId: payload.userId,
      status: "COMPLETED",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
    select: {
      id: true,
      createdAt: true,
      status: true,
      riskLevel: true,
      riskScore: true,
      extractedData: true,
    },
  });

  const verifications: PersonalVerificationItem[] = rawRecords.map((rec) => {
    let payloadData: StoredHistoryPayload | null = null;
    try {
      if (rec.extractedData) {
        payloadData = JSON.parse(rec.extractedData) as StoredHistoryPayload;
      }
    } catch {
      payloadData = null;
    }

    const submitted = payloadData?.submitted;
    const verification = payloadData?.verification;
    const ocr = payloadData?.extractedOcr;

    return {
      id: rec.id,
      createdAt: rec.createdAt.toISOString(),
      status: rec.status,
      riskLevel: rec.riskLevel,
      riskScore: rec.riskScore,
      category: verification?.category || (rec.riskLevel === "LOW" ? "NO_DISCREPANCIES" : "DIFFERENCES_REQUIRE_REVIEW"),
      categoryLabelBn: verification?.categoryLabelBn || (rec.riskLevel === "LOW" ? "সঠিক ও মিল রয়েছে" : "অসঙ্গতি রয়েছে"),
      summaryBn: verification?.summaryBn || "যাচাইকরণ ফলাফল সংরক্ষিত রয়েছে।",
      mouza: submitted?.mouza,
      upazila: submitted?.upazila,
      district: submitted?.district,
      dagNumber: submitted?.dagNumber,
      khatianNumber: submitted?.khatianNumber,
      recordedArea: submitted?.recordedArea,
      areaUnit: submitted?.areaUnit || "শতক",
      ownerName: submitted?.ownerName,
      matchCount: Number(verification?.matchCount) || 0,
      mismatchCount: Number(verification?.mismatchCount) || 0,
      missingCount: Number(verification?.missingCount) || 0,
      hasOcr: Boolean(ocr && Object.keys(ocr).length > 0),
    };
  });

  return (
    <PersonalDashboardView
      user={user}
      verifications={verifications}
    />
  );
}
