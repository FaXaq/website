import { Grid, GridItem, HStack, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";

import { getColors } from "./api/colors/utils";
import { getDerivedColor } from "./utils";

const Cooler = async () => {
  const colors = getColors();

  return <Grid flexWrap={"wrap"} templateColumns={{
    base: "repeat(3, 1fr)",
    lg: "repeat(5, 1fr)"
  }} w="full">
    {
      colors.colors.map(color => (
        <GridItem key={color.slug} bg={color.hex} color={getDerivedColor(color.rgb_array)} minH={50}>
          <Link href={`/projects/cooler/${color.slug}`}>
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
};

export default Cooler;