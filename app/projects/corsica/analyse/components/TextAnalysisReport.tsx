import React, { useMemo } from 'react'
import { Analysis } from '../../api/analyse/route'
import { useTranslation } from 'react-i18next'
import { useFormatDuration } from '../hooks/useFormatDuration'
import { intervalToDuration } from 'date-fns'

interface TextAnalysisReportProps {
    analysis: Analysis
}

export default function TextAnalysisReport({ analysis }: TextAnalysisReportProps) {
  const { t } = useTranslation()
  const formatDuration = useFormatDuration()

  const elapsedTime = useMemo(() => {
    if (analysis) {
      if (!analysis.points[0].time) {
        return undefined
      }
      return intervalToDuration({
        start: new Date(analysis.points[0].time),
        end: new Date(analysis.points[analysis.points.length - 1].time)
      })
    }
  }, [analysis])

  const movingTime = useMemo(() => {
    if (analysis && analysis.time) {
      return intervalToDuration({ start: 0, end: analysis.time.totalMovingTime })
    }
  }, [analysis])

  return (
    <div >
      <div >
        <p >{t('corsica.pages.analyse.kilometers', { value: Math.round(analysis.distance.totalDistance / 100) / 10 })}</p>
        <p >{t('corsica.pages.analyse.totalDistance')}</p>
      </div>
      <div >
        <p >{t('corsica.pages.analyse.meters', { value: Math.round(analysis.elevation.totalElevationGain) })}</p>
        <p >{t('corsica.pages.analyse.totalElevationGain')}</p>
      </div>
      <div >
        <p >{movingTime ? formatDuration(movingTime) : '--' }</p>
        <p >{t('corsica.pages.analyse.movingTime')}</p>
      </div>
      <div >
        <p >{elapsedTime ? formatDuration(elapsedTime) : '--'}</p>
        <p >{t('corsica.pages.analyse.elapsedTime')}</p>
      </div>
      <div >
        {
          analysis.speed && (
            <>
              <p >{t('corsica.pages.analyse.speed', { value: Math.round(analysis.speed.maxSpeed * 100) / 100 })}</p>
              <p >{t('corsica.pages.analyse.maxSpeed')}</p>
            </>
          )}
      </div>
      <div >
        {
          analysis.speed && (
            <>
              <p >{t('corsica.pages.analyse.speed', { value: Math.round(analysis.speed.averageSpeed * 100) / 100 })}</p>
              <p >{t('corsica.pages.analyse.averageSpeed')}</p>
            </>
          )}
      </div>
    </div>
  )
}
