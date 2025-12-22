import { Box, Container, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { system } from '@chakra-ui/react/preset';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import React from 'react';

import CyclingIcon from '@/components/corsica/CyclingIcon';
import Footer from '@/components/corsica/Footer';
import { m } from '@/paraglide/messages';


export const Route = createFileRoute('/projects/corsica')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Container p={4}>
      <VStack justifyContent="space-between" alignItems="start">
        <VStack gap={2} width="100%" alignItems="start">
          <HStack alignItems="end">
            <Box height={7} width={7}><CyclingIcon color={system.token("colors.fg")} /></Box>
            <Heading as="h1" fontSize="2xl">{m['corsica_components_nav_title']()}</Heading>
          </HStack>
          <Text>{m['corsica_components_nav_subtitle']()}</Text>
        </VStack>
        <Box py={6} w="full">
          <Outlet />
        </Box>
        <Footer/>
      </VStack>
    </Container>
  );
}
