import { Box, Heading, List, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "@tanstack/react-router";
import { format } from "date-fns";
import type z from "zod";

import type { ArticleMetaZodSchema } from "@/content";

import { Link } from "../Link";
import Tags from "./Tags";

export const ArticleListItem = ({ meta }: { meta: z.infer<typeof ArticleMetaZodSchema> }) => {
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
        <Tags tags={meta.tags || []} onDelete={() => {}} onClick={() => {}} />
      </VStack>
    </List.Item>
  );
};