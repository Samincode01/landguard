"use client";

import React, { useState, useMemo } from "react";
import { DemoLandParcel, ParcelRiskLevel } from "@/data/demo-data";
import { toBengaliNumerals } from "@/lib/formatters";
import ParcelHistoryAndRisk from "./ParcelHistoryAndRisk";

interface ParcelTableProps {
  parcels: DemoLandParcel[];
  selectedParcelId?: string | null;
  onSelectParcel?: (parcel: DemoLandParcel) => void;
  onViewOnMap?: (parcel: DemoLandParcel) => void;
}

export default function ParcelTable({
  parcels,
  selectedParcelId,
  onSelectParcel,
  onViewOnMap,
}: ParcelTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<"ALL" | ParcelRiskLevel>("ALL");
  const [expandedParcelId, setExpandedParcelId] = useState<string | null>(null);
  const [prevSelectedParcelId, setPrevSelectedParcelId] = useState(selectedParcelId);

  // Sync expanded row when a parcel is selected from map
  if (selectedParcelId !== prevSelectedParcelId) {
    setPrevSelectedParcelId(selectedParcelId);
    if (selectedParcelId) {
      setExpandedParcelId(selectedParcelId);
    }
  }

  const filteredParcels = useMemo(() => {
    return parcels.filter((parcel) => {
      const matchesRisk =
        selectedRiskFilter === "ALL" || parcel.riskLevel === selectedRiskFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        parcel.district.toLowerCase().includes(q) ||
        parcel.districtEn.toLowerCase().includes(q) ||
        parcel.upazila.toLowerCase().includes(q) ||
        parcel.upazilaEn.toLowerCase().includes(q) ||
        parcel.mouza.toLowerCase().includes(q) ||
        parcel.mouzaEn.toLowerCase().includes(q) ||
        parcel.dagNumber.includes(q) ||
        parcel.khatianNumber.includes(q) ||
        parcel.ownership.ownerName.toLowerCase().includes(q);

      return matchesRisk && matchesSearch;
    });
  }, [parcels, searchQuery, selectedRiskFilter]);

  const riskCounts = useMemo(() => {
    const counts = { ALL: parcels.length, LOW: 0, MEDIUM: 0, HIGH: 0 };
    parcels.forEach((p) => {
      if (p.riskLevel === "LOW") counts.LOW++;
      if (p.riskLevel === "MEDIUM") counts.MEDIUM++;
      if (p.riskLevel === "HIGH") counts.HIGH++;
    });
    return counts;
  }, [parcels]);

  const toggleExpand = (id: string) => {
    setExpandedParcelId((prev) => (prev === id ? null : id));
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return { label: "অতি জরুরি", badgeClass: "bg-rose-100 text-rose-900 border-rose-200" };
      case "HIGH":
        return { label: "উচ্চ ঝুঁকি", badgeClass: "bg-rose-50 text-rose-800 border-rose-200" };
      case "MEDIUM":
        return { label: "সতর্কতা", badgeClass: "bg-amber-100 text-amber-900 border-amber-200" };
      default:
        return { label: "পর্যবেক্ষণ", badgeClass: "bg-slate-100 text-slate-800 border-slate-200" };
    }
  };

  return (
    <div id="records-section" className="space-y-4 pt-2">
      {/* Table Header & Controls */}
      <div className="flex flex-col gap-3.5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              নমুনা ভূমি রেকর্ড ও খতিয়ান তালিকা
            </h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 border border-slate-200/80 tabular-nums">
              {toBengaliNumerals(filteredParcels.length)} টি
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            দাগ ও খতিয়ানভিত্তিক প্রাথমিক অসঙ্গতি পর্যবেক্ষণ — যেকোনো সারিতে ক্লিক করুন বিশ্লেষণ দেখতে
          </p>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative min-w-[240px] sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="মৌজা, দাগ, খতিয়ান বা জেলা..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-7 text-sm text-slate-900 placeholder-slate-400 shadow-2xs transition focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
            <svg
              className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600 p-0.5"
                title="মুছুন"
              >
                ✕
              </button>
            )}
          </div>

          {/* Risk Level Filter Tabs */}
          <div className="flex rounded-xl border border-slate-200 bg-white p-1 text-xs shadow-2xs">
            <button
              type="button"
              onClick={() => setSelectedRiskFilter("ALL")}
              className={`rounded-lg px-3 py-1.5 font-semibold transition ${
                selectedRiskFilter === "ALL"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              সকল ({toBengaliNumerals(riskCounts.ALL)})
            </button>
            <button
              type="button"
              onClick={() => setSelectedRiskFilter("LOW")}
              className={`rounded-lg px-3 py-1.5 font-semibold transition ${
                selectedRiskFilter === "LOW"
                  ? "bg-emerald-800 text-white"
                  : "text-emerald-800 hover:bg-emerald-50"
              }`}
            >
              ঝুঁকিহীন ({toBengaliNumerals(riskCounts.LOW)})
            </button>
            <button
              type="button"
              onClick={() => setSelectedRiskFilter("MEDIUM")}
              className={`rounded-lg px-3 py-1.5 font-semibold transition ${
                selectedRiskFilter === "MEDIUM"
                  ? "bg-amber-700 text-white"
                  : "text-amber-800 hover:bg-amber-50"
              }`}
            >
              সতর্কতা ({toBengaliNumerals(riskCounts.MEDIUM)})
            </button>
            <button
              type="button"
              onClick={() => setSelectedRiskFilter("HIGH")}
              className={`rounded-lg px-3 py-1.5 font-semibold transition ${
                selectedRiskFilter === "HIGH"
                  ? "bg-rose-700 text-white"
                  : "text-rose-800 hover:bg-rose-50"
              }`}
            >
              উচ্চ ঝুঁকি ({toBengaliNumerals(riskCounts.HIGH)})
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/90 text-slate-600 font-semibold text-xs uppercase tracking-wide">
              <tr>
                <th scope="col" className="px-4 py-3.5 min-w-[140px]">জেলা / উপজেলা</th>
                <th scope="col" className="px-4 py-3.5 min-w-[110px]">মৌজা / জেএল</th>
                <th scope="col" className="px-4 py-3.5 min-w-[120px]">খতিয়ান / জরিপ</th>
                <th scope="col" className="px-4 py-3.5 min-w-[90px]">দাগ নং</th>
                <th scope="col" className="px-4 py-3.5 min-w-[90px]">পরিমাণ</th>
                <th scope="col" className="px-4 py-3.5 min-w-[160px]">নথিভুক্ত মালিক</th>
                <th scope="col" className="px-4 py-3.5 min-w-[140px]">ঝুঁকি মূল্যায়ন</th>
                <th scope="col" className="px-4 py-3.5 text-right min-w-[80px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParcels.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-14 text-center text-slate-500">
                    <p className="text-sm font-semibold text-slate-800">কোনো রেকর্ড পাওয়া যায়নি</p>
                    <p className="text-sm text-slate-400 mt-1">
                      অনুসন্ধান পরিবর্তন করুন অথবা ফিল্টার সরিয়ে দিন।
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedRiskFilter("ALL");
                      }}
                      className="mt-3 inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
                    >
                      সব রেকর্ড দেখুন
                    </button>
                  </td>
                </tr>
              ) : (
                filteredParcels.map((parcel) => {
                  const isExpanded = expandedParcelId === parcel.id;
                  const hasFlags = parcel.riskFlags.length > 0;

                  return (
                    <React.Fragment key={parcel.id}>
                      <tr
                        id={`parcel-row-${parcel.id}`}
                        onClick={() => toggleExpand(parcel.id)}
                        className={`cursor-pointer transition-colors hover:bg-slate-50/80 ${
                          isExpanded ? "bg-slate-50" : ""
                        } ${selectedParcelId === parcel.id ? "ring-2 ring-emerald-600/40 bg-emerald-50/30" : ""}`}
                      >
                        {/* District & Upazila */}
                        <td className="px-4 py-4">
                          <div className="font-semibold text-slate-900 text-sm">
                            {parcel.district}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {parcel.upazila}
                          </div>
                        </td>

                        {/* Mouza & JL */}
                        <td className="px-4 py-4">
                          <div className="font-medium text-slate-900 text-sm">{parcel.mouza}</div>
                          <div className="text-xs text-slate-500 mt-0.5 bn-num">
                            জেএল {parcel.jlNumber}
                          </div>
                        </td>

                        {/* Khatian & Survey */}
                        <td className="px-4 py-4">
                          <div className="font-semibold text-slate-900 text-sm bn-num">
                            {parcel.khatianNumber}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {parcel.khatianType}
                          </div>
                        </td>

                        {/* Dag / Plot — prominent, tabular */}
                        <td className="px-4 py-4">
                          <span className="font-bold text-slate-900 text-base leading-none bn-num">
                            {parcel.dagNumber}
                          </span>
                        </td>

                        {/* Area */}
                        <td className="px-4 py-4">
                          <span className="font-semibold text-slate-900 text-sm bn-num">{toBengaliNumerals(parcel.recordedArea)}</span>{" "}
                          <span className="text-xs text-slate-500">{parcel.areaUnit}</span>
                        </td>

                        {/* Owner */}
                        <td className="px-4 py-4">
                          <div className="font-medium text-slate-900 text-sm leading-snug">
                            {parcel.ownership.ownerName}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5 bn-num">
                            {parcel.ownership.deedNumber || "দলিল নম্বর নেই"}
                          </div>
                        </td>

                        {/* Risk Badge */}
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1.5">
                            {parcel.riskLevel === "LOW" && (
                              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                                ঝুঁকিহীন
                              </span>
                            )}
                            {parcel.riskLevel === "MEDIUM" && (
                              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                                সতর্কতা প্রয়োজন
                              </span>
                            )}
                            {parcel.riskLevel === "HIGH" && (
                              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-800 border border-rose-200">
                                <span className="h-1.5 w-1.5 rounded-full bg-rose-600 shrink-0" />
                                উচ্চ ঝুঁকি
                              </span>
                            )}
                            <span className="text-xs text-slate-500 leading-snug">
                              {parcel.statusLabelBn}
                            </span>
                          </div>
                        </td>

                        {/* Expand toggle */}
                        <td className="px-4 py-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(parcel.id);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-900 hover:border-emerald-300 transition shadow-2xs"
                          >
                            <span>{isExpanded ? "বন্ধ" : "বিশদ"}</span>
                            <svg
                              className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Drawer */}
                      {isExpanded && (
                        <tr className="bg-slate-50/90 border-b border-slate-200">
                          <td colSpan={8} className="px-4 py-5 sm:px-6">
                            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4 shadow-2xs">
                              {/* Drawer header */}
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-2.5">
                                  <span className="h-2 w-2 rounded-full bg-emerald-700" />
                                  <span className="font-bold text-slate-900 text-sm sm:text-base">
                                    দাগ নং {parcel.dagNumber} — মৌজা {parcel.mouza}
                                  </span>
                                </div>
                                <span className="text-xs text-slate-400 font-mono">{parcel.id}</span>
                              </div>

                              {/* Assessment Note */}
                              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700 border border-slate-200/80 leading-relaxed">
                                <p className="font-semibold text-slate-900 mb-1.5">প্রাথমিক পর্যবেক্ষণ</p>
                                <p>{parcel.notesBn}</p>
                              </div>

                              {/* Risk Flags */}
                              {hasFlags ? (
                                <div className="space-y-2.5">
                                  <h3 className="text-sm font-bold text-slate-900">
                                    চিহ্নিত অসঙ্গতি ({toBengaliNumerals(parcel.riskFlags.length)} টি)
                                  </h3>
                                  <div className="grid gap-2.5 sm:grid-cols-2">
                                    {parcel.riskFlags.map((flag) => {
                                      const severity = getSeverityBadge(flag.severity);
                                      return (
                                        <div
                                          key={flag.id}
                                          className={`rounded-xl p-4 text-sm border ${
                                            flag.severity === "CRITICAL"
                                              ? "border-rose-200 bg-rose-50/60 text-rose-950"
                                              : flag.severity === "HIGH"
                                              ? "border-amber-200 bg-amber-50/60 text-amber-950"
                                              : "border-slate-200 bg-slate-50 text-slate-900"
                                          }`}
                                        >
                                          <div className="flex items-center justify-between gap-2 mb-2">
                                            <span className="font-bold text-slate-900 text-sm">{flag.title}</span>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border shrink-0 ${severity.badgeClass}`}>
                                              {severity.label}
                                            </span>
                                          </div>
                                          <p className="text-sm leading-relaxed text-slate-700">
                                            {flag.description}
                                          </p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50/70 p-3.5 text-sm text-emerald-900 border border-emerald-200/80">
                                  <svg className="h-5 w-5 text-emerald-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>
                                    এই রেকর্ডে কোনো অসঙ্গতি পাওয়া যায়নি — খতিয়ান ও দলিলের তথ্য পরস্পর সামঞ্জস্যপূর্ণ।
                                  </span>
                                </div>
                              )}

                              {/* Explainable Risk Analysis & Chronological History */}
                              <ParcelHistoryAndRisk parcel={parcel} />

                              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-400">
                                <span>* এটি কৃত্রিম ডেমো ডেটার ওপর ভিত্তি করে স্বয়ংক্রিয় প্রাক-যাচাইয়ের ফলাফল — কোনো আইনি গ্যারান্টি নয়।</span>
                                <div className="flex flex-wrap items-center gap-3">
                                  {onViewOnMap && (
                                    <button
                                      type="button"
                                      onClick={() => onViewOnMap(parcel)}
                                      className="inline-flex items-center gap-1 font-medium text-slate-700 hover:text-emerald-900 hover:underline"
                                    >
                                      <svg className="h-3.5 w-3.5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                      </svg>
                                      <span>মানচিত্রে অবস্থান</span>
                                    </button>
                                  )}
                                  {onSelectParcel && (
                                    <button
                                      type="button"
                                      onClick={() => onSelectParcel(parcel)}
                                      className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:text-emerald-950 hover:underline"
                                    >
                                      <span>এই জমির দলিল যাচাই করুন</span>
                                      <span>→</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
