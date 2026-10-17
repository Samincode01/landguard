"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useDashboard } from "@/context/DashboardContext";
import {
  LayoutDashboard,
  FileCheck2,
  History,
  Compass,
  LogOut,
  ChevronLeft,
  ShieldCheck,
  X,
} from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { language, t } = useLanguage();
  const { user, logout } = useAuth();
  const {
    isSidebarCollapsed,
    toggleSidebarCollapsed,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    openVerificationModal,
  } = useDashboard();

  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname, setIsMobileSidebarOpen]);

  // Focus close button on mobile drawer open and handle Escape key to close
  useEffect(() => {
    if (!isMobileSidebarOpen) return;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileSidebarOpen, setIsMobileSidebarOpen]);

  const navItems = [
    {
      href: "/dashboard",
      label: t.sidebar.overview,
      icon: LayoutDashboard,
      isActive: pathname === "/dashboard",
      type: "link" as const,
    },
    {
      action: "verify",
      label: t.sidebar.verifyDocument,
      icon: FileCheck2,
      isActive: false,
      type: "button" as const,
      highlight: true,
    },
    {
      href: "/dashboard/history",
      label: t.sidebar.myHistory,
      icon: History,
      isActive: pathname?.startsWith("/dashboard/history"),
      type: "link" as const,
    },
    {
      href: "/dashboard/explore",
      label: t.sidebar.exploreRecords,
      icon: Compass,
      isActive: pathname?.startsWith("/dashboard/explore"),
      type: "link" as const,
    },
  ];

  const handleLogout = async () => {
    setIsMobileSidebarOpen(false);
    await logout();
  };

  // Content for the sidebar inside desktop or mobile container
  const renderSidebarContent = (isMobile: boolean) => {
    const collapsed = !isMobile && isSidebarCollapsed;

    return (
      <div className="flex h-full flex-col overflow-hidden text-slate-700 select-none">
        {/* ── 1. BRAND / HEADER SECTION ── */}
        <div
          className={`flex h-16 shrink-0 items-center border-b border-slate-200/80 px-3.5 sm:px-4 ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {isMobile ? (
            /* Mobile drawer header */
            <>
              <Link
                href="/dashboard"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="flex items-center gap-2.5 focus:outline-none"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-900 text-white shadow-xs">
                  <ShieldCheck className="h-5 w-5 text-emerald-300" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-slate-900 tracking-tight leading-none">
                    {language === "bn" ? "ল্যান্ডগার্ড বিডি" : "LandGuard BD"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium mt-1 leading-none">
                    {t.sidebar.workspace}
                  </span>
                </div>
              </Link>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-emerald-700"
                aria-label={t.sidebar.close}
              >
                <X className="h-5 w-5" />
              </button>
            </>
          ) : collapsed ? (
            /* Desktop collapsed header (compact toggle icon) */
            <button
              type="button"
              onClick={toggleSidebarCollapsed}
              title={t.sidebar.expand}
              aria-label={t.sidebar.expand}
              className="group flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-900 text-white shadow-xs hover:bg-emerald-800 transition focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <ShieldCheck className="h-5 w-5 text-emerald-300 transition-transform group-hover:scale-105" />
            </button>
          ) : (
            /* Desktop expanded header */
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 group focus:outline-none"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-900 text-white shadow-xs group-hover:bg-emerald-800 transition">
                  <ShieldCheck className="h-5 w-5 text-emerald-300" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 tracking-tight leading-none group-hover:text-emerald-900 transition">
                    {language === "bn" ? (
                      <>
                        ল্যান্ডগার্ড <span className="text-emerald-800">বিডি</span>
                      </>
                    ) : (
                      <>
                        LandGuard <span className="text-emerald-800">BD</span>
                      </>
                    )}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium mt-1 leading-none">
                    {language === "bn" ? "নাগরিক ওয়ার্কস্পেস" : "Citizen Workspace"}
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={toggleSidebarCollapsed}
                title={t.sidebar.collapse}
                aria-label={t.sidebar.collapse}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* ── 2. NAVIGATION GROUP (Scrollable if needed, consistent item spacing) ── */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1">
          {!collapsed && (
            <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {language === "bn" ? "মেনু ও নেভিগেশন" : "Workspace Menu"}
            </div>
          )}

          <nav className="space-y-1" aria-label="Sidebar Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;

              if (item.type === "button") {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => openVerificationModal()}
                    title={collapsed ? item.label : undefined}
                    aria-label={item.label}
                    className={`group relative flex items-center rounded-xl font-medium text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer ${
                      item.highlight
                        ? "bg-emerald-900 text-white shadow-xs hover:bg-emerald-800"
                        : "text-slate-700 hover:bg-slate-100"
                    } ${
                      collapsed
                        ? "h-11 w-11 mx-auto justify-center p-0"
                        : "w-full gap-3 px-3 py-2.5"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 shrink-0 ${
                        item.highlight
                          ? "text-emerald-300"
                          : "text-slate-500 group-hover:text-slate-800"
                      }`}
                    />
                    {!collapsed && (
                      <span className="truncate text-left font-semibold">
                        {item.label}
                      </span>
                    )}
                    {item.highlight && !collapsed && (
                      <span className="ml-auto flex h-2 w-2 rounded-full bg-emerald-400" />
                    )}
                  </button>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  aria-label={item.label}
                  className={`group relative flex items-center rounded-xl font-medium text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-700 ${
                    item.isActive
                      ? "bg-emerald-50 text-emerald-950 font-bold border border-emerald-200/90 shadow-2xs"
                      : "text-slate-700 hover:bg-slate-100/90 hover:text-slate-900"
                  } ${
                    collapsed
                      ? "h-11 w-11 mx-auto justify-center p-0"
                      : "w-full gap-3 px-3 py-2.5"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 transition-colors ${
                      item.isActive
                        ? "text-emerald-800"
                        : "text-slate-500 group-hover:text-slate-800"
                    }`}
                  />
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                  {item.isActive && !collapsed && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-700" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ── 3. ACCOUNT / LOGOUT SECTION (Anchored at the bottom via mt-auto) ── */}
        <div className="shrink-0 mt-auto border-t border-slate-200/90 bg-slate-50/70 p-3 space-y-2">
          {/* User profile card */}
          {user && (
            <div
              className={`rounded-xl bg-white border border-slate-200/90 shadow-2xs ${
                collapsed
                  ? "flex h-11 w-11 mx-auto items-center justify-center p-0"
                  : "flex items-center gap-2.5 p-2"
              }`}
              title={`${user.name} (${user.email})`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-800 text-white font-bold text-xs shadow-2xs">
                {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
              </div>
              {!collapsed && (
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-900 truncate leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate leading-tight">
                    {user.email}
                  </span>
                  {user.occupation && (
                    <span className="text-[9px] text-emerald-800 font-semibold truncate leading-tight mt-0.5">
                      {user.occupation}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Logout Action Button */}
          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? t.sidebar.logout : undefined}
            aria-label={t.sidebar.logout}
            className={`group flex items-center rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 hover:text-rose-800 transition focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer ${
              collapsed
                ? "h-10 w-10 mx-auto justify-center p-0"
                : "w-full gap-2.5 px-3 py-2"
            }`}
          >
            <LogOut className="h-4 w-4 shrink-0 text-rose-600 transition group-hover:translate-x-0.5" />
            {!collapsed && <span>{t.sidebar.logout}</span>}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ── DESKTOP SIDEBAR (Visible lg and up, fills reliable 100dvh) ── */}
      <aside
        className={`hidden lg:flex flex-col h-[100dvh] max-h-[100dvh] border-r border-slate-200/90 bg-white transition-[width] duration-200 ease-in-out shrink-0 sticky top-0 z-20 overflow-hidden ${
          isSidebarCollapsed ? "w-20" : "w-64"
        }`}
        aria-label="Desktop Navigation Sidebar"
      >
        {renderSidebarContent(false)}
      </aside>

      {/* ── MOBILE DRAWER OVERLAY & PANEL ── */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label={t.sidebar.menu}
        >
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer content panel */}
          <div
            ref={drawerRef}
            className="relative flex w-full max-w-xs h-full flex-col bg-white shadow-2xl z-10 animate-in slide-in-from-left duration-200"
          >
            {renderSidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
}
