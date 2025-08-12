import { useCreateUrl } from '@/hooks/useCreateUrl';
import { Link as ChakraLink } from '@chakra-ui/react'
import NextLink from 'next/link';
import { ComponentProps } from 'react';

type LinkProps = Omit<ComponentProps<typeof NextLink>, 'href'> & { href: string };

export const Link = ({ href, children, ...props}: LinkProps) => {
  const createUrl = useCreateUrl();

  return <ChakraLink
    {...props}
    href={createUrl(href)}
    as={NextLink}
    _hover={{ color: "gray.400" }}
    transition="color 0.15s"
    style={{
      textDecoration: "none"
    }}
  >{children}</ChakraLink>
}