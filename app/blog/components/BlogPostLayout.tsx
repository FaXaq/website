'use client'

import React from 'react'
import Head from 'next/head'
import { format } from 'date-fns'
import { Container, Em, Heading, Separator, Text, VStack } from '@chakra-ui/react';

interface BlogPostLayoutProps {
  children: React.JSX.Element | React.JSX.Element[]
  meta: {
    title: string,
    creationDate: string,
    description: string
  }}

const BlogPostLayout = ({ children, meta }: BlogPostLayoutProps) => {
  if (!meta) {
    return
  }

  return (
    <>
      <Head>
        <title>{meta.title}</title>
      </Head>
      <Container py={4}>
        <VStack alignItems="start" gap={6}>
          <Heading as="h1" fontSize="4xl">
            {meta.title}
          </Heading>
          <Text fontSize={14} color="">{meta.description ? meta.description : '' } - <Em>{format(new Date(meta.creationDate), 'do MMMM yyyy')}</Em></Text>
          <Separator variant="solid" />
          <VStack gap={2} alignItems="start">
            {children}
          </VStack>
        </VStack>
      </Container>
    </>
  )
}

export default BlogPostLayout
