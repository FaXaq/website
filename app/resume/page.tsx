'use client'

import React from 'react'

import Header from './components/header'
import Footer from './components/footer'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'

function HomePage () {
  const { t } = useTranslation()

  return (
    <div>
      <Header />
      <div>
        <p>
          {t('resume.description')}
        </p>
        <main>
          <p>{t('resume.howItWorks')}</p>
          <div>
            <div>
              <Link href="/resume/full">{t('resume.fullCTA')}</Link>
            </div>
            <div>
              <Link href="/resume/developer">{t('resume.developerCTA')}</Link>
            </div>
            <div>
              <Link href="/resume/manager">{t('resume.managerCTA')}</Link>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default HomePage
