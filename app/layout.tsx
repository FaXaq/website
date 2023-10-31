'use client'

import React from 'react'

import '../styles/tailwind.scss'
import '../styles/main.scss'
import 'leaflet/dist/leaflet.css'
import '../i18n'
import { useTranslation } from 'next-i18next'

interface AppLayoutProps {
  children: React.ReactNode
}

// eslint-disable-next-line react/prop-types
function AppLayout ({ children }: AppLayoutProps) {
  const { i18n } = useTranslation()
  return (
    <html lang={i18n.language}>
      <body>
        { children }
      </body>
    </html>
  )
}

export default AppLayout
