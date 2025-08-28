'use client'

import React, { useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { Analysis } from '../api/analyse/route'
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
import dynamic from 'next/dynamic'
import { Box, VStack } from '@chakra-ui/react'

export default function Analyse() {
  const { t } = useTranslation()
  const [analysis, setAnalysis] = useState<Analysis | undefined>()
  const address = analysis?.map.reverseGeocodingSearchResult?.address

  const LeafletMap = useMemo(() => dynamic(
    () => import('./components/Map/LeafletMap'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])

  return (
    <div className='text-corsica-olive'>
      { !analysis && (
        <AnalyseForm setAnalysis={setAnalysis} />
      )}
      { analysis?.map && (
        <div>
          <div>
            <h2>
              {analysis.name}
            </h2>
            <h4>
              {address?.county}, {address?.state}, {address?.country}{analysis.time && ` - ${format(new Date(analysis.time.meta), 'PP')}`}</h4>
          </div>
          <div>
            <ActiveChartPointProvider>
              <Box>
                <Box height="200px" width="500px">
                  <LeafletMap center={[analysis.map.center.lat, analysis.map.center.lon]} style={{ width: "100%", height: "100%"}}>
                    <MapAnnotations mapAnalysis={analysis.map} points={analysis.points} />
                  </LeafletMap>
                </Box>
                <Box width="full">
                  <TextAnalysisReport analysis={analysis} />
                </Box>
                <VStack width="full" alignItems="start">
                  <Box height="100px" width="full">
                    <ElevationChart analysis={analysis} />
                  </Box>
                  <Box>
                    <ElevationChartHover analysis={analysis} />
                  </Box>
                </VStack>
                { analysis.time && (
                  <Box>
                    <Box height="100px" width="full">
                      <SpeedChart analysis={analysis} />
                    </Box>
                    <Box>
                      <SpeedChartHover analysis={analysis} />
                    </Box>
                  </Box>
                )}
              </Box>
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
