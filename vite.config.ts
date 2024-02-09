import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "DarkModeToggle",
      fileName: (_) => `index.js`,
      formats: ["es"],
    },
  },
  test: {
    environment: "happy-dom",
  },
});
