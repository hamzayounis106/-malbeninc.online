import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { assertBuildIntegrity } from "./build/integrity";
import { brandAssets } from "./build/brand-assets";

assertBuildIntegrity(__dirname);

// Long-lived vendor chunks: they change far less often than app code, so a
// content edit only invalidates the small app chunk in returning visitors'
// caches. Vendor chunks never import app code, so the chunk graph stays acyclic.
const VENDOR_CHUNKS: Record<string, RegExp> = {
  react: /node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom|@remix-run)[\\/]/,
  motion: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/,
  gsap: /node_modules[\\/](gsap|@gsap)[\\/]/,
};

// https://vitejs.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), brandAssets(__dirname), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  ssr: {
    // Bundle these into the prerender build: their deep ESM subpath imports
    // (gsap/SplitText etc.) do not resolve as bare Node externals.
    noExternal: ["gsap", "framer-motion", "lenis"],
  },
  build: {
    // Read by scripts/prerender.mjs to modulepreload each page's own chunk.
    manifest: !isSsrBuild,
    rollupOptions: {
      output: {
        manualChunks: isSsrBuild
          ? undefined
          : (id) => {
              for (const [name, re] of Object.entries(VENDOR_CHUNKS)) if (re.test(id)) return name;
            },
      },
    },
  },
}));
