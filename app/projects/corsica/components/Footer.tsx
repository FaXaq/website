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
    <footer>
      <p>Made with :</p>
      <ul>
        <li><a href="https://turfjs.org/" target="_blank" rel="noreferrer">turf.js</a></li>
        <li><a href="https://www.openstreetmap.org" target="_blank" rel="noreferrer">openstreetmap</a></li>
        <li><a href="https://leafletjs.com/" target="_blank" rel="noreferrer">leaflet</a></li>
        <li><a href="https://nominatim.org/" target="_blank" rel="noreferrer">nominatim</a></li>
      </ul>
      <a href="https://github.com/FaXaq/website/tree/master/app/projects/corsica" target="_blank" rel="noreferrer">Code on Github</a>
    </footer>
  )
}

export default Footer
