import { defineConfig } from "eslint/config";
import baseConfig from '@repo/eslint-config/eslint.config.base.js';

const config = defineConfig(
  ...baseConfig,
  {
    ignores: [
      "dist/**",
      "tsup.config.ts"
    ]
  }
);

export default config;
