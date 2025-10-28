"use client";

import { Box, Button, FileUpload, Float, Heading, HStack, Icon, Span, Text, VStack } from '@chakra-ui/react';
import _ from 'lodash';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuUpload, LuX } from 'react-icons/lu';

interface FormState {
    files: Array<File>
}

const API_URL = '/projects/corsica/api/upload';

export default function UploadForm() {
  const clearFilesRef = useRef<() => void>(undefined);
  const [isSanitizing, setIsSanitizing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingUrl, setLoadingUrl] = useState('');
  const [formState, setFormState] = useState<FormState>({
    files: []
  });
  const { t } = useTranslation();

  const onFileInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setIsSanitizing(true);
    const files = event.target.files;
    const sanitizedFiles = [];
    for (let i = 0; i < files.length; i++) {
      sanitizedFiles.push(files.item(i));
    }
    setFormState({
      files: sanitizedFiles
    });
    setIsSanitizing(false);
  };

  const uploadGpx: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const formElement: HTMLFormElement = event.target as HTMLFormElement;
    const apiUrl = formElement.action;
    const method = formElement.method;

    const body = new FormData();

    for (let i = 0; i < formState.files.length; i++) {
      body.append(`file-${i}`, formState.files[i]);
    }

    await fetch(apiUrl, {
      method,
      body
    });
    clearFilesRef.current();
    setFormState({ files: [] });

    setIsLoading(false);
  };

  return (
    <form onSubmit={uploadGpx} method='POST' action={API_URL}>
      <Heading as="h3">{t('corsica.pages.upload.title')}</Heading>
      <VStack gap={2} alignItems="start" py={4}>
        <FileUpload.Root width="100%" maxFiles={Infinity}>
          <FileUpload.Label>{t('corsica.pages.upload.fileInputLabel')}<Span fontSize="sm" color="fg.error">*</Span></FileUpload.Label>
          <FileUpload.HiddenInput onChange={onFileInputChange} accept=".gpx" required />
          <FileUpload.Dropzone width="100%" cursor="pointer" height="100px">
            <Icon size="md" color="fg.muted">
              <LuUpload />
            </Icon>
            <FileUpload.DropzoneContent>
              <Box>{t('corsica.pages.upload.fileInputDescription')}</Box>
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
                  ));
                }}
              </FileUpload.Context>
            </HStack>
          </FileUpload.ItemGroup>
        </FileUpload.Root>
        <Button loading={(isLoading || isSanitizing) && _.isEmpty(loadingUrl)} type="submit">{t('corsica.pages.upload.submitLabel')}</Button>
      </VStack>
    </form>
  );
}
