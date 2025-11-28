import { t } from '../trpc';
import { corsicaRouter } from './corsica';
import { userRouter } from './user';

export const appRouter = t.router({
  user: userRouter,
  corsica: corsicaRouter
});