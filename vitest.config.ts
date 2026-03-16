import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});

