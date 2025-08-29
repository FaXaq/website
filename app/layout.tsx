'use client'

import React, { Suspense, useEffect } from 'react'

import '../i18n'
import { useTranslation } from 'next-i18next'
import PlausibleProvider from 'next-plausible'
import { Provider } from './components/ui/provider'
import { NavBar } from './components/NavBar'
import { LocaleContext } from './components/LocaleSelector'
import { useSearchParam } from './hooks/useSearchParam'
import { LocaleEnum } from '../i18n'
import { Box } from '@chakra-ui/react'

interface AppLayoutProps {
  children: React.ReactNode
}

// eslint-disable-next-line react/prop-types
function AppLayout ({ children }: AppLayoutProps) {
  const { i18n } = useTranslation()

  const [locale, setLocale] = useSearchParam('locale', LocaleEnum.en);

  useEffect(() => {
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [i18n, locale]);

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
  )
}

export default function SuspendedAppLayout(props: AppLayoutProps) {
  return <Suspense><AppLayout {...props} /></Suspense>
}
