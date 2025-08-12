'use client'

import React from 'react'
import MTTSLogo from '../../../components/images/mtts-logo'
import { useTranslation } from 'next-i18next'

function MTTSHeader () {
  const { t } = useTranslation()
  return (
    <div >
      <div >
        <div >
          <MTTSLogo />
        </div>
        <h1 >{t('mtts.pages.index.title')}</h1>
        <h6 >{t('mtts.pages.index.subtitle')}</h6>
      </div>
    </div>
  )
}

export default MTTSHeader
