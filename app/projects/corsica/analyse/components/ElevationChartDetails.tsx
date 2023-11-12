import React from 'react'
import { Analysis } from '../../api/analyse/route'
import { useActiveChartPoint } from '../context/ActiveChartPoint'
import { useTranslation } from 'react-i18next'
import { useFormatDuration } from '../hooks/useFormatDuration'
import { intervalToDuration } from 'date-fns'

interface ElevationChartDetailsProps {
    analysis: Analysis
}

export default function ElevationChartDetails({ analysis }: ElevationChartDetailsProps) {
  const { activePoint } = useActiveChartPoint()
  const { t } = useTranslation()
  const formatDuration = useFormatDuration()

  return <div className="h-full text-center grid grid-cols-4 md:flex md:flex-col justify-center">
    <p className="text-sm">
      {t('corsica.pages.analyse.kilometers', { value: activePoint.index > -1 ? Math.round(analysis.distance.distanceVariations[activePoint.index] / 100) / 10 : '-' })}
    </p>
    <p className="text-sm">
      {(activePoint.index > -1 && analysis.time) ? formatDuration(intervalToDuration({ start: 0, end: analysis.time.movingTimeVariations[activePoint.index] })) : '-:-:-'}
    </p>
    <p className="text-sm">
      {t('corsica.pages.analyse.meters', { value: activePoint.index > -1 ? analysis.points[activePoint.index].ele : '-' })}
    </p>
    <p className="text-sm">
      {activePoint.index > -1 ? `${Math.round(analysis.elevation.elevationVariations[activePoint.index].gradient * 10000) / 10}%` : '- %'}
    </p>
  </div>
}
