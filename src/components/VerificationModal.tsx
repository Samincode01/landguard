"use client";

import React, { useState } from "react";
import { DemoLandParcel } from "@/data/demo-data";
import {
  VerificationSubmission,
  VerificationResult,
  compareLandDocument,
} from "@/lib/verification";
import { toBengaliNumerals } from "@/lib/formatters";
import VerificationReport from "./VerificationReport";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcels: DemoLandParcel[];
  initialParcelId?: string | null;
}

export default function VerificationModal({
  isOpen,
  onClose,
  parcels,
  initialParcelId,
}: VerificationModalProps) {
  const initialParcel =
    parcels.find((p) => p.id === initialParcelId) || parcels[0];

  // Current view step: "form", "results", or "report"
  const [step, setStep] = useState<"form" | "results" | "report">("form");

  // Selected reference parcel ID
  const [selectedParcelId, setSelectedParcelId] = useState<string>(
    () => initialParcel?.id || ""
  );

  // Form input state initialized from selected reference parcel
  const [formData, setFormData] = useState<VerificationSubmission>(() => ({
    parcelId: initialParcel?.id || "",
    ownerName: initialParcel?.ownership.ownerName || "",
    district: initialParcel?.district || "",
    upazila: initialParcel?.upazila || "",
    mouza: initialParcel?.mouza || "",
    khatianNumber: initialParcel?.khatianNumber || "",
    khatianType: initialParcel?.khatianType || "বিএস (BS)",
    dagNumber: initialParcel?.dagNumber || "",
    recordedArea: initialParcel ? String(initialParcel.recordedArea) : "",
    areaUnit: initialParcel?.areaUnit || "শতক",
  }));

  // Validation errors map
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Verification result state
  const [result, setResult] = useState<VerificationResult | null>(null);

  // Helper to prefill form values from a parcel
  const prefillFromParcel = (parcel: DemoLandParcel) => {
    setSelectedParcelId(parcel.id);
    setFormData({
      parcelId: parcel.id,
      ownerName: parcel.ownership.ownerName,
      district: parcel.district,
      upazila: parcel.upazila,
      mouza: parcel.mouza,
      khatianNumber: parcel.khatianNumber,
      khatianType: parcel.khatianType,
      dagNumber: parcel.dagNumber,
      recordedArea: String(parcel.recordedArea),
      areaUnit: parcel.areaUnit,
    });
    setErrors({});
    setResult(null);
  };

  if (!isOpen) return null;

  const currentParcel =
    parcels.find((p) => p.id === selectedParcelId) || parcels[0];

  // Handle changing the reference parcel from dropdown
  const handleParcelSelectChange = (newParcelId: string) => {
    const p = parcels.find((item) => item.id === newParcelId);
    if (p) {
      prefillFromParcel(p);
    }
  };

  // Field change handler
  const handleInputChange = (field: keyof VerificationSubmission, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Validate form inputs
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = "মালিকের নাম আবশ্যক।";
    }
    if (!formData.district.trim()) {
      newErrors.district = "জেলা আবশ্যক।";
    }
    if (!formData.upazila.trim()) {
      newErrors.upazila = "উপজেলা বা থানা আবশ্যক।";
    }
    if (!formData.mouza.trim()) {
      newErrors.mouza = "মৌজা আবশ্যক।";
    }
    if (!formData.khatianNumber.trim()) {
      newErrors.khatianNumber = "খতিয়ান নম্বর আবশ্যক।";
    }
    if (!formData.khatianType.trim()) {
      newErrors.khatianType = "জরিপের ধরন আবশ্যক।";
    }
    if (!formData.dagNumber.trim()) {
      newErrors.dagNumber = "দাগ নম্বর আবশ্যক।";
    }

    if (!formData.recordedArea.trim()) {
      newErrors.recordedArea = "জমির পরিমাণ আবশ্যক।";
    } else {
      // Check numeric validity
      const cleaned = formData.recordedArea
        .replace(/[০-৯]/g, (d) =>
          ({ "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4", "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9" }[d] || d)
        )
        .trim();
      const num = parseFloat(cleaned);
      if (isNaN(num) || num <= 0) {
        newErrors.recordedArea = "জমির সঠিক সংখ্যা উল্লেখ করুন (যেমন: ৭.৫ বা 7.5)।";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!currentParcel) return;

    const verificationResult = compareLandDocument(formData, currentParcel);
    setResult(verificationResult);
    setStep("results");
  };

  // Quick preset helpers for easy testing
  const applyPreset = (type: "match" | "ownerMismatch" | "dagMismatch" | "areaMismatch") => {
    if (!currentParcel) return;
    setErrors({});
    if (type === "match") {
      prefillFromParcel(currentParcel);
    } else if (type === "ownerMismatch") {
      prefillFromParcel(currentParcel);
      setFormData((prev) => ({
        ...prev,
        ownerName: "মোহাম্মদ দেলোয়ার হোসেন (অসমর্থিত ব্যক্তি)",
      }));
    } else if (type === "dagMismatch") {
      prefillFromParcel(currentParcel);
      setFormData((prev) => ({
        ...prev,
        dagNumber: "৯৯৯",
      }));
    } else if (type === "areaMismatch") {
      prefillFromParcel(currentParcel);
      setFormData((prev) => ({
        ...prev,
        recordedArea: String(currentParcel.recordedArea + 2.5),
      }));
    }
  };

  return (
    <div className="report-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        className={`report-modal-container relative w-full ${
          step === "report" ? "max-w-4xl" : "max-w-3xl"
        } my-6 rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all overflow-hidden flex flex-col max-h-[92vh]`}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header (Hidden on full report view to allow report's own action bar) */}
        {step !== "report" && (
          <div className="no-print flex items-center justify-between border-b border-slate-200/80 px-5 py-4 bg-slate-50/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-800 text-white shadow-xs">
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {step === "form" ? "দলিল ও খতিয়ান প্রাক-যাচাই" : "যাচাইকরণ ফলাফল ও রেকর্ড তুলনা"}
                  </h3>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-2xs font-semibold text-emerald-800 border border-emerald-200">
                    ডেমো প্রোটোটাইপ
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {step === "form"
                    ? "নির্বাচিত রেফারেন্স রেকর্ডের বিপরীতে দলিলের তথ্য যাচাই করুন"
                    : "দাখিলকৃত দলিলের তথ্যের সাথে রেফারেন্স রেকর্ডের তুলনামূলক বিশ্লেষণ"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              type="button"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition focus:outline-none"
              aria-label="বন্ধ করুন"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div
          className={`overflow-y-auto flex-1 ${
            step === "report" ? "p-3 sm:p-5 bg-slate-100/60" : "p-5 sm:p-6 space-y-5"
          }`}
        >
          {step === "form" ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Reference Parcel Selector Card */}
              <div className="rounded-xl border border-emerald-200/90 bg-emerald-50/40 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <label htmlFor="reference-parcel-select" className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                    ধাপ ১: তুলনার জন্য রেফারেন্স জমি নির্বাচন করুন
                  </label>
                  <button
                    type="button"
                    onClick={() => currentParcel && prefillFromParcel(currentParcel)}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline self-start sm:self-auto"
                  >
                    রেফারেন্স মান দিয়ে পুনরায় পূরণ
                  </button>
                </div>

                <select
                  id="reference-parcel-select"
                  value={selectedParcelId}
                  onChange={(e) => handleParcelSelectChange(e.target.value)}
                  className="w-full rounded-xl border border-emerald-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 shadow-2xs focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  {parcels.map((parcel) => (
                    <option key={parcel.id} value={parcel.id}>
                      দাগ নং {parcel.dagNumber} | খতিয়ান {parcel.khatianNumber} ({parcel.khatianType}) — {parcel.mouza}, {parcel.upazila}, {parcel.district} [মালিক: {parcel.ownership.ownerName}]
                    </option>
                  ))}
                </select>

                <p className="text-xs text-emerald-800/80 leading-relaxed">
                  * নির্বাচিত জমির বিদ্যমান তথ্য নিচে স্বয়ংক্রিয়ভাবে বসানো হয়েছে। আপনি মানগুলো পরিবর্তন করে অমিল পরীক্ষার ফলাফল যাচাই করতে পারেন।
                </p>
              </div>

              {/* Quick Preset Buttons for Evaluation */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="font-semibold text-slate-500">দ্রুত পরীক্ষা প্রিসেট:</span>
                <button
                  type="button"
                  onClick={() => applyPreset("match")}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-50 shadow-2xs"
                >
                  হুবহু মিল
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("ownerMismatch")}
                  className="rounded-lg border border-rose-200 bg-rose-50/60 px-2.5 py-1 font-medium text-rose-800 hover:bg-rose-100/60 shadow-2xs"
                >
                  মালিকের নামে অমিল
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("dagMismatch")}
                  className="rounded-lg border border-amber-200 bg-amber-50/60 px-2.5 py-1 font-medium text-amber-800 hover:bg-amber-100/60 shadow-2xs"
                >
                  ভিন্ন দাগ নম্বর
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("areaMismatch")}
                  className="rounded-lg border border-amber-200 bg-amber-50/60 px-2.5 py-1 font-medium text-amber-800 hover:bg-amber-100/60 shadow-2xs"
                >
                  জমির পরিমাপে গরমিল
                </button>
              </div>

              {/* Editable Fields Section */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    ধাপ ২: দাখিলকৃত দলিলের তথ্য যাচাই ও সম্পাদনা
                  </h4>
                </div>

                {/* Owner Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    নথিভুক্ত / বিক্রেতা মালিকের নাম <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange("ownerName", e.target.value)}
                    placeholder="মালিকের নাম লিখুন"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 bg-white shadow-2xs transition focus:outline-none focus:ring-1 ${
                      errors.ownerName
                        ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400 bg-rose-50/20"
                        : "border-slate-200 focus:border-emerald-700 focus:ring-emerald-700"
                    }`}
                  />
                  {errors.ownerName && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{errors.ownerName}</p>
                  )}
                </div>

                {/* District, Upazila, Mouza 3-column row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      জেলা <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => handleInputChange("district", e.target.value)}
                      placeholder="যেমন: ঢাকা"
                      className={`w-full rounded-xl border px-3 py-2 text-sm text-slate-900 bg-white shadow-2xs transition focus:outline-none focus:ring-1 ${
                        errors.district
                          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400 bg-rose-50/20"
                          : "border-slate-200 focus:border-emerald-700 focus:ring-emerald-700"
                      }`}
                    />
                    {errors.district && (
                      <p className="mt-1 text-xs text-rose-600 font-medium">{errors.district}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      উপজেলা / থানা <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.upazila}
                      onChange={(e) => handleInputChange("upazila", e.target.value)}
                      placeholder="যেমন: সাভার"
                      className={`w-full rounded-xl border px-3 py-2 text-sm text-slate-900 bg-white shadow-2xs transition focus:outline-none focus:ring-1 ${
                        errors.upazila
                          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400 bg-rose-50/20"
                          : "border-slate-200 focus:border-emerald-700 focus:ring-emerald-700"
                      }`}
                    />
                    {errors.upazila && (
                      <p className="mt-1 text-xs text-rose-600 font-medium">{errors.upazila}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      মৌজা <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.mouza}
                      onChange={(e) => handleInputChange("mouza", e.target.value)}
                      placeholder="যেমন: বিরুলিয়া"
                      className={`w-full rounded-xl border px-3 py-2 text-sm text-slate-900 bg-white shadow-2xs transition focus:outline-none focus:ring-1 ${
                        errors.mouza
                          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400 bg-rose-50/20"
                          : "border-slate-200 focus:border-emerald-700 focus:ring-emerald-700"
                      }`}
                    />
                    {errors.mouza && (
                      <p className="mt-1 text-xs text-rose-600 font-medium">{errors.mouza}</p>
                    )}
                  </div>
                </div>

                {/* Khatian Number, Khatian Type row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      খতিয়ান নম্বর <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.khatianNumber}
                      onChange={(e) => handleInputChange("khatianNumber", e.target.value)}
                      placeholder="যেমন: ৩১২ বা 312"
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 bg-white shadow-2xs transition focus:outline-none focus:ring-1 bn-num ${
                        errors.khatianNumber
                          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400 bg-rose-50/20"
                          : "border-slate-200 focus:border-emerald-700 focus:ring-emerald-700"
                      }`}
                    />
                    {errors.khatianNumber && (
                      <p className="mt-1 text-xs text-rose-600 font-medium">{errors.khatianNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      জরিপের ধরন <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.khatianType}
                      onChange={(e) => handleInputChange("khatianType", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 shadow-2xs focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    >
                      <option value="বিএস (BS)">বিএস (BS)</option>
                      <option value="আরএস (RS)">আরএস (RS)</option>
                      <option value="এসএ (SA)">এসএ (SA)</option>
                      <option value="সিএস (CS)">সিএস (CS)</option>
                      <option value="সিটি জরিপ (City Survey)">সিটি জরিপ (City Survey)</option>
                    </select>
                    {errors.khatianType && (
                      <p className="mt-1 text-xs text-rose-600 font-medium">{errors.khatianType}</p>
                    )}
                  </div>
                </div>

                {/* Dag Number, Recorded Area & Unit row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      দাগ / প্লট নম্বর <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.dagNumber}
                      onChange={(e) => handleInputChange("dagNumber", e.target.value)}
                      placeholder="যেমন: ৮৪৫ বা 845"
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 bg-white shadow-2xs transition focus:outline-none focus:ring-1 bn-num ${
                        errors.dagNumber
                          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400 bg-rose-50/20"
                          : "border-slate-200 focus:border-emerald-700 focus:ring-emerald-700"
                      }`}
                    />
                    {errors.dagNumber && (
                      <p className="mt-1 text-xs text-rose-600 font-medium">{errors.dagNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      জমির পরিমাণ ও একক <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.recordedArea}
                        onChange={(e) => handleInputChange("recordedArea", e.target.value)}
                        placeholder="যেমন: ৭.৫"
                        className={`flex-1 rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 bg-white shadow-2xs transition focus:outline-none focus:ring-1 bn-num ${
                          errors.recordedArea
                            ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400 bg-rose-50/20"
                            : "border-slate-200 focus:border-emerald-700 focus:ring-emerald-700"
                        }`}
                      />
                      <select
                        value={formData.areaUnit}
                        onChange={(e) => handleInputChange("areaUnit", e.target.value)}
                        className="w-28 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 shadow-2xs focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                      >
                        <option value="শতক">শতক</option>
                        <option value="কাঠা">কাঠা</option>
                        <option value="বিঘা">বিঘা</option>
                        <option value="একর">একর</option>
                      </select>
                    </div>
                    {errors.recordedArea && (
                      <p className="mt-1 text-xs text-rose-600 font-medium">{errors.recordedArea}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-800 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-900 transition active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-1"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span>যাচাই ও তুলনা করুন</span>
                </button>
              </div>
            </form>
          ) : step === "results" && result ? (
            /* Results View */
            <div className="space-y-5">
              {/* Overall Category Status Banner */}
              <div
                className={`rounded-2xl border p-4 sm:p-5 ${
                  result.category === "NO_DISCREPANCIES"
                    ? "border-emerald-200 bg-emerald-50/80 text-emerald-950"
                    : result.category === "DIFFERENCES_REQUIRE_REVIEW"
                    ? "border-rose-200 bg-rose-50/80 text-rose-950"
                    : "border-amber-200 bg-amber-50/80 text-amber-950"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold ${
                      result.category === "NO_DISCREPANCIES"
                        ? "bg-emerald-600 text-white"
                        : result.category === "DIFFERENCES_REQUIRE_REVIEW"
                        ? "bg-rose-600 text-white"
                        : "bg-amber-600 text-white"
                    }`}
                  >
                    {result.category === "NO_DISCREPANCIES" ? "✓" : "!"}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold leading-tight">
                        {result.categoryLabelBn}
                      </h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/70 font-semibold border border-current/20">
                        {result.category === "NO_DISCREPANCIES"
                          ? "সব মিল রয়েছে"
                          : `${toBengaliNumerals(result.mismatchCount)}টি অমিল`}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed opacity-90">{result.summaryBn}</p>
                  </div>
                </div>
              </div>

              {/* Side-by-Side Field Comparison Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    ক্ষেত্রভিত্তিক তুলনামূলক নিরীক্ষা
                  </h4>
                  <span className="text-xs text-slate-400">
                    রেফারেন্স: দাগ নং {result.referenceParcel.dagNumber} ({result.referenceParcel.mouza})
                  </span>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold text-xs">
                        <tr>
                          <th className="px-3.5 py-2.5">তালিকাকৃত ক্ষেত্র</th>
                          <th className="px-3.5 py-2.5">রেফারেন্স রেকর্ড</th>
                          <th className="px-3.5 py-2.5">আপনার দাখিলকৃত তথ্য</th>
                          <th className="px-3.5 py-2.5 text-center min-w-[90px]">অবস্থা</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {result.fieldResults.map((field) => (
                          <tr key={field.fieldName} className="hover:bg-slate-50/50">
                            <td className="px-3.5 py-3 font-semibold text-slate-800 whitespace-nowrap">
                              {field.fieldLabelBn}
                            </td>
                            <td className="px-3.5 py-3 text-slate-600 bn-num">
                              {field.referenceValue}
                            </td>
                            <td
                              className={`px-3.5 py-3 font-medium bn-num ${
                                field.status === "MISMATCH"
                                  ? "text-rose-700 bg-rose-50/40 font-semibold"
                                  : field.status === "MISSING"
                                  ? "text-slate-400 italic"
                                  : "text-slate-900"
                              }`}
                            >
                              {field.submittedValue}
                            </td>
                            <td className="px-3.5 py-3 text-center">
                              {field.status === "MATCH" && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                                  মিল রয়েছে
                                </span>
                              )}
                              {field.status === "MISMATCH" && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-800 border border-rose-200">
                                  <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                                  অমিল
                                </span>
                              )}
                              {field.status === "MISSING" && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
                                  তথ্য নেই
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Specific Discrepancy Reasons List */}
              {result.discrepancyReasons.length > 0 && (
                <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 space-y-2">
                  <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wide flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    চিহ্নিত অসঙ্গতি ও পার্থক্যের বিবরণ ({toBengaliNumerals(result.discrepancyReasons.length)}টি):
                  </h4>
                  <ul className="space-y-1.5 text-xs text-rose-900 pl-5 list-disc leading-relaxed">
                    {result.discrepancyReasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Legal & Civic Tech Advisory Notice */}
              <div className="rounded-xl bg-slate-100/80 border border-slate-200 p-3.5 text-xs text-slate-700 leading-relaxed space-y-1">
                <p className="font-semibold text-slate-900">গুরুত্বপূর্ণ আইনি ও নাগরিক পরামর্শ:</p>
                <p>{result.advisoryBn}</p>
              </div>

              {/* Result Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                >
                  <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  <span>তথ্য সংশোধন করে পুনরায় পরীক্ষা</span>
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStep("report")}
                    id="btn-view-full-report"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-800 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-900 transition active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-1"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <span>পূর্ণাঙ্গ রিপোর্ট ও PDF সংরক্ষণ</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    সম্পন্ন করুন
                  </button>
                </div>
              </div>
            </div>
          ) : step === "report" && result ? (
            /* Printable Report View */
            <VerificationReport
              result={result}
              onBack={() => setStep("results")}
              onClose={onClose}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
