import React, { useEffect, useRef, useState } from 'react'
import { getBlobFileName } from '../../api/helpers/blob'
import { ListBlobResult } from '@vercel/blob'
import { useTranslation } from 'react-i18next'
import { Box, Button, FileUpload, Float, Heading, HStack, Icon, List, SkeletonText, Span, Text, VStack } from '@chakra-ui/react'
import { LuUpload, LuX } from 'react-icons/lu'
import _ from 'lodash'
import { Analysis } from '../types'
import { Router } from 'next/router'
import { useRouter } from 'next/navigation'
import { useCustomFileContext } from '../context/CustomFileContext'

interface FormState {
    files: Array<File>
}

interface Files {
  key: string,
  urlEncoded: string,
  size: number,
  lastModified: string,
}

const FILES_URL = '/projects/corsica/api/files'
const ANALYSE_URL = '/projects/corsica/api/analyse'

export default function AnalyseForm() {
  const clearFilesRef = useRef(undefined);
  const [isSanitizing, setIsSanitizing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingUrl, setLoadingUrl] = useState('')
  const [formState, setFormState] = useState<FormState>({
    files: []
  })
  const [preLoadedFiles, setPreLoadedFiles] = useState<Files[] | void>()
  const { t } = useTranslation()
  const router = useRouter()
  const { setAnalysis } = useCustomFileContext()

  useEffect(() => {
    (async () => {
      const files = await (await fetch(FILES_URL)).json() as unknown as Files[]
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
    const response = await fetch(ANALYSE_URL, {
      method,
      body
    })

    setAnalysis(await response.json())
    setIsLoading(false)
    router.push('/projects/corsica/analyse/custom')
  }

  const selectPreLoadedFile = async (fileUrl: string) => {
    setAnalysis(undefined)
    router.push(`/projects/corsica/analyse/${encodeURIComponent(fileUrl)}`)
  }

  return (
    <form onSubmit={analyseGPX} method='POST' action={ANALYSE_URL}>
      <Heading as="h3">{t('corsica.pages.analyse.title')}</Heading>
      <Text>{t('corsica.pages.analyse.description')}</Text>
      <VStack gap={2} alignItems="start" py={4}>
        <FileUpload.Root width="100%" maxFiles={Infinity}>
          <FileUpload.Label>{t('corsica.pages.analyse.fileInputLabel')}<Span fontSize="sm" color="fg.error">*</Span></FileUpload.Label>
          <FileUpload.HiddenInput onChange={onFileInputChange} accept=".gpx" required />
          <FileUpload.Dropzone width="100%" cursor="pointer" height="100px">
            <Icon size="md" color="fg.muted">
              <LuUpload />
            </Icon>
            <FileUpload.DropzoneContent>
              <Box>{t('corsica.pages.analyse.fileInputDescription')}</Box>
              <Box color="fg.muted">.gpx</Box>
            </FileUpload.DropzoneContent>
          </FileUpload.Dropzone>
          <FileUpload.ItemGroup>
            <HStack wrap="wrap">
              <FileUpload.Context>
                {({ acceptedFiles, clearFiles }) => {
                  clearFilesRef.current = clearFiles;
                  return acceptedFiles.map((file) => (
                    <FileUpload.Item key={file.name} file={file} maxW="200px" p={2}>
                      <VStack maxW="200px" pt={4}>
                        <Float placement="top-end" m={3}>
                          <FileUpload.ItemDeleteTrigger>
                            <LuX />
                          </FileUpload.ItemDeleteTrigger>
                        </Float>
                        <HStack w="full">
                          <FileUpload.ItemPreview />
                          <Text truncate w="75%">{file.name}</Text>
                        </HStack>
                        <FileUpload.ItemSizeText />
                      </VStack>
                    </FileUpload.Item>
                  ))
                }
                }
              </FileUpload.Context>
            </HStack>
          </FileUpload.ItemGroup>
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
          { preLoadedFiles.map(file => (
            <List.Item
              key={file.key}
            >
              <Button variant="outline" onClick={() => selectPreLoadedFile(getBlobFileName(file.key))} loading={file.key === loadingUrl}>{getBlobFileName(file.key)}</Button>
            </List.Item>
          ))}
        </List.Root>
      )}
    </form>
  )
}
