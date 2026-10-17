import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import VerificationHistoryView from "@/components/VerificationHistoryView";

export const instant = false;

export const metadata: Metadata = {
  title: "যাচাইকরণ ইতিহাস — ল্যান্ডগার্ড বিডি (LandGuard BD)",
  description:
    "আপনার অ্যাকাউন্টে সংরক্ষিত পূর্ববর্তী দলিল প্রাক-যাচাই ও ক্যাডাস্ট্রাল তুলনার ফলাফলসমূহ।",
};

export default async function VerificationHistoryPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    redirect("/login");
  }

  const payload = await verifySessionToken(sessionCookie.value);
  if (!payload || !payload.userId) {
    redirect("/login");
  }

  return <VerificationHistoryView />;
}
