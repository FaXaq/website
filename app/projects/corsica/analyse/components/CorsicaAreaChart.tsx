import React from 'react'
import { CartesianGrid, Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, TooltipProps } from 'recharts'
import CustomCharTooltip from './CustomChartTooltip'
import tailwindConfig from '../../../../../tailwind.config'
import { ChartData, ChartLabel, ChartValue } from '../types'

interface CorsicaLineChartProps {
 data: ChartData
 xUnit: string,
 yUnit: string,
 tickFormatter?: (value: any, index: number) => string,
 tooltipPayloadFormatter?: (tooltipProps: any, xUnit: string, yUnit: string) => string,
}

export default function CorsicaAreaChart({ data, xUnit, yUnit, tickFormatter, tooltipPayloadFormatter }: CorsicaLineChartProps) {
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
  }

  return (
    <ResponsiveContainer>
      <AreaChart data={data}>
        <CartesianGrid />
        <XAxis dataKey="label" unit={xUnit} tickSize={6} minTickGap={30} tickFormatter={proxyTickFormatter} />
        <YAxis dataKey="value" unit={yUnit} />
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
          content={(e) => tooltipPayloadFormatter && <CustomCharTooltip payload={proxyTooltipPayloadFormatter(e as unknown, xUnit, yUnit)} />}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
