'use client';

import { Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { LuMapPin } from 'react-icons/lu';

function Header () {
  const { t } = useTranslation();
  return (
    <header>
      <VStack alignItems="start">
        <HStack alignItems="start" justifyContent="space-between" width="100%">
          <VStack gap={2} alignItems="start">
            <Heading as="h1" size="4xl">
              {t('resume.firstname')}
            </Heading>
            <Heading as="h2" size="2xl" fontWeight="bold">
              {t('resume.workfield')}
            </Heading>
          </VStack>
          <HStack justifyContent="start" alignItems="center">
            <LuMapPin /><Text>{t('resume.location')}</Text>
          </HStack>
        </HStack>
        <Text>
          {t('resume.description')}
        </Text>
      </VStack>
    </header>
  );
}

export default Header;
