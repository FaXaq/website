import { Card, Text } from '@chakra-ui/react';
import { intervalToDuration } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useFormatDuration } from '../../hooks/useFormatDuration';
import type { Analysis } from '../../types';
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
        {t('corsica.pages.analyse.kilometers', { value: activePoint.index > -1 ? Math.round(analysis.distance.distanceVariations[activePoint.index] / 100) / 10 : '-' })}
      </Text>
      <Text>
        {(activePoint.index > -1 && analysis.time) ? formatDuration(intervalToDuration({ start: 0, end: analysis.time.movingTimeVariations[activePoint.index] })) : '-:-:-'}
      </Text>
      <Text>
        {t('corsica.pages.analyse.meters', { value: activePoint.index > -1 ? analysis.points[activePoint.index].ele : '-' })}
      </Text>
      <Text>
        {activePoint.index > -1 ? `${Math.round(analysis.elevation.elevationVariations[activePoint.index].gradient * 10000) / 10}%` : '- %'}
      </Text>
    </Card.Body>
  </Card.Root>;
}
