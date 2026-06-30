import { test, expect } from "@playwright/test";
import { EMAIL, PASSWORD, loginAsAdmin } from "./helpers";

test.describe("Admin auth", () => {
  test("valid credentials log in and redirect to /admin", async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page).toHaveURL(/\/admin$/);
  });

  test("wrong password shows error message", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill("#email", EMAIL);
    await page.fill("#password", "wrong-password-123");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Invalid credentials")).toBeVisible({ timeout: 5000 });
  });

  test("empty form shows client-side validation", async ({ page }) => {
    await page.goto("/admin/login");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Please enter your email and password")).toBeVisible({ timeout: 3000 });
  });

  test("rate limiting blocks after 5 failed attempts", async ({ page }) => {
    await page.goto("/admin/login");
    for (let i = 0; i < 5; i++) {
      await page.fill("#email", EMAIL);
      await page.fill("#password", `bad-attempt-${i}`);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(300);
    }
    // 6th attempt should be rate-limited (429)
    await page.fill("#email", EMAIL);
    await page.fill("#password", "bad-attempt-6");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=/too many|try again later/i")).toBeVisible({ timeout: 5000 });
  });

  test("session persists across page reload", async ({ page }) => {
    await loginAsAdmin(page);
    await page.reload();
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.locator("text=Enquiries")).toBeVisible();
  });

  test("logout clears session and redirects to login", async ({ page }) => {
    await loginAsAdmin(page);
    const res = await page.request.post("/api/auth/logout");
    expect(res.status()).toBe(200);
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
