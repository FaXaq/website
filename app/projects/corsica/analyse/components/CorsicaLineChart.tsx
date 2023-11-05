import React, { useRef } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import CustomCharTooltip from './CustomChartTooltip'

interface CorsicaLineChartProps {
 data: any[],
 activePoint?: number,
 setActivePoint?: (index: number) => void,
 xUnit: string,
 yUnit: string
}

export default function CorsicaLineChart({ data, xUnit, yUnit }: CorsicaLineChartProps) {
  const ref = useRef(null)

  return (
    <ResponsiveContainer>
      <LineChart data={data} ref={ref}>
        <CartesianGrid />
        <XAxis dataKey="label" unit={xUnit} tickSize={6} minTickGap={30} tickFormatter={(label) => Math.round(parseFloat(label) / 1000).toString()} />
        <YAxis dataKey="data" unit={yUnit} />
        <Line type="monotone" dataKey="data" stroke="#82ca9d" dot={false} strokeWidth={2} />
        <Tooltip
          isAnimationActive={false}
          trigger='hover'
          content={(e) => <CustomCharTooltip payload={e.payload[0]?.payload} xUnit={xUnit} yUnit={yUnit} />}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
