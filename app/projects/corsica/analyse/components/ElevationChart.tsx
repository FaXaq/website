import React, { useMemo } from 'react'
import { ChartData } from '../types'
import { Analysis } from '../../api/analyse/route'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { } from 'react-leaflet'
import tailwindConfig from '../../../../../tailwind.config'

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
    <div className="grid grid-cols-4 h-full">
      <ResponsiveContainer className="col-span-4">
        <AreaChart data={elevationVariationData}>
          <CartesianGrid />
          <XAxis dataKey="label" unit="km" tickSize={6} minTickGap={30} tickFormatter={tickFormatter} />
          <YAxis dataKey="value" unit="m" />
          <Area
            type="monotone"
            dataKey="value"
            strokeWidth={0}
            fill={tailwindConfig.theme.extend.colors['corsica-green']}
            dot={false}
          />
          <Tooltip
            isAnimationActive={false}
            trigger='hover'
            content={() => (<></>)}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
