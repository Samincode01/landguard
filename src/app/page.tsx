import type { Metadata } from "next";
import LandingPageView from "@/components/LandingPageView";

export const metadata: Metadata = {
  title: "ল্যান্ডগার্ড বিডি (LandGuard BD) — জমি ও খতিয়ান প্রাক-যাচাই প্ল্যাটফর্ম",
  description:
    "জমি ক্রয়ের পূর্বে দলিলের ধারাবাহিকতা, খতিয়ানের হিস্যা এবং ১ নং খাস বাফারের প্রাথমিক যাচাইকরণ নাগরিক প্ল্যাটফর্ম।",
};

export default function HomePage() {
  return <LandingPageView />;
}

