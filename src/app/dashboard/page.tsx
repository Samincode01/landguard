import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardView from "@/components/DashboardView";
import { SYNTHETIC_DEMO_PARCELS, DEMO_SUMMARY_STATS } from "@/data/demo-data";

export const instant = false;

export const metadata: Metadata = {
  title: "যাচাই ড্যাশবোর্ড — ল্যান্ডগার্ড বিডি (LandGuard BD)",
  description:
    "কৃত্রিম ডেমো জমির ক্যাডাস্ট্রাল রেকর্ড, মানচিত্র এবং প্রাক-যাচাই ড্যাশবোর্ড।",
};

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

  return (
    <DashboardView
      parcels={SYNTHETIC_DEMO_PARCELS}
      summary={DEMO_SUMMARY_STATS}
    />
  );
}
