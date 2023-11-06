'use client'

import React from 'react'
import { theme } from '../../../../tailwind.config'
import { hexToRgb } from '../../../../utils/misc'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const CTA2_RGB = hexToRgb(theme.extend.colors['mtts-cta-2'])
const BAR_COLOR = `rgba(${CTA2_RGB.r}, ${CTA2_RGB.g}, ${CTA2_RGB.b}, 0.5)`
const BAR_COLOR_HOVER = `rgba(${CTA2_RGB.r}, ${CTA2_RGB.g}, ${CTA2_RGB.b}, 0.7)`

interface CorrelationProps {
  gsFq: number
  fqBin: number
  prevFqBin: number
  nextFqBin: number
  fqBinMag: number
  prevFqBinMag: number
  nextFqBinMag: number
  title: string
}

const Correlation = ({ gsFq, fqBin, prevFqBin, nextFqBin, fqBinMag, prevFqBinMag, nextFqBinMag, title }: CorrelationProps) => {
  const labels = ['Prev. Fq Bin', 'Fq Bin', 'Next Fq Bin']
  const values = [prevFqBinMag, fqBinMag, nextFqBinMag]
  const data = values.map((value, index) => ({
    value,
    label: labels[index]
  }))

  return <div className="h-48 w-full">
    <ResponsiveContainer>
      <BarChart data={data} layout="vertical">
        <Bar dataKey="value" fill={BAR_COLOR} activeBar={{ fill: BAR_COLOR_HOVER }} />
        <XAxis type="number" dataKey="value" />
        <YAxis type="category" dataKey="label" />
        <Tooltip />
      </BarChart>
    </ResponsiveContainer>
  </div>
}

export default Correlation
