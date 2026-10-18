"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useDashboard } from "@/context/DashboardContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { Menu, ShieldCheck, Sparkles } from "lucide-react";

interface DashboardNavbarProps {
  onOpenChat?: () => void;
}

export default function DashboardNavbar({ onOpenChat }: DashboardNavbarProps) {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { toggleMobileSidebar, isMobileSidebarOpen, openChat } = useDashboard();
  const handleOpenChat = onOpenChat ?? openChat;

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 w-full items-center justify-between border-b border-slate-200/90 bg-white/95 px-3 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={toggleMobileSidebar}
          aria-expanded={isMobileSidebarOpen}
          aria-label={t.sidebar.menu}
          className="lg:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link
          href="/dashboard"
          className="lg:hidden flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-lg min-w-0"
          aria-label="LandGuard BD Dashboard"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-900 text-white">
            <ShieldCheck className="h-4 w-4 text-emerald-300" aria-hidden />
          </div>
          <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
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

        <p className="hidden lg:block text-sm font-medium text-slate-600 truncate">
          {t.personalDashboard.navbarWorkspace}
        </p>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <LanguageSwitcher />

        <button
          type="button"
          onClick={handleOpenChat}
          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/90 px-2.5 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 cursor-pointer"
          aria-label={t.personalDashboard.actionChat}
        >
          <Sparkles className="h-3.5 w-3.5 text-emerald-700" aria-hidden />
          <span className="hidden md:inline">{t.personalDashboard.actionChat}</span>
        </button>

        {user && (
          <div
            className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200"
            title={user.email}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-900 ring-1 ring-emerald-200">
              {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
            </div>
            <div className="hidden xl:flex flex-col text-left min-w-0">
              <span className="text-xs font-semibold text-slate-800 leading-tight max-w-[130px] truncate">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-400 leading-tight truncate">
                {user.occupation || (language === "bn" ? "নাগরিক" : "Citizen")}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
