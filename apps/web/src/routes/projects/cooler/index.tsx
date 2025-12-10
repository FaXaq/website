import { Grid, GridItem, HStack, Text, VStack } from "@chakra-ui/react";
import { createFileRoute } from '@tanstack/react-router';

import { COLORS } from '@/components/cooler/const';
import { getDerivedColor } from '@/components/cooler/utils';
import { Link } from '@/components/Link';

export const Route = createFileRoute('/projects/cooler/')({
  loader: async () => {
    return {
      colors: COLORS
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { colors } = Route.useLoaderData();

  return <Grid flexWrap={"wrap"} templateColumns={{
    base: "repeat(3, 1fr)",
    lg: "repeat(5, 1fr)"
  }} w="full">
    {
      colors.colors.map(color => (
        <GridItem key={color.slug} bg={color.hex} color={getDerivedColor(color.rgb_array)} minH={50}>
          <Link to="/projects/cooler/$colorSlug" params={{ colorSlug: color.slug }}>
            <HStack w="full">
              <VStack p={4} alignItems="start" w="full">
                <Text>{color.name}</Text>
                <Text>{color.hex}</Text>
              </VStack>
            </HStack>
          </Link>
        </GridItem>
      ))
    }
  </Grid>;
}
