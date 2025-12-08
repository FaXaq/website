'use client';

import { HStack, VStack } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LuArrowRight } from 'react-icons/lu';

import { Link } from '@/components/Link';

function Nav() {
  const { t } = useTranslation();

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
  );
}

export default Nav;
