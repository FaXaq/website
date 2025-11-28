import { Context } from "../context";
import { publicProcedure, t } from "../trpc"


import { TRPCError } from "@trpc/server";

export const loggedInProcedure = publicProcedure.use(async (opts) => {
  const { ctx } = opts;
  if (!('session' in ctx) || !ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return opts.next({
    ctx: {
      session: ctx.session,
    },
  });
})