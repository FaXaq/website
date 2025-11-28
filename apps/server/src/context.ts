import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { auth } from './auth';

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (session) {
    return {
      req,
      res,
      ...session
    }
  }
  return { req, res };
}

export type Context = Awaited<ReturnType<typeof createContext>>;