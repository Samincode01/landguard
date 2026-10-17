"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { showToast, showErrorAlert } from "@/lib/alerts";
import { isValidEmail, isValidPhoneNumber, normalizePhoneNumber } from "@/lib/auth-validation";

export default function SignupPage() {
  const { t, language } = useLanguage();
  const { refreshUser } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [occupation, setOccupation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      errors.name = t.auth.nameRequired;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errors.email = t.auth.emailRequired;
    } else if (!isValidEmail(trimmedEmail)) {
      errors.email = t.auth.emailInvalid;
    }

    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
      errors.phone = t.auth.phoneRequired;
    } else {
      const normalized = normalizePhoneNumber(trimmedPhone);
      if (!isValidPhoneNumber(normalized)) {
        errors.phone = t.auth.phoneInvalid;
      }
    }

    if (!occupation.trim() || occupation.trim().length < 2) {
      errors.occupation = t.auth.occupationRequired;
    }

    if (!password) {
      errors.password = t.auth.passwordRequired;
    } else if (password.length < 8) {
      errors.password = t.auth.passwordMinLength;
    }

    if (!confirmPassword) {
      errors.confirmPassword = t.auth.confirmPasswordRequired;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = t.auth.passwordMismatch;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          occupation: occupation.trim(),
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          const duplicateMsg = data?.error || t.auth.duplicateEmailError;
          setFieldErrors((prev) => ({ ...prev, email: duplicateMsg }));
          setGeneralError(duplicateMsg);
          showErrorAlert(
            language === "bn" ? "নিবন্ধন ব্যর্থ হয়েছে" : "Registration Conflict",
            duplicateMsg,
            language === "bn" ? "লগইন করুন" : "Go to Login"
          );
        } else {
          const errorMsg = data?.error || "Registration failed";
          setGeneralError(errorMsg);
          if (data?.errors) {
            setFieldErrors(data.errors);
          }
          showErrorAlert(
            language === "bn" ? "ত্রুটি" : "Error",
            errorMsg
          );
        }
        setIsLoading(false);
        return;
      }

      // Success
      await refreshUser();
      showToast(t.auth.signupSuccess, "success");

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch {
      setGeneralError(t.auth.networkError);
      showErrorAlert(
        language === "bn" ? "সংযোগ ত্রুটি" : "Connection Error",
        t.auth.networkError
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-between">
      {/* Top Navigation Bar */}
      <header className="w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-900 text-white shadow-2xs group-hover:bg-emerald-800 transition">
              <svg
                className="h-5 w-5 text-emerald-300"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 leading-none">
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
              <p className="text-2xs text-slate-500 mt-0.5 hidden sm:block">
                {t.nav.brandSubtitle}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/"
              className="text-xs font-semibold text-slate-600 hover:text-emerald-800 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition"
            >
              ← {t.auth.backToHome}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Authentication Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden my-4">
          
          {/* Left Hero / Brand Highlight Banner */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 p-8 flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700/60 text-emerald-200 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {t.auth.signupBadge}
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white leading-snug">
                  {language === "bn" ? "নিরাপদ জমি যাচাইয়ের নির্ভরযোগ্য সহযোগী" : "Your Trusted Land Due Diligence Gateway"}
                </h2>
                <p className="text-xs text-emerald-100/80 mt-2 leading-relaxed">
                  {t.auth.signupSubtitle}
                </p>
              </div>

              <div className="pt-4 space-y-3.5 border-t border-emerald-800/60">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300/90">
                  {t.auth.trustBadgeTitle}
                </p>
                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-emerald-300">
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-xs text-emerald-50/90">{t.auth.trustPoint1}</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-emerald-300">
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-xs text-emerald-50/90">{t.auth.trustPoint2}</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-emerald-300">
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-xs text-emerald-50/90">{t.auth.trustPoint3}</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 text-[11px] text-emerald-300/80 border-t border-emerald-800/40">
              {t.auth.termsNotice}
            </div>
          </div>

          {/* Right Form Column */}
          <div className="col-span-1 lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full space-y-5">
              
              {/* Form Heading */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {t.auth.signupTitle}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {t.auth.signupSubtitle}
                </p>
              </div>

              {/* General Error Notice */}
              {generalError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 flex items-start gap-2.5 text-rose-800 text-xs animate-in fade-in duration-150">
                  <svg className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{generalError}</span>
                </div>
              )}

              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-slate-800 mb-1">
                    {t.auth.nameLabel} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    placeholder={t.auth.namePlaceholder}
                    className={`w-full rounded-xl border px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition ${
                      fieldErrors.name
                        ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        : "border-slate-300 bg-slate-50/50 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                    }`}
                  />
                  {fieldErrors.name && (
                    <p className="text-rose-600 text-2xs mt-1 font-medium">{fieldErrors.name}</p>
                  )}
                </div>

                {/* Email & Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-slate-800 mb-1">
                      {t.auth.emailLabel} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      placeholder={t.auth.emailPlaceholder}
                      className={`w-full rounded-xl border px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition ${
                        fieldErrors.email
                          ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                          : "border-slate-300 bg-slate-50/50 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                      }`}
                    />
                    {fieldErrors.email && (
                      <p className="text-rose-600 text-2xs mt-1 font-medium">{fieldErrors.email}</p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold text-slate-800 mb-1">
                      {t.auth.phoneLabel} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: "" }));
                      }}
                      placeholder={t.auth.phonePlaceholder}
                      className={`w-full rounded-xl border px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition ${
                        fieldErrors.phone
                          ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                          : "border-slate-300 bg-slate-50/50 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                      }`}
                    />
                    {fieldErrors.phone && (
                      <p className="text-rose-600 text-2xs mt-1 font-medium">{fieldErrors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Occupation Field */}
                <div>
                  <label htmlFor="occupation" className="block text-xs font-semibold text-slate-800 mb-1">
                    {t.auth.occupationLabel} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="occupation"
                    type="text"
                    required
                    value={occupation}
                    onChange={(e) => {
                      setOccupation(e.target.value);
                      if (fieldErrors.occupation) setFieldErrors((prev) => ({ ...prev, occupation: "" }));
                    }}
                    placeholder={t.auth.occupationPlaceholder}
                    className={`w-full rounded-xl border px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition ${
                      fieldErrors.occupation
                        ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        : "border-slate-300 bg-slate-50/50 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                    }`}
                  />
                  {fieldErrors.occupation && (
                    <p className="text-rose-600 text-2xs mt-1 font-medium">{fieldErrors.occupation}</p>
                  )}
                </div>

                {/* Password & Confirm Password Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-xs font-semibold text-slate-800 mb-1">
                      {t.auth.passwordLabel} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: "" }));
                        }}
                        placeholder={t.auth.passwordPlaceholder}
                        className={`w-full rounded-xl border pl-3.5 pr-9 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition ${
                          fieldErrors.password
                            ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                            : "border-slate-300 bg-slate-50/50 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? t.auth.hidePassword : t.auth.showPassword}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                      >
                        {showPassword ? (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <p className="text-rose-600 text-2xs mt-1 font-medium">{fieldErrors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-800 mb-1">
                      {t.auth.confirmPasswordLabel} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (fieldErrors.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
                        }}
                        placeholder={t.auth.confirmPasswordPlaceholder}
                        className={`w-full rounded-xl border pl-3.5 pr-9 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition ${
                          fieldErrors.confirmPassword
                            ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                            : "border-slate-300 bg-slate-50/50 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? t.auth.hidePassword : t.auth.showPassword}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && (
                      <p className="text-rose-600 text-2xs mt-1 font-medium">{fieldErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:bg-emerald-700/60 text-white font-semibold text-sm transition shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 active:scale-[0.99] cursor-pointer mt-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>{t.auth.signingUpButton}</span>
                    </>
                  ) : (
                    <span>{t.auth.signupButton}</span>
                  )}
                </button>
              </form>

              {/* Link to Login */}
              <div className="pt-3 border-t border-slate-200 text-center">
                <p className="text-xs text-slate-600">
                  {t.auth.alreadyHaveAccount}{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-emerald-800 hover:text-emerald-900 hover:underline ml-1"
                  >
                    {t.auth.loginLink} →
                  </Link>
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-4 text-center text-2xs text-slate-500">
        <p>{t.footer.disclaimer}</p>
        <p className="mt-1 text-slate-400">{t.footer.copyright}</p>
      </footer>
    </div>
  );
}
