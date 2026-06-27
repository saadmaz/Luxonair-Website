export default {
  preset: "node-server",
  serverEntry: {
    handler: "./dist/server/server.js",
    format: "web",
  },
  publicAssets: [{ dir: "./dist/client", baseURL: "/" }],
  compatibilityDate: "2025-06-19",
};
