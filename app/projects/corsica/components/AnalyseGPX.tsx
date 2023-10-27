import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Analysis } from '../analyse/route'

interface FormState {
    files: Array<File>
}

export default function AnalyseGPX() {
  const { t } = useTranslation()
  const [isSanitizing, setIsSanitizing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | void>()
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

  return (
    <div>
      { !isLoading && !isSanitizing && !analysis && (
        <form onSubmit={mergeGPX} method='POST' action='/projects/corsica/analyse' className='flex flex-col'>
          <label htmlFor="gpx-inputs">{t('corsica.components.analysis.inputLabel')}</label>
          <input id="gpx-inputs" type="file" onChange={onFileInputChange} accept=".gpx"/>
          <input type="submit" value={t('corsica.components.analysis.submitLabel')}/>
        </form>
      )}
      { analysis && (
        <div>
          <p>{t('corsica.components.analysis.elevationGain', { elevationGain: Math.round(analysis.elevation.totalElevationGain) })}</p>
          <p>{t('corsica.components.analysis.elevationLoss', { elevationLoss: Math.round(analysis.elevation.totalElevationLoss) })}</p>
          <p>{t('corsica.components.analysis.elevationVariation', { elevationVariation: Math.round(analysis.elevation.elevationVariation) })}</p>
          <button className="inline-block bg-corsica-blue bg-opacity-90 m-y-6 p-2 rounded text-white hover:bg-opacity-100" onClick={() => setAnalysis()}>{t('corsica.components.analysis.retry')}</button>
        </div>
      )}
    </div>
  )
}
