import { Box, Heading, Text } from "@chakra-ui/react";
import type { NotFoundRouteProps } from "@tanstack/react-router";
import React from "react";

const NotFound: React.FC<NotFoundRouteProps> = ({ data, isNotFound, routeId }) => {
  return (
    <Box
      textAlign="center"
      py="16"
      px="4"
    >
      <Heading as="h1" size="2xl" mb="4">
        404 &ndash;
      </Heading>
      <Text fontSize="xl">
        Sorry, the page you are looking for does not exist.
      </Text>
    </Box>
  );
};

export default NotFound;
