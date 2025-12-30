import { SignInEmailSchema, SignInUsernameSchema, SignUpEmailSchema } from "@repo/schemas/api/procedures/user";
import { TRPCError } from "@trpc/server";
import type { APIError as BetterAuthAPIError } from "better-auth";

import { auth } from "../auth";
import { t } from "../trpc";
import { toIsomorphicHeaders } from "../utils/toIsomorphicHeaders";

export const userRouter = t.router({
  singUpEmail: t.procedure.input(SignUpEmailSchema).mutation(async (opts) => {
    const { response } = await auth.api.signUpEmail({
      returnHeaders: true,
      body: {
        name: opts.input.name,
        email: opts.input.email,
        password: opts.input.password,
        username: opts.input.username,
      }
    });

    return response;
  }),

  singInEmail: t.procedure.input(SignInEmailSchema).mutation(async (opts) => {
    try {
      const { headers, response } = await auth.api.signInEmail({
        returnHeaders: true,
        body: {
          email: opts.input.email,
          password: opts.input.password,
          rememberMe: opts.input.rememberMe ?? false
        }
      });

      headers.forEach((value, key) => {
        opts.ctx.res.header(key, value);
      });
      // token to give back as header is in set-cookie header in response as better-auth.session_token and should be used as cookie on the front-end sid
      return response;
    } catch (err) {
      const typedErr = err as BetterAuthAPIError;
      if (typedErr.status === "UNAUTHORIZED") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: typedErr.message,
          cause: typedErr.cause
        });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
        cause: err
      });
    }
  }),

  singInUsername: t.procedure.input(SignInUsernameSchema).mutation(async (opts) => {
    const res = await auth.api.signInUsername({
      body: {
        username: opts.input.username,
        password: opts.input.password,
        rememberMe: opts.input.rememberMe ?? false
      }
    });

    return res;
  }),

  signOut: t.procedure.mutation(async (opts) => {
    await auth.api.signOut({
      headers: toIsomorphicHeaders(opts.ctx.req.headers)
    });
  }),

  me: t.procedure.query(async (opts) => {
    const res = await auth.api.getSession({
      headers: toIsomorphicHeaders(opts.ctx.req.headers),
    });

    return res?.user ?? null;
  }),
});