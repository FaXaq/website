'use client';

import type { ImageProps, LinkProps } from '@chakra-ui/react';
import { Blockquote,Code, Heading, Image as ChakraImage,Link as ChakraLink, List, Separator, Table, Text } from '@chakra-ui/react';
import Image from 'next/image';
import NextLink from 'next/link';
import { LuExternalLink } from 'react-icons/lu';

export const MDXHeading1 = ({ children }: { children: React.ReactNode }) => (
  <><Heading as="h1" mt={4} mb={2}>{children}</Heading><Separator /></>
);

export const MDXHeading2 = ({ children }: { children: React.ReactNode }) => (
  <Heading as="h2" mt={4} mb={2} fontSize="2xl">{children}</Heading>
);

export const MDXHeading3 = ({ children }: { children: React.ReactNode }) => (
  <Heading as="h3" mt={4} mb={2}>{children}</Heading>
);

export const MDXHeading4 = ({ children }: { children: React.ReactNode }) => (
  <Heading as="h4" mt={4} mb={2}>{children}</Heading>
);

export const MDXHeading5 = ({ children }: { children: React.ReactNode }) => (
  <Heading as="h5" mt={4} mb={2}>{children}</Heading>
);

export const MDXHeading6 = ({ children }: { children: React.ReactNode }) => (
  <Heading as="h6" mt={4} mb={2}>{children}</Heading>
);

export const MDXText = ({ children }: { children: React.ReactNode }) => (
  <Text fontSize="md" my={2}>{children}</Text>
);

export const MDXCode = ({ children }: { children: React.ReactNode }) => (
  <Code>{children}</Code>
);

export const MDXList = ({ children }: { children: React.ReactNode }) => (
  <List.Root>{children}</List.Root>
);

export const MDXListItem = ({ children }: { children: React.ReactNode }) => (
  <List.Item ml={4}>{children}</List.Item>
);

export const MDXBlockquote = ({ children }: { children: React.ReactNode }) => (
  <Blockquote.Root>
    <Blockquote.Content>{children}</Blockquote.Content>
  </Blockquote.Root>
);

export const MDXTable = ({ children }: { children: React.ReactNode }) => (
  <Table.Root>{children}</Table.Root>
);

export const MDXTableHeader = ({ children }: { children: React.ReactNode }) => (
  <Table.Header>{children}</Table.Header>
);

export const MDXTableBody = ({ children }: { children: React.ReactNode }) => (
  <Table.Body>{children}</Table.Body>
);

export const MDXTableRow = ({ children }: { children: React.ReactNode }) => (
  <Table.Row>{children}</Table.Row>
);

export const MDXTableColumnHeader = ({ children }: { children: React.ReactNode }) => (
  <Table.ColumnHeader>{children}</Table.ColumnHeader>
);

export const MDXTableCell = ({ children }: { children: React.ReactNode }) => (
  <Table.Cell>{children}</Table.Cell>
);

export const MDXImg = (props: ImageProps) => (
  <ChakraImage as={Image} {...props} />
);

interface MDXLinkProps extends LinkProps {
  children: React.ReactNode
}

export const MDXLink = ({ children, ...props }: MDXLinkProps) => (
  <ChakraLink as={NextLink} {...props} target="_blank" color={{ base: "fg.info" }}>
    {children}<LuExternalLink />
  </ChakraLink>
);