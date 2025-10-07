import React, { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, Customized, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { } from 'react-leaflet'
import { theme } from '@/components/ui/theme'
import ActiveVerticalChartLine from './ActiveVerticalChartLine'
import { Box } from '@chakra-ui/react'
import { Analysis, ChartData } from '../../types'

interface ElevationChartProps {
    analysis: Analysis,
}

export default function ElevationChart({ analysis }: ElevationChartProps) {
  const elevationVariationData: ChartData = useMemo(() => {
    if (analysis) {
      return analysis.points.map((variation, index) => ({
        value: Math.round(variation.ele),
        label: analysis.distance.distanceVariations[index],
        index
      }))
    }

    return []
  }, [analysis])

  const tickFormatter = (value) => Math.round(parseFloat(value) / 1000).toString()

  return (
    <Box w="100%" h="100%">
      <ResponsiveContainer>
        <AreaChart data={elevationVariationData} margin={{ bottom: 0, left: 0, right: 0, top: 0 }}>
          <CartesianGrid />
          <XAxis dataKey="label" unit="km" tickSize={6} minTickGap={30} tickFormatter={tickFormatter} />
          <YAxis dataKey="value" unit="m" />
          <Area
            type="monotone"
            dataKey="value"
            strokeWidth={0}
            fill={theme.colors['corsica-green']}
            dot={false}
            activeDot={false}
          />
          <Tooltip contentStyle={{ display: 'none' }} />
          <Customized component={ActiveVerticalChartLine} />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  )
}
