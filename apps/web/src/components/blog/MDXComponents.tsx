import type { ImageProps, LinkProps } from '@chakra-ui/react';
import { Blockquote,Box, Code, CodeBlock as ChakraCodeBlock, createShikiAdapter, Heading,IconButton,Image as ChakraImage,Link as ChakraLink, List, Separator, Table, Text } from '@chakra-ui/react';
import { Image } from '@unpic/react';
import React from 'react';
import { LuExternalLink } from 'react-icons/lu';
import type { BundledLanguage, BundledTheme, HighlighterGeneric } from 'shiki';
import { createHighlighter } from 'shiki';
import z from 'zod';

import { ExternalLink } from '../Link';
import { useColorMode } from '../ui/color-mode';

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


export const MDXCodeBlock = ({ children }: { children: React.Component<{ children: string, "data-meta"?: string, "data-language": string }> }) => {
  if (typeof window === "undefined" || document === undefined) {
    return null;
  }

  const MetaSchema = z.object({
    language: z.string(),
    title: z.string().optional(),
    size: z.enum(["sm", "md", "lg"]).optional(),
    addedLineNumbers: z.array(z.number()).optional(),
    removedLineNumbers: z.array(z.number()).optional(),
    showLineNumbers: z.boolean().optional().default(true),
    highlightLines: z.array(z.number()).optional(),
    wordWrap: z.boolean().optional().default(false),
    focusedLineNumbers: z.array(z.number()).optional(),
  });

  const { colorMode } = useColorMode();

  const code = children.props.children;

  const extractSpecsFromMeta = (meta: string) => {
    const specs = meta.split(" ");
    const res: Record<string, unknown> = {};
    specs.forEach((spec) => {
      const [key, value] = spec.split("=");
      if (!value || !key) return;
      switch (key) {
        case "title":
          res[key] = value.replaceAll("\"", "").replaceAll("'", "");
          break;
        case "size":
          res[key] = value.replaceAll("\"", "").replaceAll("'", "");
          break;
        case "addedLineNumbers":
          res[key] = JSON.parse(value);
          break;
        case "removedLineNumbers":
          res[key] = JSON.parse(value);
          break;
        case "showLineNumbers":
          res[key] = value === "true";
          break;
        case "highlightLines":
          res[key] = JSON.parse(value);
          break;
        case "wordWrap":
          res[key] = value === "true";
          break;
        case "focusedLineNumbers":
          res[key] = JSON.parse(value);
          break;
        default:
          res[key] = value;
          break;
      }
    });
    return res;
  };

  let data: z.infer<typeof MetaSchema>;

  if (children.props["data-meta"]) {
    const res = extractSpecsFromMeta(children.props["data-meta"]);
    res.language = children.props["data-language"];
    data = MetaSchema.parse(res);
  } else {
    data = MetaSchema.parse({
      language: "text",
      showLineNumbers: true,
    });
  }

  const shikiAdapter = createShikiAdapter<HighlighterGeneric<BundledLanguage, BundledTheme>>({
    async load() {
      return await createHighlighter({
        langs: ["tsx", "typescript", "txt", "text", "rust"],
        themes: ["github-light", "github-dark"],
      });
    },
    theme: {
      light: "github-light",
      dark: "github-dark",
    }
  });

  return (
    <Box maxW="full">
      <ChakraCodeBlock.AdapterProvider value={shikiAdapter}>
        <ChakraCodeBlock.Root
          code={code}
          meta={{
            colorScheme: colorMode,
            addedLineNumbers: data?.addedLineNumbers ?? [],
            removedLineNumbers: data?.removedLineNumbers ?? [],
            showLineNumbers: data.showLineNumbers,
            highlightLines: data?.highlightLines ?? [],
            wordWrap: data?.wordWrap ?? false,
            focusedLineNumbers: data?.focusedLineNumbers ?? [],
          }}
          size={data?.size ?? "sm"}
          language="typescript"
          overflow="auto"
        >
          <ChakraCodeBlock.Header>
            {data?.title && (<ChakraCodeBlock.Title>{data.title}</ChakraCodeBlock.Title> )}
            <ChakraCodeBlock.Control>
              <ChakraCodeBlock.CopyTrigger asChild>
                <IconButton variant="ghost" size="2xs">
                  <ChakraCodeBlock.CopyIndicator />
                </IconButton>
              </ChakraCodeBlock.CopyTrigger>
            </ChakraCodeBlock.Control>
          </ChakraCodeBlock.Header>
          <ChakraCodeBlock.Content>
            <ChakraCodeBlock.Code>
              <ChakraCodeBlock.CodeText overflow="auto" />
            </ChakraCodeBlock.Code>
          </ChakraCodeBlock.Content>
        </ChakraCodeBlock.Root>
      </ChakraCodeBlock.AdapterProvider>
    </Box>
  );
};

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
  <ChakraLink as={ExternalLink} {...props} target="_blank" color={{ base: "fg.info" }}>
    {children}<LuExternalLink />
  </ChakraLink>
);
export const MDXComponents = {
  h1: MDXHeading1,
  h2: MDXHeading2,
  h3: MDXHeading3,
  h4: MDXHeading4,
  h5: MDXHeading5,
  h6: MDXHeading6,
  p: MDXText,
  code: MDXCode,
  ul: MDXList,
  li: MDXListItem,
  blockquote: MDXBlockquote,
  table: MDXTable,
  thead: MDXTableHeader,
  tbody: MDXTableBody,
  tr: MDXTableRow,
  th: MDXTableColumnHeader,
  td: MDXTableCell,
  a: MDXLink,
  pre: MDXCodeBlock,
};