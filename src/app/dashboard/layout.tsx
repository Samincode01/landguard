import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDatabaseParcels } from "@/lib/parcels";
import { DashboardProvider } from "@/context/DashboardContext";
import DashboardLayoutClient from "@/components/DashboardLayoutClient";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    select: { id: true },
  });

  if (!user) {
    redirect("/login");
  }

  // Load reference parcels from the database for the verification modal
  const { parcels } = await getDatabaseParcels({ limit: 15 });

  return (
    <DashboardProvider initialParcels={parcels}>
      <DashboardLayoutClient>{children}</DashboardLayoutClient>
    </DashboardProvider>
  );
}
