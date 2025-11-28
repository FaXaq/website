import { Box, Grid, GridItem, Heading, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { Trans } from "react-i18next/TransWithoutContext";

import { getColor } from "../api/colors/utils";
import { getDerivedColor } from "../utils";

const CoolerColor = async ({ params }: { params: Promise<{ color: string }> }) => {
  const { color: colorParam } = await params;
  const color = await getColor(colorParam);

  if (!color) {
    return <Box>
      <Trans>No color found</Trans>
    </Box>;
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
              <Link href={`/projects/cooler/${color.color.slug}/${c.number}`}>
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
};

export default CoolerColor;