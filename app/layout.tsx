'use client'

import React from 'react'

import '../styles/tailwind.scss'
import '../styles/main.scss'
import 'leaflet/dist/leaflet.css'
import '../i18n'

interface AppLayoutProps {
  children: React.ReactNode
}

// eslint-disable-next-line react/prop-types
function AppLayout ({ children }: AppLayoutProps) {
  return (
    <html>
      <body>
        { children }
      </body>
    </html>
  )
}

export default AppLayout
