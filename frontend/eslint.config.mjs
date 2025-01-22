import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    plugins: ["prefer-arrow", "@typescript-eslint"],
    rules: {
      indent: ["error", 2],
      // "no-mixed-spaces-and-tabs": "error",
      semi: ["error", "always"],
      "object-curly-spacing": ["error", "always"],
      "space-before-function-paren": ["error", "never"],
      quotes: ["error", "double"],
      // Enforce the use of arrow functions
      "prefer-arrow/prefer-arrow-functions": [
        "error",
        {
          disallowPrototype: true,
          singleReturnOnly: false,
          classPropertiesAllowed: false,
        },
      ],

      "no-console": [
        "error",
        { allow: ["warn", "error"] }
      ],

      // Disallow unused variables
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

      // Disallow unnecessary blank lines
      "no-multiple-empty-lines": ["error", { max: 1, maxBOF: 0, maxEOF: 0 }],

      // Enforce spacing around keywords
      "keyword-spacing": ["error", { before: true, after: true }],

      // Disallow trailing whitespace at the end of lines
      "no-trailing-spaces": "error",

      // Enforce consistent spacing around operators
      "space-infix-ops": "error",

      // Require `const` or `let` instead of `var`
      "no-var": "error",

      // Prefer `const` where possible
      "prefer-const": [
        "error",
        { destructuring: "any", ignoreReadBeforeAssign: true },
      ],

      // Enforce consistent newline at the end of files
      "eol-last": ["error", "always"],

      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "typeLike",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "method",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "default",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "property",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "property",
          format: null,
          modifiers: ["requiresQuotes"],
        },
      ]

    },
  }),
];

export default eslintConfig;
