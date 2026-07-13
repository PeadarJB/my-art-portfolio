import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Unit tests only. Playwright specs live in ./e2e and are run by
    // `npm run test:e2e`, not Vitest.
    include: ["tests/**/*.test.ts"],
  },
});
