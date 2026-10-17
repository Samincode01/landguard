"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import {
  LogIn,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Plus,
  History,
} from "lucide-react";

interface HeaderProps {
  onOpenVerificationModal?: () => void;
  onOpenChat?: () => void;
  isLandingPage?: boolean;
}

export default function Header({
  onOpenVerificationModal,
  onOpenChat,
  isLandingPage,
}: HeaderProps) {
  const { t, language } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Determine active route state
  const isDashboardActive = pathname === "/dashboard";
  const isHistoryActive =
    pathname?.startsWith("/dashboard/history") || pathname?.startsWith("/history");

  // Close profile dropdown on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    await logout();
    setIsLoggingOut(false);
  };

  // Helper for initials
  const getUserInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-2xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 gap-3">
        {/* ── ZONE 1: BRAND AREA (Compact, Non-crowding) ── */}
        <Link
          href={isAuthenticated ? "/dashboard" : "/"}
          className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none shrink-0"
          aria-label="LandGuard BD"
        >
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-900 text-white shadow-2xs group-hover:bg-emerald-800 transition">
            <ShieldCheck className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-emerald-300" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-bold text-slate-900 leading-none group-hover:text-emerald-900 transition tracking-tight">
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
            </div>
            <span className="text-[10px] text-slate-400 font-medium leading-none mt-1 hidden sm:block">
              {language === "bn" ? "নাগরিক ভূমি প্রাক-যাচাই" : "Civic Land Due Diligence"}
            </span>
          </div>
        </Link>

        {/* ── ZONE 2: PRIMARY NAVIGATION (Desktop & Tablet) ── */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {isLandingPage || pathname === "/" ? (
            /* Landing Page Navigation */
            <>
              <a
                href="#workflow"
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-emerald-900 hover:bg-slate-100/80 rounded-lg transition"
              >
                {t.nav.workflow}
              </a>
              <a
                href="#features"
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-emerald-900 hover:bg-slate-100/80 rounded-lg transition"
              >
                {t.nav.features}
              </a>
              {isAuthenticated && (
                <div className="flex items-center gap-1 pl-1 ml-1 border-l border-slate-200">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 rounded-lg transition"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 text-emerald-700" />
                    <span>{t.nav.dashboard}</span>
                  </Link>
                  <Link
                    href="/dashboard/history"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-emerald-800 hover:bg-slate-50 rounded-lg transition"
                  >
                    <History className="h-3.5 w-3.5 text-emerald-700" />
                    <span>{t.nav.history}</span>
                  </Link>
                </div>
              )}
            </>
          ) : (
            /* Dashboard & Verification History Navigation */
            <div className="flex items-center gap-1.5 lg:gap-2.5">
              {/* Segmented View Tabs */}
              <div className="inline-flex items-center rounded-xl bg-slate-100/90 p-1 border border-slate-200/80">
                <Link
                  href="/dashboard"
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    isDashboardActive
                      ? "bg-emerald-800 text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                  }`}
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>{t.nav.dashboard}</span>
                </Link>

                <Link
                  href="/dashboard/history"
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    isHistoryActive
                      ? "bg-emerald-800 text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                  }`}
                >
                  <History className="h-3.5 w-3.5" />
                  <span>{t.nav.history}</span>
                </Link>
              </div>

              {/* In-Page Quick Navigation Jumps (visible on xl screens) */}
              <div className="hidden xl:flex items-center gap-1 pl-2 border-l border-slate-200 text-xs">
                <a
                  href={isDashboardActive ? "#map-section" : "/dashboard#map-section"}
                  className="px-2 py-1 text-slate-500 hover:text-emerald-900 hover:bg-slate-100/80 rounded-md transition font-medium"
                >
                  {t.nav.map}
                </a>
                <a
                  href={isDashboardActive ? "#records-section" : "/dashboard#records-section"}
                  className="px-2 py-1 text-slate-500 hover:text-emerald-900 hover:bg-slate-100/80 rounded-md transition font-medium"
                >
                  {t.nav.records}
                </a>
                <a
                  href={isDashboardActive ? "#risk-guide" : "/dashboard#risk-guide"}
                  className="px-2 py-1 text-slate-500 hover:text-emerald-900 hover:bg-slate-100/80 rounded-md transition font-medium"
                >
                  {t.nav.riskGuide}
                </a>
              </div>
            </div>
          )}

          {/* Bhumi Sathi AI Assistant Trigger */}
          {onOpenChat && (
            <button
              type="button"
              onClick={onOpenChat}
              title={
                language === "en"
                  ? "Ask Bhumi Sathi AI Land Assistant"
                  : "ভূমিসাথী এআই সহকারীকে জিজ্ঞাসা করুন"
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200/90 bg-emerald-50/70 px-2.5 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-100/80 hover:border-emerald-300 transition shadow-2xs cursor-pointer ml-1"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
              <span>{language === "en" ? "Bhumi Sathi" : "ভূমিসাথী"}</span>
              <span className="rounded-full bg-emerald-800 text-white text-[9px] font-bold px-1.5 py-0.2 leading-none">
                AI
              </span>
            </button>
          )}
        </nav>

        {/* ── ZONE 3: ACTIONS & ACCOUNT (Right Side) ── */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Bilingual Switcher */}
          <LanguageSwitcher />

          {isAuthenticated && user ? (
            <>
              {/* Primary Verification Action Button */}
              {onOpenVerificationModal && (
                <button
                  onClick={onOpenVerificationModal}
                  type="button"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-900 transition focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-1 active:scale-[0.98] cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>{t.nav.verifyDeedBtn}</span>
                </button>
              )}

              {/* User Profile Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-2 rounded-full border border-slate-200/90 bg-white py-1 pl-1 pr-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
                >
                  <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-emerald-800 text-[11px] sm:text-xs font-bold text-white shadow-xs">
                    {getUserInitials(user.name)}
                  </div>
                  <span className="hidden sm:inline-block max-w-[100px] truncate text-slate-800 font-medium">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                      isProfileOpen ? "rotate-180 text-emerald-800" : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100 z-50">
                    {/* User Profile Card */}
                    <div className="px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-1.5">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {user.email}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100/80 text-emerald-800">
                          {user.occupation || t.nav.citizenBadge}
                        </span>
                      </div>
                    </div>

                    {/* Navigation Items in Dropdown */}
                    <div className="space-y-0.5 text-xs">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition ${
                          isDashboardActive
                            ? "bg-emerald-50 text-emerald-900 font-semibold"
                            : "text-slate-700 hover:bg-slate-50 hover:text-emerald-900"
                        }`}
                      >
                        <LayoutDashboard className="h-4 w-4 text-emerald-700" />
                        <span>{t.nav.dashboard}</span>
                      </Link>

                      <Link
                        href="/dashboard/history"
                        onClick={() => setIsProfileOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition ${
                          isHistoryActive
                            ? "bg-emerald-50 text-emerald-900 font-semibold"
                            : "text-slate-700 hover:bg-slate-50 hover:text-emerald-900"
                        }`}
                      >
                        <History className="h-4 w-4 text-emerald-700" />
                        <span>{t.nav.history}</span>
                      </Link>

                      {onOpenVerificationModal && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            onOpenVerificationModal();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-emerald-900 rounded-lg font-medium transition cursor-pointer text-left"
                        >
                          <Plus className="h-4 w-4 text-emerald-700" />
                          <span>{t.nav.verifyDeedBtn}</span>
                        </button>
                      )}

                      {onOpenChat && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            onOpenChat();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-emerald-900 rounded-lg font-medium transition cursor-pointer text-left"
                        >
                          <Sparkles className="h-4 w-4 text-emerald-700" />
                          <span>
                            {language === "en" ? "Ask Bhumi Sathi" : "ভূমিসাথীকে প্রশ্ন করুন"}
                          </span>
                        </button>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="my-1 border-t border-slate-100" />

                    {/* Logout */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-lg transition disabled:opacity-60 cursor-pointer text-left"
                    >
                      <LogOut className="h-4 w-4 text-rose-500" />
                      <span>{isLoggingOut ? t.nav.loggingOut : t.nav.logout}</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Logged-Out Action Buttons */
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 hover:text-emerald-900 transition focus:outline-none focus:ring-2 focus:ring-emerald-700 active:scale-[0.98]"
              >
                <LogIn className="h-3.5 w-3.5 text-emerald-700" />
                <span>{t.nav.login}</span>
              </Link>

              <Link
                href="/signup"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-900 transition focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-1 active:scale-[0.98]"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>{t.nav.signup}</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? t.nav.menuClose : t.nav.menuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-slate-700" />
            ) : (
              <Menu className="h-5 w-5 text-slate-700" />
            )}
          </button>
        </div>
      </div>

      {/* ── MOBILE DRAWER MENU ── */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-150">
          {/* User state in mobile menu */}
          {isAuthenticated && user && (
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-800 text-xs font-bold text-white shrink-0 shadow-xs">
                {getUserInitials(user.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user.name}
                </p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                <span className="inline-block mt-0.5 text-[10px] font-semibold text-emerald-800">
                  {user.occupation || t.nav.citizenBadge}
                </span>
              </div>
            </div>
          )}

          {/* Nav links */}
          <div className="space-y-1 text-sm">
            {isLandingPage ? (
              <>
                <a
                  href="#workflow"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-900 rounded-lg transition"
                >
                  {t.nav.workflow}
                </a>
                <a
                  href="#features"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-900 rounded-lg transition"
                >
                  {t.nav.features}
                </a>
              </>
            ) : null}

            {isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold transition ${
                    isDashboardActive
                      ? "bg-emerald-50 text-emerald-900"
                      : "text-slate-700 hover:bg-slate-50 hover:text-emerald-900 font-medium"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4 text-emerald-700" />
                  <span>{t.nav.dashboard}</span>
                </Link>

                <Link
                  href="/dashboard/history"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold transition ${
                    isHistoryActive
                      ? "bg-emerald-50 text-emerald-900"
                      : "text-slate-700 hover:bg-slate-50 hover:text-emerald-900 font-medium"
                  }`}
                >
                  <History className="h-4 w-4 text-emerald-700" />
                  <span>{t.nav.history}</span>
                </Link>

                {/* Dashboard Anchor Jumps */}
                <div className="pt-1 pb-1 pl-3 grid grid-cols-3 gap-1 text-xs text-slate-600">
                  <a
                    href={isDashboardActive ? "#map-section" : "/dashboard#map-section"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 rounded-md text-center transition font-medium"
                  >
                    {t.nav.map}
                  </a>
                  <a
                    href={isDashboardActive ? "#records-section" : "/dashboard#records-section"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 rounded-md text-center transition font-medium"
                  >
                    {t.nav.records}
                  </a>
                  <a
                    href={isDashboardActive ? "#risk-guide" : "/dashboard#risk-guide"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 rounded-md text-center transition font-medium"
                  >
                    {t.nav.riskGuide}
                  </a>
                </div>
              </>
            )}

            {/* Bhumi Sathi AI Assistant Trigger */}
            {onOpenChat && (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenChat();
                }}
                className="w-full text-left px-3 py-2 text-sm font-semibold text-emerald-900 bg-emerald-50/80 border border-emerald-200/80 hover:bg-emerald-100 rounded-lg transition flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-700" />
                  <span>
                    {language === "en" ? "Ask Bhumi Sathi" : "ভূমিসাথীকে প্রশ্ন করুন"}
                  </span>
                </div>
                <span className="rounded-full bg-emerald-800 text-white text-[10px] px-2 py-0.5 font-bold">
                  AI
                </span>
              </button>
            )}

            {/* Verify Deed Button in mobile drawer */}
            {isAuthenticated && onOpenVerificationModal && (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenVerificationModal();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                <span>{t.nav.verifyDeedBtn}</span>
              </button>
            )}
          </div>

          {/* Mobile Auth Actions */}
          <div className="pt-2 border-t border-slate-100">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition disabled:opacity-60 cursor-pointer"
              >
                <LogOut className="h-4 w-4 text-rose-500" />
                <span>{isLoggingOut ? t.nav.loggingOut : t.nav.logout}</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                >
                  <LogIn className="h-3.5 w-3.5 text-emerald-800" />
                  <span>{t.nav.login}</span>
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>{t.nav.signup}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
