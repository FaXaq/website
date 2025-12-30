import { Box, Grid, GridItem, Heading, Text, VStack } from "@chakra-ui/react";
import { createFileRoute } from '@tanstack/react-router';

import { getColor, getDerivedColor } from "@/components/cooler/utils";
import { Link } from "@/components/Link";

export const Route = createFileRoute('/projects/cooler/$colorSlug/')({
  component: RouteComponent,
  loader: ({ params }) => {
    return {
      color: getColor(params.colorSlug)
    };
  }
});

function RouteComponent() {
  const { color } = Route.useLoaderData();

  if (!color) {
    return null;
  }

  return <Box w="full" h="full">
    <VStack direction="column-reverse" w="full" h="full" gap={0}>
      <Box bg={color?.color?.hex} h="full" w="full" color={getDerivedColor(color.color.rgb_array)} p={3}>
        <Heading as="h2">{color.color.name}</Heading>
        <Text>{color.color.hex}</Text>
        <Text>{color.color.rgb}</Text>
        <Text>{color.color.cmyk}</Text>
      </Box>
      <Grid templateColumns="repeat(4, 1fr)" w="full" p={2}>
        {
          color?.combinations?.map((c) => (
            <GridItem h={100} key={`${c.number}`} p={2}>
              <Link
                to="/projects/cooler/$colorSlug/$combination"
                params={{ colorSlug: color.color.slug, combination: c.number.toString() }}
                style={{ display: "block", height: "100%" }}
              >
                <Grid templateColumns={`repeat(${c.colors.length}, 1fr)`} h="full" w="full">
                  {
                    c.colors.map(cc => (
                      <GridItem key={`${c.number}-${cc.slug}`} bgColor={cc.hex} h="full" w="full"></GridItem>
                    ))
                  }
                </Grid>
              </Link>
            </GridItem>
          ))
        }
      </Grid>
    </VStack>
  </Box>;
}
