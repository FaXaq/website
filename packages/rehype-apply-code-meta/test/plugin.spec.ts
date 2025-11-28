import { describe, it, expect } from 'vitest'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import remarkExtractCodeMeta from '@repo/remark-extract-code-meta'
import plugin from '../src/index'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import rehypeStringify from 'rehype-stringify'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('remark-extract-code-meta plugin', () => {
  it('processes markdown and writes output', async () => {
    const document = await fs.readFile(join(__dirname, 'test.md'), 'utf8')

    const file = await unified()
      .use(remarkParse)
      .use(remarkExtractCodeMeta)
      .use(remarkRehype)
      .use(plugin)
      .use(rehypeStringify)
      .process(document)

    await fs.writeFile(join(__dirname, 'output.md'), String(file))

    // Optionally, add assertions here
    expect(file).toBeTruthy()
  })
})