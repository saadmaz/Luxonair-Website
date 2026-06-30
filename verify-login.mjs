import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const shotsDir = "./audit-shots/login-verify";
mkdirSync(shotsDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
const consoleErrors = [];
page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
page.on("pageerror", (err) => consoleErrors.push(String(err)));

console.log("=== Step 1: Open login page ===");
await page.goto("https://luxeonair.co.uk/admin/login", { waitUntil: "networkidle" });
console.log("URL:", page.url());

console.log("\n=== Step 2: Fill credentials ===");
await page.fill("#username", "admin@luxeonair.co.uk");
await page.fill("#password", "Luxonair2026!");
await page.screenshot({ path: `${shotsDir}/01-filled.png` });

console.log("\n=== Step 3: Click sign in ===");
await Promise.all([
  page.waitForURL("**/admin", { timeout: 15000 }).catch(() => null),
  page.click('button[type="submit"]'),
]);
await page.waitForTimeout(1500);
console.log("URL after submit:", page.url());
await page.screenshot({ path: `${shotsDir}/02-after-submit.png` });

const cookies = await page.context().cookies();
const sessionCookie = cookies.find((c) => c.name === "lx_session");
console.log("\nSession cookie present:", !!sessionCookie);
if (sessionCookie) {
  console.log("  httpOnly:", sessionCookie.httpOnly, " secure:", sessionCookie.secure, " sameSite:", sessionCookie.sameSite);
}

console.log("\n=== Step 4: Refresh and confirm still logged in ===");
await page.reload({ waitUntil: "networkidle" });
console.log("URL after refresh:", page.url());
await page.screenshot({ path: `${shotsDir}/03-after-refresh.png` });

console.log("\n=== Step 5: Navigate to a sub-page (destinations) ===");
await page.goto("https://luxeonair.co.uk/admin/destinations", { waitUntil: "networkidle" });
console.log("URL:", page.url());
await page.screenshot({ path: `${shotsDir}/04-destinations.png` });

console.log("\n=== Step 6: Logout ===");
const logoutBtn = page.locator('button:has-text("Logout"), button:has-text("Sign out"), a:has-text("Logout")').first();
if (await logoutBtn.count() > 0) {
  await logoutBtn.click();
  await page.waitForTimeout(1000);
  console.log("URL after logout:", page.url());
} else {
  console.log("No logout button found by common selectors (non-fatal, skipping).");
}

console.log("\nConsole/page errors captured:", consoleErrors.length);
consoleErrors.slice(0, 10).forEach((e) => console.log("  -", e));

await browser.close();
console.log("\n=== DONE ===");
