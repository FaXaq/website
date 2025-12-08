"use client";

import React, { useEffect } from 'react';
import type { CategoricalChartProps, createDefaultState } from 'recharts/types/chart/generateCategoricalChart';

import { useActiveChartPoint } from '../context/ActiveChartPoint';

type CategoricalChartState = ReturnType<typeof createDefaultState>

type ChartProps = CategoricalChartProps & CategoricalChartState

export default function ActiveVerticalChartLine({
  isTooltipActive,
  activeCoordinate,
  offset,
  activeTooltipIndex
}: ChartProps) {
  const { activePoint, setActivePoint } = useActiveChartPoint();

  useEffect(() => {
    if (isTooltipActive && activeTooltipIndex !== undefined && activeCoordinate !== undefined) {
      setActivePoint({ ...activeCoordinate, index: activeTooltipIndex });
    } else {
      setActivePoint({ x: -1, y: -1, index: -1 });
    }
  }, [isTooltipActive, activeCoordinate]);

  const verticalLineX = Math.round(activePoint.x * 1000) / 1000;

  if (!offset?.top || !offset?.height) {
    return null;
  }

  return <path stroke='#000000' d={`M${verticalLineX},${offset.top}L${verticalLineX},${offset.top + offset.height}`}></path>;
}
