import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  plugins: [
    ...tanstackStart({
      tsr: {
        routeFileIgnorePattern: /\/api\//,
      },
      server: { entry: "server" },
    }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  ssr: {
    external: ["mysql2", "drizzle-orm", "jose"],
    noExternal: [],
  },
  optimizeDeps: {
    exclude: ["mysql2", "drizzle-orm"],
  },
});
