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
    <div className="flex flex-col md:flex-row h-screen w-screen">
      <Nav />
      {path !== '/projects/corsica' && (
        <div className="grow overflow-auto bg-white w-full flex flex-col">
          <div className="p-6 w-full grow overflow-auto">
            {children}
          </div>
          <Footer nav={false} />
        </div>
      )}
    </div>
  )
}

export default CorsicaLayout
