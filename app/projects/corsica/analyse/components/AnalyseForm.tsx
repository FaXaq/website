import React, { useEffect, useState } from 'react'
import Button from '../../components/Button'
import { getBlobFileName } from '../../api/helpers/blob'
import { Analysis } from '../../api/analyse/route'
import { ListBlobResult } from '@vercel/blob'
import LoadingIcon from '../../components/LoadingIcon'
import { useTranslation } from 'react-i18next'

interface FormState {
    files: Array<File>
}

interface AnalysisFormProps {
    setAnalysis: (analysis: Analysis) => void
}

const API_URL = '/projects/corsica/api/analyse'

export default function AnalyseForm({ setAnalysis }: AnalysisFormProps) {
  const [isSanitizing, setIsSanitizing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formState, setFormState] = useState<FormState>({
    files: []
  })
  const [preLoadedFiles, setPreLoadedFiles] = useState<ListBlobResult | void>()
  const { t } = useTranslation()

  useEffect(() => {
    (async () => {
      const files = await (await fetch(API_URL)).json() as unknown as ListBlobResult
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

  return (
    <form onSubmit={analyseGPX} method='POST' action={API_URL} >
      <header>
        <h2 >{t('corsica.pages.analyse.title')}</h2>
        <p>{t('corsica.pages.analyse.description')}</p>
      </header>
      <input  required/>
      <Button loading={isLoading || isSanitizing} type="submit">{t('corsica.pages.analyse.submitLabel')}</Button>
      <p >{t('corsica.pages.analyse.selectAFile')}</p>
      { !preLoadedFiles ? (
        <LoadingIcon />
      ) : (
        <ul >
          { preLoadedFiles.blobs.map(file => (
            <li
              
              onClick={() => selectPreLoadedFile(file.url)}
              key={file.pathname}
            >
              {getBlobFileName(file.pathname)}
            </li>
          ))}
        </ul>
      )}
    </form>
  )
}
