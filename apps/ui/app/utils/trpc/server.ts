import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { headers } from "next/headers";

import { getServerConfig } from "@/lib/config";

import type { AppRouter } from "./types";

export const trpcServer = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: getServerConfig().trpcUrl,
      // You can pass any HTTP headers you wish here
      headers: async () => {
        const h = await headers();
        return h;
      }
    }),
  ],
});