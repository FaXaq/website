'use client'

import React from 'react'
import { Chart as ChartJS, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { theme } from '../../../../tailwind.config'
import { hexToRgb } from '../../../../utils/misc'

const CTA2_RGB = hexToRgb(theme.extend.colors['mtts-cta-2'])
const BAR_COLOR = `rgba(${CTA2_RGB.r}, ${CTA2_RGB.g}, ${CTA2_RGB.b}, 0.5)`
const BAR_COLOR_HOVER = `rgba(${CTA2_RGB.r}, ${CTA2_RGB.g}, ${CTA2_RGB.b}, 0.7)`

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

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
  const data = {
    labels: ['Prev. Fq Bin', 'Fq Bin', 'Next Fq Bin'],
    datasets: [
      {
        label: 'Magnitude',
        backgroundColor: BAR_COLOR,
        hoverBackgroundColor: BAR_COLOR_HOVER,
        data: [prevFqBinMag, fqBinMag, nextFqBinMag]
      }
    ]
  }
  const options = {
    indexAxis: 'y' as const,
    tooltips: {
      enabled: false
    },
    legend: {
      display: false
    },
    title: {
      display: true,
      text: title
    }
  }

  return <Bar data={data} options={options} height={100} />
}

export default Correlation
