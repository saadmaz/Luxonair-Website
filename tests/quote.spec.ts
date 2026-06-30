import { test, expect } from "@playwright/test";

test.describe("Quote form", () => {
  test("completes all 5 steps and submits", async ({ page }) => {
    await page.goto("/quote");

    // Step 1 — Where
    await page.fill('input[placeholder*="destination"], input[name="destination"]', "Maldives");
    await page.click('button:has-text("Next"), button:has-text("Continue")');

    // Step 2 — When (flexible mode is default)
    await page.fill(
      'input[placeholder*="month"], input[name="departWindow"], input[placeholder*="when"]',
      "August 2025"
    );
    // nights already defaults to 7
    await page.click('button:has-text("Next"), button:has-text("Continue")');

    // Step 3 — Flights
    await page.selectOption('select[name="departAirport"], select', { label: /Heathrow/ });
    await page.click('button:has-text("Next"), button:has-text("Continue")');

    // Step 4 — Who
    // adults defaults to 2, budget defaults to £££ — just proceed
    await page.click('button:has-text("Next"), button:has-text("Continue")');

    // Step 5 — Contact
    await page.fill('input[name="name"]', "Playwright Test");
    await page.fill('input[name="email"]', "playwright@example.com");
    await page.fill('input[name="phone"]', "+44 7000 000000");

    await page.click('button:has-text("Send my brief"), button[type="submit"]');

    // Confirmation state
    await expect(
      page.locator("text=/enquiry received|thank you|we.ll be in touch|consultant/i")
    ).toBeVisible({ timeout: 15_000 });
  });

  test("API rejects enquiry missing required fields", async ({ page }) => {
    const res = await page.request.post("/api/enquiries", {
      data: { email: "test@example.com" },
    });
    expect(res.status()).toBe(400);
  });
});
