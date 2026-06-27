export default {
  preset: "node-server",
  entry: "./dist/server/server.js",
  publicAssets: [{ dir: "./dist/client", baseURL: "/" }],
  compatibilityDate: "2025-06-19",
};
