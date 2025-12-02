import { Box, Button, FileUpload, Float, Heading, HStack, Icon, List, SkeletonText, Span, Text, VStack } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { Controller,useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LuUpload, LuX } from 'react-icons/lu';
import { v4 as uuidv4 } from 'uuid';

import { useTRPC } from '@/utils/trpc/client';

import { useCustomFileContext } from '../context/CustomFileContext';

interface AnalyseFormValues {
  file: File[];
}

export default function AnalyseForm() {
  const clearFilesRef = useRef<(() => void) | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  const { setAnalysis } = useCustomFileContext();
  const trpc = useTRPC();

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = useForm<AnalyseFormValues>({
    defaultValues: {
      file: undefined,
    },
  });

  const {
    data: preloadedFiles,
    isLoading: isLoadingPreloadedFiles
  } = useQuery(trpc.corsica.getExamples.queryOptions());

  const analyseGpxMutation = useMutation(trpc.corsica.analyseGPX.mutationOptions({}));
  const generateS3SignedUrlsMutation = useMutation(trpc.corsica.generateS3SignedUrls.mutationOptions({}));
  const deleteFilesMutation = useMutation(trpc.corsica.deleteFiles.mutationOptions({}));

  const onSubmit = async (data: AnalyseFormValues) => {
    setIsLoading(true);

    const formFile = data.file[0];

    if (!formFile) return;

    const file = {
      name: `${uuidv4()}.gpx`,
      type: formFile.type,
      file: formFile,
    };

    const urls = await generateS3SignedUrlsMutation.mutateAsync({
      files: [file],
      scope: 'analyse/custom'
    });

    for (const url of urls.urls) {
      await fetch(url.uploadUrl, {
        method: 'PUT',
        body: file.file,
      });
    }
    const analysis = await analyseGpxMutation.mutateAsync({
      id: file.name,
      example: false
    });
    setAnalysis(analysis);
    await deleteFilesMutation.mutateAsync({
      files: [file],
      scope: 'analyse/custom'
    });
    router.push(`/projects/corsica/analyse/custom`);
  };

  const selectPreLoadedFile = async (fileUrl: string) => {
    setAnalysis(undefined);
    router.push(`/projects/corsica/analyse/${encodeURIComponent(fileUrl)}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading as="h3">{t('corsica.pages.analyse.title')}</Heading>
      <Text>{t('corsica.pages.analyse.description')}</Text>
      <VStack gap={2} alignItems="start" py={4}>
        <Controller
          name="file"
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <FileUpload.Root width="100%" maxFiles={Infinity}>
              <FileUpload.Label>
                {t('corsica.pages.analyse.fileInputLabel')}
                <Span fontSize="sm" color="fg.error">*</Span>
              </FileUpload.Label>
              <FileUpload.HiddenInput
                {...register("file", { required: t('corsica.pages.merge.fileInputRequired') })}
                accept=".gpx"
                required
                multiple={false}
              />
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
                      ));
                    }}
                  </FileUpload.Context>
                </HStack>
              </FileUpload.ItemGroup>
            </FileUpload.Root>
          )}
        />
        <Button
          loading={(isLoadingPreloadedFiles)}
          type="submit"
        >
          {t('corsica.pages.analyse.submitLabel')}
        </Button>
      </VStack>
      <Text>{t('corsica.pages.analyse.selectAFile')}</Text>
      { !preloadedFiles ? (
        <>
          <SkeletonText noOfLines={1} />
          <SkeletonText noOfLines={1} />
          <SkeletonText noOfLines={1} />
        </>
      ) : (
        <List.Root variant="plain" gap={2} py={4}>
          { preloadedFiles.map(file => (
            <List.Item
              key={file.key}
            >
              <Button variant="outline" onClick={async () => selectPreLoadedFile(file.key)}>{file.key}</Button>
            </List.Item>
          ))}
        </List.Root>
      )}
    </form>
  );
}
