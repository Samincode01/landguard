import { redirect } from "next/navigation";

export const instant = false;

export default function HistoryRedirectPage() {
  redirect("/dashboard/history");
}
