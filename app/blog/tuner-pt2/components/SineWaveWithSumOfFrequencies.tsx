'use client'

import React from 'react'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

export default function SinWaveWithSumOfrequencies() {
  const clearSineWaveData = Array.from(Array(1000).keys()).map((i) => {
    return {
      value: Math.sin((2 * Math.PI / 0.44) * i / 50) + Math.sin((2 * Math.PI / 0.55437) * i / 50),
      value2: Math.sin((2 * Math.PI / 0.44) * i / 50),
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
    <p>But in real life, what we get is the sum of those frequencies, which looks like this :</p>
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