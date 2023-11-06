'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { Analysis } from '../api/analyse/route'
import LeafletMap from './components/LeafletMap'
import MapAnnotations from './components/MapAnnotations'
import CyclingIcon from '../components/CyclingIcon'
import { format, intervalToDuration } from 'date-fns'
import Button from '../components/Button'
import { ListBlobResult } from '@vercel/blob'
import { getBlobFileName } from '../api/helpers/blob'
import LoadingIcon from '../components/LoadingIcon'
import CorsicaLineChart from './components/CorsicaLineChart'
import CorsicaAreaChart from './components/CorsicaAreaChart'
import { ChartData } from './types'
import './recharts.scss'
import { useFormatDuration } from './hooks/useFormatDuration'

interface FormState {
    files: Array<File>
}

const API_URL = '/projects/corsica/api/analyse'

export default function Analyse() {
  const { t } = useTranslation()
  const [isSanitizing, setIsSanitizing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | void>()
  const [activePoint] = useState<number>(-1)
  const [formState, setFormState] = useState<FormState>({
    files: []
  })
  const [preLoadedFiles, setPreLoadedFiles] = useState<ListBlobResult | void>()
  const formatDuration = useFormatDuration()

  useEffect(() => {
    (async () => {
      const files = await (await fetch('/projects/corsica/api/analyse')).json() as unknown as ListBlobResult
      setPreLoadedFiles(files)
    })()
  }, [])

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

  const analyseGPX: React.FormEventHandler<HTMLFormElement> = async (event) => {
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

  const selectPreLoadedFile = async (fileUrl: string) => {
    setIsLoading(true)
    const body = new FormData()
    body.append('fileUrl', fileUrl)

    const response = await fetch(API_URL, {
      method: 'POST',
      body: body
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

  const movingTime = useMemo(() => {
    if (analysis && analysis.time) {
      return intervalToDuration({ start: 0, end: analysis.time.elapsedDuration })
    }
  }, [analysis])

  const elevationVariationData: ChartData = useMemo(() => {
    if (analysis) {
      return analysis.points.map((variation, index) => ({
        value: Math.round(variation.ele),
        label: analysis.distance.distanceVariations[index],
        index
      }))
    }

    return []
  }, [analysis])

  const speedVariationData: ChartData = useMemo(() => {
    if (analysis && analysis.speed) {
      return analysis.speed.speedVariations.map((variation, index) => ({
        value: Math.round(variation),
        label: analysis.distance.distanceVariations[index],
        index
      }))
    }

    return []
  }, [analysis])

  return (
    <div className='text-corsica-olive'>
      { !preLoadedFiles && <LoadingIcon /> }
      { !analysis && preLoadedFiles && (
        <form onSubmit={analyseGPX} method='POST' action={API_URL} className='flex flex-col items-start'>
          <h2 className="flex flex-center items-center text-3xl font-bold font-corsica-title text-corsica-olive">{t('corsica.pages.analyse.title')}</h2>
          <input className="py-4" id="gpx-inputs" type="file" onChange={onFileInputChange} accept=".gpx" required/>
          <Button loading={isLoading || isSanitizing} type="submit">{t('corsica.pages.analyse.submitLabel')}</Button>
          <h4 className="py-2 text-xl font-semibold font-corsica-title">{t('corsica.pages.analyse.selectAFile')}</h4>
          <ul className="w-full">
            {
              preLoadedFiles.blobs.map(file => (
                <li
                  className="p-2 cursor-pointer hover:bg-corsica-khaki hover:text-corsica-white"
                  onClick={() => selectPreLoadedFile(file.url)}
                  key={file.pathname}
                >
                  {getBlobFileName(file.pathname)}
                </li>
              ))
            }
          </ul>
        </form>
      )}
      { analysis && analysis.map && (
        <div>
          <div className="pb-4">
            <h2 className="flex items-center text-3xl font-bold font-corsica-title text-corsica-olive">
              {analysis.name}
            </h2>
            <h4 className="flex items-center">
              {analysis.activity === 'cycling' && (
                <span className="inline-block h-6 pr-2">
                  <CyclingIcon />
                </span>
              )}
              {analysis.map.reverseGeocodingSearchResult.address.county}, {analysis.map.reverseGeocodingSearchResult.address.state}, {analysis.map.reverseGeocodingSearchResult.address.country}{analysis.time && ` - ${format(new Date(analysis.time.meta), 'PP')}`}</h4>
          </div>
          <div>
            <div className="grid grid-cols-4">
              <div className='col-span-3 h-80'>
                <LeafletMap center={[analysis.map.center.lat, analysis.map.center.lon]} className='w-full h-full'>
                  <MapAnnotations mapAnalysis={analysis.map} points={analysis.points} activePoint={activePoint} />
                </LeafletMap>
              </div>
              <div className="col-span-1 grid grid-cols-2 grid-rows-4">
                <div className="bg-white row-span-1 col-span-2 grid grid-cols-2">
                  <div className="col-span-1 py-4 text-center">
                    <p className="text-2xl">{t('corsica.pages.analyse.kilometers', { value: Math.round(analysis.distance.totalDistance / 100) / 10 })}</p>
                    <p className="text-xs">{t('corsica.pages.analyse.totalDistance')}</p>
                  </div>
                  <div className="col-span-1 py-4 text-center">
                    <p className="text-2xl">{t('corsica.pages.analyse.meters', { value: Math.round(analysis.elevation.totalElevationGain) })}</p>
                    <p className="text-xs">{t('corsica.pages.analyse.totalElevationGain')}</p>
                  </div>
                </div>
                <div className="bg-white col-span-2 grid grid-rows-2 text-center w-full">
                  <p className="text-2xl">{movingTime ? formatDuration(movingTime) : '--' }</p>
                  <p className="text-xs">{t('corsica.pages.analyse.movingTime')}</p>
                </div>
                <div className="bg-white col-span-2 grid grid-rows-2 text-center w-full">
                  <p className="text-xl">{elapsedTime ? formatDuration(elapsedTime) : '--'}</p>
                  <p className="text-xs">{t('corsica.pages.analyse.elapsedTime')}</p>
                </div>
                <div className="bg-white row-span-1 col-span-2 grid grid-cols-2">
                  <div className="col-span-1 py-4 text-center">
                    {
                      analysis.speed && (
                        <>
                          <p className="text-l">{t('corsica.pages.analyse.speed', { value: Math.round(analysis.speed.maxSpeed * 100) / 100 })}</p>
                          <p className="text-xs">{t('corsica.pages.analyse.maxSpeed')}</p>
                        </>
                      )}
                  </div>
                  <div className="col-span-1 py-4 text-center">
                    {
                      analysis.speed && (
                        <>
                          <p className="text-l">{t('corsica.pages.analyse.speed', { value: Math.round(analysis.speed.averageSpeed * 100) / 100 })}</p>
                          <p className="text-xs">{t('corsica.pages.analyse.averageSpeed')}</p>
                        </>
                      )}
                  </div>
                </div>
              </div>
              <div className='py-4 col-span-6 md:col-span-6 h-48'>
                <CorsicaAreaChart
                  data={elevationVariationData}
                  xUnit='km'
                  yUnit='m'
                  tickFormatter={(value) => Math.round(parseFloat(value) / 1000).toString()}
                  tooltipPayloadFormatter={(payload, x, y) => t('corsica.pages.analyse.elevationChart.tooltip', { yValue: payload.value, xValue: Math.round(payload.label / 100) / 10, x, y })}
                />
              </div>
              { speedVariationData.length > 0 && (
                <div className="h-64 col-span-4">
                  <CorsicaLineChart
                    data={speedVariationData}
                    xUnit='km'
                    yUnit='km/h'
                    tickFormatter={(value) => Math.round(parseFloat(value) / 1000).toString()}
                    tooltipPayloadFormatter={(payload, x, y) => t('corsica.pages.analyse.speedChart.tooltip', { yValue: payload.value, xValue: Math.round(payload.label / 100) / 10, x, y })}
                  />
                </div>
              )}
            </div>
            <Button
              type="button"
              onClick={() => setAnalysis()}
              loading={false}
            >
              {t('corsica.pages.analyse.retry')}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
