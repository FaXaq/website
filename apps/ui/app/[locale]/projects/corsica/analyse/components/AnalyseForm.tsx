import { Box, Button, FileUpload, Float, Heading, HStack, Icon, List, SkeletonText, Span, Text, VStack } from '@chakra-ui/react';
import _ from 'lodash';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { Controller,useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LuUpload, LuX } from 'react-icons/lu';

import { getBlobFileName } from '../../api/helpers/blob';
import { useCustomFileContext } from '../context/CustomFileContext';

interface Files {
  key: string,
  urlEncoded: string,
  size: number,
  lastModified: string,
}

const FILES_URL = '/projects/corsica/api/files';
const ANALYSE_URL = '/projects/corsica/api/analyse';

interface AnalyseFormValues {
  files: File[];
}

export default function AnalyseForm() {
  const clearFilesRef = useRef<(() => void) | null>(null);
  const [isSanitizing, setIsSanitizing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingUrl, setLoadingUrl] = useState('');
  const [preLoadedFiles, setPreLoadedFiles] = useState<Files[] | void>();
  const { t } = useTranslation();
  const router = useRouter();
  const { setAnalysis } = useCustomFileContext();

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { isSubmitting }
  } = useForm<AnalyseFormValues>({
    defaultValues: {
      files: [],
    },
  });

  useEffect(() => {
    (async () => {
      const files = await (await fetch(FILES_URL)).json() as unknown as Files[];
      setPreLoadedFiles(files);
    })();
  }, []);

  // Since FileUpload doesn't natively hookup to react-hook-form,
  // we have to intercept the file input and sync it into rhf
  const handleFilesFromEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSanitizing(true);
    const files = event.target.files;
    if (files && files.length > 0) {
      const sanitized: File[] = [];
      for (let i = 0; i < files.length; i++) {
        const item = files.item(i);
        if (item) sanitized.push(item);
      }
      setValue("files", sanitized, { shouldValidate: true });
    } else {
      setValue("files", [], { shouldValidate: true });
    }
    setIsSanitizing(false);
  };

  const onSubmit = async (values: AnalyseFormValues) => {
    setIsLoading(true);
    const body = new FormData();
    for (let i = 0; i < values.files.length; i++) {
      // defensively check for type
      const file = values.files[i];
      if (file) {
        body.append(`file-${i}`, file);
      }
    }
    const response = await fetch(ANALYSE_URL, {
      method: 'POST',
      body
    });

    setAnalysis(await response.json());
    setIsLoading(false);
    router.push('/projects/corsica/analyse/custom');
  };

  const selectPreLoadedFile = async (fileUrl: string) => {
    setAnalysis(undefined);
    router.push(`/projects/corsica/analyse/${encodeURIComponent(fileUrl)}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} method='POST' action={ANALYSE_URL}>
      <Heading as="h3">{t('corsica.pages.analyse.title')}</Heading>
      <Text>{t('corsica.pages.analyse.description')}</Text>
      <VStack gap={2} alignItems="start" py={4}>
        <Controller
          name="files"
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <FileUpload.Root width="100%" maxFiles={Infinity}>
              <FileUpload.Label>
                {t('corsica.pages.analyse.fileInputLabel')}
                <Span fontSize="sm" color="fg.error">*</Span>
              </FileUpload.Label>
              <FileUpload.HiddenInput
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleFilesFromEvent(event);
                  onChange(event.target.files ? Array.from(event.target.files) : []);
                }}
                accept=".gpx"
                required
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
          loading={(isLoading || isSanitizing || isSubmitting) && _.isEmpty(loadingUrl)}
          type="submit"
        >
          {t('corsica.pages.analyse.submitLabel')}
        </Button>
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
              <Button variant="outline" onClick={async () => selectPreLoadedFile(getBlobFileName(file.key))} loading={file.key === loadingUrl}>{getBlobFileName(file.key)}</Button>
            </List.Item>
          ))}
        </List.Root>
      )}
    </form>
  );
}
