import React, { useEffect } from 'react'
import { useActiveChartPoint } from '../context/ActiveChartPoint'
import { CategoricalChartProps, CategoricalChartState } from 'recharts/types/chart/generateCategoricalChart'

type ChartProps = CategoricalChartProps & CategoricalChartState

export default function ActiveVerticalChartLine({ isTooltipActive, activeCoordinate, offset, activeTooltipIndex }: ChartProps) {
  const { activePoint, setActivePoint } = useActiveChartPoint()

  useEffect(() => {
    if (isTooltipActive) {
      setActivePoint({ ...activeCoordinate, index: activeTooltipIndex })
    } else {
      setActivePoint({ x: -1, y: -1, index: -1 })
    }
  }, [isTooltipActive, activeCoordinate])

  const verticalLineX = Math.round(activePoint.x * 1000) / 1000

  return <path stroke='#000000' d={`M${verticalLineX},${offset.top}L${verticalLineX},${offset.top + offset.height}`}></path>
}
