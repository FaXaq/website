'use client'

import React from 'react'
import Footer from './components/Footer'
import { Box, Container, Heading, HStack, Text, Theme, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { system } from '@chakra-ui/react/preset'
import MTTSLogo from '@/components/images/mtts-logo'

interface CorsicaLayoutProps {
    children: React.ReactNode
}

function CorsicaLayout({ children }: CorsicaLayoutProps) {
  const { t } = useTranslation();

  return (
    <Container p={4}>
      <VStack justifyContent="space-between" alignItems="start">
        <VStack gap={2} width="100%" alignItems="start">
          <HStack alignItems="end">
            <Box height={7} width={7}><MTTSLogo color={system.token("colors.fg")} /></Box>
            <Heading as="h1" fontSize="2xl">{t('mtts.pages.index.title')}</Heading>
          </HStack>
          <Text>{t('mtts.pages.index.subtitle')}</Text>
        </VStack>
        <Box py={6} w="full">
          {children}
        </Box>
        <Footer/>
      </VStack>
    </Container>
  )
}

export default CorsicaLayout
