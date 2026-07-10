import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    // Legacy CRA reference, build output, and generated files are not linted.
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      "legacy-src/**",
      "next-env.d.ts",
      "coverage/**",
      "public/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Build/tooling scripts run in Node, not the browser bundle.
    files: ["scripts/**/*.mjs", "*.config.{js,mjs,ts}"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];

export default eslintConfig;
