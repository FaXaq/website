'use client'

import React, { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { Analysis } from '../api/analyse/route'
import LeafletMap from './components/LeafletMap'
import MapAnnotations from './components/MapAnnotations'
import CyclingIcon from '../components/CyclingIcon'
import { format } from 'date-fns'
import Button from '../components/Button'
import AnalyseForm from './components/AnalyseForm'
import TextAnalysisReport from './components/TextAnalysisReport'
import ElevationChart from './components/ElevationChart'
import './recharts.scss'
import SpeedChart from './components/SpeedChart'

export default function Analyse() {
  const { t } = useTranslation()
  const [analysis, setAnalysis] = useState<Analysis | void>()
  const [activeIndex] = useState<number | void>()

  return (
    <div className='text-corsica-olive'>
      { !analysis && (
        <AnalyseForm setAnalysis={setAnalysis} />
      )}
      { analysis && analysis.map && (
        <div>
          <div className="pb-4">
            <h2 className="flex items-center text-3xl font-bold font-corsica-title text-corsica-olive">
              {analysis.name}
            </h2>
            <h4 className="flex items-center">
              {analysis.activity === 'cycling' && (
                <span className="inline-block h-6 pr-2">
                  <CyclingIcon />
                </span>
              )}
              {analysis.map.reverseGeocodingSearchResult.address.county}, {analysis.map.reverseGeocodingSearchResult.address.state}, {analysis.map.reverseGeocodingSearchResult.address.country}{analysis.time && ` - ${format(new Date(analysis.time.meta), 'PP')}`}</h4>
          </div>
          <div>
            <div className="grid grid-cols-4">
              <div className='col-span-3 h-80'>
                <LeafletMap center={[analysis.map.center.lat, analysis.map.center.lon]} className='w-full h-full'>
                  <MapAnnotations mapAnalysis={analysis.map} points={analysis.points} activePoint={activeIndex} />
                </LeafletMap>
              </div>
              <TextAnalysisReport analysis={analysis} />
              <div className='py-4 col-span-6 md:col-span-6 h-48'>
                <ElevationChart analysis={analysis} />
              </div>
              { analysis.time && (
                <div className="h-48 col-span-4">
                  <SpeedChart analysis={analysis} />
                </div>
              )}
            </div>
            <Button
              type="button"
              onClick={() => setAnalysis()}
              loading={false}
            >
              {t('corsica.pages.analyse.retry')}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
