"use client";

import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

/**
 * Toast notification for non-blocking success/status alerts
 */
export function showToast(
  title: string,
  icon: "success" | "error" | "warning" | "info" = "success"
) {
  if (typeof window === "undefined") return;

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  return Toast.fire({
    icon,
    title,
  });
}

/**
 * Modal alert for important user-facing errors
 */
export function showErrorAlert(title: string, text: string, confirmText = "ঠিক আছে / OK") {
  if (typeof window === "undefined") return;

  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonText: confirmText,
    confirmButtonColor: "#065f46", // emerald-800
    background: "#ffffff",
    customClass: {
      popup: "rounded-2xl shadow-xl font-sans border border-slate-200 text-slate-800",
      confirmButton: "rounded-xl px-5 py-2 text-sm font-semibold text-white shadow-sm cursor-pointer",
      title: "text-lg font-bold text-slate-900",
      htmlContainer: "text-sm text-slate-600",
    },
  });
}

/**
 * Modal alert for informational notices (e.g. demo credentials not configured)
 */
export function showInfoAlert(title: string, text: string, confirmText = "ঠিক আছে / OK") {
  if (typeof window === "undefined") return;

  return Swal.fire({
    icon: "info",
    title,
    text,
    confirmButtonText: confirmText,
    confirmButtonColor: "#065f46", // emerald-800
    background: "#ffffff",
    customClass: {
      popup: "rounded-2xl shadow-xl font-sans border border-slate-200 text-slate-800",
      confirmButton: "rounded-xl px-5 py-2 text-sm font-semibold text-white shadow-sm cursor-pointer",
      title: "text-lg font-bold text-slate-900",
      htmlContainer: "text-sm text-slate-600",
    },
  });
}
