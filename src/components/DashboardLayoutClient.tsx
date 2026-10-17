"use client";

import React, { useState } from "react";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";
import VerificationModal from "./VerificationModal";
import ChatSupportWidget from "./ChatSupportWidget";
import { useDashboard } from "@/context/DashboardContext";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
}

export default function DashboardLayoutClient({
  children,
}: DashboardLayoutClientProps) {
  const {
    isVerificationModalOpen,
    closeVerificationModal,
    selectedParcelForVerification,
    referenceParcels,
  } = useDashboard();

  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Responsive Sidebar: Full 100dvh on desktop, off-canvas drawer on mobile */}
      <DashboardSidebar />

      {/* Main View Area: Fixed Navbar + Independent Scrollable Content */}
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        {/* Minimal Top Navbar */}
        <DashboardNavbar onOpenChat={() => setIsChatOpen(true)} />

        {/* Route Content (Overview / History / Explore) with single scroll container */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Persistent Floating / Bottom-Sheet Chat Widget (Bhumi Sathi) */}
      <ChatSupportWidget
        isOpen={isChatOpen}
        onOpen={() => setIsChatOpen(true)}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Global Verification Modal (accessible anywhere via Sidebar CTA) */}
      {isVerificationModalOpen && (
        <VerificationModal
          key={selectedParcelForVerification || "default"}
          isOpen={isVerificationModalOpen}
          onClose={closeVerificationModal}
          parcels={referenceParcels}
          initialParcelId={selectedParcelForVerification}
        />
      )}
    </div>
  );
}
