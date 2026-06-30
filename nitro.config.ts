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
          // 'unsafe-inline' required by TanStack Start inline hydration scripts.
          // Migrate to 'strict-dynamic' + per-request nonces when TanStack Start
          // supports ScriptOnce nonce injection.
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
  },
};
