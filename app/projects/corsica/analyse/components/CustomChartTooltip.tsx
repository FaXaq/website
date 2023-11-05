import React from 'react'

interface CustomChartTooltipProps {
    payload: any,
    xUnit: string,
    yUnit: string
}

export default function CustomCharTooltip({ payload, xUnit, yUnit }: CustomChartTooltipProps) {
  console.log(payload, xUnit, yUnit)
  return <p className="rounded bg-corsica-green p-2 text-corsica-white">
    {Math.round(payload?.label / 100) / 10}{xUnit} : {payload?.data}{yUnit}
  </p>
}
