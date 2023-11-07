import React from 'react'
import { Analysis } from '../../api/analyse/route'
import { useTranslation } from 'react-i18next'
import { useActiveChartPoint } from '../Context/ActiveChartPoint'

interface SpeedChartDetailsProps {
    analysis: Analysis
}

export default function SpeedChartDetails({ analysis }: SpeedChartDetailsProps) {
  const { activePoint } = useActiveChartPoint()
  const { t } = useTranslation()

  return <div className="h-full flex flex-col justify-center text-center">
    <p className="text-sm">
      {analysis.speed && t('corsica.pages.analyse.speed', { value: activePoint.index > -1 ? Math.round(analysis.speed.speedVariations[activePoint.index] * 10) / 10 : '-' })}
    </p>
  </div>
}
