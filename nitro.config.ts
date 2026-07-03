export default {
  preset: "node-server",
  serverEntry: {
    handler: "./dist/server/server.js",
    format: "web",
  },
  publicAssets: [{ dir: "./dist/client", baseURL: "/" }],
  compatibilityDate: "2025-06-19",
  routeRules: {
    "/**": {
      headers: {
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
        "Content-Security-Policy": [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline'",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "img-src 'self' data: https://images.unsplash.com",
          "font-src 'self' data: https://fonts.gstatic.com",
          "connect-src 'self'",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join("; "),
      },
    },
    // Session-gated pages and the auth-sensitive API surface must never be
    // cached by an intermediary (Hostinger's LiteSpeed layer caches full-page
    // HTML by URL only, ignoring cookies, unless explicitly told not to —
    // without this it serves one cached logged-out snapshot to every visitor
    // regardless of their session).
    "/admin/**": { headers: { "Cache-Control": "private, no-store" } },
    "/api/**": { headers: { "Cache-Control": "private, no-store" } },
  },
};
