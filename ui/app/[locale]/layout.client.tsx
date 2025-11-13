'use client';

import '../../i18n';

import { Box, VStack } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import PlausibleProvider from 'next-plausible';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LocaleContext } from '@/components/LocaleSelector';
import { NavBar } from '@/components/NavBar';
import { Provider } from '@/components/ui/provider';

import type { Response } from '../../api.client';
import { AuthProvider } from './contexts/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode,
  user?: Response<"get", "/users/me">
}


export function AppLayout ({ user, children }: AppLayoutProps) {
  const { i18n } = useTranslation();
  const { locale: urlLocale } = useParams();
  const router = useRouter();

  const [locale, setLocale] = useState<string>(urlLocale as string);

  useEffect(() => {
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(urlLocale as string);
      document.cookie = `NEXT_LOCALE=${locale}; max-age=31536000; path=/`;

    }
  }, [i18n, urlLocale]);


  useEffect(() => {
    if (urlLocale && locale !== urlLocale) {
      const oldUrl = location.pathname;
      const newUrl = oldUrl.replace(`/${urlLocale}`, `/${locale}`);
      router.push(newUrl);
    }
  }, [locale, urlLocale]);

  const queryClient = new QueryClient();

  return (
    <html lang={i18n.language} suppressHydrationWarning>
      <head>
        <PlausibleProvider domain="norra.fr" />
      </head>
      <body>
        <AuthProvider auth={user}>
          <QueryClientProvider client={queryClient}>
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
          </QueryClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}