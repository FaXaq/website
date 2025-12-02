import { Card } from '@chakra-ui/react';
import type { Analysis } from '@repo/schemas/api/procedures/corsica';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useActiveChartPoint } from '../context/ActiveChartPoint';

interface SpeedChartDetailsProps {
    analysis: Analysis
}

export default function SpeedChartDetails({ analysis }: SpeedChartDetailsProps) {
  const { activePoint } = useActiveChartPoint();
  const { t } = useTranslation();

  const speed = analysis.speed?.speedVariations[activePoint.index] ?? 0;

  return <Card.Root bg="gray.subtle" shadow="sm">
    <Card.Body>
      {speed && t('corsica.pages.analyse.speed', { value: activePoint.index > -1 ? Math.round(speed * 10) / 10 : '-' })}
    </Card.Body>
  </Card.Root>;
}
