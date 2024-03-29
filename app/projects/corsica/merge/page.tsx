'use client'

import React, { useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import Button from '../components/Button'
import { ObjectSchema, ValidationError, array, object, string } from 'yup'
import classNames from 'classnames'

interface FormState {
    files: Array<File>,
    newName: string
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

const INITIAL_FORM_STATE: FormState = {
  files: [],
  newName: ''
}

export default function Merge() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE)
  const formStateSchema: ObjectSchema<FormState> = object({
    newName: string().trim().required(),
    files: array()
  })
  const [formErrors, setFormErrors] = useState<Array<string>>([])
  const formRef = useRef<HTMLFormElement>()

  const onFileInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const files = event.target.files
    const sanitizedFiles = []
    for (let i = 0; i < files.length; i++) {
      sanitizedFiles.push(files.item(i))
    }
    setFormState({
      ...formState,
      files: sanitizedFiles
    })
  }

  const onTextInputChange: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    setFormErrors([])
    setFormState({
      ...formState,
      newName: event.target.value
    })
  }

  const mergeGPX: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    const formElement: HTMLFormElement = event.target as HTMLFormElement
    const apiUrl = formElement.action
    const method = formElement.method

    const body = new FormData()

    try {
      const { newName: validatedNewName } = await formStateSchema.validate(formState)
      body.append('newName', validatedNewName)
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        setFormErrors(err.errors)
      }
      setIsLoading(false)
      return
    }

    for (let i = 0; i < formState.files.length; i++) {
      body.append(`file-${i}`, formState.files[i])
    }

    // Frustrating but we have to not set manualy the Content-Type of the request
    // Because the boundary of form-data has to be set by the web browser itself
    const response = await fetch(apiUrl, {
      method,
      body
    })

    const sanitizedFileName = formState.newName
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s/g, '_')
      .toLocaleLowerCase()

    downloadFile(`${sanitizedFileName}.gpx`, await response.blob())
    formRef.current.reset()
    setFormState(INITIAL_FORM_STATE)
    setIsLoading(false)
  }

  return (
    <form onSubmit={mergeGPX} method='POST' action='/projects/corsica/api/merge' className='flex flex-col items-start' ref={formRef}>
      <header>
        <h2 className="flex flex-center items-center text-3xl font-bold font-corsica-title text-corsica-olive">{t('corsica.pages.merge.title')}</h2>
        <p>{t('corsica.pages.merge.description')}</p>
      </header>
      <div className="my-4">
        <div className="flex flex-col pb-4">
          <label htmlFor="new-name-input">{t('corsica.pages.merge.inputLabel')}</label>
          <input
            id="new-name-input"
            className={
              classNames({
                'rounded border py-1 px-2': true,
                'border-corsica-red': formErrors.length > 0,
                'border-corsica-khaki': formErrors.length === 0
              })
            }
            type="text"
            onChange={onTextInputChange}
            accept=".gpx"
            required
          />
          <div className="text-corsica-red">
            {formErrors.length > 0 && (
              formErrors.map((err, i) => <p key={`err-${i}`}>{err}</p>)
            )}
          </div>
        </div>
        <input type="file" onChange={onFileInputChange} accept=".gpx" required multiple />
      </div>
      <Button type="submit" loading={isLoading}>{t('corsica.pages.merge.submitLabel')}</Button>
    </form>
  )
}
