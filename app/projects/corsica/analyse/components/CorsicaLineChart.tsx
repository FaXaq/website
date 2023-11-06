import React from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts'
import CustomCharTooltip from './CustomChartTooltip'
import tailwindConfig from '../../../../../tailwind.config'
import { ChartData, ChartLabel, ChartValue } from '../types'

interface CorsicaLineChartProps {
 data: ChartData,
 xUnit: string,
 yUnit: string,
 tickFormatter?: (value: any, index: number) => string,
 tooltipPayloadFormatter?: (payload: any, xUnit: string, yUnit: string) => string,
}

export default function CorsicaLineChart({ data, xUnit, yUnit, tickFormatter, tooltipPayloadFormatter }: CorsicaLineChartProps) {
  const proxyTickFormatter = (value: any, index: number) => {
    if (tickFormatter) {
      return tickFormatter(value, index)
    }

    return value
  }

  const proxyTooltipPayloadFormatter = (tooltipProps: TooltipProps<ChartValue, ChartLabel>, xUnit: string, yUnit: string) => {
    const activePayload = tooltipProps.payload[0]

    if (activePayload) {
      if (tooltipPayloadFormatter && activePayload.payload) {
        return tooltipPayloadFormatter(activePayload.payload, xUnit, yUnit)
      }
    }

    return ''
  }

  return (
    <ResponsiveContainer>
      <LineChart data={data}>
        <CartesianGrid />
        <XAxis dataKey="label" unit={xUnit} tickSize={6} minTickGap={30} tickFormatter={proxyTickFormatter} tickMargin={5}/>
        <YAxis dataKey="value" unit={yUnit} />
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
          content={(e: TooltipProps<number, number>) => tooltipPayloadFormatter && <CustomCharTooltip payload={proxyTooltipPayloadFormatter(e, xUnit, yUnit)}
          />}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
