import { Container, Heading, HStack, List, Separator, VStack } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { LuExternalLink } from "react-icons/lu";

import { ArticleListItem } from "@/components/blog/ArticleListItem";
import { ExternalLink } from "@/components/Link";
import { listAllPostMetas } from "@/content";

export const Route = createFileRoute('/blog/')({
  component: BlogIndex,
  loader: async () => {
    const p = listAllPostMetas();

    return { posts: p.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()) };
  }
});

function BlogIndex() {
  const { posts } = Route.useLoaderData();
  // const tags = posts.map((a) => a.meta.tags).flat();

  return <>
  <Container py={4}>
    <VStack alignItems="start">
      {/* <section>
        {tags.length > 0 && (
          <VStack pb={4} gap={4} alignItems="start">
            <Text>{m['blog_tagsSearch']()}</Text>
            <Tags tags={tags} />
          </VStack>
        )}
      </section> */}
      <List.Root variant="plain" gap={4} w="full">
        {posts.map(({ meta }) => (
          <ArticleListItem key={`article-${meta.slug}`} meta={meta} />
        ))}
      </List.Root>
      <Separator my={6} width="100%"/>
      <footer>
        <HStack>
          <Heading as="h3">Links:</Heading>
          <List.Root variant="plain" display="flex" flexDir="row">
            <List.Item px={3}>/</List.Item>
            <List.Item>
              <ExternalLink href="https://github.com/faxaq/website">Code<LuExternalLink /></ExternalLink>
            </List.Item>
          </List.Root>
        </HStack>
      </footer>
    </VStack>
  </Container>
</>;
}