import { Card, Grid, GridItem, Text } from '@chakra-ui/react';
import type { Analysis } from '@repo/schemas/api/procedures/corsica';
import { intervalToDuration } from 'date-fns';
import React, { useMemo } from 'react';

import { m } from '@/paraglide/messages';

import { useFormatDuration } from './hooks/useFormatDuration';

interface TextAnalysisReportProps {
    analysis: Analysis
}

export default function TextAnalysisReport({ analysis }: TextAnalysisReportProps) {
  const formatDuration = useFormatDuration();

  const elapsedTime = useMemo(() => {
    const lastPoint = analysis.points[analysis.points.length - 1];
    if (analysis) {
      if (!analysis.points[0]?.time || !lastPoint?.time) {
        return undefined;
      }
      return intervalToDuration({
        start: new Date(analysis.points[0].time),
        end: new Date(lastPoint.time)
      });
    }
  }, [analysis]);

  const movingTime = useMemo(() => {
    if (analysis && analysis.time) {
      return intervalToDuration({ start: 0, end: analysis.time.totalMovingTime ?? 0 });
    }
  }, [analysis]);

  return (
    <Card.Root bg="gray.subtle" overflow="hidden" shadow="md">
      <Card.Body>
        <Grid templateColumns="repeat(4, 1fr)" gap={2}>
          <GridItem colSpan={{ base: 4, sm: 2, xl: 4 }} textAlign="center">
            <Text fontSize="4xl" lineClamp="1" title={m['corsica_pages_analyse_kilometers']({ value: Math.round(analysis.distance.totalDistance / 100) / 10 })}>{m['corsica_pages_analyse_kilometers']({ value: Math.round(analysis.distance.totalDistance / 100) / 10 })}</Text>
            <Text textAlign="center">{m['corsica_pages_analyse_totalDistance']()}</Text>
          </GridItem>
          <GridItem colSpan={{ base: 4, sm: 2, xl: 4 }} textAlign="center">
            <Text fontSize="4xl" lineClamp="1">{m['corsica_pages_analyse_meters']({ value: Math.round(analysis.elevation.totalElevationGain) })}</Text>
            <Text textAlign="center">{m['corsica_pages_analyse_totalElevationGain']()}</Text>
          </GridItem>
          <GridItem colSpan={2} lineClamp="1" textAlign="center">
            <Text fontSize="2xl" truncate>{movingTime ? formatDuration(movingTime) : '--' }</Text>
            <Text textAlign="center">{m['corsica_pages_analyse_movingTime']()}</Text>
          </GridItem>
          <GridItem colSpan={2} lineClamp="1" textAlign="center">
            <Text fontSize="2xl" truncate>{elapsedTime ? formatDuration(elapsedTime) : '--'}</Text>
            <Text textAlign="center">{m['corsica_pages_analyse_elapsedTime']()}</Text>
          </GridItem>
          <GridItem colSpan={2}>
            {
              analysis.speed && (
                <>
                  <Text fontSize="2xl" lineClamp="1" textAlign="center">{m['corsica_pages_analyse_speed']({ value: Math.round(analysis.speed.maxSpeed * 100) / 100 })}</Text>
                  <Text textAlign="center">{m['corsica_pages_analyse_maxSpeed']()}</Text>
                </>
              )}
          </GridItem>
          <GridItem colSpan={2}>
            {
              analysis.speed && (
                <>
                  <Text fontSize="2xl" lineClamp="1" textAlign="center">{m['corsica_pages_analyse_speed']({ value: Math.round(analysis.speed.averageSpeed * 100) / 100 })}</Text>
                  <Text textAlign="center">{m['corsica_pages_analyse_averageSpeed']()}</Text>
                </>
              )}
          </GridItem>
        </Grid>
      </Card.Body>
    </Card.Root>
  );
}
