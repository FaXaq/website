import type { Kysely } from "kysely";
import { DB } from "../../utils/db/db";

export const up = async (db: Kysely<DB>) => {
  await db.schema
    .alterTable("user")
    .addColumn("username", "varchar", (col) => col.unique().notNull())
    .addColumn("displayUsername", "varchar")
    .execute()
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable("user")
    .dropColumn("username")
    .dropColumn("displayUsername")
    .execute()
};
