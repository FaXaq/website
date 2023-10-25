'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'

const NoMicAccess = () => {
  const { t } = useTranslation()
  return (
    <div className="">
      <p>{t('mtts.tuner.needMicAccess')}</p>
    </div>
  )
}

export default NoMicAccess
