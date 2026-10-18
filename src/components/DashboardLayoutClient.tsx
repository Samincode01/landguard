"use client";

import React from "react";
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
    isChatOpen,
    openChat,
    closeChat,
  } = useDashboard();

  return (
    <div className="flex h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-[#f4f7f5] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 print:h-auto print:max-h-none print:overflow-visible print:bg-white print:block">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden print:h-auto print:overflow-visible print:block">
        <DashboardNavbar onOpenChat={openChat} />

        <main className="flex-1 min-w-0 h-full overflow-y-auto overflow-x-hidden print:h-auto print:overflow-visible print:p-0 print:m-0 print:block">
          {children}
        </main>
      </div>

      <ChatSupportWidget
        isOpen={isChatOpen}
        onOpen={openChat}
        onClose={closeChat}
      />

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
