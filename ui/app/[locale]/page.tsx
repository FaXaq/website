'use client';

import { Container, Heading, List, Text } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { LuArrowRight, LuExternalLink } from 'react-icons/lu';

import { Link } from '@/components/Link';

const Home = () => {
  const { t } = useTranslation();

  return (
    <Container p={4}>
      <Heading as="h1" size="2xl" mb={4}>
        {t("home.title")}
      </Heading>
      <Text>
        {t("home.description")}
      </Text>
      <List.Root gap={2} py={4} variant="plain">
        <List.Item>
          <Link href="resume">
            {t("home.resume")}
            <LuArrowRight />
          </Link>
        </List.Item>
        <List.Item>
          <Link href="projects">
            {t("home.projects")}
            <LuArrowRight />
          </Link>
        </List.Item>
        <List.Item>
          <Link href="blog">
            {t("home.blog")}
            <LuArrowRight />
          </Link>
        </List.Item>
        <List.Item>
          <Link target="_blank" href="https://github.com/faxaq">
            {t("home.github")}
            <LuExternalLink />
          </Link>
        </List.Item>
      </List.Root>
    </Container>
  );
};

export default Home;
