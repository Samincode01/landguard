import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      className={`${hindSiliguri.variable} h-full antialiased`}
    >
      <body className={`${hindSiliguri.className} min-h-full flex flex-col bg-slate-50/70 text-slate-900 font-sans`}>
        {children}
      </body>
    </html>
  );
}
