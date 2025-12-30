import { defineConfig } from "eslint/config";
import baseConfig from '@repo/eslint-config/eslint.config.base.js';

import reacteslint from "eslint-plugin-react";

const config = defineConfig(
  ...baseConfig,
  reacteslint.configs.flat.recommended,
  [
    {
      rules: {
        "react/react-in-jsx-scope": "off",
        "react/no-unescaped-entities": "off",
        "react/prop-types": "off"
      }
    }
  ],
  [
    {
      ignores: [
        "src/paraglide/**",
        "src/content/tuner-pt3/wasm/auto-correlate/pkg/**",
        ".output/**",
        ".turbo/**",
        ".nitro/**",
        "vite.config.ts"
      ]
    }
  ]
);

export default config;
