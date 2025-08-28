'use client'

import React, { useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import z, { ZodError } from 'zod'
import { FileUpload, Button, Input, Field, VStack, Card, Heading, Text, Icon, Box } from '@chakra-ui/react'
import { LuUpload } from 'react-icons/lu'
import { SubmitHandler, useForm } from 'react-hook-form';

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormState>()
  const [formErrors, setFormErrors] = useState<Array<string>>([])
  const formRef = useRef<HTMLFormElement>(undefined)

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

  const mergeGPX = async (data: FormState) => {
    if (!formRef.current) return;
    setIsLoading(true)
    const apiUrl = formRef.current.action
    const method = formRef.current.method

    const body = new FormData()

    try {
      body.append('newName', data.newName)
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        setFormErrors(err.issues.map(e => e.message))
      }
      setIsLoading(false)
      return
    }

    for (let i = 0; i < data.files.length; i++) {
      body.append(`file-${i}`, data.files[i])
    }

    // Frustrating but we have to not set manualy the Content-Type of the request
    // Because the boundary of form-data has to be set by the web browser itself
    const response = await fetch(apiUrl, {
      method,
      body
    })

    const sanitizedFileName = data.newName
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s/g, '_')
      .toLocaleLowerCase()

    downloadFile(`${sanitizedFileName}.gpx`, await response.blob())
    formRef.current.reset()
    setFormState(INITIAL_FORM_STATE)
    setIsLoading(false)
  }

  const onSubmit: SubmitHandler<FormState> = (data) => mergeGPX(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)} method='POST' action='/projects/corsica/api/merge' ref={formRef}>
      <Heading as="h3">{t('corsica.pages.merge.title')}</Heading>
      <Text>{t('corsica.pages.merge.description')}</Text>
      <VStack gap={2} alignItems="start" py={4}>
        <Field.Root>
          <Field.Label htmlFor="new-name-input">{t('corsica.pages.merge.inputLabel')}</Field.Label>
          <Input type="text" id="new-name-input" {...register('newName')} />
        </Field.Root>
        <FileUpload.Root width="100%">
          <FileUpload.HiddenInput accept=".gpx" {...register("files")} multiple />
          <FileUpload.Dropzone width="100%" cursor="pointer">
            <Icon size="md" color="fg.muted">
              <LuUpload />
            </Icon>
            <FileUpload.DropzoneContent>
              <Box>Drag and drop files here</Box>
              <Box color="fg.muted">.gpx only</Box>
            </FileUpload.DropzoneContent>
          </FileUpload.Dropzone>
          <FileUpload.ItemGroup>
            <FileUpload.Items showSize clearable />
          </FileUpload.ItemGroup>
        </FileUpload.Root>
      </VStack>
      <Button type="submit" loading={isLoading}>{t('corsica.pages.merge.submitLabel')}</Button>
    </form>
  )
}
