'use client'

import { NextPage } from 'next'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface FormData {
    files: Array<File>
}

const HomePage: NextPage<{}> = () => {
  const { t } = useTranslation()
  const [isSanitizing, setIsSanitizing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    files: []
  })

  const mergeGPX: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    const formElement: HTMLFormElement = event.target as HTMLFormElement
    const apiUrl = formElement.action
    const method = formElement.method

    const body = new FormData()

    for (let i = 0; i < formData.files.length; i++) {
      body.append(`file-${i}`, formData.files[i])
    }

    // Frustrating but we have to not set manualy the Content-Type of the request
    // Because the boundary of form-data has to be set by the web browser itself
    const response = await fetch(apiUrl, {
      method,
      body
    })

    console.log(response)

    setIsLoading(false)
  }

  const onFileInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setIsSanitizing(true)
    const files = event.target.files
    const sanitizedFiles = []
    for (let i = 0; i < files.length; i++) {
      sanitizedFiles.push(files.item(i))
    }
    setFormData({
      files: sanitizedFiles
    })
    setIsSanitizing(false)
  }

  return (
    <div className="font-sans">
      <header className='p-6'>
        <h1 className='text-4xl text-center'>{t('corsica.pages.index.header.title')}</h1>
        <h3 className='text-xl text-center'>{t('corsica.pages.index.header.subtitle')}</h3>
      </header>
      {
        !isLoading && !isSanitizing && (
          <form onSubmit={mergeGPX} method='POST' action='/api/corsica'>
            <label htmlFor="gpx-inputs">{t('corsica.pages.index.form.inputLabel')}</label>
            <input id="gpx-inputs" type="file" multiple onChange={onFileInputChange} accept=".gpx"/>
            <input type="submit" />
          </form>
        )
      }
    </div>
  )
}

HomePage.getInitialProps = _ => {
  return {}
}

export default HomePage
