'use client'

import React from 'react'
import Nav from './components/Nav'
import { usePathname } from 'next/navigation'
import Footer from './components/Footer'

interface CorsicaLayoutProps {
    children: React.ReactNode
}

function CorsicaLayout({ children }: CorsicaLayoutProps) {
  const path = usePathname()

  return (
    <div >
      <Nav />
      {path !== '/projects/corsica' && (
        <div >
          <div >
            {children}
          </div>
          <Footer nav={false} />
        </div>
      )}
    </div>
  )
}

export default CorsicaLayout
