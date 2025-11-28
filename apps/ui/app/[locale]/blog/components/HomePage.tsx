'use client';

import { Box, Container, Heading, HStack, List, Separator, Text, VStack } from '@chakra-ui/react';
import { format } from 'date-fns';
import Head from 'next/head';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { LuExternalLink } from 'react-icons/lu';

import { Link } from '@/components/Link';

import Tags from './Tags';

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
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  function removeTagFromQueryParams (tagToRemove: string) {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const tags = searchParams.getAll('tag');

    if (tags.length > 1) {
      newSearchParams.delete('tag');
      tags.filter(tag => tag !== tagToRemove).forEach(tag => newSearchParams.append('tag', tag));
    } else {
      if (tags.indexOf(tagToRemove) > -1) {
        newSearchParams.delete('tag');
      }
    }

    router.push(pathname + '?' + newSearchParams.toString());
  }

  function addTagToQueryParams (tag: string) {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const tags = searchParams.getAll('tag');

    if (tags.indexOf(tag) === -1) {
      newSearchParams.append('tag', tag);
    } else {
      return;
    }

    router.push(pathname + '?' + new URLSearchParams(newSearchParams).toString());
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
    );
  });

  return (
    <>
      <Head>
        <title>Blog</title>
      </Head>
      <Container py={4}>
        <VStack alignItems="start">
          <section>
            {tags.length > 0 && (
              <VStack pb={4} gap={4} alignItems="start">
                <Text>{t('blog.tagsSearch')}</Text>
                <Tags tags={tags} removable onDelete={tag => removeTagFromQueryParams(tag)}/>
              </VStack>
            )}
          </section>
          <List.Root variant="plain" gap={4} w="full">
            {links.length > 0 ? links : 'No blog post here...'}
          </List.Root>
          <Separator my={6} width="100%"/>
          <footer>
            <HStack>
              <Heading as="h3">Links:</Heading>
              <List.Root variant="plain" display="flex" flexDir="row">
                {/* <List.Item>
                  <Link href="/blog/rss">RSS<LuLink /></Link>
                </List.Item> */}
                <List.Item px={3}>/</List.Item>
                <List.Item>
                  <Link href="https://github.com/faxaq/website">Code<LuExternalLink /></Link>
                </List.Item>
              </List.Root>
            </HStack>
          </footer>
        </VStack>
      </Container>
    </>
  );
}

export default function SuspendedBlogHomePage(props: BlogProps) {
  return (
    <Suspense>
      <BlogHomePage {...props} />
    </Suspense>
  );
}
