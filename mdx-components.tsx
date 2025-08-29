import NextLink from 'next/link'
import { Code, Heading, Text, List, Separator, Blockquote, Table, Link as ChakraLink } from '@chakra-ui/react'
import type { MDXComponents } from 'mdx/types'
import { LuExternalLink } from 'react-icons/lu'

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    // h1: ({ children }) => <h1 style={{ fontSize: "100px" }}>{children}</h1>,
    ...components,
    h1: ({ children }) => <><Heading as="h1" mt={4} mb={2}>{children}</Heading><Separator /></>,
    h2: ({ children }) => <Heading as="h2" mt={4} mb={2} fontSize="2xl">{children}</Heading>,
    h3: ({ children }) => <Heading as="h3" mt={4} mb={2}>{children}</Heading>,
    h4: ({ children }) => <Heading as="h4" mt={4} mb={2}>{children}</Heading>,
    h5: ({ children }) => <Heading as="h5" mt={4} mb={2}>{children}</Heading>,
    h6: ({ children }) => <Heading as="h6" mt={4} mb={2}>{children}</Heading>,
    p: ({ children }) => <Text fontSize="md" my={2}>{children}</Text>,
    code: ({ children }) => <Code>{children}</Code>,
    ul: ({ children }) => <List.Root>{children}</List.Root>,
    li: ({ children }) => <List.Item ml={4}>{children}</List.Item>,
    blockquote: ({ children }) => <Blockquote.Root>
      <Blockquote.Content>{children}</Blockquote.Content>
    </Blockquote.Root>,
    table: ({ children }) => <Table.Root>{children}</Table.Root>,
    thead: ({ children }) => <Table.Header>{children}</Table.Header>,
    tbody: ({ children }) => <Table.Body>{children}</Table.Body>,
    tr: ({ children }) => <Table.Row>{children}</Table.Row>,
    th: ({ children }) => <Table.ColumnHeader>{children}</Table.ColumnHeader>,
    td: ({ children }) => <Table.Cell>{children}</Table.Cell>,
    a: ({ children, ...props }) => <ChakraLink as={NextLink} {...props} target="_blank" color={{ base: "fg.info" }}>{children}<LuExternalLink /></ChakraLink>
  }
}
