import DashboardView from "@/components/DashboardView";
import { SYNTHETIC_DEMO_PARCELS, DEMO_SUMMARY_STATS } from "@/data/demo-data";

export default function Home() {
  return (
    <DashboardView
      parcels={SYNTHETIC_DEMO_PARCELS}
      summary={DEMO_SUMMARY_STATS}
    />
  );
}
