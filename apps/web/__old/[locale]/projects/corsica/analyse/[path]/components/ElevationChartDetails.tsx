import { Card, Text } from '@chakra-ui/react';
import type { Analysis } from '@repo/schemas/api/procedures/corsica';
import { intervalToDuration } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useFormatDuration } from '../../hooks/useFormatDuration';
import { useActiveChartPoint } from '../context/ActiveChartPoint';

interface ElevationChartDetailsProps {
    analysis: Analysis
}

export default function ElevationChartDetails({ analysis }: ElevationChartDetailsProps) {
  const { activePoint } = useActiveChartPoint();
  const { t } = useTranslation();
  const formatDuration = useFormatDuration();

  return <Card.Root bg="gray.subtle" shadow="sm">
    <Card.Body>
      <Text>
        {t('corsica.pages.analyse.kilometers', { value: activePoint.index > -1 ? Math.round(analysis.distance.distanceVariations[activePoint.index] ?? 0 / 100) / 10 : '-' })}
      </Text>
      <Text>
        {(activePoint.index > -1 && analysis.time) ? formatDuration(intervalToDuration({ start: 0, end: analysis.time.movingTimeVariations[activePoint.index] ?? 0 })) : '-:-:-'}
      </Text>
      <Text>
        {t('corsica.pages.analyse.meters', { value: activePoint.index > -1 ? analysis.points[activePoint.index]?.ele ?? 0 : '-' })}
      </Text>
      <Text>
        {activePoint.index > -1 ? `${Math.round(analysis.elevation.elevationVariations[activePoint.index]?.gradient ?? 0 * 10000) / 10}%` : '- %'}
      </Text>
    </Card.Body>
  </Card.Root>;
}
