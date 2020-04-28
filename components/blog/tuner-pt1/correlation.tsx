import React from 'react'
import { Line } from 'react-chartjs-2'
import { theme } from '../../../tailwind.config'

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
    labels: ['Previous frequency bin', 'Frequency bin', 'Next frequency bin'],
    datasets: [
      {
        label: 'Magnitude',
        backgroundColor: 'transparent',
        borderColor: theme.extend.colors['mtts-cta-2'],
        hoverBackgroundColor: 'transparent',
        hoverBorderColor: theme.extend.colors['mtts-cta-2'],
        data: [{
          x: prevFqBin,
          y: prevFqBinMag
        }, {
          x: fqBin,
          y: fqBinMag
        }, {
          x: nextFqBin,
          y: nextFqBinMag
        }]
      }
    ]
  }
  const options = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          endAt: 100
        }
      }]
    },
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
  return <Line data={data} options={options} height={75} />
}

export default Correlation
