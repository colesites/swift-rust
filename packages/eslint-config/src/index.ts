export interface EslintConfigOptions {
  root?: boolean;
  react?: "detect" | "off" | "on";
  typescript?: boolean;
  jsx?: boolean;
  prettier?: boolean;
  ignores?: string[];
}

const SHARED_IGNORES = [
  ".next/**",
  ".turbo/**",
  ".swift-rust/**",
  "dist/**",
  "node_modules/**",
  "target/**",
  "coverage/**",
  "**/*.min.js",
  "**/*.d.ts",
];

export function buildConfig(options: EslintConfigOptions = {}) {
  const {
    root = true,
    react = "detect",
    typescript = true,
    jsx = true,
    prettier: usePrettier = true,
    ignores = [],
  } = options;

  return {
    root,
    ignores: [...SHARED_IGNORES, ...ignores],
    parser: typescript ? "@typescript-eslint/parser" : undefined,
    parserOptions: typescript
      ? {
          ecmaVersion: 2022,
          sourceType: "module",
          ecmaFeatures: jsx ? { jsx: true } : undefined,
        }
      : undefined,
    plugins: [
      typescript && "@typescript-eslint",
      react !== "off" && "react",
      react !== "off" && "react-hooks",
      "import",
      jsx && "jsx-a11y",
    ].filter(Boolean) as string[],
    extends: [
      "eslint:recommended",
      typescript && "plugin:@typescript-eslint/recommended",
      react === "on" && "plugin:react/recommended",
      react === "on" && "plugin:react-hooks/recommended",
      jsx && "plugin:jsx-a11y/recommended",
      usePrettier && "prettier",
    ].filter(Boolean) as string[],
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/consistent-type-imports": "warn",
    },
  };
}

export default buildConfig;
