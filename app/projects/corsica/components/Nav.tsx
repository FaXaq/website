'use client'

import React from 'react'
import { useTranslation } from 'next-i18next'
import { Link } from '@/components/Link'
import { LuArrowRight } from 'react-icons/lu'
import { HStack, VStack } from '@chakra-ui/react'

function Nav() {
  const { t } = useTranslation()

  return (
    <VStack width="100%" alignItems="start" gap={6}>
      <VStack gap={2} width="100%" alignItems="start">
        <Link href="/projects/corsica/merge" description={t('corsica.components.nav.actions.merge.description')}>
          <HStack>
            {t('corsica.components.nav.actions.merge.label')}
            <LuArrowRight />
          </HStack>
        </Link>
        <Link href="/projects/corsica/analyse" description={t('corsica.components.nav.actions.analyse.description')}>
          <HStack>
            {t('corsica.components.nav.actions.analyse.label')}
            <LuArrowRight />
          </HStack>
        </Link>
      </VStack>
    </VStack>
  )
}

export default Nav
