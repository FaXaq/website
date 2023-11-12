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
import { ActiveChartPointProvider } from './context/ActiveChartPoint'
import ElevationChartHover from './components/ElevationChartDetails'
import SpeedChartHover from './components/SpeedChartDetails'

export default function Analyse() {
  const { t } = useTranslation()
  const [analysis, setAnalysis] = useState<Analysis | undefined>()
  const address = analysis?.map.reverseGeocodingSearchResult?.address

  return (
    <div className='text-corsica-olive'>
      { !analysis && (
        <AnalyseForm setAnalysis={setAnalysis} />
      )}
      { analysis?.map && (
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
              {address?.county}, {address?.state}, {address?.country}{analysis.time && ` - ${format(new Date(analysis.time.meta), 'PP')}`}</h4>
          </div>
          <div>
            <ActiveChartPointProvider>
              <div className="md:grid md:grid-cols-4">
                <div className='md:col-span-4 h-56'>
                  <LeafletMap center={[analysis.map.center.lat, analysis.map.center.lon]} className='w-full h-full'>
                    <MapAnnotations mapAnalysis={analysis.map} points={analysis.points} />
                  </LeafletMap>
                </div>
                <div className='md:col-span-4'>
                  <TextAnalysisReport analysis={analysis} />
                </div>
                <div className='py-4 md:col-span-4 flex flex-col md:grid md:grid-cols-8 h-32'>
                  <div className="grow md:col-span-7">
                    <ElevationChart analysis={analysis} />
                  </div>
                  <div className='md:col-span-1 md:ml-2 bg-corsica-white'>
                    <ElevationChartHover analysis={analysis} />
                  </div>
                </div>
                { analysis.time && (
                  <div className="py-4 col-span-4 flex flex-col md:grid md:grid-cols-8 h-32">
                    <div className="grow  md:col-span-7">
                      <SpeedChart analysis={analysis} />
                    </div>
                    <div className="md:col-span-1 md:ml-2 bg-corsica-white">
                      <SpeedChartHover analysis={analysis} />
                    </div>
                  </div>
                )}
              </div>
            </ActiveChartPointProvider>
            <Button
              type="button"
              onClick={() => setAnalysis(undefined)}
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
