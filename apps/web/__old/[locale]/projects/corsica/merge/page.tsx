'use client';

import { Box, Button, Field, FileUpload, Float, Heading, HStack, Icon, Input, Span, Text, VStack } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import React, { useRef } from 'react';
import type { SubmitHandler} from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LuUpload, LuX } from 'react-icons/lu';
import { v4 as uuidv4 } from 'uuid';

import { useTRPC } from '@/utils/trpc/client';

interface FormState {
    files: FileList,
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

export default function Merge() {
  const { t } = useTranslation();
  const clearFilesRef = useRef<VoidFunction | null>(null);
  const trpc = useTRPC();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormState>();
  const formRef = useRef<HTMLFormElement | null>(null);

  const mergeGPXMutation = useMutation(trpc.corsica.mergeGpx.mutationOptions({}));
  const generateS3SignedUrlsMutation = useMutation(trpc.corsica.generateS3SignedUrls.mutationOptions({}));
  const deleteFilesMutation = useMutation(trpc.corsica.deleteFiles.mutationOptions({}));

  const mergeGPX = async (data: FormState) => {
    if (!formRef.current) return;

    const files = Array.from(data.files).map(file => ({
      id: `${uuidv4()}.gpx`,
      name: file.name,
      type: file.type,
      file,
    }));

    const urls = await generateS3SignedUrlsMutation.mutateAsync({
      files: files.map(file => ({ name: file.id, type: file.type })),
      scope: 'merge'
    });


    for (const url of urls.urls) {
      await fetch(url.uploadUrl, {
        method: 'PUT',
        body: files.find(file => file.id === url.filename)?.file ?? null,
      });
    }

    const { url } = await mergeGPXMutation.mutateAsync({
      newName: data.newName, files: files.map(file => ({ id: file.id }))
    });

    const res = await fetch(url);
    const blob = await res.blob();
    downloadFile(`${data.newName}.gpx`, blob);

    await deleteFilesMutation.mutateAsync({
      files: [...files.map(file => ({ name: file.id })), { name: `${data.newName}.gpx` }],
      scope: 'merge'
    });
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
        <Button type="submit" loading={isSubmitting}>{t('corsica.pages.merge.submitLabel')}</Button>
      </HStack>
    </form>
  );
}
