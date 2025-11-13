'use client';

import {
  Box,
  Button,
  Container,
  FileUpload,
  Heading,
  Icon,
  Span,
  VStack,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { LuUpload } from 'react-icons/lu';

import { toaster } from '@/components/ui/toaster';

import { ApiClient } from '../../../../../api.client';

interface SplitArguments {
  file: File
}

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SplitArguments>();
  const loginMutation = useMutation({
    mutationFn: async ({ file }: SplitArguments) => {
      const formData = new FormData();
      formData.append('file', file[0]);
      const response = await ApiClient.POST('/mtts/split', {
        body: formData
      });

      if (response.error) {
        throw new Error('Login failed');
      }

      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: () => {
      toaster.create({
        title: 'Login failed',
        description: 'Please check your credentials and try again',
        type: 'error',
        duration: 3000,
      });
    },
  });

  const onSubmit = (data: SplitArguments) => {
    loginMutation.mutate(data);
  };

  return (
    <Container maxW="container.sm" py={10}>
      <VStack gap={8}>
        <Heading>Admin Login</Heading>
        <Box w="100%" as="form" onSubmit={handleSubmit(onSubmit)}>
          <VStack gap={4}>
            <FileUpload.Root width="100%" maxFiles={Infinity}>
              <FileUpload.Label>test<Span fontSize="sm" color="fg.error">*</Span></FileUpload.Label>
              <FileUpload.HiddenInput {...register("file")} required />
              <FileUpload.Dropzone width="100%" cursor="pointer" height="100px">
                <Icon size="md" color="fg.muted">
                  <LuUpload />
                </Icon>
                <FileUpload.DropzoneContent>
                  <Box>Upload file</Box>
                  <Box color="fg.muted">.</Box>
                </FileUpload.DropzoneContent>
              </FileUpload.Dropzone>
            </FileUpload.Root>
            <Button
              type="submit"
              colorScheme="blue"
              width="100%"
              loading={loginMutation.isPending}
            >
              Login
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}