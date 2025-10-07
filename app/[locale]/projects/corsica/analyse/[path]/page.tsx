"use client"

import { Box, Grid, GridItem, Heading, Skeleton, VStack, Button } from "@chakra-ui/react"
import TextAnalysisReport from "./components/TextAnalysisReport"
import MapAnnotations from "./components/MapAnnotations"
import { ActiveChartPointProvider } from "./context/ActiveChartPoint"
import ElevationChart from "./components/ElevationChart"
import SpeedChart from "./components/SpeedChart"
import { useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import ElevationChartHover from './components/ElevationChartDetails'
import SpeedChartHover from './components/SpeedChartDetails'
import { useParams } from "next/navigation"
import { useCustomFileContext } from "../context/CustomFileContext"
import { format } from "date-fns"
import { t } from "i18next"
import { S3_PATH_PREFIX } from "../../const"
import { Analysis } from "../types"


const FILES_URL = '/projects/corsica/api/files'
const ANALYSE_URL = '/projects/corsica/api/analyse'

export default function AnalyseFile() {
  const { path } = useParams();
  const { analysis, setAnalysis } = useCustomFileContext();
  const address = analysis?.map?.reverseGeocodingSearchResult?.address;

  const fetchAndAnalyseExample = async (path: string) => {
    const analyseResponse = await fetch(`${FILES_URL}/${encodeURIComponent(path)}`);
    const fileData = await analyseResponse.blob();

    const body = new FormData();
    body.append(`file-[0]`, fileData, path);

    const response = await fetch(ANALYSE_URL, {
      method: 'POST',
      body
    })

    setAnalysis(await response.json());
  }

  useEffect(() => {
    if (path !== "custom" && !analysis) {
      fetchAndAnalyseExample(path as string);
    }
  }, [path, analysis])

  const LeafletMap = useMemo(() => dynamic(
    () => import('./components/Map/LeafletMap'),
    {
      loading: () => <Skeleton height="100%" width="100%" />,
      ssr: false
    }
  ), [])

  return <Box w="full">
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
              <GridItem colSpan={{ base: 4, md: 2, xl: 3 }} minHeight="300px" rounded="md" overflow="hidden">
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
}