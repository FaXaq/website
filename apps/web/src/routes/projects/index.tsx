import { Container, Heading, HStack, List, Text } from '@chakra-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import React from 'react';
import { LuArrowRight } from 'react-icons/lu';

import { Link } from '@/components/Link';
import { m } from '@/paraglide/messages';

export const Route = createFileRoute('/projects/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Container p={4}>
    <Heading as="h1" size="2xl" mb={4}>
      {m["projects_title"]()}
    </Heading>
    <Text>
      {m["projects_description"]()}
    </Text>
    <List.Root gap={2} py={4} variant="plain">
      <List.Item>
        <Link to="/projects/mtts" description={m['projects_mtts_description']()}>
          <HStack>
            {m['projects_mtts_title']().toUpperCase()}
            <LuArrowRight />
          </HStack>
        </Link>
      </List.Item>
      <List.Item>
        <Link to="/projects/mtts" description={m['projects_corsica_description']()}>
          <HStack>
            {m['projects_corsica_title']()}
            <LuArrowRight />
          </HStack>
        </Link>
      </List.Item>
      <List.Item>
        <Link to="/projects/cooler" description={m['projects_cooler_description']()}>
          <HStack>
            {m['projects_cooler_title']()}
            <LuArrowRight />
          </HStack>
        </Link>
      </List.Item>
    </List.Root>
  </Container>;
}

