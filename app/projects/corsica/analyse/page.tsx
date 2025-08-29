'use client'

import React, { useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { Analysis } from '../api/analyse/route'
import MapAnnotations from './components/MapAnnotations'
import { format } from 'date-fns'
import AnalyseForm from './components/AnalyseForm'
import TextAnalysisReport from './components/TextAnalysisReport'
import ElevationChart from './components/ElevationChart'
import './recharts.scss'
import SpeedChart from './components/SpeedChart'
import { ActiveChartPointProvider } from './context/ActiveChartPoint'
import ElevationChartHover from './components/ElevationChartDetails'
import SpeedChartHover from './components/SpeedChartDetails'
import dynamic from 'next/dynamic'
import { Box, Grid, GridItem, Heading, Button, Skeleton, VStack } from '@chakra-ui/react'

export default function Analyse() {
  const { t } = useTranslation()
  const [analysis, setAnalysis] = useState<Analysis | undefined>()
  const address = analysis?.map.reverseGeocodingSearchResult?.address

  const LeafletMap = useMemo(() => dynamic(
    () => import('./components/Map/LeafletMap'),
    {
      loading: () => <Skeleton height="100%" width="100%" />,
      ssr: false
    }
  ), [])

  return (
    <Box w="full">
      { !analysis && (
        <AnalyseForm setAnalysis={setAnalysis} />
      )}
      { analysis?.map && (
        <Box w="full">
          <Box>
            <Heading as="h2" size="xl">
              {analysis.name}
            </Heading>
            <Heading as="h4" size="sm">
              {address?.county}, {address?.state}, {address?.country}{analysis.time && ` - ${format(new Date(analysis.time.meta), 'PP')}`}
            </Heading>
          </Box>
          <ActiveChartPointProvider>
            <Grid templateColumns="repeat(4, 1fr)" gap={6} py={6}>
              <GridItem colSpan={{ base: 4, md: 2, xl: 3 }} minHeight="300px">
                <LeafletMap center={[analysis.map.center.lat, analysis.map.center.lon]} style={{ width: "100%", height: "100%"}}>
                  <MapAnnotations mapAnalysis={analysis.map} points={analysis.points} />
                </LeafletMap>
              </GridItem>
              <GridItem colSpan={{ base: 4, md: 2, xl: 1 }}>
                <VStack justifyContent="center" h="full">
                  <TextAnalysisReport analysis={analysis} />
                </VStack>
              </GridItem>
              <GridItem colSpan={{ base: 4, md: 3 }}>
                <ElevationChart analysis={analysis} />
              </GridItem>
              <GridItem colSpan={{ base: 4, md: 1 }} minH="100px">
                <ElevationChartHover analysis={analysis} />
              </GridItem>
              { analysis.time && (
                <>
                  <GridItem colSpan={{ base: 4, md: 3 }}>
                      <SpeedChart analysis={analysis} />
                  </GridItem>
                  <GridItem colSpan={{ base: 4, md: 1 }} minH="100px">
                      <SpeedChartHover analysis={analysis} />
                  </GridItem>
                </>
              )}
            </Grid>
            <Button
              type="button"
              onClick={() => setAnalysis(undefined)}
              loading={false}
            >
              {t('corsica.pages.analyse.retry')}
            </Button>
          </ActiveChartPointProvider>
        </Box>
      )}
    </Box>
  )
}
