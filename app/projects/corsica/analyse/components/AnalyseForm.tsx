import React, { useEffect, useState } from 'react'
import { getBlobFileName } from '../../api/helpers/blob'
import { Analysis } from '../../api/analyse/route'
import { ListBlobResult } from '@vercel/blob'
import LoadingIcon from '../../components/LoadingIcon'
import { useTranslation } from 'react-i18next'
import { Button, FileUpload, Heading, List, SkeletonText, Text, VStack } from '@chakra-ui/react'
import { LuHardDriveUpload } from 'react-icons/lu'
import _ from 'lodash'

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
  const [loadingUrl, setLoadingUrl] = useState('')
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
    setLoadingUrl(fileUrl);
    const body = new FormData()
    body.append('fileUrl', fileUrl)

    const response = await fetch(API_URL, {
      method: 'POST',
      body: body
    })

    setAnalysis(await response.json())
    setIsLoading(false)
    setLoadingUrl('');
  }

  return (
    <form onSubmit={analyseGPX} method='POST' action={API_URL}>
      <Heading as="h3">{t('corsica.pages.analyse.title')}</Heading>
      <Text>{t('corsica.pages.analyse.description')}</Text>
      <VStack gap={2} alignItems="start" py={4}>
        <FileUpload.Root>
          <FileUpload.HiddenInput onChange={onFileInputChange} accept=".gpx" required />
          <FileUpload.Trigger asChild>
            <Button variant="outline" size="sm">
              <LuHardDriveUpload /> Upload file
            </Button>
          </FileUpload.Trigger>
          <FileUpload.List />
        </FileUpload.Root>
        <Button loading={(isLoading || isSanitizing) && _.isEmpty(loadingUrl)} type="submit">{t('corsica.pages.analyse.submitLabel')}</Button>
      </VStack>
      <Text>{t('corsica.pages.analyse.selectAFile')}</Text>
      { !preLoadedFiles ? (
        <>
          <SkeletonText noOfLines={1} />
          <SkeletonText noOfLines={1} />
          <SkeletonText noOfLines={1} />
        </>
      ) : (
        <List.Root variant="plain" gap={2} py={4}>
          { preLoadedFiles.blobs.map(file => (
            <List.Item
              key={file.pathname}
            >
              <Button variant="outline" onClick={() => selectPreLoadedFile(file.url)} loading={file.url === loadingUrl}>{getBlobFileName(file.pathname)}</Button>
            </List.Item>
          ))}
        </List.Root>
      )}
    </form>
  )
}
