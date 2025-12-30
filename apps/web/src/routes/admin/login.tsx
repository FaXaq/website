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
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';

import { useAuth } from '@/hooks/useAuth';
import { shouldNotBeLoggedIn } from '@/lib/before-load';
import type { RouterInput } from '@/lib/trpc/types';

type CreateUserFormData = RouterInput["user"]["singInEmail"];

export const Route = createFileRoute('/admin/login')({
  beforeLoad: shouldNotBeLoggedIn,
  component: RouteComponent,
});

function RouteComponent() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(SignInEmailSchema),
  });
  const { singInEmail } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: CreateUserFormData) => {
    await singInEmail(data);
    navigate({ to: '/admin/me' });
  };

  return (
    <Box maxW="600px" mx="auto" p={6}>
      <Heading mb={6} size="lg">
        Login
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
            Login
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
