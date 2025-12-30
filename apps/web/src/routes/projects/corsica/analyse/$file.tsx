import { Box, Button,Grid, GridItem, Heading, Skeleton, VStack } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { format } from "date-fns";
import { t } from "i18next";
import { useEffect, useState } from "react";

import { ActiveChartPointProvider } from "@/components/corsica/analyse/context/ActiveChartPoint";
import { useCustomFileContext } from "@/components/corsica/analyse/context/CustomFileContext";
import ElevationChart from "@/components/corsica/analyse/ElevationChart";
import ElevationChartHover from '@/components/corsica/analyse/ElevationChartDetails';
import LeafletMap from "@/components/corsica/analyse/Map/LeafletMap";
import MapAnnotations from "@/components/corsica/analyse/MapAnnotations";
import SpeedChart from "@/components/corsica/analyse/SpeedChart";
import SpeedChartHover from '@/components/corsica/analyse/SpeedChartDetails';
import TextAnalysisReport from "@/components/corsica/analyse/TextAnalysisReport";
import { useTRPC } from "@/lib/trpc/client";

export const Route = createFileRoute('/projects/corsica/analyse/$file')({
  component: RouteComponent,
  ssr: false
});

function RouteComponent() {
  const { file } = Route.useParams();
  const { analysis, setAnalysis } = useCustomFileContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const trpc = useTRPC();
  const analyseGpxMutation = useMutation(trpc.corsica.analyseGPX.mutationOptions({}));
  const address = analysis?.map?.reverseGeocodingSearchResult?.address;
  const navigate = useNavigate();

  const fetchAndAnalyseExample = async (path: string) => {
    setIsLoading(true);
    const analysis = await analyseGpxMutation.mutateAsync({
      id: decodeURIComponent(path),
      example: true
    });
    setAnalysis(analysis);
    setIsLoading(false);
  };

  useEffect(() => {
    if (file !== "custom" && !analysis) {
      fetchAndAnalyseExample(file as string);
    }
  }, [file, analysis]);

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
            {address?.county}, {address?.state}, {address?.country}{analysis.time && ` - ${format(new Date(analysis.time.meta ?? ''), 'PP')}`}
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
            onClick={async () => navigate({ to: '/projects/corsica/analyse' })}
            loading={false}
          >
            {t('corsica.pages.analyse.retry')}
          </Button>
        </ActiveChartPointProvider>
      </Box>
    )}
  </Box>;
}
