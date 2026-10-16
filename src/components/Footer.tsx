import React from "react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-800 text-white font-bold text-xs">
              LG
            </div>
            <span className="text-sm font-bold text-slate-800">
              ল্যান্ডগার্ড বিডি (LandGuard BD)
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              পরীক্ষামূলক সংস্করণ
            </span>
          </div>

          <p className="text-center text-xs text-slate-500 md:text-right">
            কৃত্রিম তথ্যের ভিত্তিতে তৈরি সচেতনতামূলক প্ল্যাটফর্ম • এটি কোনো সরকারি বা আইনি সনদ নয়।
          </p>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-400">
          © 2026 LandGuard BD (ল্যান্ডগার্ড বিডি) — Civic Tech for Land Due Diligence in Bangladesh.
        </div>
      </div>
    </footer>
  );
}
