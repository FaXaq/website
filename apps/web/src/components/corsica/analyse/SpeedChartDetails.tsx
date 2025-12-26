import { Card } from '@chakra-ui/react';
import type { Analysis } from '@repo/schemas/api/procedures/corsica';
import React from 'react';

import { m } from '@/paraglide/messages';

import { useActiveChartPoint } from './context/ActiveChartPoint';

interface SpeedChartDetailsProps {
    analysis: Analysis
}

export default function SpeedChartDetails({ analysis }: SpeedChartDetailsProps) {
  const { activePoint } = useActiveChartPoint();

  const speed = analysis.speed?.speedVariations[activePoint.index] ?? 0;

  return <Card.Root bg="gray.subtle" shadow="sm">
    <Card.Body>
      {speed && m['corsica_pages_analyse_speed']({ value: activePoint.index > -1 ? Math.round(speed * 10) / 10 : '-' })}
    </Card.Body>
  </Card.Root>;
}
