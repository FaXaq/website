import { createTRPCClient, httpBatchLink, httpLink, isNonJsonSerializable, splitLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";

import { config } from "@/lib/config";

import { getRequestHeaders } from "../requestHeaders";
import type { AppRouter } from "./types";

const trpcContext: ReturnType<typeof createTRPCContext<AppRouter>> = createTRPCContext<AppRouter>();

export const TRPCProvider: typeof trpcContext.TRPCProvider = trpcContext.TRPCProvider;
export const useTRPC: typeof trpcContext.useTRPC = trpcContext.useTRPC;
export const useTRPCClient: typeof trpcContext.useTRPCClient = trpcContext.useTRPCClient;

export const trcpClient = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => isNonJsonSerializable(op.input),
      true: httpLink({
        url: config.trpcUrl,
        async fetch(url, options) {
          const response = await fetch(url, {
            ...options,
            // mandatory to handle cookies from the server
            credentials: 'include',
          });
          return response;
        },
      }),
      false: httpBatchLink({
        url: config.trpcUrl,
        async fetch(url, options) {
          const headers = getRequestHeaders();
          const response = await fetch(url, {
            ...options,
            // mandatory to handle cookies from the server
            credentials: 'include',
            headers: headers ? { ...(options?.headers ?? {}), ...headers } : (options?.headers ?? {})
          });
          return response;
        },
      })
    })
  ],
});