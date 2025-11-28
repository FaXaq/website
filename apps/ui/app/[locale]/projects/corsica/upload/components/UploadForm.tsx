"use client";

import {
  Box,
  Button,
  FileUpload,
  Float,
  Heading,
  HStack,
  Icon,
  Span,
  Text,
  VStack
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import React, { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LuUpload, LuX } from 'react-icons/lu';

import { useTRPC } from '@/utils/trpc/client'; // adjust this import to your trpc client location

type UploadFormInputs = {
  files: File[];
};

export default function UploadForm() {
  const trpc = useTRPC();
  const { t } = useTranslation();
  const clearFilesRef = useRef<() => void>(undefined);

  // ==== Changes: useRef for input element ====
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting }
  } = useForm<UploadFormInputs>({
    defaultValues: {
      files: []
    }
  });

  const generateS3SignedUrlsMutation = useMutation(trpc.corsica.generateS3SignedUrls.mutationOptions({}));

  const handleFilesChange = (acceptedFiles: File[]) => {
    setValue('files', acceptedFiles, { shouldDirty: true });
  };

  const onSubmit = async (data: UploadFormInputs) => {
    const urls = await generateS3SignedUrlsMutation.mutateAsync({
      files: data.files.map(file => ({ name: file.name, type: file.type }))
    });
    for (const url of urls.urls) {
      const file = data.files.find(file => file.name === url.filename);
      if (file) {
        const response = await fetch(url.uploadUrl, {
          method: 'PUT',
          body: file,
          headers: {
            contentType: 'application/octet-stream',
          }
        });
        console.log(response);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading as="h3">{t('corsica.pages.upload.title')}</Heading>
      <VStack gap={2} alignItems="start" py={4}>
        <Controller
          control={control}
          name="files"
          render={({ field }) => (
            <FileUpload.Root width="100%" maxFiles={Infinity}>
              <FileUpload.Label>
                {t('corsica.pages.upload.fileInputLabel')}
                <Span fontSize="sm" color="fg.error">
                  *
                </Span>
              </FileUpload.Label>
              <FileUpload.HiddenInput
                ref={fileInputRef}
                onChange={e => {
                  const fileList = e.target.files;
                  const filesArr: File[] = [];
                  if (fileList && fileList.length) {
                    for (let i = 0; i < fileList.length; i++) {
                      const file = fileList.item(i);
                      if (file) filesArr.push(file);
                    }
                  }
                  field.value = filesArr;
                  handleFilesChange(filesArr);
                }}
                accept=".gpx"
                required
              />
              <FileUpload.Dropzone
                width="100%"
                cursor="pointer"
                height="100px"
                onClick={() => {
                  // Explicitly trigger input file dialog
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
                tabIndex={0}
                // Allow keyboard accessibility
                onKeyDown={e => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    if (fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }
                }}
                style={{ outline: 'none' }}
              >
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
          )}
        />
        <Button
          loading={isSubmitting || generateS3SignedUrlsMutation.isPending}
          type="submit"
          disabled={generateS3SignedUrlsMutation.isPending || isSubmitting}
        >
          {t('corsica.pages.upload.submitLabel')}
        </Button>
      </VStack>
    </form>
  );
}
