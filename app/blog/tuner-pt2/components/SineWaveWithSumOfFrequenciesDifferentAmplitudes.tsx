'use client'

import React, { useState } from 'react'
import { Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

export default function SinWaveWithSumOfrequenciesDifferentAmplitude() {
  const clearSineWaveData = Array.from(Array(1000).keys()).map((i) => {
    return {
      value: 4 * Math.sin((2 * Math.PI / 0.44) * i / 50) + Math.sin((2 * Math.PI / 0.55437) * i / 50),
      value2: 4 * Math.sin((2 * Math.PI / 0.44) * i / 50),
      value3: Math.sin((2 * Math.PI / 0.55437) * i / 50),
      label: i / 50
    }
  })
  

  return <div>
    <div className="w-full h-32">
      <ResponsiveContainer>
        <LineChart data={clearSineWaveData}>
          <Line
            type="monotone"
            dataKey="value2"
            stroke="red"
            dot={false}
            strokeWidth={1}
            activeDot={false}
          />
          <Line
            type="monotone"
            dataKey="value3"
            stroke="green"
            dot={false}
            strokeWidth={1}
            activeDot={false}
          />
          <XAxis type="number" unit="ms" dataKey="label" />
          <YAxis type="number" dataKey="value" />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <div className="w-full h-32">
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
  </div>
}