import React from 'react'
import { Analysis } from '../../api/analyse/route'
import { useTranslation } from 'react-i18next'
import { useActiveChartPoint } from '../context/ActiveChartPoint'

interface SpeedChartDetailsProps {
    analysis: Analysis
}

export default function SpeedChartDetails({ analysis }: SpeedChartDetailsProps) {
  const { activePoint } = useActiveChartPoint()
  const { t } = useTranslation()

  return <div >
    <p >
      {analysis.speed && t('corsica.pages.analyse.speed', { value: activePoint.index > -1 ? Math.round(analysis.speed.speedVariations[activePoint.index] * 10) / 10 : '-' })}
    </p>
  </div>
}
