import { Box, Heading, HStack, List, Text, VStack } from '@chakra-ui/react';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import React from 'react';
import { LuArrowRight } from 'react-icons/lu';

import ResearchIcon from '@/components/images/research-icon';
import { Link } from '@/components/Link';
import { m } from '@/paraglide/messages';

interface Experiment {
  title: string;
  description: string;
  link: string;
}

export const Route = createFileRoute('/projects/mtts/')({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();

  const experiments = [
    {
      title: m['mtts_pages_index_experiments_0_title'](),
      description: m['mtts_pages_index_experiments_0_description'](),
      link: m['mtts_pages_index_experiments_0_link'](),
    },
    {
      title: m['mtts_pages_index_experiments_1_title'](),
      description: m['mtts_pages_index_experiments_1_description'](),
      link: m['mtts_pages_index_experiments_1_link'](),
    }
  ].map(e => {
    if (!(e.link in router.routesByPath)) {
      return;
    }
    return (
      <List.Item key={e.title}>
        <Link to={e.link} description={e.description}>
          <HStack>
            {e.title}
            <LuArrowRight />
          </HStack>
        </Link>
      </List.Item>
    );
  });

  return (
    <VStack alignItems="start" gap={4}>
      <Box>
        <HStack>
          <Box h={7} w={7}>
            <ResearchIcon />
          </Box>
          <Heading as="h3">{m['mtts_pages_index_research_title']()}</Heading>
        </HStack>
        <Text>{m['mtts_pages_index_research_text']()}</Text>
      </Box>
      <VStack gap={2} alignItems="start">
        <Heading as="h3">{m['mtts_pages_index_experimentsTitle']()}</Heading>
        <List.Root variant="plain" gap={4}>
          {experiments}
        </List.Root>
      </VStack>
    </VStack>
  );
}
