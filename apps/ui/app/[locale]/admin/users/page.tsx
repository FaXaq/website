'use client';

import {
  Box,
  Button,
  Field,
  Heading,
  Input,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { toaster } from '@/components/ui/toaster';
import { useTRPC } from '@/utils/trpc/client';

const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  username: z.string().min(1, 'Username is required'),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

export default function CreateUserPage() {
  const trpc = useTRPC();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });

  const createUserMutation = useMutation(trpc.user.singUpEmail.mutationOptions({
    onSuccess: () => {
      toaster.create({
        title: 'User created',
        description: 'The user has been successfully created.',
        type: 'success',
        duration: 5000,
      });
      reset();
    },
    onError: (error) => {
      toaster.create({
        title: 'Error creating user',
        description: error.message || 'An error occurred while creating the user.',
        type: 'error',
        duration: 5000,
      });
    },
  }));

  const onSubmit = async (data: CreateUserFormData) => {
    await createUserMutation.mutateAsync(data);
  };

  return (
    <Box maxW="600px" mx="auto" p={6}>
      <Heading mb={6} size="lg">
        Create New User
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={4} align="stretch">
          <Field.Root invalid={!!errors.name}>
            <Field.Label htmlFor="name">Name</Field.Label>
            <Input
              id="name"
              type="text"
              {...register('name')}
              placeholder="Enter full name"
            />
            <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.username}>
            <Field.Label htmlFor="username">Username</Field.Label>
            <Input
              id="username"
              type="text"
              {...register('username')}
              placeholder="Enter username"
            />
            <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.email}>
            <Field.Label htmlFor="email">Email</Field.Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Enter email address"
            />
            <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.password}>
            <Field.Label htmlFor="password">Password</Field.Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              placeholder="Enter password (min 8 characters)"
            />
            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
          </Field.Root>

          <Button
            type="submit"
            colorPalette="blue"
            loading={isSubmitting}
            loadingText="Creating..."
            width="full"
            mt={4}
          >
            Create User
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

