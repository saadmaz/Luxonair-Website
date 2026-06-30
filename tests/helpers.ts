import type { Page } from "@playwright/test";

const EMAIL = process.env.TEST_ADMIN_EMAIL ?? process.env.ADMIN_EMAIL ?? "admin@luxeonair.co.uk";
const PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? "changeme";

export { EMAIL, PASSWORD };

export async function loginAsAdmin(page: Page) {
  await page.goto("/admin/login");
  await page.fill("#email", EMAIL);
  await page.fill("#password", PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/admin");
}
