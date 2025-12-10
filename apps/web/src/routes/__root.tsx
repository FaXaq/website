import { Box, ChakraProvider, defaultSystem, VStack } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { NavBar } from "@/components/NavBar";
import { ColorModeProvider } from "@/components/ui/color-mode";
import { AuthProvider } from "@/contexts/AuthContext";
import { getLocale } from "@/paraglide/runtime";
import { trcpClient, TRPCProvider } from "@/utils/trpc/client";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "TanStack Start Starter" }
    ],
  }),
  component: RootLayout,
  ssr: true,
  preload: true,
  loader: async ({ location}) => {
    // early return to prevent prefetching auth on non-auth routes
    if (location.pathname.includes('installHook.js.map')) return { auth: undefined };

    try {
      const auth = await trcpClient.user.me.query();
      return {
        auth: auth ?? undefined,
      };
    } catch (error) {
      console.error(error);
    }
    return {
      auth: undefined,
    };
  },
});

function RootLayout() {
  const { auth } = Route.useLoaderData();

  const queryClient = useMemo(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
        },
      },
    });
  }, []);
  const [trpcClient] = useState(() => trcpClient);

  return (
    <html lang={getLocale()} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ChakraProvider value={defaultSystem}>
          <ColorModeProvider>
            <AuthProvider auth={auth}>
              <QueryClientProvider client={queryClient}>
                <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
                  <VStack bg="bg.subtle" h="100vh" width="100vw" overflow="auto" gap={0}>
                    <Box w="full">
                      <NavBar />
                    </Box>
                    <Box flexGrow={1} w="full" overflow="auto">
                      <Outlet />
                    </Box>
                  </VStack>
                </TRPCProvider>
              </QueryClientProvider>
            </AuthProvider>
          </ColorModeProvider>
        </ChakraProvider>
        <Scripts />
      </body>
    </html>
  );
}