import React from 'react'

interface CustomChartTooltipProps {
    payload: string
}

export default function CustomCharTooltip({ payload }: CustomChartTooltipProps) {
  return <p className="rounded bg-white p-2 text-corsica-olive">
    {payload}
  </p>
}
