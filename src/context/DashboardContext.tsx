"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { DemoLandParcel, SYNTHETIC_DEMO_PARCELS } from "@/data/demo-data";

interface DashboardContextType {
  // Verification Modal State
  isVerificationModalOpen: boolean;
  openVerificationModal: (parcelId?: string) => void;
  closeVerificationModal: () => void;
  selectedParcelForVerification: string | null;

  // Sidebar States
  isSidebarCollapsed: boolean;
  toggleSidebarCollapsed: () => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;

  // Reference parcels
  referenceParcels: DemoLandParcel[];
}

const DashboardContext = createContext<DashboardContextType | null>(null);

interface DashboardProviderProps {
  children: React.ReactNode;
  initialParcels?: DemoLandParcel[];
}

export function DashboardProvider({
  children,
  initialParcels = SYNTHETIC_DEMO_PARCELS,
}: DashboardProviderProps) {
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [selectedParcelForVerification, setSelectedParcelForVerification] = useState<string | null>(null);

  // Desktop sidebar collapse (persisted in localStorage if available)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("landguard_sidebar_collapsed") === "true";
      } catch {
        return false;
      }
    }
    return false;
  });

  // Mobile drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebarCollapsed = useCallback(() => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("landguard_sidebar_collapsed", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen((prev) => !prev);
  }, []);

  const openVerificationModal = useCallback((parcelId?: string) => {
    setSelectedParcelForVerification(parcelId || null);
    setIsVerificationModalOpen(true);
    // Auto-close mobile sidebar if open
    setIsMobileSidebarOpen(false);
  }, []);

  const closeVerificationModal = useCallback(() => {
    setIsVerificationModalOpen(false);
    setSelectedParcelForVerification(null);
  }, []);

  // Close mobile sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        isVerificationModalOpen,
        openVerificationModal,
        closeVerificationModal,
        selectedParcelForVerification,
        isSidebarCollapsed,
        toggleSidebarCollapsed,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        toggleMobileSidebar,
        referenceParcels: initialParcels,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
