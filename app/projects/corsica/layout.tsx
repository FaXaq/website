'use client'

import React from 'react'
import Nav from './components/Nav'
import { usePathname } from 'next/navigation'
import Footer from './components/Footer'
import { Box, Container, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import CyclingIcon from './components/CyclingIcon'
import { useTranslation } from 'react-i18next'

interface CorsicaLayoutProps {
    children: React.ReactNode
}

function CorsicaLayout({ children }: CorsicaLayoutProps) {
  const path = usePathname()
  const { t } = useTranslation();

  return (
    <Container p={4}>
      <VStack justifyContent="space-between" alignItems="start">
        <VStack gap={2} width="100%" alignItems="start">
          <HStack alignItems="end">
            <Box height={7} width={7}><CyclingIcon /></Box>
            <Heading as="h1" fontSize="2xl">{t('corsica.components.nav.title')}</Heading>
          </HStack>
          <Text>{t('corsica.components.nav.subtitle')}</Text>
        </VStack>
        <Box py={6}>
          {children}
        </Box>
        <Footer/>
      </VStack>
    </Container>
  )
}

export default CorsicaLayout
