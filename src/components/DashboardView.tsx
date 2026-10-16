"use client";

import React, { useState } from "react";
import { DemoLandParcel, DashboardSummary } from "@/data/demo-data";
import Header from "./Header";
import DisclaimerBanner from "./DisclaimerBanner";
import SummaryCards from "./SummaryCards";
import VerificationCTA from "./VerificationCTA";
import ParcelMap from "./ParcelMap";
import ParcelTable from "./ParcelTable";
import AboutSection from "./AboutSection";
import VerificationModal from "./VerificationModal";
import Footer from "./Footer";

interface DashboardViewProps {
  parcels: DemoLandParcel[];
  summary: DashboardSummary;
}

export default function DashboardView({ parcels, summary }: DashboardViewProps) {
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [selectedParcelForVerification, setSelectedParcelForVerification] = useState<string | null>(null);
  const [highlightedParcelId, setHighlightedParcelId] = useState<string | null>(null);

  const handleOpenVerification = (parcelId?: string) => {
    setSelectedParcelForVerification(parcelId || null);
    setIsVerificationModalOpen(true);
  };

  const handleScrollToTable = (parcelId: string) => {
    setHighlightedParcelId(parcelId);
    const el = document.getElementById(`parcel-row-${parcelId}`) || document.getElementById("records-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleViewOnMap = (parcel: DemoLandParcel) => {
    setHighlightedParcelId(parcel.id);
    const el = document.getElementById("map-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Dashboard Screen Content (Isolated and hidden in print mode) */}
      <div id="dashboard-view-content" className="no-print dashboard-screen-content flex flex-col flex-1 w-full">
        {/* Navigation Header */}
        <Header onOpenVerificationModal={() => handleOpenVerification()} />

        {/* Main Content Area */}
        <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
          {/* Compact Civic Tech Disclaimer Banner */}
          <DisclaimerBanner />

          {/* Primary Hero & Verification Action */}
          <VerificationCTA onOpenVerificationModal={() => handleOpenVerification()} />

          {/* Compact Summary of Demo Records & Risk Indicators */}
          <SummaryCards stats={summary} />

          {/* Interactive Synthetic Parcel Map & Geographic Visualizer */}
          <ParcelMap
            parcels={parcels}
            selectedParcelId={highlightedParcelId}
            onSelectParcel={(parcel) => setHighlightedParcelId(parcel.id)}
            onOpenVerification={(parcelId) => handleOpenVerification(parcelId)}
            onScrollToTable={handleScrollToTable}
          />

          {/* Cadastral Records & Risk Table */}
          <ParcelTable
            parcels={parcels}
            selectedParcelId={highlightedParcelId}
            onSelectParcel={(parcel) => handleOpenVerification(parcel.id)}
            onViewOnMap={handleViewOnMap}
          />

          {/* Educational Land Risk Pitfalls & Synthetic Data Notice */}
          <AboutSection />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Verification Functional Modal */}
      {isVerificationModalOpen && (
        <VerificationModal
          key={selectedParcelForVerification || "default"}
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          parcels={parcels}
          initialParcelId={selectedParcelForVerification}
        />
      )}
    </div>
  );
}
