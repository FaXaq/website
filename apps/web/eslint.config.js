// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import reacteslint from "eslint-plugin-react";
import simpleSortPlugin from "eslint-plugin-simple-import-sort";
import unusedImportPlugin from "eslint-plugin-unused-imports";
import tseslint from 'typescript-eslint';

const config = defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  reacteslint.configs.flat.recommended,
  [
    {
      "ignores": [
        "./eslint.config.js" 
      ]
    }
  ],
  [
    {
      "languageOptions": {
        parserOptions: {
          "ecmaFeatures": {
            "jsx": true
          },
          "ecmaVersion": "latest",
          "sourceType": "module",
          "project": ["tsconfig.json"]
        },
      }
    }
  ],
  [
    {
      "ignores": [
        "node_modules",
        ".next",
        "wasm/auto-correlate/pkg"
      ]
    }
  ],
  [
    {
      plugins: {
        "import": importPlugin,
        "simple-import-sort": simpleSortPlugin,
        "unused-imports": unusedImportPlugin
      }
    },
    {
      "rules": {
        "max-len": [
          "warn",
          {
            "code": 120,
            "ignorePattern": "^import\\s.+\\sfrom\\s.+;$",
            "ignoreComments": true,
            "ignoreStrings": true,
            "ignoreTemplateLiterals": true
          }
        ],
        "simple-import-sort/imports": "error",
        "no-extra-semi": "error",
        "semi": ["error", "always"],
        "indent": "off",
        "no-prototype-builtins": "error",
        "no-trailing-spaces": "error",

        "import/no-useless-path-segments": ["error"],
        "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
        "import/no-extraneous-dependencies": [
          "error",
          {
            "devDependencies": [
              "**/*.test.ts",
              "**/*.test.tsx",
              "**/*.spec.ts",
              "**/tests/**/*.ts",
              "**/tests/*.ts",
              "**/fixtures/**/*.ts",
              "**/tsup.config.ts",
              "**/vitest.workspace.ts",
              "**/vite.config.ts",
              "**/content-collections.ts"
            ]
          }
        ],
        "@typescript-eslint/consistent-type-imports": ["error", { "prefer": "type-imports" }],
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-import-type-side-effects": "error",
        "@typescript-eslint/promise-function-async": "error",
        "@typescript-eslint/switch-exhaustiveness-check": "error",
        "@typescript-eslint/no-unused-vars": "off",
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": [
          "warn",
          {
            "vars": "all",
            "varsIgnorePattern": "^_",
            "args": "after-used",
            "argsIgnorePattern": "^_"
          }
        ],
        "react/react-in-jsx-scope": "off",
        "react/no-unescaped-entities": "off",
        "react/prop-types": "off",
        "import/namespace": "warn",
        "import/no-named-as-default-member": "off"
      }
    }
  ]
);

export default config;