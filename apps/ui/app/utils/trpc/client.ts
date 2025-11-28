import { createTRPCContext } from "@trpc/tanstack-react-query";

import type { AppRouter } from "./types";

const trpcContext: ReturnType<typeof createTRPCContext<AppRouter>> = createTRPCContext<AppRouter>();

export const TRPCProvider: typeof trpcContext.TRPCProvider = trpcContext.TRPCProvider;
export const useTRPC: typeof trpcContext.useTRPC = trpcContext.useTRPC;
export const useTRPCClient: typeof trpcContext.useTRPCClient = trpcContext.useTRPCClient;