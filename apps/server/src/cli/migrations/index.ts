/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Kysely } from "kysely";

import * as migration_1763578451672 from "./migration_1763578451672";

type Migration = {
  up: (db: Kysely<any>) => Promise<void>;
  down: (db: Kysely<any>) => Promise<void>;
};

type Migrations = Record<string, Migration>;

export const migrations: Migrations = {
  migration_1763578451672,
};
