import { createFileRoute } from '@tanstack/react-router';

import BlogPostLayout from '@/components/blog/BlogPostLayout';
import { MDXComponents } from '@/components/blog/MDXComponents';
import { ArticleMetaZodSchema } from '@/content';
import Article, { meta as articleMeta } from '@/content/digital-ads.mdx';

export const Route = createFileRoute('/blog/digital-ads')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: articleMeta.title,
        description: articleMeta.description,
      }
    ]
  }),
});

function RouteComponent() {
  const meta = ArticleMetaZodSchema.parse(articleMeta);

  return <BlogPostLayout meta={meta}>
    <Article components={MDXComponents} />
  </BlogPostLayout>;
}
