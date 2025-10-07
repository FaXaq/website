import { Link as ChakraLink, Span, VStack } from '@chakra-ui/react'
import _ from 'lodash';
import NextLink from 'next/link';
import { ComponentProps } from 'react';

type LinkDefaultProps = Omit<ComponentProps<typeof NextLink>, 'href'> & { href: string };

interface LinkProps extends LinkDefaultProps {
  description?: string
}

export const Link = ({ href, children, description, ...props}: LinkProps) => {
  const hasDescription = !_.isEmpty(description);

  return <ChakraLink
    {...props}
    href={href}
    as={NextLink}
    _hover={{ color: "gray.400" }}
    transition="color 0.15s"
    style={{
      textDecoration: "none"
    }}
  >
    {hasDescription && (
      <VStack alignItems="start" gap={0}>
        {children}
        <Span fontSize="xs">{description}</Span>
      </VStack>
    )}
    {!hasDescription && children}
  </ChakraLink>
}