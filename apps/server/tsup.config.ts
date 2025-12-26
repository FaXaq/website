import fs from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "tsup";

export default defineConfig((options) => {
  const dir = dirname(fileURLToPath(import.meta.url));
  const migrationFiles = fs.readdirSync(join(dir, "src/cli/migrations"));

  // Filter out non-TypeScript files and ensure they have the .ts extension
  const migrationFilesFiltered = migrationFiles.filter(file => file.endsWith(".ts"));

  const entry: Record<string, string> = {
    index: "src/index.ts",
    cli: "src/cli/index.ts"
  };

  for (const file of migrationFilesFiltered) {
    entry[`migrations/${basename(file, ".ts")}`] = `src/cli/migrations/${file}`;
  }

  return {
    entry,
    target: 'node22',
    tsconfig: './tsconfig.json',
    format: ["esm", "cjs"],
    dts: true,
    noExternal: ['@repo/schemas'],
  };
});
