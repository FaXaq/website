'use client';

import '../../i18n';

import { Box } from '@chakra-ui/react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'next-i18next';
import PlausibleProvider from 'next-plausible';
import React, { Suspense, useEffect, useState } from 'react';

import { LocaleContext } from '@/components/LocaleSelector';
import { NavBar } from '@/components/NavBar';
import { Provider } from '@/components/ui/provider';

interface AppLayoutProps {
  children: React.ReactNode
}

// eslint-disable-next-line react/prop-types
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
            <Box bg="bg.subtle" h="100vh" width="100vw" overflow="auto">
              <NavBar />
              { children }
            </Box>
          </Provider>
        </LocaleContext.Provider>
      </body>
    </html>
  );
}

export default function SuspendedAppLayout(props: AppLayoutProps) {
  return <Suspense><AppLayout {...props} /></Suspense>;
}
