'use client'

import React from 'react'

import Mountains from '../../components/images/mountains'
import { useTranslation } from 'next-i18next'
import LocaleSelector from '../../components/locale-selector'

function Header () {
  const { t } = useTranslation()
  return (
    <header className="relative">
      <div className="absolute top-0 right-0 z-10">
        <LocaleSelector />
      </div>
      <div className="py-32 md:py-64 max-h-screen relative bg-dark-marine w-full">
        <div className="container h-full px-4 lg:px-0 mx-auto flex flex-col justify-center">
          <h1 className="text-light-sand text-6xl md:text-7xl font-black">
            {t('resume.firstname')}
          </h1>
          <h2 className="text-dark-sand text-2xl md:text-3xl">
            {t('resume.workfield')}
          </h2>
        </div>
        <div className="absolute bottom-0 w-full">
          <Mountains />
        </div>
      </div>
    </header>
  )
}

export default Header
