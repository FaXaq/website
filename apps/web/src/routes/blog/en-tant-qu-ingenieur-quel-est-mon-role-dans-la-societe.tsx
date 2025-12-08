import { createFileRoute } from '@tanstack/react-router';

import BlogPostLayout from '@/components/blog/BlogPostLayout';
import { MDXComponents } from '@/components/blog/MDXComponents';
import { ArticleMetaZodSchema } from '@/content';
import Article, { meta as articleMeta } from '@/content/en-tant-qu-ingenieur-quel-est-mon-role-dans-la-societe.mdx';

export const Route = createFileRoute('/blog/en-tant-qu-ingenieur-quel-est-mon-role-dans-la-societe')({
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
