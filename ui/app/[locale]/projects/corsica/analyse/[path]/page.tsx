"use client";

import { Box, Button,Grid, GridItem, Heading, Skeleton, VStack } from "@chakra-ui/react";
import { format } from "date-fns";
import { t } from "i18next";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useCustomFileContext } from "../context/CustomFileContext";
import ElevationChart from "./components/ElevationChart";
import ElevationChartHover from './components/ElevationChartDetails';
import MapAnnotations from "./components/MapAnnotations";
import SpeedChart from "./components/SpeedChart";
import SpeedChartHover from './components/SpeedChartDetails';
import TextAnalysisReport from "./components/TextAnalysisReport";
import { ActiveChartPointProvider } from "./context/ActiveChartPoint";


const FILES_URL = '/projects/corsica/api/files';
const ANALYSE_URL = '/projects/corsica/api/analyse';

export default function AnalyseFile() {
  const { path } = useParams();
  const { analysis, setAnalysis } = useCustomFileContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const address = analysis?.map?.reverseGeocodingSearchResult?.address;

  const fetchAndAnalyseExample = async (path: string) => {
    setIsLoading(true);
    const analyseResponse = await fetch(`${FILES_URL}/${encodeURIComponent(path)}`);
    const fileData = await analyseResponse.blob();

    const body = new FormData();
    body.append(`file-[0]`, fileData, path);

    const response = await fetch(ANALYSE_URL, {
      method: 'POST',
      body
    });

    setAnalysis(await response.json());
    setIsLoading(false);
  };

  useEffect(() => {
    if (path !== "custom" && !analysis) {
      fetchAndAnalyseExample(path as string);
    }
  }, [path, analysis]);

  const LeafletMap = useMemo(() => dynamic(
    async () => import('./components/Map/LeafletMap'),
    {
      loading: () => <Skeleton height="100%" width="100%" />,
      ssr: false
    }
  ), []);

  return <Box w="full">
    {
      isLoading && (
        <Skeleton w="full" h={100} />
      )
    }
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
  </Box>;
}