import eslint from "@eslint/js"
import pluginQuery from "@tanstack/eslint-plugin-query"
import pluginRouter from "@tanstack/eslint-plugin-router"
import prettierConfig from "eslint-config-prettier"
import oxlint from "eslint-plugin-oxlint"
import reactPlugin from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import { defineConfig } from "eslint/config"
import tseslint from "typescript-eslint"

export default defineConfig(
  ...pluginQuery.configs["flat/recommended"],
  ...pluginRouter.configs["flat/recommended"],
  {
    settings: {
      react: {
        // This tells eslint-plugin-react to automatically find the
        // installed React version from your package.json, silencing the warning.
        version: "detect",
      },
    },
  },
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  reactHooks.configs.flat.recommended,
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prettierConfig,

  // 2. Load the strict type-checked rules (These require the project service)
  tseslint.configs.strictTypeChecked,
  tseslint.configs.recommendedTypeChecked,
  ...oxlint.configs["flat/recommended"],

  // 3. **THE FIX**: Configure the parser options for the type-checked rules
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        // Allow files outside of tsconfig.json's strict scope to be parsed.
        allowDefaultProject: true,
      },
    },
  },

  {
    rules: {
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: false,
        },
      ],
    },
  },
)
