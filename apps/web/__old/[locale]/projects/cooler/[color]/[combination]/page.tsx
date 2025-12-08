import { Box, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import { Trans } from "react-i18next/TransWithoutContext";

import { getColorCombination } from "../../api/colors/utils";
import { getDerivedColor } from "../../utils";

const CoolerColor = async ({ params }: { params: Promise<{ color: string, combination: string }> }) => {
  const { color, combination: combinationParam } = await params;
  const combination = await getColorCombination(color, parseInt(combinationParam));

  if (!combination) {
    return <Box>
      <Trans>No color combination found</Trans>
    </Box>;
  }

  const mainColor = combination.colors[0];
  const complementaryColors = combination.colors.slice(1);

  return <Box w="full" h="full">
    <Grid w="full" h="full" templateColumns="repeat(2, 1fr)">
      <GridItem rowSpan={complementaryColors.length} bg={mainColor.hex} color={getDerivedColor(mainColor.rgb_array)}>
        <Link href={`/projects/cooler/${mainColor.slug}`} style={{ display: "block", height: "100%", width: "100%" }}>
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
            <Link href={`/projects/cooler/${cc.slug}`} style={{ display: "block", height: "100%", width: "100%" }}>
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
};

export default CoolerColor;