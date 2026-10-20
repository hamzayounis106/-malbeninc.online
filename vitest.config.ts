import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { assertBuildIntegrity } from "./build/integrity";
import { brandAssets } from "./build/brand-assets";

assertBuildIntegrity(__dirname);

export default defineConfig({
  plugins: [react(), brandAssets(__dirname)],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
