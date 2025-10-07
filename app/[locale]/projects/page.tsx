'use client'

import React from 'react'
import { Box, Container, Heading, HStack, List, Span, Text, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { LuArrowRight, LuExternalLink } from 'react-icons/lu'
import { Link } from '@/components/Link'
import CyclingIcon from './corsica/components/CyclingIcon'

const Projects = () => {
  const { t } = useTranslation()

  return <Container p={4}>
    <Heading as="h1" size="2xl" mb={4}>
      {t("projects.title")}
    </Heading>
    <Text>
      {t("projects.description")}
    </Text>
    <List.Root gap={2} py={4} variant="plain">
      <List.Item>
        <Link href="/projects/mtts" description={t('projects.mtts.description')}>
          <HStack>
            {t('projects.mtts.title')}
            <LuArrowRight />
          </HStack>
        </Link>
      </List.Item>
      <List.Item>
        <Link href="/projects/corsica" description={t('projects.corsica.description')}>
          <HStack>
            {t('projects.corsica.title')}
            <LuArrowRight />
          </HStack>
        </Link>
      </List.Item>
    </List.Root>
  </Container>
}

export default Projects
