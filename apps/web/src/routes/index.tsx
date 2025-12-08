import { Container, Heading, List, Text } from '@chakra-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import React from 'react';
import { LuArrowRight, LuExternalLink } from 'react-icons/lu';

import { ExternalLink, Link } from '../components/Link';
import { m } from '../paraglide/messages';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <Container p={4}>
      <Heading as="h1" size="2xl" mb={4}>
        {m['home.title']()}
      </Heading>
      <Text>
        {m['home.description']()}
      </Text>
      <List.Root gap={2} py={4} variant="plain">
        <List.Item>
          <Link to="/resume">
            {m['home.resume']()}
            <LuArrowRight />
          </Link>
        </List.Item>
        <List.Item>
          <Link to="/projects">
            {m['home.projects']()}
            <LuArrowRight />
          </Link>
        </List.Item>
        <List.Item>
          <Link to="/blog">
            {m['home.blog']()}
            <LuArrowRight />
          </Link>
        </List.Item>
        <List.Item>
          <ExternalLink target="_blank" href="https://github.com/faxaq">
            {m['home.github']()}
            <LuExternalLink />
          </ExternalLink>
        </List.Item>
      </List.Root>
    </Container>
  );
}

export default Home;
