import { Box, Container, Heading, HStack, List, Separator, Text, VStack } from "@chakra-ui/react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { format } from "date-fns";
import { LuExternalLink } from "react-icons/lu";
import type z from "zod";

import Tags from "@/components/blog/Tags";
import { ExternalLink, Link } from "@/components/Link";
import type { ArticleMetaZodSchema} from "@/content";
import { listAllPosts } from "@/content";

const ArticleListItem = ({ meta }: { meta: z.infer<typeof ArticleMetaZodSchema> }) => {
  const router = useRouter();
  const routes = router.routesByPath;
  const articleRoute = `/blog/${meta.slug}`;

  if (!(articleRoute in routes)) {
    return null;
  }

  return (
    <List.Item key={`article-${meta.slug}`}>
      <VStack alignItems="start">
        <Link to={articleRoute}>
          <Box>
            <Heading as="h3">{meta.title}</Heading>
            <Text>{meta.description ? meta.description : '' } - <em>{format(new Date(meta.date), 'do MMMM yyyy')}</em></Text>
          </Box>
        </Link>
        <Tags tags={meta.tags || []} />
      </VStack>
    </List.Item>
  );
};


export const Route = createFileRoute('/blog/')({
  component: BlogIndex,
  loader: async () => {
    const p = await listAllPosts();

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
            <Text>{m['blog.tagsSearch']()}</Text>
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