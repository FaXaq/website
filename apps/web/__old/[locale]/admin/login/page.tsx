'use client';

import {
  Box,
  Button,
  Checkbox,
  Field,
  Heading,
  Input,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInEmailSchema } from '@repo/schemas/api/procedures/user';
import { Controller, useForm } from 'react-hook-form';

import { useAuth } from '@/hooks/useAuth';
import { useTRPC } from '@/utils/trpc/client';
import type { RouterInput } from '@/utils/trpc/types';

type CreateUserFormData = RouterInput["user"]["singInEmail"];

export default function CreateUserPage() {
  const trpc = useTRPC();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(SignInEmailSchema),
  });
  const { singInEmail } = useAuth();

  const onSubmit = async (data: CreateUserFormData) => {
    await singInEmail(data);
  };

  return (
    <Box maxW="600px" mx="auto" p={6}>
      <Heading mb={6} size="lg">
        Create New User
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={4} align="stretch">
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

          <Controller
            control={control}
            name="rememberMe"
            render={({ field }) => (
              <Field.Root invalid={!!errors.rememberMe}>
              <Checkbox.Root onCheckedChange={({ checked }) => field.onChange(checked)} checked={field.value}>
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>Remember me</Checkbox.Label>
              </Checkbox.Root>
              <Field.ErrorText>{errors.rememberMe?.message}</Field.ErrorText>
            </Field.Root>
            )} />

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

