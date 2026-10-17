"use client";

import React, { useState, useRef } from "react";
import { DemoLandParcel } from "@/data/demo-data";
import {
  VerificationSubmission,
  VerificationResult,
  compareLandDocument,
} from "@/lib/verification";
import { toBengaliNumerals } from "@/lib/formatters";
import VerificationReport from "./VerificationReport";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import type { DocumentExtractionResult, ExtractedField } from "@/lib/document-extractor";

const CATEGORY_LABELS_EN: Record<string, string> = {
  NO_DISCREPANCIES: "No Discrepancies Found — Verified Match",
  DIFFERENCES_REQUIRE_REVIEW: "Discrepancies Require Detailed Review",
  INSUFFICIENT_INFO: "Insufficient Information for Complete Audit",
};

const FIELD_LABELS_EN: Record<string, string> = {
  ownerName: "Owner / Seller Name",
  district: "District",
  upazila: "Upazila",
  mouza: "Mouza",
  khatianNumber: "Khatian Number",
  khatianType: "Survey Type",
  dagNumber: "Dag (Plot) Number",
  recordedArea: "Land Area & Unit",
};

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
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
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

  const [result, setResult] = useState<VerificationResult | null>(null);
  const [savedHistoryId, setSavedHistoryId] = useState<string | null>(null);
  const [isSavingHistory, setIsSavingHistory] = useState<boolean>(false);
  const [saveHistoryError, setSaveHistoryError] = useState<string | null>(null);

  // Upload and Gemini extraction state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [extractionNotice, setExtractionNotice] = useState<string | null>(null);
  const [extractionResult, setExtractionResult] = useState<DocumentExtractionResult | null>(null);
  const [unconfiguredNotice, setUnconfiguredNotice] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClearUpload = () => {
    setUploadFile(null);
    setExtractionResult(null);
    setExtractionError(null);
    setExtractionNotice(null);
    setUnconfiguredNotice(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelected = async (file: File) => {
    setExtractionError(null);
    setExtractionNotice(null);
    setUnconfiguredNotice(null);

    const validMimes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    const validExts = [".jpg", ".jpeg", ".png", ".webp", ".pdf"];
    const name = file.name.toLowerCase();
    const hasValidExt = validExts.some((ext) => name.endsWith(ext));
    const hasValidMime = validMimes.includes(file.type);

    if (!hasValidMime && !hasValidExt) {
      setExtractionError(
        language === "en"
          ? "Invalid file type. Only JPEG, PNG, WebP and PDF files are supported."
          : "অননুমোদিত ফাইল ফরম্যাট। শুধুমাত্র JPEG, PNG, WebP ছবি অথবা PDF ফাইল আপলোড করা যাবে।"
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setExtractionError(
        language === "en"
          ? "File size exceeds 5MB limit. Please upload a smaller file."
          : "ফাইলের আকার ৫ মেগাবাইটের বেশি। অনুগ্রহ করে ৫ মেগাবাইট বা তার ছোট ফাইল আপলোড করুন।"
      );
      return;
    }

    setUploadFile(file);
    setIsExtracting(true);

    try {
      const payload = new FormData();
      payload.append("file", file);

      const response = await fetch("/api/verify/extract-document", {
        method: "POST",
        body: payload,
      });

      const data = await response.json();

      if (response.status === 503 && (data.code === "GEMINI_NOT_CONFIGURED" || data.error === "GEMINI_NOT_CONFIGURED")) {
        setUnconfiguredNotice(
          language === "en"
            ? (data.message || t.modal.geminiNotConfiguredNotice)
            : (data.messageBn || t.modal.geminiNotConfiguredNotice)
        );
        setIsExtracting(false);
        return;
      }

      if (!response.ok || !data.success) {
        const errorText =
          language === "en"
            ? (data.message || t.modal.uploadFailedDesc)
            : (data.messageBn || data.message || t.modal.uploadFailedDesc);
        setExtractionError(errorText);
        setIsExtracting(false);
        return;
      }

      const ext = data.data as DocumentExtractionResult;
      setExtractionResult(ext);

      // Populate form fields with non-null extracted values
      setFormData((prev) => ({
        ...prev,
        ownerName: ext.ownerName.value ?? prev.ownerName,
        district: ext.district.value ?? prev.district,
        upazila: ext.upazila.value ?? prev.upazila,
        mouza: ext.mouza.value ?? prev.mouza,
        khatianNumber: ext.khatianNumber.value ?? prev.khatianNumber,
        khatianType: ext.khatianType.value ?? prev.khatianType,
        dagNumber: ext.dagNumber.value ?? prev.dagNumber,
        recordedArea: ext.recordedArea.value ?? prev.recordedArea,
        areaUnit: ext.areaUnit.value ?? prev.areaUnit,
      }));

      // Clear errors for populated fields
      setErrors((prev) => {
        const copy = { ...prev };
        if (ext.ownerName.value) delete copy.ownerName;
        if (ext.district.value) delete copy.district;
        if (ext.upazila.value) delete copy.upazila;
        if (ext.mouza.value) delete copy.mouza;
        if (ext.khatianNumber.value) delete copy.khatianNumber;
        if (ext.khatianType.value) delete copy.khatianType;
        if (ext.dagNumber.value) delete copy.dagNumber;
        if (ext.recordedArea.value) delete copy.recordedArea;
        return copy;
      });

      // Check if any field could not be read
      const unreadableFields = Object.entries(ext).filter(
        ([k, v]) => k !== "notes" && typeof v === "object" && v !== null && (v as { value: unknown }).value === null
      );

      if (unreadableFields.length > 0) {
        setExtractionNotice(
          language === "en" ? t.modal.uploadUnreadableWarning : t.modal.uploadUnreadableWarning
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      setExtractionError(
        language === "en"
          ? `Document extraction failed (${msg}). Please enter deed details manually below.`
          : `দলিল পাঠোদ্ধার সম্ভব হয়নি (${msg})। অনুগ্রহ করে নিচের তথ্যগুলো নিজে পূরণ করুন।`
      );
    } finally {
      setIsExtracting(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const renderFieldExtractionBadge = (fieldKey: keyof DocumentExtractionResult) => {
    if (!extractionResult) return null;
    const field = extractionResult[fieldKey];
    if (!field || typeof field !== "object" || !("confidence" in field)) return null;

    if (field.value !== null) {
      const confText =
        field.confidence === "HIGH"
          ? (language === "en" ? "High" : "উচ্চ")
          : field.confidence === "MEDIUM"
          ? (language === "en" ? "Med" : "মাঝারি")
          : (language === "en" ? "Low" : "স্বল্প");

      const dotColor =
        field.confidence === "HIGH"
          ? "bg-emerald-600"
          : field.confidence === "MEDIUM"
          ? "bg-amber-500"
          : "bg-rose-500";

      return (
        <span
          className="inline-flex items-center gap-1 text-[10px] sm:text-2xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap bg-emerald-50 text-emerald-800 border border-emerald-200/90 shrink-0"
          title={
            language === "en"
              ? `Extracted by Gemini AI (Confidence: ${field.confidence})`
              : `Gemini AI দ্বারা উদ্ধারকৃত (নির্ভুলতা: ${confText})`
          }
        >
          <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
          <span>{language === "en" ? "AI Extracted" : "AI উদ্ধার"} • {confText}</span>
        </span>
      );
    }

    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] sm:text-2xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap bg-amber-50 text-amber-800 border border-amber-200/90 shrink-0"
        title={
          language === "en"
            ? "Could not be read clearly from document. Please enter manually."
            : "দলিল থেকে স্পষ্টভাবে পড়া যায়নি। অনুগ্রহ করে নিজে পূরণ করুন।"
        }
      >
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        <span>{language === "en" ? "Unreadable" : "অপাঠ্য"}</span>
      </span>
    );
  };

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
    setSavedHistoryId(null);
    setIsSavingHistory(false);
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

  // Save completed verification to history
  const saveToHistory = async (verificationResult: VerificationResult) => {
    if (!isAuthenticated) return;
    setIsSavingHistory(true);
    setSaveHistoryError(null);

    try {
      const res = await fetch("/api/verify/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submitted: formData,
          verification: {
            category: verificationResult.category,
            categoryLabelBn: verificationResult.categoryLabelBn,
            summaryBn: verificationResult.summaryBn,
            advisoryBn: verificationResult.advisoryBn,
            matchCount: verificationResult.matchCount,
            mismatchCount: verificationResult.mismatchCount,
            missingCount: verificationResult.missingCount,
            discrepancyReasons: verificationResult.discrepancyReasons,
            fieldResults: verificationResult.fieldResults,
          },
          extractedOcr: extractionResult || null,
          documentFilename: uploadFile?.name || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.id) {
          setSavedHistoryId(data.id);
          setSaveHistoryError(null);
        } else {
          setSaveHistoryError(
            language === "en"
              ? "Failed to save verification to history. Invalid server response."
              : "যাচাইকরণ ফলাফল ইতিহাসে সংরক্ষণ করা যায়নি। সার্ভার থেকে সঠিক উত্তর পাওয়া যায়নি।"
          );
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        setSaveHistoryError(
          errData.error ||
            (language === "en"
              ? "Failed to save verification to history."
              : "যাচাইকরণ ফলাফল ইতিহাসে সংরক্ষণ করা যায়নি।")
        );
      }
    } catch (err) {
      console.warn("Could not save verification history:", err);
      setSaveHistoryError(
        language === "en"
          ? "Network error: could not connect to server to save verification."
          : "নেটওয়ার্ক সমস্যার কারণে যাচাইকরণ ফলাফল ইতিহাসে সংরক্ষণ করা যায়নি।"
      );
    } finally {
      setIsSavingHistory(false);
    }
  };

  const handleRetrySaveHistory = () => {
    if (result) {
      saveToHistory(result);
    }
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!currentParcel) return;

    const verificationResult = compareLandDocument(formData, currentParcel);
    setResult(verificationResult);
    setStep("results");
    setSavedHistoryId(null);
    setSaveHistoryError(null);

    // Persist completed verification to history for authenticated users
    if (isAuthenticated) {
      saveToHistory(verificationResult);
    }
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
    <div className="report-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-hidden animate-in fade-in duration-200">
      <div
        className={`report-modal-container relative w-full ${
          step === "report" ? "max-w-4xl" : "max-w-3xl"
        } my-auto rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]`}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header (Hidden on full report view to allow report's own action bar) */}
        {step !== "report" && (
          <div className="no-print flex items-center justify-between border-b border-slate-200 px-4 py-2.5 sm:px-6 sm:py-3 bg-slate-50/90 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-800 text-white shadow-2xs">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {step === "form" ? t.modal.formTitle : t.modal.resultsTitle}
                  </h3>
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] sm:text-2xs font-semibold text-emerald-800 border border-emerald-200/80 whitespace-nowrap">
                    {t.modal.demoBadge}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 truncate mt-0.5">
                  {step === "form"
                    ? t.modal.formSubtitle
                    : t.modal.resultsSubtitle}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              type="button"
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition focus:outline-none shrink-0 cursor-pointer ml-2"
              aria-label={t.modal.closeBtn}
            >
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Modal Body & Step Content */}
        {step === "form" ? (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
              {/* Reference Parcel Selector Card */}
              <div className="rounded-xl border border-emerald-200/90 bg-emerald-50/40 p-3 sm:p-3.5 space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <label htmlFor="reference-parcel-select" className="text-2xs sm:text-xs font-bold text-emerald-950 uppercase tracking-wide">
                    {language === "en" ? "Step 1: Select Reference Land for Comparison" : "ধাপ ১: তুলনার জন্য রেফারেন্স জমি নির্বাচন করুন"}
                  </label>
                  <button
                    type="button"
                    onClick={() => currentParcel && prefillFromParcel(currentParcel)}
                    className="text-2xs font-semibold text-emerald-800 hover:text-emerald-950 underline self-start sm:self-auto cursor-pointer"
                  >
                    {language === "en" ? "Refill with Reference Values" : "রেফারেন্স মান দিয়ে পুনরায় পূরণ"}
                  </button>
                </div>

                <select
                  id="reference-parcel-select"
                  value={selectedParcelId}
                  onChange={(e) => handleParcelSelectChange(e.target.value)}
                  className="h-9 sm:h-9.5 w-full rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-900 shadow-2xs focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 cursor-pointer"
                >
                  {parcels.map((parcel) => (
                    <option key={parcel.id} value={parcel.id}>
                      {language === "en"
                        ? `Dag ${parcel.dagNumber} | Khatian ${parcel.khatianNumber} (${parcel.khatianType}) — ${parcel.mouzaEn}, ${parcel.upazilaEn}, ${parcel.districtEn} [Owner: ${parcel.ownership.ownerNameEn}]`
                        : `দাগ নং ${parcel.dagNumber} | খতিয়ান ${parcel.khatianNumber} (${parcel.khatianType}) — ${parcel.mouza}, ${parcel.upazila}, ${parcel.district} [মালিক: ${parcel.ownership.ownerName}]`}
                    </option>
                  ))}
                </select>

                <p className="text-[11px] sm:text-xs text-emerald-800/80 leading-relaxed">
                  {language === "en"
                    ? "* Selected parcel details have been auto-populated below. You can edit any field to test discrepancy detection."
                    : "* নির্বাচিত জমির বিদ্যমান তথ্য নিচে স্বয়ংক্রিয়ভাবে বসানো হয়েছে। আপনি মানগুলো পরিবর্তন করে অমিল পরীক্ষার ফলাফল যাচাই করতে পারেন।"}
                </p>
              </div>

              {/* Quick Preset Buttons for Evaluation */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="font-semibold text-slate-500 text-2xs sm:text-xs">{t.modal.quickPresets}</span>
                <button
                  type="button"
                  onClick={() => applyPreset("match")}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-2xs sm:text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer"
                >
                  {t.modal.presetMatch}
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("ownerMismatch")}
                  className="rounded-lg border border-rose-200 bg-rose-50/60 px-2 py-0.5 text-2xs sm:text-xs font-medium text-rose-800 hover:bg-rose-100/60 shadow-2xs cursor-pointer"
                >
                  {t.modal.presetOwnerMismatch}
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("dagMismatch")}
                  className="rounded-lg border border-amber-200 bg-amber-50/60 px-2 py-0.5 text-2xs sm:text-xs font-medium text-amber-800 hover:bg-amber-100/60 shadow-2xs cursor-pointer"
                >
                  {t.modal.presetDagMismatch}
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("areaMismatch")}
                  className="rounded-lg border border-amber-200 bg-amber-50/60 px-2 py-0.5 text-2xs sm:text-xs font-medium text-amber-800 hover:bg-amber-100/60 shadow-2xs cursor-pointer"
                >
                  {t.modal.presetAreaMismatch}
                </button>
              </div>

              {/* Smart Document Extraction Card (Gemini AI) */}
              <div className="rounded-xl border border-dashed border-emerald-300 bg-linear-to-b from-emerald-50/50 via-emerald-50/20 to-white p-3 sm:p-3.5 space-y-2.5 transition">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-800 text-white shadow-2xs">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-emerald-950">
                        {t.modal.uploadDeedTitle}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-500">
                        {t.modal.uploadDeedDesc}
                      </p>
                    </div>
                  </div>
                  {uploadFile && (
                    <button
                      type="button"
                      onClick={handleClearUpload}
                      className="text-2xs font-semibold text-rose-700 hover:text-rose-900 underline shrink-0 cursor-pointer"
                    >
                      {t.modal.clearUploadBtn}
                    </button>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  id="deed-file-input"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelected(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                {/* Dropzone area */}
                {!uploadFile && (
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed p-3.5 sm:p-4 text-center cursor-pointer transition ${
                      dragActive
                        ? "border-emerald-600 bg-emerald-100/60 ring-2 ring-emerald-500/20"
                        : "border-emerald-300 hover:border-emerald-500 bg-white hover:bg-emerald-50/30"
                    }`}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-800">
                        {t.modal.uploadDropPrompt}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {t.modal.uploadFormatsHint}
                      </p>
                    </div>
                  </div>
                )}

                {/* Processing Spinner */}
                {isExtracting && (
                  <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-emerald-950 animate-pulse">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent shrink-0" />
                    <span className="text-xs font-medium">
                      {t.modal.uploadAnalyzing}
                    </span>
                  </div>
                )}

                {/* Unconfigured GEMINI_API_KEY Notice */}
                {unconfiguredNotice && (
                  <div className="rounded-xl border border-amber-300 bg-amber-50/90 p-3 text-amber-950 flex items-start gap-2.5">
                    <svg className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <div className="text-xs leading-relaxed space-y-0.5">
                      <p className="font-bold text-amber-900">{language === "en" ? "Gemini Extraction Notice" : "Gemini এআই সংক্রান্ত তথ্য"}</p>
                      <p>{unconfiguredNotice}</p>
                    </div>
                  </div>
                )}

                {/* Extraction Error Alert */}
                {extractionError && (
                  <div className="rounded-xl border border-rose-300 bg-rose-50/90 p-3 text-rose-950 flex items-start gap-2.5">
                    <svg className="h-4 w-4 text-rose-700 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <div className="text-xs leading-relaxed space-y-0.5 flex-1">
                      <p className="font-bold text-rose-900">{t.modal.uploadFailedTitle}</p>
                      <p>{extractionError}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearUpload}
                      className="text-2xs font-semibold text-rose-700 hover:text-rose-900 underline shrink-0 cursor-pointer"
                    >
                      {language === "en" ? "Dismiss" : "বাতিল"}
                    </button>
                  </div>
                )}

                {/* Extraction Success & Review Summary Card */}
                {extractionResult && (
                  <div className="rounded-xl border border-emerald-300 bg-linear-to-b from-emerald-50/90 via-emerald-50/50 to-white p-3 sm:p-3.5 space-y-2.5 shadow-2xs">
                    {/* Header: Title, Filename & Reset Action */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold shadow-2xs">
                          ✓
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-emerald-950 truncate">
                            {t.modal.uploadSuccessTitle}
                          </p>
                          <p className="text-[11px] text-emerald-800/80 truncate">
                            {uploadFile ? uploadFile.name : (language === "en" ? "Deed Document" : "দলিল নথি")}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearUpload}
                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-white px-2.5 py-1 text-2xs font-semibold text-emerald-800 hover:bg-emerald-50 hover:text-emerald-950 transition shadow-2xs shrink-0 cursor-pointer"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        <span>{t.modal.clearUploadBtn}</span>
                      </button>
                    </div>

                    {/* Compact Confidence Pill Overview */}
                    <div className="pt-1.5 border-t border-emerald-200/70">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[10px] sm:text-2xs font-bold text-emerald-950 uppercase tracking-wide">
                          {language === "en" ? "Extracted Fields Confidence:" : "উদ্ধারকৃত তথ্যের নির্ভরযোগ্যতা স্তর:"}
                        </p>
                        <span className="text-[10px] sm:text-2xs text-emerald-700 font-medium">
                          {language === "en" ? "Editable below" : "নিচে সম্পাদনাযোগ্য"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 text-2xs">
                        {Object.entries(extractionResult)
                          .filter(([key]) => key !== "notes")
                          .map(([key, field]) => {
                            const fieldObj = field as ExtractedField;
                            const isVal = fieldObj && fieldObj.value !== null;
                            const fieldNameLabels: Record<string, string> = {
                              ownerName: language === "en" ? "Owner" : "মালিক",
                              district: language === "en" ? "District" : "জেলা",
                              upazila: language === "en" ? "Upazila" : "উপজেলা",
                              mouza: language === "en" ? "Mouza" : "মৌজা",
                              khatianNumber: language === "en" ? "Khatian" : "খতিয়ান",
                              khatianType: language === "en" ? "Survey" : "জরিপ",
                              dagNumber: language === "en" ? "Dag" : "দাগ",
                              recordedArea: language === "en" ? "Area" : "পরিমাণ",
                              areaUnit: language === "en" ? "Unit" : "একক",
                            };
                            const confText =
                              fieldObj.confidence === "HIGH"
                                ? (language === "en" ? "High" : "উচ্চ")
                                : fieldObj.confidence === "MEDIUM"
                                ? (language === "en" ? "Med" : "মাঝারি")
                                : (language === "en" ? "Low" : "স্বল্প");

                            return (
                              <span
                                key={key}
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[11px] ${
                                  !isVal
                                    ? "bg-slate-100 text-slate-500 border-slate-200"
                                    : fieldObj.confidence === "HIGH"
                                    ? "bg-emerald-100/70 text-emerald-900 border-emerald-300 font-medium"
                                    : fieldObj.confidence === "MEDIUM"
                                    ? "bg-amber-100/70 text-amber-900 border-amber-300 font-medium"
                                    : "bg-rose-100/70 text-rose-900 border-rose-300 font-medium"
                                }`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    !isVal
                                      ? "bg-slate-400"
                                      : fieldObj.confidence === "HIGH"
                                      ? "bg-emerald-600"
                                      : fieldObj.confidence === "MEDIUM"
                                      ? "bg-amber-600"
                                      : "bg-rose-600"
                                  }`}
                                />
                                <span className="font-semibold">{fieldNameLabels[key] || key}:</span>
                                <span>{isVal ? confText : (language === "en" ? "Unreadable" : "অপাঠ্য")}</span>
                              </span>
                            );
                          })}
                      </div>
                    </div>

                    {/* Notice for unreadable / partial fields */}
                    {extractionNotice && (
                      <div className="flex items-start gap-2 rounded-lg bg-amber-50/90 border border-amber-200 px-2.5 py-1.5 text-2xs text-amber-900 leading-relaxed">
                        <svg className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{extractionNotice}</span>
                      </div>
                    )}

                    {/* Review instruction prompt */}
                    <div className="rounded-lg bg-white/80 border border-emerald-200/80 px-2.5 py-1.5 text-2xs text-slate-700 flex items-center justify-between">
                      <span>{t.modal.extractedReviewNotice}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Review & Edit Form Grid */}
              <div className="space-y-3">
                <div className="border-b border-slate-100 pb-1.5 flex items-center justify-between">
                  <h4 className="text-2xs sm:text-xs font-bold text-slate-700 uppercase tracking-wide">
                    {language === "en" ? "Step 2: Review & Edit Submitted Deed Details" : "ধাপ ২: দাখিলকৃত দলিলের তথ্য যাচাই ও সম্পাদনা"}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    <span className="text-rose-500 font-bold">*</span> {language === "en" ? "Required fields" : "আবশ্যক ক্ষেত্র"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
                  {/* Row 1: Owner Name (Full Width) */}
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between gap-1.5 mb-1 min-h-[1.25rem]">
                      <label className="text-2xs sm:text-xs font-semibold text-slate-700 truncate">
                        {t.modal.fieldOwner} <span className="text-rose-500 font-bold">*</span>
                      </label>
                      {renderFieldExtractionBadge("ownerName")}
                    </div>
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => handleInputChange("ownerName", e.target.value)}
                      placeholder={language === "en" ? "Enter owner name" : "মালিকের নাম লিখুন"}
                      className={`h-9 sm:h-9.5 w-full rounded-xl border px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-900 bg-white shadow-2xs transition focus:outline-none focus:ring-1 ${
                        errors.ownerName
                          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400 bg-rose-50/20"
                          : "border-slate-200 focus:border-emerald-700 focus:ring-emerald-700"
                      }`}
                    />
                    {errors.ownerName && (
                      <p className="mt-0.5 text-2xs text-rose-600 font-medium">{errors.ownerName}</p>
                    )}
                  </div>

                  {/* Row 2: District */}
                  <div className="col-span-1">
                    <div className="flex items-center justify-between gap-1.5 mb-1 min-h-[1.25rem]">
                      <label className="text-2xs sm:text-xs font-semibold text-slate-700 truncate">
                        {t.modal.fieldDistrict} <span className="text-rose-500 font-bold">*</span>
                      </label>
                      {renderFieldExtractionBadge("district")}
                    </div>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => handleInputChange("district", e.target.value)}
                      placeholder={language === "en" ? "e.g. Dhaka" : "যেমন: ঢাকা"}
                      className={`h-9 sm:h-9.5 w-full rounded-xl border px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-900 bg-white shadow-2xs transition focus:outline-none focus:ring-1 ${
                        errors.district
                          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400 bg-rose-50/20"
                          : "border-slate-200 focus:border-emerald-700 focus:ring-emerald-700"
                      }`}
                    />
                    {errors.district && (
                      <p className="mt-0.5 text-2xs text-rose-600 font-medium">{errors.district}</p>
                    )}
                  </div>

                  {/* Row 2: Upazila */}
                  <div className="col-span-1">
                    <div className="flex items-center justify-between gap-1.5 mb-1 min-h-[1.25rem]">
                      <label className="text-2xs sm:text-xs font-semibold text-slate-700 truncate">
                        {t.modal.fieldUpazila} <span className="text-rose-500 font-bold">*</span>
                      </label>
                      {renderFieldExtractionBadge("upazila")}
                    </div>
                    <input
                      type="text"
                      value={formData.upazila}
                      onChange={(e) => handleInputChange("upazila", e.target.value)}
                      placeholder={language === "en" ? "e.g. Savar" : "যেমন: সাভার"}
                      className={`h-9 sm:h-9.5 w-full rounded-xl border px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-900 bg-white shadow-2xs transition focus:outline-none focus:ring-1 ${
                        errors.upazila
                          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400 bg-rose-50/20"
                          : "border-slate-200 focus:border-emerald-700 focus:ring-emerald-700"
                      }`}
                    />
                    {errors.upazila && (
                      <p className="mt-0.5 text-2xs text-rose-600 font-medium">{errors.upazila}</p>
                    )}
                  </div>

                  {/* Row 3: Mouza */}
                  <div className="col-span-1">
                    <div className="flex items-center justify-between gap-1.5 mb-1 min-h-[1.25rem]">
                      <label className="text-2xs sm:text-xs font-semibold text-slate-700 truncate">
                        {t.modal.fieldMouza} <span className="text-rose-500 font-bold">*</span>
                      </label>
                      {renderFieldExtractionBadge("mouza")}
                    </div>
                    <input
                      type="text"
                      value={formData.mouza}
                      onChange={(e) => handleInputChange("mouza", e.target.value)}
                      placeholder={language === "en" ? "e.g. Birulia" : "যেমন: বিরুলিয়া"}
                      className={`h-9 sm:h-9.5 w-full rounded-xl border px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-900 bg-white shadow-2xs transition focus:outline-none focus:ring-1 ${
                        errors.mouza
                          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400 bg-rose-50/20"
                          : "border-slate-200 focus:border-emerald-700 focus:ring-emerald-700"
                      }`}
                    />
                    {errors.mouza && (
                      <p className="mt-0.5 text-2xs text-rose-600 font-medium">{errors.mouza}</p>
                    )}
                  </div>

                  {/* Row 3: Survey Type (Khatian Type) */}
                  <div className="col-span-1">
                    <div className="flex items-center justify-between gap-1.5 mb-1 min-h-[1.25rem]">
                      <label className="text-2xs sm:text-xs font-semibold text-slate-700 truncate">
                        {t.modal.fieldKhatianType} <span className="text-rose-500 font-bold">*</span>
                      </label>
                      {renderFieldExtractionBadge("khatianType")}
                    </div>
                    <select
                      value={formData.khatianType}
                      onChange={(e) => handleInputChange("khatianType", e.target.value)}
                      className="h-9 sm:h-9.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-900 shadow-2xs focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 cursor-pointer"
                    >
                      <option value="বিএস (BS)">বিএস (BS)</option>
                      <option value="আরএস (RS)">আরএস (RS)</option>
                      <option value="এসএ (SA)">এসএ (SA)</option>
                      <option value="সিএস (CS)">সিএস (CS)</option>
                      <option value="সিটি জরিপ (City Survey)">সিটি জরিপ (City Survey)</option>
                    </select>
                    {errors.khatianType && (
                      <p className="mt-0.5 text-2xs text-rose-600 font-medium">{errors.khatianType}</p>
                    )}
                  </div>

                  {/* Row 4: Khatian Number */}
                  <div className="col-span-1">
                    <div className="flex items-center justify-between gap-1.5 mb-1 min-h-[1.25rem]">
                      <label className="text-2xs sm:text-xs font-semibold text-slate-700 truncate">
                        {t.modal.fieldKhatianNumber} <span className="text-rose-500 font-bold">*</span>
                      </label>
                      {renderFieldExtractionBadge("khatianNumber")}
                    </div>
                    <input
                      type="text"
                      value={formData.khatianNumber}
                      onChange={(e) => handleInputChange("khatianNumber", e.target.value)}
                      placeholder="312 / ৩১২"
                      className={`h-9 sm:h-9.5 w-full rounded-xl border px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-900 bg-white shadow-2xs transition focus:outline-none focus:ring-1 bn-num ${
                        errors.khatianNumber
                          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400 bg-rose-50/20"
                          : "border-slate-200 focus:border-emerald-700 focus:ring-emerald-700"
                      }`}
                    />
                    {errors.khatianNumber && (
                      <p className="mt-0.5 text-2xs text-rose-600 font-medium">{errors.khatianNumber}</p>
                    )}
                  </div>

                  {/* Row 4: Dag (Plot) Number */}
                  <div className="col-span-1">
                    <div className="flex items-center justify-between gap-1.5 mb-1 min-h-[1.25rem]">
                      <label className="text-2xs sm:text-xs font-semibold text-slate-700 truncate">
                        {t.modal.fieldDagNumber} <span className="text-rose-500 font-bold">*</span>
                      </label>
                      {renderFieldExtractionBadge("dagNumber")}
                    </div>
                    <input
                      type="text"
                      value={formData.dagNumber}
                      onChange={(e) => handleInputChange("dagNumber", e.target.value)}
                      placeholder="845 / ৮৪৫"
                      className={`h-9 sm:h-9.5 w-full rounded-xl border px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-900 bg-white shadow-2xs transition focus:outline-none focus:ring-1 bn-num ${
                        errors.dagNumber
                          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400 bg-rose-50/20"
                          : "border-slate-200 focus:border-emerald-700 focus:ring-emerald-700"
                      }`}
                    />
                    {errors.dagNumber && (
                      <p className="mt-0.5 text-2xs text-rose-600 font-medium">{errors.dagNumber}</p>
                    )}
                  </div>

                  {/* Row 5: Recorded Area & Unit (Full Width with side-by-side number + unit) */}
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between gap-1.5 mb-1 min-h-[1.25rem]">
                      <label className="text-2xs sm:text-xs font-semibold text-slate-700 truncate">
                        {t.modal.fieldRecordedArea} <span className="text-rose-500 font-bold">*</span>
                      </label>
                      {renderFieldExtractionBadge("recordedArea")}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={formData.recordedArea}
                          onChange={(e) => handleInputChange("recordedArea", e.target.value)}
                          placeholder="7.5 / ৭.৫"
                          className={`h-9 sm:h-9.5 w-full rounded-xl border px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-900 bg-white shadow-2xs transition focus:outline-none focus:ring-1 bn-num ${
                            errors.recordedArea
                              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400 bg-rose-50/20"
                              : "border-slate-200 focus:border-emerald-700 focus:ring-emerald-700"
                          }`}
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <select
                          value={formData.areaUnit}
                          onChange={(e) => handleInputChange("areaUnit", e.target.value)}
                          className="h-9 sm:h-9.5 w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm font-medium text-slate-900 shadow-2xs focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 cursor-pointer"
                        >
                          <option value="শতক">{language === "en" ? "Decimal (শতক)" : "শতক (Decimal)"}</option>
                          <option value="কাঠা">{language === "en" ? "Katha (কাঠা)" : "কাঠা (Katha)"}</option>
                          <option value="বিঘা">{language === "en" ? "Bigha (বিঘা)" : "বিঘা (Bigha)"}</option>
                          <option value="একর">{language === "en" ? "Acre (একর)" : "একর (Acre)"}</option>
                        </select>
                      </div>
                    </div>
                    {errors.recordedArea && (
                      <p className="mt-0.5 text-2xs text-rose-600 font-medium">{errors.recordedArea}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Pinned Form Footer Actions (Always visible, responsive, zero horizontal overflow) */}
            <div className="no-print shrink-0 border-t border-slate-200 bg-slate-50/95 px-4 py-2.5 sm:px-6 sm:py-3 flex items-center justify-between sm:justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100/80 transition shadow-2xs cursor-pointer flex-1 sm:flex-initial text-center justify-center"
              >
                {language === "en" ? "Cancel" : "বাতিল করুন"}
              </button>
              <button
                type="submit"
                id="btn-verify-submit"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-800 px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-emerald-900 transition active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-1 cursor-pointer flex-2 sm:flex-initial"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <span>{language === "en" ? "Verify & Compare" : "যাচাই ও তুলনা করুন"}</span>
              </button>
            </div>
          </form>
        ) : step === "results" && result ? (
          /* Results View with Pinned Action Footer */
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* Overall Category Status Banner */}
              <div
                className={`rounded-xl border p-3.5 sm:p-4 ${
                  result.category === "NO_DISCREPANCIES"
                    ? "border-emerald-200 bg-emerald-50/80 text-emerald-950"
                    : result.category === "DIFFERENCES_REQUIRE_REVIEW"
                    ? "border-rose-200 bg-rose-50/80 text-rose-950"
                    : "border-amber-200 bg-amber-50/80 text-amber-950"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-bold text-xs ${
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
                      <h4 className="text-sm sm:text-base font-bold leading-tight">
                        {language === "en" ? (CATEGORY_LABELS_EN[result.category] || result.categoryLabelBn) : result.categoryLabelBn}
                      </h4>
                      <span className="text-2xs px-2 py-0.5 rounded-full bg-white/70 font-semibold border border-current/20">
                        {result.category === "NO_DISCREPANCIES"
                          ? (language === "en" ? "All Matched" : "সব মিল রয়েছে")
                          : (language === "en" ? `${result.mismatchCount} Discrepancies` : `${toBengaliNumerals(result.mismatchCount)}টি অমিল`)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                      {result.summaryBn}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verification Persistence Notice */}
              {isAuthenticated ? (
                isSavingHistory ? (
                  <div className="flex items-center justify-between text-2xs px-3 py-2 rounded-xl border bg-amber-50/80 border-amber-200/90 text-amber-900 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                      <span className="font-medium">
                        {language === "en"
                          ? "Saving to your verification history..."
                          : "আপনার যাচাইকরণ ইতিহাসে সংরক্ষণ করা হচ্ছে..."}
                      </span>
                    </div>
                  </div>
                ) : saveHistoryError ? (
                  <div className="flex items-center justify-between text-2xs px-3 py-2 rounded-xl border bg-rose-50 border-rose-200 text-rose-900 shadow-2xs gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                      <span className="font-medium truncate">
                        {saveHistoryError}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRetrySaveHistory}
                      className="font-bold text-rose-700 hover:text-rose-900 underline underline-offset-2 ml-2 shrink-0 cursor-pointer"
                    >
                      {language === "en" ? "Retry Save ↻" : "পুনরায় সংরক্ষণ করুন ↻"}
                    </button>
                  </div>
                ) : savedHistoryId ? (
                  <div className="flex items-center justify-between text-2xs px-3 py-2 rounded-xl border bg-emerald-50/80 border-emerald-200/90 text-emerald-950 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-600" />
                      <span className="font-medium">
                        {language === "en"
                          ? "Verification saved to your permanent history."
                          : "যাচাইকরণ ফলাফল আপনার স্থায়ী ইতিহাসে সংরক্ষিত হয়েছে।"}
                      </span>
                    </div>
                    <a
                      href="/dashboard/history"
                      className="font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-2 ml-2 shrink-0"
                    >
                      {language === "en" ? "View History →" : "ইতিহাস দেখুন →"}
                    </a>
                  </div>
                ) : null
              ) : (
                <div className="flex items-center justify-between text-2xs px-3 py-2 rounded-xl border bg-slate-50/90 border-slate-200/90 text-slate-600 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    <span className="font-medium">
                      {language === "en"
                        ? "Log in to permanently save verification results to your history."
                        : "স্থায়ী ইতিহাসে যাচাইকরণ ফলাফল সংরক্ষণ করতে লগইন করুন।"}
                    </span>
                  </div>
                  <a
                    href="/login"
                    className="font-semibold text-emerald-700 hover:text-emerald-900 underline underline-offset-2 ml-2 shrink-0"
                  >
                    {language === "en" ? "Log In →" : "লগইন করুন →"}
                  </a>
                </div>
              )}

              {/* Side-by-Side Field Comparison Table */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-2xs sm:text-xs font-bold text-slate-700 uppercase tracking-wide">
                    {language === "en" ? "Field-Level Comparative Audit" : "ক্ষেত্রভিত্তিক তুলনামূলক নিরীক্ষা"}
                  </h4>
                  <span className="text-2xs text-slate-400">
                    {language === "en"
                      ? `Reference: Dag No. ${result.referenceParcel.dagNumber} (${result.referenceParcel.mouzaEn})`
                      : `রেফারেন্স: দাগ নং ${result.referenceParcel.dagNumber} (${result.referenceParcel.mouza})`}
                  </span>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold text-2xs sm:text-xs">
                        <tr>
                          <th className="px-3 py-2">
                            {language === "en" ? "Audited Field" : "তালিকাকৃত ক্ষেত্র"}
                          </th>
                          <th className="px-3 py-2">
                            {language === "en" ? "Reference Record" : "রেফারেন্স রেকর্ড"}
                          </th>
                          <th className="px-3 py-2">
                            {language === "en" ? "Your Submitted Info" : "আপনার দাখিলকৃত তথ্য"}
                          </th>
                          <th className="px-3 py-2 text-center min-w-[80px]">
                            {language === "en" ? "Status" : "অবস্থা"}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {result.fieldResults.map((field) => (
                          <tr key={field.fieldName} className="hover:bg-slate-50/50">
                            <td className="px-3 py-2 sm:py-2.5 font-semibold text-slate-800 whitespace-nowrap">
                              {language === "en" ? (FIELD_LABELS_EN[field.fieldName] || field.fieldLabelBn) : field.fieldLabelBn}
                            </td>
                            <td className="px-3 py-2 sm:py-2.5 text-slate-600 bn-num">
                              {field.referenceValue}
                            </td>
                            <td
                              className={`px-3 py-2 sm:py-2.5 font-medium bn-num ${
                                field.status === "MISMATCH"
                                  ? "text-rose-700 bg-rose-50/40 font-semibold"
                                  : field.status === "MISSING"
                                  ? "text-slate-400 italic"
                                  : "text-slate-900"
                              }`}
                            >
                              {field.submittedValue}
                            </td>
                            <td className="px-3 py-2 sm:py-2.5 text-center">
                              {field.status === "MATCH" && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-2xs font-semibold text-emerald-800 border border-emerald-200">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                                  {language === "en" ? "Match" : "মিল রয়েছে"}
                                </span>
                              )}
                              {field.status === "MISMATCH" && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-2xs font-semibold text-rose-800 border border-rose-200">
                                  <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                                  {language === "en" ? "Mismatch" : "অমিল"}
                                </span>
                              )}
                              {field.status === "MISSING" && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-2xs font-semibold text-slate-700 border border-slate-200">
                                  {language === "en" ? "No Data" : "তথ্য নেই"}
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
                <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 sm:p-3.5 space-y-1.5">
                  <h4 className="text-2xs sm:text-xs font-bold text-rose-950 uppercase tracking-wide flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    {language === "en"
                      ? `Identified Discrepancy Details (${result.discrepancyReasons.length}):`
                      : `চিহ্নিত অসঙ্গতি ও পার্থক্যের বিবরণ (${toBengaliNumerals(result.discrepancyReasons.length)}টি):`}
                  </h4>
                  <ul className="space-y-1 text-xs text-rose-900 pl-5 list-disc leading-relaxed">
                    {result.discrepancyReasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Legal & Civic Tech Advisory Notice */}
              <div className="rounded-xl bg-slate-100/80 border border-slate-200 p-3 text-xs text-slate-700 leading-relaxed space-y-1">
                <p className="font-semibold text-slate-900">
                  {language === "en" ? "Important Legal & Civic Advisory:" : "গুরুত্বপূর্ণ আইনি ও নাগরিক পরামর্শ:"}
                </p>
                <p>{result.advisoryBn}</p>
              </div>
            </div>

            {/* Pinned Result Actions Footer */}
            <div className="no-print shrink-0 border-t border-slate-200 bg-slate-50/95 px-4 py-2.5 sm:px-6 sm:py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100/80 transition shadow-2xs cursor-pointer"
              >
                <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                <span>{language === "en" ? "Edit & Re-verify" : "তথ্য সংশোধন করে পুনরায় পরীক্ষা"}</span>
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep("report")}
                  id="btn-view-full-report"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-800 px-3.5 py-2 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-emerald-900 transition active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-1 cursor-pointer flex-1 sm:flex-initial justify-center"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span>{language === "en" ? "Full Report & Save PDF" : "পূর্ণাঙ্গ রিপোর্ট ও PDF সংরক্ষণ"}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100/80 transition cursor-pointer flex-1 sm:flex-initial text-center justify-center"
                >
                  {language === "en" ? "Close" : "সম্পন্ন করুন"}
                </button>
              </div>
            </div>
          </div>
        ) : step === "report" && result ? (
          /* Printable Report View */
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-slate-100/60">
            <VerificationReport
              result={result}
              onBack={() => setStep("results")}
              onClose={onClose}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
