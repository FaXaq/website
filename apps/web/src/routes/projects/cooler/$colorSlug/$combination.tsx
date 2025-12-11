import { Box, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import { createFileRoute } from '@tanstack/react-router';

import { getColorCombination } from "@/components/cooler/utils";
import { getDerivedColor } from "@/components/cooler/utils";
import { Link } from "@/components/Link";

export const Route = createFileRoute(
  '/projects/cooler/$colorSlug/$combination',
)({
  component: RouteComponent,
  loader: ({ params }) => {
    return {
      combination: getColorCombination(params.colorSlug, parseInt(params.combination))
    };
  }
});

function RouteComponent() {
  const { combination } = Route.useLoaderData();

  if (!combination) {
    return <Box>
      <Text>No combination found</Text>
    </Box>;
  }

  const mainColor = combination.colors[0]!;
  const complementaryColors = combination.colors.slice(1);

  return <Box w="full" h="full">
    <Grid w="full" h="full" templateColumns="repeat(2, 1fr)">
      <GridItem rowSpan={complementaryColors.length} bg={mainColor.hex} color={getDerivedColor(mainColor.rgb_array)}>
        <Link to="/projects/cooler/$colorSlug" params={{ colorSlug: mainColor.slug }} style={{ display: "block", width: "100%", height: "100%", color: "inherit" }}>
          <Box p={3}>
            <Heading as="h2">{mainColor.name}</Heading>
            <Text>{mainColor.hex}</Text>
            <Text>{mainColor.rgb}</Text>
            <Text>{mainColor.cmyk}</Text>
          </Box>
        </Link>
      </GridItem>
        {complementaryColors.map(cc => (
          <GridItem key={cc.slug} bg={cc.hex} color={getDerivedColor(cc.rgb_array)}>
            <Link to="/projects/cooler/$colorSlug" params={{ colorSlug: cc.slug }} style={{ display: "block", width: "100%", height: "100%", color: "inherit" }}>
              <Box p={3}>
                <Heading as="h2">{cc.name}</Heading>
                <Text>{cc.hex}</Text>
                <Text>{cc.rgb}</Text>
                <Text>{cc.cmyk}</Text>
              </Box>
            </Link>
          </GridItem>
        ))}
    </Grid>
  </Box>;
}
