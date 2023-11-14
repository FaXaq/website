'use client'

import React from 'react'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

export default function ClearSineWave() {
  const clearSineWaveData = Array.from(Array(1000).keys()).map((i) => {
    return {
      value: Math.sin((2 * Math.PI / 0.44) * i / 50),
      label: i / 50
    }
  })

  return <div className="w-full h-32">
    <ResponsiveContainer>
      <LineChart data={clearSineWaveData}>
        <Line
          type="monotone"
          dataKey="value"
          dot={false}
          strokeWidth={1}
          activeDot={false}
        />
        <XAxis type="number" unit="ms" dataKey="label" />
        <YAxis type="number" dataKey="value" />
      </LineChart>
    </ResponsiveContainer>
  </div>
}