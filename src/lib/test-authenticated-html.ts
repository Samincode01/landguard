import { signSessionToken, SESSION_COOKIE_NAME } from "./auth";

async function testAuthenticatedHTML() {
  console.log("=== Testing Authenticated HTML Rendering ===");

  // Generate valid session token for test user
  const token = await signSessionToken({
    id: "cmvckklor0000hk7knm4dlno3",
    email: "test.usera@example.com",
    name: "User A",
    phone: "01711111111",
    occupation: "নাগরিক",
  });

  const cookieHeader = `${SESSION_COOKIE_NAME}=${token}`;

  // 1. Fetch /dashboard
  const resDash = await fetch("http://localhost:3000/dashboard", {
    headers: { Cookie: cookieHeader },
  });
  console.log("GET /dashboard authenticated status:", resDash.status);
  const dashHtml = await resDash.text();

  const hasWorkspace = dashHtml.includes("ব্যক্তিগত ভূমি প্রাক-যাচাই");
  console.log("  ✓ /dashboard contains Personal Workspace header:", hasWorkspace);

  const hasSidebar = dashHtml.includes("ভূমি রেকর্ড অনুসন্ধান") && dashHtml.includes("আমার যাচাইকরণ ইতিহাস");
  console.log("  ✓ /dashboard contains Sidebar navigation links:", hasSidebar);

  const hasCTA = dashHtml.includes("দলিল যাচাই শুরু করুন") || dashHtml.includes("দলিল বা খতিয়ান যাচাই শুরু করুন");
  console.log("  ✓ /dashboard contains Primary Action CTA:", hasCTA);

  // 2. Fetch /dashboard/explore
  const resExplore = await fetch("http://localhost:3000/dashboard/explore", {
    headers: { Cookie: cookieHeader },
  });
  console.log("\nGET /dashboard/explore authenticated status:", resExplore.status);
  const exploreHtml = await resExplore.text();

  const hasExploreTitle = exploreHtml.includes("ভূমি রেকর্ড অনুসন্ধান");
  console.log("  ✓ /dashboard/explore contains Explore Title:", hasExploreTitle);

  const hasDisclaimer = exploreHtml.includes("কৃত্রিম উদাহরণমূলক রেকর্ড");
  console.log("  ✓ /dashboard/explore contains Illustrative Disclaimer:", hasDisclaimer);

  const hasParcels = exploreHtml.includes("lp-demo-001") || exploreHtml.includes("৮৪৫") || exploreHtml.includes("সাভার");
  console.log("  ✓ /dashboard/explore renders database parcels:", hasParcels);

  // 3. Fetch /dashboard/history
  const resHistory = await fetch("http://localhost:3000/dashboard/history", {
    headers: { Cookie: cookieHeader },
  });
  console.log("\nGET /dashboard/history authenticated status:", resHistory.status);
  const historyHtml = await resHistory.text();

  const hasHistory = historyHtml.includes("যাচাইকরণ ইতিহাস");
  console.log("  ✓ /dashboard/history renders history view:", hasHistory);

  if (hasWorkspace && hasSidebar && hasCTA && hasExploreTitle && hasDisclaimer && hasParcels && hasHistory) {
    console.log("\n=== ALL AUTHENTICATED HTML RENDERING CHECKS PASSED ===");
  } else {
    console.error("\n=== SOME HTML CHECKS FAILED ===");
    process.exit(1);
  }
}

testAuthenticatedHTML().catch((err) => {
  console.error(err);
  process.exit(1);
});
