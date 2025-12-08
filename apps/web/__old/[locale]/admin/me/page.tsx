'use client';

import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';

import { useAuth } from '@/hooks/useAuth';

const AdminMePage = () => {
  const { authUser, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  if (!authUser) {
    return (
      <Container mt={8}>
        <Heading size="lg" mb={4}>
          Not logged in
        </Heading>
        <Text>You must be logged in to view this page.</Text>
      </Container>
    );
  }

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container mt={8}>
      <Heading size="lg" mb={4}>
        My Account
      </Heading>
      <VStack align="flex-start" gap={4}>
        <Box>
          <Text fontWeight="bold">Email:</Text>
          <Text>{authUser.email || '-'}</Text>
        </Box>
        {authUser.name && (
          <Box>
            <Text fontWeight="bold">Name:</Text>
            <Text>{authUser.name}</Text>
          </Box>
        )}
        {/* Add other user fields below as needed */}
      </VStack>
      <Button onClick={handleLogout} loading={isLoading} disabled={isLoading}>
        Logout
      </Button>
    </Container>
  );
};

export default AdminMePage;
