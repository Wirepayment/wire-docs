import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Inline an empty PostCSS config so Vite doesn't try to load the app's
  // Tailwind v4 postcss.config.mjs (unparseable in this node-env test run).
  css: { postcss: {} },
  test: { environment: "node" },
  resolve: { alias: { "@": path.resolve(import.meta.dirname, ".") } },
});
