import { test, expect } from "@playwright/test";

test.describe("Contact form", () => {
  test("successful submission shows confirmation", async ({ page }) => {
    await page.goto("/contact");

    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="message"]', "This is a test message from Playwright.");

    await page.click('button[type="submit"]');

    // Success state renders a confirmation — look for something unique to that state
    await expect(
      page.locator("text=/thank you|message received|we.ll be in touch/i")
    ).toBeVisible({ timeout: 10_000 });
  });

  test("API rejects empty name", async ({ page }) => {
    const res = await page.request.post("/api/contacts", {
      data: { email: "test@example.com", message: "Hello" },
    });
    expect(res.status()).toBe(400);
  });

  test("API rejects invalid email", async ({ page }) => {
    const res = await page.request.post("/api/contacts", {
      data: { name: "Test", email: "not-an-email", message: "Hello" },
    });
    expect(res.status()).toBe(400);
  });
});
