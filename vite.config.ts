import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@tanstack/react-start/api": fileURLToPath(
        new URL("./src/lib/api-route.ts", import.meta.url),
      ),
    },
  },
  plugins: [
    ...tanstackStart({
      server: { entry: "server" },
      router: {
        routeFileIgnorePattern: "^api$",
      },
    }),
    react(),
    tailwindcss(),
  ],
  ssr: {
    external: ["mysql2", "drizzle-orm"],
    noExternal: ["jose"],
  },
  optimizeDeps: {
    exclude: ["mysql2", "drizzle-orm"],
  },
});
