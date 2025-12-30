import { t } from "../trpc";
import { db } from "../utils/db";

export const healthRouter = t.router({
  isOk: t.procedure.query(async () => {
    return {
      message: "OK"
    };
  }),

  isDbOk: t.procedure.query(async () => {
    try {
      await db.selectFrom("user").select("id").executeTakeFirst();
      return {
        message: "DB OK"
      };
    } catch (error) {
      return {
        message: "DB KO",
        error: error
      };
    }
  }),
});