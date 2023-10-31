'use client'

import React, { useMemo, useState } from 'react'
import { CategoryScale, ChartData, Chart as ChartJS, ChartOptions, Legend, LineElement, LinearScale, PointElement, TimeScale, Title, Tooltip } from 'chart.js'
import 'chartjs-adapter-date-fns'
import { Line } from 'react-chartjs-2'
import { useTranslation } from 'next-i18next'
import { Analysis } from '../api/analyse/route'
import LeafletMap from './components/LeafletMap'
import MapAnnotations from './components/MapAnnotations'
import CyclingIcon from '../components/CyclingIcon'
import { format, intervalToDuration } from 'date-fns'

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

export default function Analyse() {
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

  const AnalyseGPX: React.FormEventHandler<HTMLFormElement> = async (event) => {
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

  const elapsedTime = useMemo(() => {
    if (analysis) {
      if (!analysis.points[0].time) {
        return undefined
      }
      return intervalToDuration({
        start: new Date(analysis.points[0].time),
        end: new Date(analysis.points[analysis.points.length - 1].time)
      })
    }
  }, [analysis])

  const elevationVariationData: ChartData<'line', number[], number> = useMemo(() => {
    if (analysis) {
      return {
        labels: analysis.distance.distanceVariations.map(dist => dist / 1000),
        datasets: [
          {
            label: 'test',
            data: analysis.points.map(variation => Math.round(variation.ele)),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            pointRadius: 0.5,
            pointBackgroundColor: 'rgba(255, 99, 132, 1',
            tension: 0.1
          }
        ]
      }
    }
  }, [analysis])

  const elevationGradientData: ChartData<'line', number[], number> = useMemo(() => {
    if (analysis) {
      return {
        labels: analysis.distance.distanceVariations.map(dist => dist / 1000),
        datasets: [
          {
            label: 'test',
            data: analysis.elevation.elevationVariations.map(variation => (variation.gradient * 100) % 10),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            pointRadius: 0.5,
            pointBackgroundColor: 'rgba(255, 99, 132, 1',
            tension: 0.1
          }
        ]
      }
    }
  }, [analysis])

  const speedVariationData: ChartData<'line', number[], number> = useMemo(() => {
    if (analysis && analysis.speed) {
      return {
        labels: analysis.distance.distanceVariations.map(distance => distance / 1000),
        datasets: [
          {
            label: 'test',
            data: analysis.speed.speedVariations.map(variation => variation),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            pointRadius: 0.1,
            pointBackgroundColor: 'rgba(255, 99, 132, 1)',
            tension: 0.1
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
        type: 'linear'
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
    <div className='text-corsica-olive'>
      { !isLoading && !isSanitizing && !analysis && (
        <form onSubmit={AnalyseGPX} method='POST' action='/projects/corsica/api/analyse' className='flex flex-col'>
          <label htmlFor="gpx-inputs">{t('corsica.components.analysis.inputLabel')}</label>
          <input id="gpx-inputs" type="file" onChange={onFileInputChange} accept=".gpx" required/>
          <input type="submit" value={t('corsica.components.analysis.submitLabel')}/>
        </form>
      )}
      { analysis && analysis.map && (
        <div>
          <div className="pb-4">
            <h2 className="flex flex-center items-center text-3xl font-bold font-corsica-title text-corsica-olive">
              {analysis.activity === 'cycling' && (
                <span className="inline-block h-12 pr-2">
                  <CyclingIcon />
                </span>
              )}
              {analysis.name}
            </h2>
            <h4>{analysis.map.reverseGeocodingSearchResult.address.county}, {analysis.map.reverseGeocodingSearchResult.address.state}, {analysis.map.reverseGeocodingSearchResult.address.country}{analysis.time && ` - ${format(new Date(analysis.time), 'PP')}`}</h4>
          </div>
          <div>
            <div className='w-full h-80'>
              <LeafletMap center={[analysis.map.center.lat, analysis.map.center.lon]} className='w-full h-full'>
                <MapAnnotations mapAnalysis={analysis.map} points={analysis.points} activePoint={activePoint} />
              </LeafletMap>
            </div>
            <div className="grid grid-cols-4">
              <div className="pr-4 py-4">
                <p className="flex justify-between">
                  <span>Distance parcourue</span>
                  <span>{Math.round(analysis.distance.totalDistance / 100) / 10 } km</span>
                </p>
                <p className="flex justify-between">
                  {
                    elapsedTime ? (
                      <>
                        <span>Elapsed time</span>
                        <span>{elapsedTime?.days && `${elapsedTime?.days} days `}{elapsedTime.hours}h{elapsedTime.minutes}</span>
                      </>
                    ) : null
                  }
                </p>
                <p className="flex justify-between">
                  <span>Elevation Gain</span>
                  <span>{Math.round(analysis.elevation.totalElevationGain)}m</span>
                </p>
                <p className="flex justify-between">
                  {
                    analysis.speed && (
                      <>
                        <span>Max Speed</span><span>{Math.round(analysis.speed.maxSpeed * 100) / 100} km/h</span>
                      </>
                    )}
                </p>
                <p className="flex justify-between">
                  {
                    analysis.speed && (
                      <>
                        <span>Avg Speed</span><span>{Math.round(analysis.speed.averageSpeed * 100) / 100} km/h</span>
                      </>
                    )}
                </p>
              </div>
              <div className='col-span-3'>
                <Line data={elevationVariationData} options={LINE_TIME_OPTIONS} />
              </div>
            </div>
            <div className='col-span-3'>
              <Line data={elevationGradientData} options={LINE_TIME_OPTIONS} />
            </div>
            <div>
              {
                analysis.speed && (
                  <>
                    <div className='h-64 w-full'>
                      <Line data={speedVariationData} options={LINE_TIME_OPTIONS} />
                    </div>
                  </>
                )
              }
            </div>
            <button
              className="inline-block bg-corsica-blue bg-opacity-90 m-y-6 p-2 rounded text-white hover:bg-opacity-100"
              onClick={() => setAnalysis()}
            >
              {t('corsica.components.analysis.retry')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
