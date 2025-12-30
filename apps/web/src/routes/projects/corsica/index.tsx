import { HStack, VStack } from '@chakra-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { LuArrowRight } from 'react-icons/lu';

import { Link } from '@/components/Link';
import { m } from '@/paraglide/messages';

export const Route = createFileRoute('/projects/corsica/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <VStack width="100%" alignItems="start" gap={6}>
      <VStack gap={2} width="100%" alignItems="start">
        <Link to="/projects/corsica/merge" description={m['corsica_components_nav_actions_merge_description']()}>
          <HStack>
            {m['corsica_components_nav_actions_merge_label']()}
            <LuArrowRight />
          </HStack>
        </Link>
        <Link to="/projects/corsica/analyse" description={m['corsica_components_nav_actions_analyse_description']()}>
          <HStack>
            {m['corsica_components_nav_actions_analyse_label']()}
            <LuArrowRight />
          </HStack>
        </Link>
      </VStack>
    </VStack>
  );
}
