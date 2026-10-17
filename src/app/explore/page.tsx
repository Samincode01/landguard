import { redirect } from "next/navigation";

export const instant = false;

export default function ExploreRedirectPage() {
  redirect("/dashboard/explore");
}
