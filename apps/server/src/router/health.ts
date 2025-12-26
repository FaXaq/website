import { config } from "src/config";
import { t } from "../trpc";
import { db } from "src/utils/db";

export const healthRouter = t.router({
  isOk: t.procedure.query(async () => {
    return {
      message: "OK"
    }
  }),

  isDbOk: t.procedure.query(async () => {
    try {
      const u = await db.selectFrom("user").select("id").executeTakeFirst();
      console.log(u);
      return {
        message: "DB OK"
      }
    } catch (error) {
      return {
        message: "DB KO",
        error: error
      }
    }
  }),
})