'use client';

import { Heading, Link as ChakraLink, Text,VStack } from '@chakra-ui/react';
import NextLink from "next/link";
import { useTranslation } from 'next-i18next';
import React from 'react';
import { LuExternalLink } from 'react-icons/lu';

import type { TProject } from '../types';

function Project ({ project }: { project: TProject }) {
  const { t } = useTranslation();
  return (
    <VStack alignItems="start" width="100%" fontSize="xs">
      <Heading as="h4" fontSize="lg">{project.title}</Heading>
      <Text color="fg.muted">{project.period}</Text>
      {project.links.length > 0 && (<Text>
        {project.links.map(l => (
          <ChakraLink key={l} as={NextLink} href={l} pr={2} color="fg.info">
            {l.replace("https://","")}<LuExternalLink />
          </ChakraLink>
        ))}
      </Text>)}
      <Text>
        {project.tasks.map(t => <span key={t.text}>{t.text}</span>)}
      </Text>
    </VStack>
  );
}

export default Project;
