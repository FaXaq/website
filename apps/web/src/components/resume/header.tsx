'use client';

import { Heading, HStack, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { LuMapPin } from 'react-icons/lu';

import { m } from '@/paraglide/messages';

function Header () {
  return (
    <header>
      <VStack alignItems="start">
        <HStack alignItems="start" justifyContent="space-between" width="100%">
          <VStack gap={2} alignItems="start">
            <Heading as="h1" size="4xl">
              {m['resume.firstname']()}
            </Heading>
            <Heading as="h2" size="2xl" fontWeight="bold">
              {m['resume.workfield']()}
            </Heading>
          </VStack>
          <HStack justifyContent="start" alignItems="center">
            <LuMapPin /><Text>{m['resume.location']()}</Text>
          </HStack>
        </HStack>
        <Text>
          {m['resume.description']()}
        </Text>
      </VStack>
    </header>
  );
}

export default Header;
