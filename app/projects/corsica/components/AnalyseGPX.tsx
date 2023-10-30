'use client'

import React, { useMemo, useState } from 'react'
import { CategoryScale, ChartData, Chart as ChartJS, ChartOptions, Legend, LineElement, LinearScale, PointElement, TimeScale, Title, Tooltip } from 'chart.js'
import 'chartjs-adapter-date-fns'
import { Line } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import { Analysis } from '../analyse/route'
import LeafletMap from './LeafletMap'
import MapAnnotations from './MapAnnotations'

interface FormState {
    files: Array<File>
}

ChartJS.register(
  CategoryScale,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function AnalyseGPX() {
  const { t } = useTranslation()
  const [isSanitizing, setIsSanitizing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | void>()
  const [activePoint, setActivePoint] = useState<number | void>()
  const [formState, setFormState] = useState<FormState>({
    files: []
  })

  const onFileInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setIsSanitizing(true)
    const files = event.target.files
    const sanitizedFiles = []
    for (let i = 0; i < files.length; i++) {
      sanitizedFiles.push(files.item(i))
    }
    setFormState({
      files: sanitizedFiles
    })
    setIsSanitizing(false)
  }

  const mergeGPX: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    const formElement: HTMLFormElement = event.target as HTMLFormElement
    const apiUrl = formElement.action
    const method = formElement.method

    const body = new FormData()

    for (let i = 0; i < formState.files.length; i++) {
      body.append(`file-${i}`, formState.files[i])
    }

    // Frustrating but we have to not set manualy the Content-Type of the request
    // Because the boundary of form-data has to be set by the web browser itself
    const response = await fetch(apiUrl, {
      method,
      body
    })

    setAnalysis(await response.json())
    setIsLoading(false)
  }

  const elevationVariationData: ChartData<'line', number[], Date> = useMemo(() => {
    if (analysis) {
      return {
        labels: analysis.points.map(point => new Date(point.time)),
        datasets: [
          {
            label: 'test',
            data: analysis.points.map(variation => Math.round(variation.ele)),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            pointRadius: 0.5,
            pointBackgroundColor: 'rgba(255, 99, 132, 1',
            fill: true,
            tension: 0
          }
        ]
      }
    }
  }, [analysis])

  const speedVariationData: ChartData<'line', number[], Date> = useMemo(() => {
    if (analysis) {
      return {
        labels: analysis.points.map(point => new Date(point.time)),
        datasets: [
          {
            label: 'test',
            data: analysis.speed.speedVariations.map(variation => variation),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            pointRadius: 0.5,
            pointBackgroundColor: 'rgba(255, 99, 132, 1)',
            tension: 0
          }
        ]
      }
    }
  }, [analysis])

  const LINE_TIME_OPTIONS: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour'
        }
      }
    },
    hover: {
      mode: 'x',
      intersect: false
    },
    onHover(_, elements) {
      setActivePoint(elements[0]?.index)
    }
  }

  return (
    <div>
      { !isLoading && !isSanitizing && !analysis && (
        <form onSubmit={mergeGPX} method='POST' action='/projects/corsica/analyse' className='flex flex-col'>
          <label htmlFor="gpx-inputs">{t('corsica.components.analysis.inputLabel')}</label>
          <input id="gpx-inputs" type="file" onChange={onFileInputChange} accept=".gpx"/>
          <input type="submit" value={t('corsica.components.analysis.submitLabel')}/>
        </form>
      )}
      { analysis && analysis.map && (
        <div>
          <p>{t('corsica.components.analysis.elevationGain', { elevationGain: Math.round(analysis.elevation.totalElevationGain) })}</p>
          <p>{t('corsica.components.analysis.elevationLoss', { elevationLoss: Math.round(analysis.elevation.totalElevationLoss) })}</p>
          <p>{t('corsica.components.analysis.totalDistance', { totalDistance: Math.round(analysis.distance.totalDistance / 1000) })}</p>
          <p>{analysis.speed.maxSpeed} km/h</p>
          <p>{analysis.speed.averageSpeed} km/h</p>
          <div className='w-full h-96'>
            <LeafletMap center={[analysis.map.center.lat, analysis.map.center.lon]} className='w-full h-full'>
              <MapAnnotations mapAnalysis={analysis.map} points={analysis.points} activePoint={activePoint} />
            </LeafletMap>
          </div>
          <div>
            <div className='h-64 w-full'>
              <Line data={elevationVariationData} options={LINE_TIME_OPTIONS} />
            </div>
            <div className='h-64 w-full'>
              <Line data={speedVariationData} options={LINE_TIME_OPTIONS} />
            </div>
          </div>
          <button
            className="inline-block bg-corsica-blue bg-opacity-90 m-y-6 p-2 rounded text-white hover:bg-opacity-100"
            onClick={() => setAnalysis()}
          >
            {t('corsica.components.analysis.retry')}
          </button>
        </div>
      )}
    </div>
  )
}
