import { Box, Button, FileUpload, Float, Heading, HStack, Icon, List, SkeletonText, Span, Text, VStack } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React, { useRef, useState } from 'react';
import { Controller,useForm } from 'react-hook-form';
import { LuUpload, LuX } from 'react-icons/lu';
import { v4 as uuidv4 } from 'uuid';

import { useCustomFileContext } from '@/components/corsica/analyse/context/CustomFileContext';
import { trcpClient, useTRPC } from '@/lib/trpc/client';
import { m } from '@/paraglide/messages';

interface AnalyseFormValues {
  file: File[];
}


export const Route = createFileRoute('/projects/corsica/analyse/')({
  loader: async () => {
    const preloadedFiles = await trcpClient.corsica.getExamples.query() ?? [];
    return { preloadedFiles };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const clearFilesRef = useRef<(() => void) | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { setAnalysis } = useCustomFileContext();
  const { preloadedFiles } = Route.useLoaderData();
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
    navigate({ to: '/projects/corsica/analyse/$file', params: { file: 'custom' } });
  };

  const selectPreLoadedFile = (fileUrl: string) => {
    setAnalysis(undefined);
    navigate({ to: '/projects/corsica/analyse/$file', params: { file: fileUrl } });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading as="h3">{m['corsica_pages_analyse_title']()}</Heading>
      <Text>{m['corsica_pages_analyse_description']()}</Text>
      <VStack gap={2} alignItems="start" py={4}>
        <Controller
          name="file"
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <FileUpload.Root width="100%" maxFiles={Infinity}>
              <FileUpload.Label>
                {m['corsica_pages_analyse_fileInputLabel']()}
                <Span fontSize="sm" color="fg.error">*</Span>
              </FileUpload.Label>
              <FileUpload.HiddenInput
                {...register("file", { required: m['corsica_pages_merge_fileInputRequired']() })}
                accept=".gpx"
                required
                multiple={false}
              />
              <FileUpload.Dropzone width="100%" cursor="pointer" height="100px">
                <Icon size="md" color="fg.muted">
                  <LuUpload />
                </Icon>
                <FileUpload.DropzoneContent>
                  <Box>{m['corsica_pages_analyse_fileInputDescription']()}</Box>
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
          type="submit"
        >
          {m['corsica_pages_analyse_submitLabel']()}
        </Button>
      </VStack>
      <Text>{m['corsica_pages_analyse_selectAFile']()}</Text>
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
              <Button variant="outline" onClick={() => selectPreLoadedFile(file.key)}>{file.key}</Button>
            </List.Item>
          ))}
        </List.Root>
      )}
    </form>
  );
}
