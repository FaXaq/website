'use client';

import { Heading, HStack, Link as ChakraLink,List } from '@chakra-ui/react';
import NextLink from "next/link";
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LuExternalLink } from 'react-icons/lu';

function Footer () {
  const { t } = useTranslation();
  return (
    <footer>
      <HStack>
        <Heading as="h3">{t('resume.copy')}</Heading>
        <List.Root variant="plain" display="flex" flexDir="row">
          <List.Item>
            <ChakraLink href="https://github.com/faxaq/website" rel="noopener noreferrer" as={NextLink} target="_blank">Github<LuExternalLink /></ChakraLink>
          </List.Item>
        </List.Root>
      </HStack>
    </footer>
  );
}

export default Footer;
