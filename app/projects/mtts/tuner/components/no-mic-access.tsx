'use client'

import React from 'react'
import { useTranslation } from 'next-i18next'

const NoMicAccess = () => {
  const { t } = useTranslation()
  return (
    <div className="">
      <p>{t('mtts.tuner.needMicAccess')}</p>
    </div>
  )
}

export default NoMicAccess
