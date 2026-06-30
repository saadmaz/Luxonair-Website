import { chromium, request } from "@playwright/test";

// Test 1: Direct API call with fetch
console.log("=== TEST 1: Direct API POST ===");
const ctx = await request.newContext({ baseURL: "https://luxeonair.co.uk" });

const r1 = await ctx.post("/api/auth/login", {
  data: { username: "super_admin", password: "admin123" },
  headers: { "Content-Type": "application/json" },
});
console.log("POST /api/auth/login status:", r1.status());
const body1 = await r1.text();
console.log("Response body:", body1.slice(0, 300));

// Test 2: Try old email format
console.log("\n=== TEST 2: Old email format ===");
const r2 = await ctx.post("/api/auth/login", {
  data: { email: "admin@luxeonair.co.uk", password: "admin123" },
  headers: { "Content-Type": "application/json" },
});
console.log("POST with email field status:", r2.status());
console.log("Response:", (await r2.text()).slice(0, 200));

// Test 3: Check if any API route works
console.log("\n=== TEST 3: GET /api/enquiries (should 401) ===");
const r3 = await ctx.get("/api/enquiries");
console.log("GET /api/enquiries status:", r3.status());
console.log("Response:", (await r3.text()).slice(0, 200));

await ctx.dispose();
