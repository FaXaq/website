'use client'

import { useColorMode } from "@/components/ui/color-mode";
import { CodeBlock as ChakraCodeBlock, createShikiAdapter, IconButton } from "@chakra-ui/react"
import { HighlighterGeneric } from "shiki"

interface ICodeBlockProps {
  file: {
    code: string,
    language: string;
    title?: string;
  },
  enableCopy?: boolean,
  showLineNumbers?: boolean,
  addedLineNumbers?: Array<number>,
  removedLineNumbers?: Array<number>,
  size?: "sm" | "md" | "lg",
  highlightLines?: Array<number>
}

export const CodeBlock = ({ file, enableCopy = true, showLineNumbers = true, addedLineNumbers = [], size = "sm", highlightLines = [], removedLineNumbers = [] }: ICodeBlockProps) => {
  const { colorMode } = useColorMode();

  return (
    <ChakraCodeBlock.AdapterProvider value={shikiAdapter}>
      <ChakraCodeBlock.Root code={file.code} language={file.language} meta={{ showLineNumbers, colorScheme: colorMode, addedLineNumbers, highlightLines, removedLineNumbers }} size={size}>
        { (file.title || enableCopy) && (
          <ChakraCodeBlock.Header>
            <ChakraCodeBlock.Title>{file.title}</ChakraCodeBlock.Title>
            <ChakraCodeBlock.Control>
              {
                enableCopy && (
                  <ChakraCodeBlock.CopyTrigger asChild>
                    <IconButton variant="ghost" size="2xs">
                      <ChakraCodeBlock.CopyIndicator />
                    </IconButton>
                  </ChakraCodeBlock.CopyTrigger>
                )}
            </ChakraCodeBlock.Control>
          </ChakraCodeBlock.Header>
        )}
        <ChakraCodeBlock.Content>
          <ChakraCodeBlock.Code>
            <ChakraCodeBlock.CodeText />
          </ChakraCodeBlock.Code>
        </ChakraCodeBlock.Content>
      </ChakraCodeBlock.Root>
    </ChakraCodeBlock.AdapterProvider>
  )
}

const shikiAdapter = createShikiAdapter<HighlighterGeneric<any, any>>({
  async load() {
    const { createHighlighter } = await import("shiki")
    return createHighlighter({
      langs: ["tsx", "scss", "html", "bash", "json", "typescript", "txt", "text"],
      themes: ["github-dark", "github-light"],
    })
  },
})
