'use client'

import React from 'react'
import MTTSLogo from '../../../components/images/mtts-logo'
import { useTranslation } from 'next-i18next'

function MTTSHeader () {
  const { t } = useTranslation()
  return (
    <div className="bg-mtts-dark-violet text-mtts-white">
      <div className="container mx-auto py-56 px-4 md:px-0">
        <div className="w-56">
          <MTTSLogo />
        </div>
        <h1 className="text-6xl md:text-7xl">{t('mtts.pages.index.title')}</h1>
        <h6 className="text-2xl">{t('mtts.pages.index.subtitle')}</h6>
      </div>
    </div>
  )
}

export default MTTSHeader
