import { appRouter } from ".";

// export type definition of API
export type AppRouter = typeof appRouter;
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
 
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;