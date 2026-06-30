import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers";

test.describe("Admin destinations CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/destinations");
  });

  test("destinations page loads with table headers", async ({ page }) => {
    await expect(page.locator("text=Destinations")).toBeVisible();
    // Either rows or empty state should appear — not a spinner
    await expect(page.locator('[data-testid="destinations-table"], text=/no destinations/i, table')).toBeVisible({ timeout: 10_000 });
  });

  test("add new destination appears in the list", async ({ page }) => {
    const slug = `pw-test-${Date.now()}`;

    await page.click('button:has-text("Add"), button:has-text("New destination")');
    await page.fill('input[placeholder*="slug"], input[name="slug"]', slug);
    await page.fill('input[placeholder*="name"], input[name="name"]', "Playwright Island");
    await page.fill('input[placeholder*="country"], input[name="country"]', "Testland");
    await page.fill('input[placeholder*="price"], input[name="fromPrice"]', "2500");

    await page.click('button:has-text("Save"), button[type="submit"]:has-text("Save")');

    await expect(page.locator(`text=Playwright Island`)).toBeVisible({ timeout: 10_000 });

    // Cleanup — delete the row we just created
    const row = page.locator(`tr:has-text("Playwright Island")`).first();
    await row.locator('button[aria-label*="delete"], button:has(svg)').last().click();
    await page.click('button:has-text("Delete"), button:has-text("Confirm")');
    await expect(page.locator("text=Playwright Island")).not.toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Admin enquiries list", () => {
  test("enquiries tab shows data or empty state", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/enquiries");
    await expect(
      page.locator("text=Enquiries, table, text=/no enquiries/i")
    ).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Admin badge counts", () => {
  test("sidebar shows numeric badges (or zero)", async ({ page }) => {
    await loginAsAdmin(page);
    // Wait for nav to settle — badge count is loaded async
    await page.waitForTimeout(2000);
    const nav = page.locator("nav, aside");
    await expect(nav).toBeVisible();
    // Page should not show NaN or undefined in the badge area
    const text = await nav.textContent();
    expect(text).not.toMatch(/NaN|undefined/);
  });
});
