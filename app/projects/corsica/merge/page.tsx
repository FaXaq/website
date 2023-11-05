'use client'

import React, { useState } from 'react'
import { useTranslation } from 'next-i18next'
import Button from '../components/Button'

interface FormState {
    files: Array<File>
}

function downloadFile(name: string, blob: Blob) {
  const fakeLink = document.createElement('a')
  fakeLink.setAttribute('download', name)
  const href = URL.createObjectURL(blob)
  fakeLink.href = href
  fakeLink.setAttribute('target', '_blank')
  fakeLink.click()
  URL.revokeObjectURL(href)
}

export default function Merge() {
  const { t } = useTranslation()
  const [isSanitizing, setIsSanitizing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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

    downloadFile('test.gpx', await response.blob())

    setIsLoading(false)
  }

  return (
    <form onSubmit={mergeGPX} method='POST' action='/projects/corsica/api/merge' className='flex flex-col items-start'>
      <h2 className="flex flex-center items-center text-3xl font-bold font-corsica-title text-corsica-olive">{t('corsica.pages.merge.title')}</h2>
      <input className="py-4" id="gpx-inputs" type="file" onChange={onFileInputChange} accept=".gpx" required multiple />
      <Button type="submit" loading={isLoading || isSanitizing}>{t('corsica.pages.merge.submitLabel')}</Button>
    </form>
  )
}
