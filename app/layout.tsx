'use client'

import React from 'react'

import '../styles/main.scss'
import '../i18n'
import { useTranslation } from 'next-i18next'
import PlausibleProvider from 'next-plausible'

interface AppLayoutProps {
  children: React.ReactNode
}

// eslint-disable-next-line react/prop-types
function AppLayout ({ children }: AppLayoutProps) {
  const { i18n } = useTranslation()
  return (
    <html lang={i18n.language}>
      <head>
        <PlausibleProvider domain="norra.fr" />
      </head>
      <body>
        { children }
      </body>
    </html>
  )
}

export default AppLayout
