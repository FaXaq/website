'use client'

import React from 'react'
import { Link } from '@/components/Link'
import Tags from './Tags'
import { useTranslation } from 'react-i18next'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Head from 'next/head'
import { format } from 'date-fns'
import { Box, Container, Heading, List, Text, VStack } from '@chakra-ui/react'

export interface ArticleMetaData {
  title: string
  description: string
  creationDate: string
  tags: string[]
  published: boolean
}

interface Article {
  meta: ArticleMetaData
  link: string
}

interface BlogProps {
  articles: Article[]
  tags: string[]
}

function BlogHomePage({ articles, tags }: BlogProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  function removeTagFromQueryParams (tagToRemove: string) {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    const tags = searchParams.getAll('tag')

    if (tags.length > 1) {
      newSearchParams.delete('tag')
      tags.filter(tag => tag !== tagToRemove).forEach(tag => newSearchParams.append('tag', tag))
    } else {
      if (tags.indexOf(tagToRemove) > -1) {
        newSearchParams.delete('tag')
      }
    }

    router.push(pathname + '?' + newSearchParams.toString())
  }

  function addTagToQueryParams (tag: string) {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    const tags = searchParams.getAll('tag')

    if (tags.indexOf(tag) === -1) {
      newSearchParams.append('tag', tag)
    } else {
      return
    }

    router.push(pathname + '?' + new URLSearchParams(newSearchParams).toString())
  }

  const links = articles.map((a, i) => {
    return (
      <List.Item key={`article-${i}`}>
        <VStack alignItems="start">
          <Link href={`${a.link}`}>
            <Box>
              <Heading as="h3">{a.meta.title}</Heading>
              <Text>{a.meta.description ? a.meta.description : '' } - <em>{format(new Date(a.meta.creationDate), 'do MMMM yyyy')}</em></Text>
            </Box>
          </Link>
          <Tags tags={a.meta.tags || []} onClick={addTagToQueryParams} />
        </VStack>
      </List.Item>
    )
  })

  return (
    <>
      <Head>
        <title>Blog</title>
      </Head>
      <Container py={4}>
        <VStack alignItems="start">
          <section>
            {tags.length > 0 && (
              <Box>
                <Text>{t('blog.tagsSearch')}</Text>
                <Tags tags={tags} removable onDelete={tag => removeTagFromQueryParams(tag)}/>
              </Box>
            )}
          </section>
          <List.Root variant="plain" gap={4}>
            {links.length > 0 ? links : 'No blog post here...'}
          </List.Root>
          <footer>
            <p>Links:</p>
            <ul>
              <li>
                <Link href="/blog/rss">RSS</Link>
              </li>
              <li>
                <Link href="https://github.com/faxaq/website">Code</Link>
              </li>
            </ul>
          </footer>
        </VStack>
      </Container>
    </>
  )
}

export default BlogHomePage
