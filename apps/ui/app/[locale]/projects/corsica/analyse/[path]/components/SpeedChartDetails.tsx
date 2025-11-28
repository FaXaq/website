import { Card } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Analysis } from '../../types';
import { useActiveChartPoint } from '../context/ActiveChartPoint';

interface SpeedChartDetailsProps {
    analysis: Analysis
}

export default function SpeedChartDetails({ analysis }: SpeedChartDetailsProps) {
  const { activePoint } = useActiveChartPoint();
  const { t } = useTranslation();

  return <Card.Root bg="gray.subtle" shadow="sm">
    <Card.Body>
      {analysis.speed && t('corsica.pages.analyse.speed', { value: activePoint.index > -1 ? Math.round(analysis.speed.speedVariations[activePoint.index] * 10) / 10 : '-' })}
    </Card.Body>
  </Card.Root>;
}
