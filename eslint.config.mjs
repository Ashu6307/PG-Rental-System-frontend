import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // TypeScript Rules - Turn off strict any checking for development
      "@typescript-eslint/no-explicit-any": "warn", // Change from error to warn
      "@typescript-eslint/no-unused-vars": "warn", // Change from error to warn
      
      // React Rules - Turn off strict rules for development
      "react/no-unescaped-entities": "warn", // Change from error to warn
      "react-hooks/exhaustive-deps": "warn", // Change from error to warn
      "react/jsx-no-undef": "warn", // Change from error to warn
      
      // NextJS Rules - Turn off strict img rules for development
      "@next/next/no-img-element": "warn", // Change from error to warn
      "@next/next/no-html-link-for-pages": "warn", // Change from error to warn
      
      // General Rules
      "prefer-const": "warn", // Change from error to warn
      "jsx-a11y/alt-text": "warn", // Change from error to warn
      
      // Turn off rules that are too strict for development
      "no-console": "off",
      "no-debugger": "warn",
    },
  },
];

export default eslintConfig;
