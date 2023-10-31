'use client'

import React from 'react'
import Nav from './components/Nav'
import { usePathname } from 'next/navigation'

interface CorsicaLayoutProps {
    children: React.ReactNode
}

function CorsicaLayout({ children }: CorsicaLayoutProps) {
  const path = usePathname()

  return (
    <div className="flex">
      <Nav />
      {path !== '/projects/corsica' && (
        <div className="p-6 bg-corsica-white w-full h-screen overflow-auto">
          {children}
        </div>
      )}
    </div>
  )
}

export default CorsicaLayout
