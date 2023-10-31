'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import classNames from 'classnames'
import Link from 'next/link'

function Nav() {
  const [fullPage, setFullPage] = useState(false)
  const { t } = useTranslation()
  const path = usePathname()

  useEffect(() => {
    if (path === '/projects/corsica') {
      setFullPage(true)
    } else {
      setFullPage(false)
    }
  }, [path])

  return (
    <nav className={classNames({
      'w-screen items-center': fullPage,
      'w-80': !fullPage,
      'h-screen bg-corsica-brown flex flex-center': true
    })}>
      <div className="w-full relative">
        <div className="px-2 py-12">
          <h1 className="font-extrabold block w-full text-center text-4xl text-corsica-white font-corsica-title">{t('corsica.components.nav.title')}</h1>
          <h4 className="block w-full text-center text-xl text-corsica-white font-corsica-title">{t('corsica.components.nav.subtitle')}</h4>
        </div>
        <ul className={classNames({
          'flex justify-center': fullPage
        })}>
          <li>
            <Link className={
              classNames({
                'p-2 block w-full text-corsica-white hover:bg-corsica-khaki': path,
                'bg-corsica-khaki': path.indexOf('merge') > -1
              })
            } href="/projects/corsica/merge">
              Merge
            </Link>
          </li>
          <li>
            <Link className={
              classNames({
                'p-2 block w-full text-corsica-white hover:bg-corsica-khaki': path,
                'bg-corsica-khaki': path.indexOf('analyse') > -1
              })
            } href="/projects/corsica/analyse">
              Analyse
            </Link>
          </li>
        </ul>
        <footer className="text-center text-corsica-white absolute bottom-0">
          Made with :
          <ul className="flex justify-center flex-wrap p-4">
            <li className="pr-2">turf.js</li>
            <li className="pr-2">openstreetmap</li>
            <li className="pr-2">leaflet</li>
            <li>nominatim</li>
          </ul>
        </footer>
      </div>
    </nav>
  )
}

export default Nav
