'use client';

import { Container, Heading, HStack, List, Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LuArrowRight } from 'react-icons/lu';

import { Link } from '@/components/Link';


const Projects = () => {
  const { t } = useTranslation();

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
      <List.Item>
        <Link href="/projects/cooler" description={t('projects.cooler.description')}>
          <HStack>
            {t('projects.cooler.title')}
            <LuArrowRight />
          </HStack>
        </Link>
      </List.Item>
    </List.Root>
  </Container>;
};

export default Projects;
