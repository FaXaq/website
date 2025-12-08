import { Card, Grid, GridItem, Text } from '@chakra-ui/react';
import type { Analysis } from '@repo/schemas/api/procedures/corsica';
import { intervalToDuration } from 'date-fns';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useFormatDuration } from '../../hooks/useFormatDuration';

interface TextAnalysisReportProps {
    analysis: Analysis
}

export default function TextAnalysisReport({ analysis }: TextAnalysisReportProps) {
  const { t } = useTranslation();
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
      return intervalToDuration({ start: 0, end: analysis.time.totalMovingTime });
    }
  }, [analysis]);

  return (
    <Card.Root bg="gray.subtle" overflow="hidden" shadow="md">
      <Card.Body>
        <Grid templateColumns="repeat(4, 1fr)" gap={2}>
          <GridItem colSpan={{ base: 4, sm: 2, xl: 4 }} textAlign="center">
            <Text fontSize="4xl" lineClamp="1" title={t('corsica.pages.analyse.kilometers', { value: Math.round(analysis.distance.totalDistance / 100) / 10 })}>{t('corsica.pages.analyse.kilometers', { value: Math.round(analysis.distance.totalDistance / 100) / 10 })}</Text>
            <Text textAlign="center">{t('corsica.pages.analyse.totalDistance')}</Text>
          </GridItem>
          <GridItem colSpan={{ base: 4, sm: 2, xl: 4 }} textAlign="center">
            <Text fontSize="4xl" lineClamp="1">{t('corsica.pages.analyse.meters', { value: Math.round(analysis.elevation.totalElevationGain) })}</Text>
            <Text textAlign="center">{t('corsica.pages.analyse.totalElevationGain')}</Text>
          </GridItem>
          <GridItem colSpan={2} lineClamp="1" textAlign="center">
            <Text fontSize="2xl" truncate>{movingTime ? formatDuration(movingTime) : '--' }</Text>
            <Text textAlign="center">{t('corsica.pages.analyse.movingTime')}</Text>
          </GridItem>
          <GridItem colSpan={2} lineClamp="1" textAlign="center">
            <Text fontSize="2xl" truncate>{elapsedTime ? formatDuration(elapsedTime) : '--'}</Text>
            <Text textAlign="center">{t('corsica.pages.analyse.elapsedTime')}</Text>
          </GridItem>
          <GridItem colSpan={2}>
            {
              analysis.speed && (
                <>
                  <Text fontSize="2xl" lineClamp="1" textAlign="center">{t('corsica.pages.analyse.speed', { value: Math.round(analysis.speed.maxSpeed * 100) / 100 })}</Text>
                  <Text textAlign="center">{t('corsica.pages.analyse.maxSpeed')}</Text>
                </>
              )}
          </GridItem>
          <GridItem colSpan={2}>
            {
              analysis.speed && (
                <>
                  <Text fontSize="2xl" lineClamp="1" textAlign="center">{t('corsica.pages.analyse.speed', { value: Math.round(analysis.speed.averageSpeed * 100) / 100 })}</Text>
                  <Text textAlign="center">{t('corsica.pages.analyse.averageSpeed')}</Text>
                </>
              )}
          </GridItem>
        </Grid>
      </Card.Body>
    </Card.Root>
  );
}
