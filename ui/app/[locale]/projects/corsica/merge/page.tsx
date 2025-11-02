'use client';

import { Box, Button, Field, FileUpload, Float, Heading, HStack, Icon, Input, Span, Text, VStack } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import type { SubmitHandler} from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LuUpload, LuX } from 'react-icons/lu';

interface FormState {
    files: Array<File>,
    newName: string
}

function downloadFile(name: string, blob: Blob) {
  const fakeLink = document.createElement('a');
  fakeLink.setAttribute('download', name);
  const href = URL.createObjectURL(blob);
  fakeLink.href = href;
  fakeLink.setAttribute('target', '_blank');
  fakeLink.click();
  URL.revokeObjectURL(href);
}

const INITIAL_FORM_STATE: FormState = {
  files: [],
  newName: ''
};

export default function Merge() {
  const { t } = useTranslation();
  const clearFilesRef = useRef(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<FormState>();
  const formRef = useRef<HTMLFormElement>(undefined);

  const mergeGPX = async (data: FormState, analyse = false) => {
    if (!formRef.current) return;
    setIsLoading(true);
    const apiUrl = formRef.current.action;
    const method = formRef.current.method;

    const body = new FormData();

    for (let i = 0; i < data.files.length; i++) {
      body.append(`file-${i}`, data.files[i]);
    }

    // Frustrating but we have to not set manualy the Content-Type of the request
    // Because the boundary of form-data has to be set by the web browser itself
    const response = await fetch(apiUrl, {
      method,
      body
    });

    const sanitizedFileName = data.newName
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s/g, '_')
      .toLocaleLowerCase();

    downloadFile(`${sanitizedFileName}.gpx`, await response.blob());
    formRef.current.reset();
    setValue("files", []);
    clearFilesRef.current();
    setIsLoading(false);
  };

  const onSubmit: SubmitHandler<FormState> = async (data) => mergeGPX(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} method='POST' action='/projects/corsica/api/merge' ref={formRef}>
      <Heading as="h3">{t('corsica.pages.merge.title')}</Heading>
      <Text>{t('corsica.pages.merge.description')}</Text>
      <VStack gap={2} alignItems="start" py={4}>
        <Field.Root>
          <Field.Label htmlFor="new-name-input">{t('corsica.pages.merge.inputLabel')}<Span fontSize="sm" color="fg.error">*</Span></Field.Label>
          <Input type="text" id="new-name-input" {...register('newName', { required: t('corsica.pages.merge.inputRequired') })} maxWidth="300px" />
          { errors.newName?.message && <Field.ErrorText>{errors.newName?.message}</Field.ErrorText>}
        </Field.Root>
        <FileUpload.Root width="100%" maxFiles={Infinity}>
          <FileUpload.Label>{t('corsica.pages.merge.fileInputLabel')}<Span fontSize="sm" color="fg.error">*</Span></FileUpload.Label>
          <FileUpload.HiddenInput accept=".gpx" {...register("files", { required: t('corsica.pages.merge.fileInputRequired') })} multiple />
          <FileUpload.Dropzone width="100%" cursor="pointer">
            <Icon size="md" color="fg.muted">
              <LuUpload />
            </Icon>
            <FileUpload.DropzoneContent>
              <Box>{t('corsica.pages.merge.fileInputDescription')}</Box>
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
                }
                }
              </FileUpload.Context>
            </HStack>
          </FileUpload.ItemGroup>
        </FileUpload.Root>
      </VStack>
      <HStack gap={2}>
        <Button type="submit" loading={isLoading}>{t('corsica.pages.merge.submitLabel')}</Button>
      </HStack>
    </form>
  );
}
