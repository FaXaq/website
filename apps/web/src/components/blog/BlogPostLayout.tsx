import { Container, Em, Heading, Separator, Text, VStack } from '@chakra-ui/react';
import { format } from 'date-fns';
import React from 'react';

interface BlogPostLayoutProps {
  children: React.JSX.Element | React.JSX.Element[]
  meta: {
    title: string,
    date: string,
    description: string
  }}

const BlogPostLayout = ({ children, meta }: BlogPostLayoutProps) => {
  if (!meta) {
    return;
  }

  return (
    <>
      <Container py={8}>
        <VStack alignItems="start" gap={6}>
          <Heading as="h1" fontSize="4xl">
            {meta.title}
          </Heading>
          <Text fontSize={14} color="">{meta.description ? meta.description : '' } - <Em>{format(new Date(meta.date), 'do MMMM yyyy')}</Em></Text>
          <Separator variant="solid" />
          <VStack gap={2} alignItems="start">
            {children}
          </VStack>
        </VStack>
      </Container>
    </>
  );
};

export default BlogPostLayout;
