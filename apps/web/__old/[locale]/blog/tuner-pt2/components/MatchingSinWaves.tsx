'use client';

import { Box } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export default function MatchingSinWaves() {
  const [offset, setOffset] = useState(1);
  const clearSineWaveData = Array.from(Array(1000).keys()).map((i) => {
    return {
      value: 4 * Math.sin((2 * Math.PI / 0.44) * i / 50) + Math.sin((2 * Math.PI / 0.55437) * i / 50),
      value2: (4 * Math.sin((2 * Math.PI / 0.44) * (i + offset) / 50) + Math.sin((2 * Math.PI / 0.55437) * (i + offset) / 50)),
      label: i / 50
    };
  });


  return <Box width="100%">
    <p>Use the range input below to change the period of the red sine wave.</p>
    <input type="range" min="1" max="200" value={offset} onChange={(e) => setOffset(parseInt(e.target.value))}/>
    <p>P = {offset / (50 * 1000)}s</p>
    <p>F = 1/P = {Math.round(1 / (offset / (50 * 1000)))}Hz</p>
    <Box height="200px" width="100%" p={2}>
      <ResponsiveContainer>
        <LineChart data={clearSineWaveData}>
          <Line
            type="monotone"
            dataKey="value"
            dot={false}
            strokeWidth={1}
            activeDot={false}
            animateNewValues={false}
          />
          <Line
            type="monotone"
            dataKey="value2"
            stroke="red"
            dot={false}
            strokeWidth={1}
            animateNewValues={false}
            activeDot={false}
          />
          <XAxis type="number" unit="ms" dataKey="label" />
          <YAxis type="number" dataKey="value" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  </Box>;
}