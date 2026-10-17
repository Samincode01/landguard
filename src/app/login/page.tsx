"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { showToast, showErrorAlert } from "@/lib/alerts";

export default function LoginPage() {
  const { t, language } = useLanguage();
  const { refreshUser } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [demoFilledNotice, setDemoFilledNotice] = useState(false);

  // Check if demo credentials are configured in environment
  const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL || "";
  const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD || "";
  const isDemoConfigured = Boolean(demoEmail && demoPassword);

  const handleDemoAutofill = () => {
    if (isDemoConfigured) {
      setEmail(demoEmail);
      setPassword(demoPassword);
      setErrorMsg(null);
      setDemoFilledNotice(true);
      showToast(t.auth.demoLoginNotice, "info");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMsg(t.auth.emailRequired);
      return;
    }

    if (!password) {
      setErrorMsg(t.auth.passwordRequired);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorText = data?.error || t.auth.genericLoginError;
        setErrorMsg(errorText);
        showErrorAlert(
          language === "bn" ? "লগইন ব্যর্থ হয়েছে" : "Sign In Failed",
          errorText,
          language === "bn" ? "আবার চেষ্টা করুন" : "Try Again"
        );
        setIsLoading(false);
        return;
      }

      // Success toast and sync state
      await refreshUser();
      showToast(t.auth.loginSuccess, "success");

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch {
      setErrorMsg(t.auth.networkError);
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
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          
          {/* Left Hero / Brand Highlight Banner (Visible on lg+) */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 p-8 flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700/60 text-emerald-200 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {t.auth.loginBadge}
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white leading-snug">
                  {language === "bn" ? "নিরাপদ জমি যাচাইয়ের নির্ভরযোগ্য সহযোগী" : "Your Trusted Land Due Diligence Gateway"}
                </h2>
                <p className="text-xs text-emerald-100/80 mt-2 leading-relaxed">
                  {t.auth.loginSubtitle}
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
              {t.auth.adminNotice}
            </div>
          </div>

          {/* Right Form Column */}
          <div className="col-span-1 lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full space-y-6">
              
              {/* Form Heading */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {t.auth.loginTitle}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  {t.auth.loginSubtitle}
                </p>
              </div>

              {/* Hackathon Demo Access Card */}
              <div className="rounded-2xl border border-amber-200/90 bg-amber-50/70 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-xs font-bold text-amber-900">
                      {language === "bn" ? "হ্যাকথন বিচারক ও পরীক্ষকদের জন্য" : "Hackathon Evaluator Access"}
                    </span>
                  </div>
                  <span className="rounded-full bg-amber-200/80 text-amber-900 text-[10px] font-semibold px-2 py-0.5">
                    {t.auth.demoLoginBadge}
                  </span>
                </div>
                <p className="text-2xs text-amber-800/90 leading-relaxed">
                  {isDemoConfigured ? t.auth.demoLoginHelper : t.auth.demoNotConfiguredDesc}
                </p>
                {isDemoConfigured ? (
                  <button
                    type="button"
                    onClick={handleDemoAutofill}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition shadow-2xs cursor-pointer active:scale-[0.98]"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    <span>{t.auth.demoLoginButton}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-200/90 text-slate-500 font-semibold text-xs cursor-not-allowed border border-slate-300/70 shadow-2xs"
                  >
                    <span>{t.auth.demoLoginButton} ({language === "bn" ? "কনফিগার করা নেই" : "Not Configured"})</span>
                  </button>
                )}
                {demoFilledNotice && (
                  <p className="text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center">
                    ✓ {t.auth.demoLoginNotice}
                  </p>
                )}
              </div>

              {/* Error Notice */}
              {errorMsg && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 flex items-start gap-2.5 text-rose-800 text-xs animate-in fade-in duration-150">
                  <svg className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-800 mb-1">
                    {t.auth.emailLabel} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorMsg(null);
                      }}
                      placeholder={t.auth.emailPlaceholder}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-xs font-semibold text-slate-800">
                      {t.auth.passwordLabel} <span className="text-rose-500">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrorMsg(null);
                      }}
                      placeholder={t.auth.passwordPlaceholder}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? t.auth.hidePassword : t.auth.showPassword}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:bg-emerald-700/60 text-white font-semibold text-sm transition shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 active:scale-[0.99] cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>{t.auth.loggingInButton}</span>
                    </>
                  ) : (
                    <span>{t.auth.loginButton}</span>
                  )}
                </button>
              </form>

              {/* Link to Signup */}
              <div className="pt-4 border-t border-slate-200 text-center">
                <p className="text-xs text-slate-600">
                  {t.auth.dontHaveAccount}{" "}
                  <Link
                    href="/signup"
                    className="font-semibold text-emerald-800 hover:text-emerald-900 hover:underline ml-1"
                  >
                    {t.auth.signupLink} →
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
