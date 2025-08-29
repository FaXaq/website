'use client'

import React from 'react'
import { useTranslation } from 'next-i18next'
import ResearchIcon from '../../components/images/research-icon'
import { Box, Heading, HStack, List, Text, VStack } from '@chakra-ui/react'
import { Link } from '@/components/Link'
import { LuArrowRight } from 'react-icons/lu'

interface Experiment {
  title: string;
  description: string;
  link: string;
}

function Page() {
  const { t } = useTranslation()
  const experiments: React.JSX.Element[] = (t('mtts.pages.index.experiments') as unknown as Experiment[]).map(e => {
    return (
      
      <List.Item key={e.title}>
        <Link href={e.link} description={e.description}>
          <HStack>
            {e.title}
            <LuArrowRight />
          </HStack>
        </Link>
      </List.Item>
    )
  })

  return (
    <>
    <VStack alignItems="start" gap={4}>
      <Box>
        <HStack>
          <Box h={7} w={7}>
            <ResearchIcon />
          </Box>
          <Heading as="h3">{t('mtts.pages.index.research.title')}</Heading>
        </HStack>
        <Text>{t('mtts.pages.index.research.text')}</Text>
      </Box>
      <VStack gap={2} alignItems="start">
        <Heading as="h3">{t('mtts.pages.index.experimentsTitle')}</Heading>
        <List.Root variant="plain" gap={4}>
          {experiments}
        </List.Root>
      </VStack>
    </VStack>
    </>
  )
}

export default Page
