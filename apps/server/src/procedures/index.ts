import { TRPCError } from "@trpc/server";

import { publicProcedure } from "../trpc";

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
});