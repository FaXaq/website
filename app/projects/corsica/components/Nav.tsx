'use client'

import React from 'react'
import { useIsAtRootPage } from '../hooks/isAtRootPage'
import { useTranslation } from 'next-i18next'
import classNames from 'classnames'
import Link from 'next/link'
import Footer from './Footer'
import { usePathname } from 'next/navigation'

function Nav() {
  const fullPage = useIsAtRootPage()
  const path = usePathname()
  const { t } = useTranslation()

  return (
    <nav className={classNames({
      'w-screen h-screen items-center': fullPage,
      'md:w-80': !fullPage,
      'md:h-screen bg-corsica-brown flex flex-center': true
    })}>
      <div className={classNames({
        'w-full h-full relative flex flex-col items-center': true,
        'justify-center': fullPage
      })}>
        <div className="px-2 py-4 md:py-12">
          <h1 className="font-extrabold block w-full text-center text-4xl text-corsica-white font-corsica-title">{t('corsica.components.nav.title')}</h1>
          <h4 className={classNames({
            'hidden md:block': !fullPage,
            'w-full text-center text-xl text-corsica-white font-corsica-title': true,
            block: fullPage
          })}>{t('corsica.components.nav.subtitle')}</h4>
        </div>
        <ul className={classNames({
          'flex md:justify-center': fullPage,
          'flex md:block md:w-full self-start': !fullPage
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
        <Footer nav={true} />
      </div>
    </nav>
  )
}

export default Nav
