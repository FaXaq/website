import { Card, Text } from '@chakra-ui/react';
import type { Analysis } from '@repo/schemas/api/procedures/corsica';
import { intervalToDuration } from 'date-fns';
import React from 'react';

import { m } from '@/paraglide/messages';

import { useActiveChartPoint } from './context/ActiveChartPoint';
import { useFormatDuration } from './hooks/useFormatDuration';

interface ElevationChartDetailsProps {
    analysis: Analysis
}

export default function ElevationChartDetails({ analysis }: ElevationChartDetailsProps) {
  const { activePoint } = useActiveChartPoint();
  const formatDuration = useFormatDuration();

  return <Card.Root bg="gray.subtle" shadow="sm">
    <Card.Body>
      <Text>
        {m['corsica_pages_analyse_kilometers']({ value: activePoint.index > -1 ? Math.round(analysis.distance.distanceVariations[activePoint.index] ?? 0 / 100) / 10 : '-' })}
      </Text>
      <Text>
        {(activePoint.index > -1 && analysis.time) ? formatDuration(intervalToDuration({ start: 0, end: analysis.time.movingTimeVariations[activePoint.index] ?? 0 })) : '-:-:-'}
      </Text>
      <Text>
        {m['corsica_pages_analyse_meters']({ value: activePoint.index > -1 ? analysis.points[activePoint.index]?.ele ?? 0 : '-' })}
      </Text>
      <Text>
        {activePoint.index > -1 ? `${Math.round(analysis.elevation.elevationVariations[activePoint.index]?.gradient ?? 0 * 10000) / 10}%` : '- %'}
      </Text>
    </Card.Body>
  </Card.Root>;
}
