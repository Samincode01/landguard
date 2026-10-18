import type { Metadata } from "next";
import LandingPageView from "@/components/LandingPageView";

export const metadata: Metadata = {
  title: "ল্যান্ডগার্ড বিডি — জমি কেনার আগে দলিল যাচাই",
  description:
    "জমি কেনার আগে খতিয়ান, বায়া দলিল ও ঝুঁকির লক্ষণ ঘরে বসে প্রাথমিকভাবে যাচাই করুন। LandGuard BD — civic land document pre-check for Bangladesh.",
};

export default function HomePage() {
  return <LandingPageView />;
}

