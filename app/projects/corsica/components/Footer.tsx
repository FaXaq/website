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
      'bg-corsica-brown py-2 w-full': true,
      'block absolute bottom-0': fullPage || nav,
      'md:hidden self-end': !nav,
      'hidden md:block': nav && !fullPage,
      'text-center text-corsica-white': true
    })}>
      <p>Made with :</p>
      <ul className="flex justify-center flex-wrap py-2 px-4">
        <li className="pr-2"><a href="https://turfjs.org/" target="_blank" rel="noreferrer">turf.js</a></li>
        <li className="pr-2"><a href="https://www.openstreetmap.org" target="_blank" rel="noreferrer">openstreetmap</a></li>
        <li className="pr-2"><a href="https://leafletjs.com/" target="_blank" rel="noreferrer">leaflet</a></li>
        <li><a href="https://nominatim.org/" target="_blank" rel="noreferrer">nominatim</a></li>
      </ul>
      <a href="https://github.com/FaXaq/website/tree/master/app/projects/corsica" target="_blank" rel="noreferrer">Code on Github</a>
    </footer>
  )
}

export default Footer
