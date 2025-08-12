'use client'

import React from 'react'

import { useTranslation } from 'next-i18next'

function Header () {
  const { t } = useTranslation()
  return (
    <header >
      <div >
        <div >
          <h1 >
            {t('resume.firstname')}
          </h1>
          <h2 >
            {t('resume.workfield')}
          </h2>
        </div>
      </div>
    </header>
  )
}

export default Header
