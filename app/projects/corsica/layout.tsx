'use client'

import React from 'react'
import Footer from './components/Footer'
import { Box, Container, Heading, HStack, Text, Theme, VStack } from '@chakra-ui/react'
import CyclingIcon from './components/CyclingIcon'
import { useTranslation } from 'react-i18next'
import { system } from '@chakra-ui/react/preset'

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
            <Box height={7} width={7}><CyclingIcon color={system.token("colors.fg")} /></Box>
            <Heading as="h1" fontSize="2xl">{t('corsica.components.nav.title')}</Heading>
          </HStack>
          <Text>{t('corsica.components.nav.subtitle')}</Text>
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
