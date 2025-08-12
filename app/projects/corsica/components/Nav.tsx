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
    <nav>
      <div>
        <div >
          <h1 >{t('corsica.components.nav.title')}</h1>
          <h4>{t('corsica.components.nav.subtitle')}</h4>
        </div>
        <ul>
          <li>
            <Link href="/projects/corsica/merge">
              Merge
            </Link>
          </li>
          <li>
            <Link href="/projects/corsica/analyse">
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
