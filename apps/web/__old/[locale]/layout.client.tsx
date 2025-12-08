'use client';

import '../../i18n';

import { Box, VStack } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink, httpLink, isNonJsonSerializable, splitLink } from '@trpc/client';
import { useParams, useRouter } from 'next/navigation';
import PlausibleProvider from 'next-plausible';
import React, { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LocaleContext } from '@/components/LocaleSelector';
import { NavBar } from '@/components/NavBar';
import { Provider } from '@/components/ui/provider';
import type { AuthUser } from '@/contexts/AuthContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { getClientConfig, getServerConfig, isServer } from '@/lib/config';
import { TRPCProvider } from '@/utils/trpc/client';
import type { AppRouter } from '@/utils/trpc/types';

interface AppLayoutProps {
  auth?: AuthUser,
  children: React.ReactNode
}


function AppLayout ({ children, auth }: AppLayoutProps) {
  const { i18n } = useTranslation();
  const { locale: urlLocale } = useParams();
  const router = useRouter();

  const [locale, setLocale] = useState<string>(urlLocale as string);

  useEffect(() => {
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(urlLocale as string);
    }
  }, [i18n, urlLocale]);


  useEffect(() => {
    if (urlLocale && locale !== urlLocale) {
      const oldUrl = location.pathname;
      const newUrl = oldUrl.replace(`/${urlLocale}`, `/${locale}`);
      router.push(newUrl);
    }
  }, [locale, urlLocale]);

  function makeQueryClient() {
    return new QueryClient({
      defaultOptions: {
        queries: {
          // With SSR, we usually want to set some default staleTime
          // above 0 to avoid refetching immediately on the client
          staleTime: 60 * 1000,
        },
      },
    });
  }

  let browserQueryClient: QueryClient | undefined = undefined;

  function getQueryClient() {
    if (typeof window === 'undefined') {
      // Server: always make a new query client
      return makeQueryClient();
    } else {
      // Browser: make a new query client if we don't already have one
      // This is very important, so we don't re-make a new client if React
      // suspends during the initial render. This may not be needed if we
      // have a suspense boundary BELOW the creation of the query client
      if (!browserQueryClient) browserQueryClient = makeQueryClient();
      return browserQueryClient;
    }
  }
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() => createTRPCClient<AppRouter>({
    links: [
      splitLink({
        condition: (op) => isNonJsonSerializable(op.input),
        true: httpLink({
          url: isServer ? getServerConfig().trpcUrl : getClientConfig().trpcUrl,
          async fetch(url, options) {
            const response = await fetch(url, {
              ...options,
              // mandatory to handle cookies from the server
              credentials: 'include'
            });
            return response;
          },
        }),
        false: httpBatchLink({
          url: isServer ? getServerConfig().trpcUrl : getClientConfig().trpcUrl,
          async fetch(url, options) {
            const response = await fetch(url, {
              ...options,
              // mandatory to handle cookies from the server
              credentials: 'include'
            });
            return response;
          },
        })
      })
    ],
  }));

  return (
    <html lang={i18n.language} suppressHydrationWarning>
      <head>
        <PlausibleProvider domain="norra.fr" />
      </head>
      <body>
        <AuthProvider auth={auth}>
          <QueryClientProvider client={queryClient}>
            <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
              <LocaleContext.Provider
                value={{
                  locale,
                  setLocale
                }}
              >
                <Provider>
                  <VStack bg="bg.subtle" h="100vh" width="100vw" overflow="auto" gap={0}>
                    <Box w="full">
                      <NavBar />
                    </Box>
                    <Box flexGrow={1} w="full" overflow="auto">
                      { children }
                    </Box>
                  </VStack>
                </Provider>
              </LocaleContext.Provider>
            </TRPCProvider>
          </QueryClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

export default function SuspendedAppLayout(props: AppLayoutProps) {
  return <Suspense><AppLayout {...props} /></Suspense>;
}
