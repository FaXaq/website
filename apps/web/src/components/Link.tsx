import type {LinkProps as ChakraLinkProps} from '@chakra-ui/react';
import { Link as ChakraLink,  Span, VStack } from '@chakra-ui/react';
import type { Link as TanstackLink } from '@tanstack/react-router';
import { createLink } from '@tanstack/react-router';
import _ from 'lodash';
import React from 'react';

interface CustomChakraLinkProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TanstackLink>, 'href'> {
  // Add any additional props you want to pass to the link
  description?: string
}

const CustomChakraLink = React.forwardRef<
HTMLAnchorElement,
ChakraLinkProps
>((props, ref) => {
  return <ChakraLink
    ref={ref}
    _hover={{ color: "gray.400" }}
    transition="color 0.15s"
    style={{
      textDecoration: "none"
    }}
    {...props}
  />;
});

CustomChakraLink.displayName = 'CustomChakraLink';

const ChakraLinkComponent = React.forwardRef<
  HTMLAnchorElement,
  CustomChakraLinkProps
>(({ description, children, mask, ...props }, ref) => {
  const hasDescription = !_.isEmpty(description);
  if (children instanceof Function) {
    children = children({ isActive: false, isTransitioning: false });
  }
  return <ChakraLink
    ref={ref}
    _hover={{ color: "gray.400" }}
    transition="color 0.15s"
    style={{
      textDecoration: "none",
      display: "block",
      height: "100%"
    }}
    {...props}
  >
    {hasDescription && (
      <VStack alignItems="start" gap={0}>
        {children}
        <Span fontSize="xs">{description}</Span>
      </VStack>
    )}
    {!hasDescription && children}
  </ChakraLink>;
});

ChakraLinkComponent.displayName = 'ChakraLinkComponent';

export const Link = createLink(ChakraLinkComponent);
export const ExternalLink = CustomChakraLink;