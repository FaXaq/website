"use client";

import { Button, Field, Input, Text, VStack } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { getClientConfig } from '@/lib/config';

const Admin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: async (data) => {
      // Replace with your API call
      const response = await fetch(`${getClientConfig().serverUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <VStack as="form" onSubmit={handleSubmit(onSubmit)} gap={4}>
      <Field.Root invalid={!!errors.username}>
        <Field.Label htmlFor="username">Username</Field.Label>
        <Input id="username" {...register('username', { required: 'Username is required' })} />
      </Field.Root>
      <Field.Root invalid={!!errors.password}>
        <Field.Label htmlFor="password">Password</Field.Label>
        <Input id="password" type="password" {...register('password', { required: 'Password is required' })} />
      </Field.Root>
      <Button type="submit" loading={mutation.isPending}>
        Submit
      </Button>
      {mutation.isError && <Text>Error: {mutation.error.message}</Text>}
      {mutation.isSuccess && <Text>Success!</Text>}
    </VStack>
  );
};

export default Admin;