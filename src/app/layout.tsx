import type { Metadata } from "next";
import { Noto_Sans_Bengali, Hind_Siliguri } from "next/font/google";
import "./globals.css";

const notoSansBengali = Noto_Sans_Bengali({
  weight: ["400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  display: "swap",
  variable: "--font-noto-bengali",
});

const hindSiliguri = Hind_Siliguri({
  weight: ["400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  display: "swap",
  variable: "--font-hind-siliguri",
});

export const metadata: Metadata = {
  title: "ল্যান্ডগার্ড বিডি (LandGuard BD) — জমি ও খতিয়ান প্রাক-যাচাই প্ল্যাটফর্ম",
  description:
    "জমি ক্রয়ের পূর্বে দলিলের ধারাবাহিকতা, খতিয়ানের হিস্যা এবং ১ নং খাস বাফারের প্রাথমিক যাচাইকরণ নাগরিক প্ল্যাটফর্ম।",
};

import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      data-scroll-behavior="smooth"
      className={`${notoSansBengali.variable} ${hindSiliguri.variable} h-full antialiased`}
    >
      <body className={`${notoSansBengali.className} min-h-full flex flex-col bg-slate-50/70 text-slate-900 font-sans`}>
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

