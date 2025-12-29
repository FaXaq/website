import { Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { LuMapPin } from 'react-icons/lu';

import { m } from '@/paraglide/messages';

function Header () {
  return (
    <header>
      <VStack alignItems="start">
        <HStack alignItems="start" justifyContent="space-between" width="100%">
          <VStack gap={2} alignItems="start">
            <Heading as="h1" size="4xl">
              {m['resume_firstname']()}
            </Heading>
            <Heading as="h2" size="2xl" fontWeight="bold">
              {m['resume_workfield']()}
            </Heading>
          </VStack>
          <HStack justifyContent="start" alignItems="center">
            <LuMapPin /><Text>{m['resume_location']()}</Text>
          </HStack>
        </HStack>
        <Text>
          {m['resume_description']()}
        </Text>
      </VStack>
    </header>
  );
}

export default Header;
