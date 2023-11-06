import React, { useMemo } from 'react'
import { Analysis } from '../../api/analyse/route'
import { ChartData } from '../types'
import tailwindConfig from '../../../../../tailwind.config'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface SpeedChartProps {
    analysis: Analysis
}

export default function SpeedChart({ analysis }: SpeedChartProps) {
  const speedVariationData: ChartData = useMemo(() => {
    if (analysis && analysis.speed) {
      return analysis.speed.speedVariations.map((variation, index) => ({
        value: Math.round(variation),
        label: analysis.distance.distanceVariations[index],
        index
      }))
    }

    return []
  }, [analysis])

  const tickFormatter = (value) => Math.round(parseFloat(value) / 1000).toString()

  return (
    <ResponsiveContainer>
      <LineChart data={speedVariationData}>
        <CartesianGrid />
        <XAxis dataKey="label" unit="km" tickSize={6} minTickGap={30} tickFormatter={tickFormatter} tickMargin={5}/>
        <YAxis dataKey="value" unit="km/h" />
        <Line
          type="monotone"
          dataKey="value"
          stroke={tailwindConfig.theme.extend.colors['corsica-green']}
          dot={false}
          strokeWidth={2}
        />
        <Tooltip
          isAnimationActive={false}
          trigger='hover'
          content={() => <></>}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
