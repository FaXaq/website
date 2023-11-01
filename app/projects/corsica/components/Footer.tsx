'use client'

import classNames from 'classnames'
import React from 'react'
import { useIsAtRootPage } from '../hooks/isAtRootPage'

interface FooterProps {
    nav: boolean
}

function Footer({ nav }: FooterProps) {
  const fullPage = useIsAtRootPage()

  return (
    <footer className={classNames({
      'bg-corsica-brown py-2': true,
      'block absolute bottom-0': fullPage || nav,
      'md:hidden self-end': !nav,
      'hidden md:block': nav && !fullPage,
      'text-center text-corsica-white': true
    })}>
      <p>Made with :</p>
      <ul className="flex justify-center flex-wrap py-2 px-4">
        <li className="pr-2">turf.js</li>
        <li className="pr-2">openstreetmap</li>
        <li className="pr-2">leaflet</li>
        <li>nominatim</li>
      </ul>
    </footer>
  )
}

export default Footer
