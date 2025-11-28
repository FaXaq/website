import { createMiddleware } from "@tanstack/react-start";

import { authClient } from "@/lib/auth-client";
import { getRequestHeaders } from "@/utils/requestHeaders";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: {
        ...getRequestHeaders() as HeadersInit,
      },
    },
  });

  return next({
    context: {
      session,
    }
  });
});