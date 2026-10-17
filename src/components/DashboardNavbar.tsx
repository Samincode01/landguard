"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useDashboard } from "@/context/DashboardContext";
import LanguageSwitcher from "./LanguageSwitcher";
import {
  Menu,
  ShieldCheck,
  Bot,
} from "lucide-react";

interface DashboardNavbarProps {
  onOpenChat?: () => void;
}

export default function DashboardNavbar({ onOpenChat }: DashboardNavbarProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toggleMobileSidebar, isMobileSidebarOpen } = useDashboard();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/90 bg-white/95 px-4 sm:px-6 backdrop-blur-md shadow-2xs">
      {/* Left: Mobile menu trigger & Brand (Mobile) / Desktop Workspace Indicator */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={toggleMobileSidebar}
          aria-expanded={isMobileSidebarOpen}
          aria-label={language === "bn" ? "মেনু খুলুন" : "Open navigation menu"}
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-1 cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Brand link (visible on mobile where sidebar is in drawer) */}
        <Link
          href="/dashboard"
          className="lg:hidden flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-emerald-700 rounded-lg p-0.5"
          aria-label="LandGuard BD Dashboard"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-900 text-white shadow-xs">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-300" />
          </div>
          <span className="text-base font-bold text-slate-900 tracking-tight">
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
        </Link>

        {/* Desktop Workspace Indicator */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            {language === "bn"
              ? "নাগরিক ভূমি প্রাক-যাচাই ও খতিয়ান হিস্যা ওয়ার্কস্পেস"
              : "Civic Land Due Diligence Workspace"}
          </span>
        </div>
      </div>

      {/* Right: Language Switcher, Chatbot Trigger, User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* AI Assistant Quick Trigger */}
        {onOpenChat && (
          <button
            type="button"
            onClick={onOpenChat}
            className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-2.5 py-1.5 text-xs font-medium text-emerald-900 hover:bg-emerald-100 hover:border-emerald-300 transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
            title={language === "bn" ? "ভূমিসাথী AI এর সাথে কথা বলুন" : "Chat with Bhumi Sathi AI"}
            aria-label={language === "bn" ? "ভূমিসাথী AI সহকারী" : "Bhumi Sathi AI Assistant"}
          >
            <Bot className="h-3.5 w-3.5 text-emerald-700" />
            <span className="hidden md:inline font-semibold">
              {language === "bn" ? "ভূমিসাথী AI" : "Bhumi Sathi AI"}
            </span>
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        )}

        {/* User initials chip */}
        {user && (
          <div
            className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200"
            title={user.email}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-900 border border-emerald-300">
              {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 leading-tight max-w-[130px] truncate">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-400 leading-tight">
                {user.occupation || (language === "bn" ? "নাগরিক" : "Citizen")}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
