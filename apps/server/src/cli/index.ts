import { program } from "commander";
import { writeFileSync, } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { migrateDownDB, migrateToLatest, migrateUp, statusMigration } from "./migrations/migrate";

export const __dirname = (filePath?: string) => {
  const __filename = fileURLToPath(filePath ?? import.meta.url);
  return path.dirname(__filename);
};

program
  .command("migrations:up")
  .description("Run migrations up")
  .action(async () => {
    await migrateUp();
  });

program
  .command("migrations:latest")
  .description("Run migrations latest")
  .action(async () => {
    await migrateToLatest(true);
  });

program
  .command("migrations:status")
  .description("Check migrations status")
  .action(async () => {
    const pendingMigrations = await statusMigration();
    console.log(`migrations-status=${pendingMigrations === 0 ? "synced" : "pending"}`);
    return;
  });

program
  .command("migrations:down")
  .description("Run migrations down")
  .argument("[numberOfMigrations]", "number of migrations to rollback [default: 1]")
  .action(async (numberOfMigrations = 1) => {
    await migrateDownDB(numberOfMigrations);
  });

program
  .command("migrations:create")
  .description("Run migrations create")
  .action(() => {
    writeFileSync(
      path.join(__dirname(), "../src", `scripts/migrations/migration_${new Date().getTime()}.ts`),
      `import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {};

export const down = async (db: Kysely<unknown>) => {};
`
    );
  });

program.parse();