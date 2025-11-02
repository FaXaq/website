'use client';

import '../../i18n';

import { Box, VStack } from '@chakra-ui/react';
import { useParams, useRouter } from 'next/navigation';
import PlausibleProvider from 'next-plausible';
import React, { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LocaleContext } from '@/components/LocaleSelector';
import { NavBar } from '@/components/NavBar';
import { Provider } from '@/components/ui/provider';

interface AppLayoutProps {
  children: React.ReactNode
}


function AppLayout ({ children }: AppLayoutProps) {
  const { i18n } = useTranslation();
  const { locale: urlLocale } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(urlLocale as string);
    }
  }, [i18n, urlLocale]);

  const [locale, setLocale] = useState<string>(urlLocale as string);

  useEffect(() => {
    if (urlLocale && locale !== urlLocale) {
      const oldUrl = location.pathname;
      const newUrl = oldUrl.replace(`/${urlLocale}`, `/${locale}`);
      router.push(newUrl);
    }
  }, [locale]);

  return (
    <html lang={i18n.language} suppressHydrationWarning>
      <head>
        <PlausibleProvider domain="norra.fr" />
      </head>
      <body>
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
      </body>
    </html>
  );
}

export default function SuspendedAppLayout(props: AppLayoutProps) {
  return <Suspense><AppLayout {...props} /></Suspense>;
}
