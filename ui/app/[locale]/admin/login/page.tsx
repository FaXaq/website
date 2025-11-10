'use client';

import {
  Box,
  Button,
  Container,
  Field,
  Heading,
  Input,
  VStack,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { useAuthContext } from '@/[locale]/contexts/AuthContext';
import { toaster } from '@/components/ui/toaster';
import { getClientConfig } from '@/lib/config';

interface LoginCredentials {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();
  const { login } = useAuthContext();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await fetch(`${getClientConfig().serverUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toaster.create({
        title: 'Login successful',
        type: 'success',
        duration: 3000,
      });
      login(data);
      router.push('/');
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

  const onSubmit = (data: LoginCredentials) => {
    loginMutation.mutate(data);
  };

  return (
    <Container maxW="container.sm" py={10}>
      <VStack gap={8}>
        <Heading>Admin Login</Heading>
        <Box w="100%" as="form" onSubmit={handleSubmit(onSubmit)}>
          <VStack gap={4}>
            <Field.Root required>
              <Field.Label>Email</Field.Label>
              <Input
                type="email"
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && <Field.ErrorText>{errors.email.message}</Field.ErrorText>}
            </Field.Root>
            <Field.Root required>
              <Field.Label>Password</Field.Label>
              <Input
                type="password"
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              {errors.password && (
                <Field.ErrorText>{errors.password.message}</Field.ErrorText>
              )}
            </Field.Root>
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